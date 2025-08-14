/**
 * Sistema de cache inteligente para aplicação
 * Implementa estratégias de cache em memória e localStorage
 */

import { errorLogger } from './errorLogger';

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
  hits: number;
  size: number; // tamanho em bytes aproximado
}

export interface CacheOptions {
  ttl?: number; // Time to live em milissegundos
  maxSize?: number; // Tamanho máximo do cache em bytes
  maxEntries?: number; // Número máximo de entradas
  enablePersistence?: boolean; // Salvar no localStorage
  enableCompression?: boolean; // Comprimir dados grandes
}

class SmartCache {
  private cache = new Map<string, CacheEntry>();
  private readonly options: Required<CacheOptions>;
  private currentSize = 0;
  
  private static instance: SmartCache;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: 5 * 60 * 1000, // 5 minutos padrão
      maxSize: 10 * 1024 * 1024, // 10MB
      maxEntries: 1000,
      enablePersistence: true,
      enableCompression: false,
      ...options,
    };
    
    this.loadFromStorage();
    this.setupPeriodicCleanup();
  }

  public static getInstance(options?: CacheOptions): SmartCache {
    if (!SmartCache.instance) {
      SmartCache.instance = new SmartCache(options);
    }
    return SmartCache.instance;
  }

  /**
   * Define um valor no cache
   */
  set<T>(key: string, data: T, customTtl?: number): void {
    try {
      const ttl = customTtl ?? this.options.ttl;
      const now = Date.now();
      const serialized = JSON.stringify(data);
      const size = new Blob([serialized]).size;

      // Verificar limites antes de adicionar
      if (size > this.options.maxSize) {
        console.warn(`[SmartCache] Entry too large: ${key} (${size} bytes)`);
        return;
      }

      // Limpeza automática se necessário
      this.ensureLimits(size);

      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        expiresAt: now + ttl,
        hits: 0,
        size,
      };

      this.cache.set(key, entry);
      this.currentSize += size;

      // Persistir se habilitado
      if (this.options.enablePersistence) {
        this.saveToStorage(key, entry);
      }

      console.log(`✅ [SmartCache] Set: ${key} (${size} bytes, TTL: ${ttl}ms)`);
    } catch (error) {
      errorLogger.logError({
        message: `Cache set error for key: ${key}`,
        context: { error, key },
      });
    }
  }

  /**
   * Obtém um valor do cache
   */
  get<T>(key: string): T | null {
    try {
      const entry = this.cache.get(key) as CacheEntry<T> | undefined;
      
      if (!entry) {
        return null;
      }

      // Verificar expiração
      if (Date.now() > entry.expiresAt) {
        this.delete(key);
        return null;
      }

      // Incrementar hits para estatísticas LRU
      entry.hits++;
      
      console.log(`🎯 [SmartCache] Hit: ${key} (${entry.hits} hits)`);
      return entry.data;
    } catch (error) {
      errorLogger.logError({
        message: `Cache get error for key: ${key}`,
        context: { error, key },
      });
      return null;
    }
  }

  /**
   * Verifica se uma chave existe e não expirou
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Remove uma entrada do cache
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    this.cache.delete(key);
    this.currentSize -= entry.size;

    // Remover do localStorage também
    if (this.options.enablePersistence) {
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (error) {
        console.warn(`[SmartCache] Failed to remove from localStorage: ${key}`);
      }
    }

    console.log(`🗑️ [SmartCache] Deleted: ${key}`);
    return true;
  }

  /**
   * Limpa todo o cache
   */
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    this.currentSize = 0;

    // Limpar localStorage também
    if (this.options.enablePersistence) {
      this.clearStorage();
    }

    console.log(`🧹 [SmartCache] Cleared ${count} entries`);
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const expired = entries.filter(e => Date.now() > e.expiresAt).length;
    
    return {
      entries: this.cache.size,
      expired,
      totalSize: this.currentSize,
      averageSize: this.currentSize / this.cache.size || 0,
      totalHits: entries.reduce((sum, e) => sum + e.hits, 0),
      memoryUsage: `${(this.currentSize / 1024 / 1024).toFixed(2)} MB`,
      limits: {
        maxSize: `${(this.options.maxSize / 1024 / 1024).toFixed(2)} MB`,
        maxEntries: this.options.maxEntries,
      },
    };
  }

  /**
   * Obtém ou define um valor usando uma função factory
   */
  async getOrSet<T>(
    key: string, 
    factory: () => Promise<T> | T, 
    customTtl?: number
  ): Promise<T> {
    // Tentar obter do cache primeiro
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Executar factory e cachear resultado
    try {
      const data = await factory();
      this.set(key, data, customTtl);
      return data;
    } catch (error) {
      errorLogger.logError({
        message: `Cache factory error for key: ${key}`,
        context: { error, key },
      });
      throw error;
    }
  }

  /**
   * Remove entradas expiradas e aplica limites
   */
  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;
    let removedSize = 0;

    // Remover entradas expiradas
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.currentSize -= entry.size;
        removedSize += entry.size;
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`🧼 [SmartCache] Cleanup: removed ${removedCount} expired entries (${removedSize} bytes)`);
    }

    // Aplicar limites se ainda necessário
    this.ensureLimits(0);
  }

  /**
   * Garante que os limites do cache sejam respeitados
   */
  private ensureLimits(newEntrySize: number): void {
    // Verificar limite de tamanho
    while (this.currentSize + newEntrySize > this.options.maxSize && this.cache.size > 0) {
      this.evictLeastUsed();
    }

    // Verificar limite de entradas
    while (this.cache.size >= this.options.maxEntries) {
      this.evictLeastUsed();
    }
  }

  /**
   * Remove a entrada menos usada (LRU)
   */
  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let leastHits = Infinity;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Priorizar por menor número de hits, depois por mais antigo
      if (entry.hits < leastHits || (entry.hits === leastHits && entry.timestamp < oldestTime)) {
        leastUsedKey = key;
        leastHits = entry.hits;
        oldestTime = entry.timestamp;
      }
    }

    if (leastUsedKey) {
      console.log(`📤 [SmartCache] Evicted LRU: ${leastUsedKey} (${leastHits} hits)`);
      this.delete(leastUsedKey);
    }
  }

  /**
   * Carrega dados do localStorage
   */
  private loadFromStorage(): void {
    if (!this.options.enablePersistence) return;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          const cacheKey = key.substring(6);
          const data = localStorage.getItem(key);
          
          if (data) {
            const entry: CacheEntry = JSON.parse(data);
            
            // Verificar se não expirou
            if (Date.now() <= entry.expiresAt) {
              this.cache.set(cacheKey, entry);
              this.currentSize += entry.size;
            } else {
              localStorage.removeItem(key);
            }
          }
        }
      }
      
      console.log(`💾 [SmartCache] Loaded ${this.cache.size} entries from storage`);
    } catch (error) {
      console.warn('[SmartCache] Failed to load from storage:', error);
    }
  }

  /**
   * Salva uma entrada no localStorage
   */
  private saveToStorage(key: string, entry: CacheEntry): void {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn(`[SmartCache] Failed to save to storage: ${key}`, error);
    }
  }

  /**
   * Limpa todas as entradas do cache no localStorage
   */
  private clearStorage(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('[SmartCache] Failed to clear storage:', error);
    }
  }

  /**
   * Configura limpeza periódica
   */
  private setupPeriodicCleanup(): void {
    // Limpeza a cada 2 minutos
    setInterval(() => {
      this.cleanup();
    }, 2 * 60 * 1000);

    // Limpeza ao sair da página
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
}

// Instância global do cache
export const smartCache = SmartCache.getInstance({
  ttl: 5 * 60 * 1000, // 5 minutos
  maxSize: 50 * 1024 * 1024, // 50MB
  maxEntries: 500,
  enablePersistence: true,
});

// Helpers especializados
export const proposalsCache = {
  get: (key: string) => smartCache.get<unknown[]>(`proposals_${key}`),
  set: (key: string, data: unknown[]) => smartCache.set(`proposals_${key}`, data, 10 * 60 * 1000), // 10 min
  delete: (key: string) => smartCache.delete(`proposals_${key}`),
};

export const userDataCache = {
  get: (userId: string, key: string) => smartCache.get(`user_${userId}_${key}`),
  set: (userId: string, key: string, data: unknown) => smartCache.set(`user_${userId}_${key}`, data, 15 * 60 * 1000), // 15 min
  delete: (userId: string, key: string) => smartCache.delete(`user_${userId}_${key}`),
};

export default smartCache;
