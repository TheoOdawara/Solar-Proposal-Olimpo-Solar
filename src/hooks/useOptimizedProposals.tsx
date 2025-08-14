/**
 * Hook otimizado para propostas
 * Combina funcionalidades e implementa cache inteligente
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/utils/errorLogger';
import type { ProposalData } from '@/types/proposal';

interface UseOptimizedProposalsOptions {
  enableCache?: boolean;
  cacheTimeout?: number; // em minutos
  autoRefresh?: boolean;
  refreshInterval?: number; // em minutos
}

const DEFAULT_OPTIONS: UseOptimizedProposalsOptions = {
  enableCache: true,
  cacheTimeout: 5, // 5 minutos
  autoRefresh: false,
  refreshInterval: 10, // 10 minutos
};

export const useOptimizedProposals = (options: UseOptimizedProposalsOptions = {}) => {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  const { state, cacheProposals, setLoading } = useAppContext();
  const { user } = useAuth();
  const { toast } = useToast();

  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Verifica se o cache ainda é válido
  const isCacheValid = useMemo(() => {
    if (!finalOptions.enableCache || !state.cache.lastFetch) return false;
    
    const now = new Date();
    const cacheAge = (now.getTime() - state.cache.lastFetch.getTime()) / (1000 * 60);
    return cacheAge < finalOptions.cacheTimeout!;
  }, [state.cache.lastFetch, finalOptions.enableCache, finalOptions.cacheTimeout]);

  // Fetch otimizado com cache
  const fetchProposals = useCallback(async (forceRefresh = false) => {
    try {
      setLoading('proposals', true);
      setError(null);

      // Se o cache é válido e não é force refresh, usar cache
      if (isCacheValid && !forceRefresh && state.cache.proposals.length > 0) {
        setProposals(state.cache.proposals);
        setLoading('proposals', false);
        return state.cache.proposals;
      }

      console.log('🔄 [OptimizedProposals] Fetching fresh data...');
      
      // Verificar autenticação
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar propostas
      const { data, error: fetchError } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const fetchedProposals = (data || []) as ProposalData[];
      
      // Atualizar cache
      if (finalOptions.enableCache) {
        cacheProposals(fetchedProposals);
      }
      
      setProposals(fetchedProposals);
      
      console.log(`✅ [OptimizedProposals] Loaded ${fetchedProposals.length} proposals`);
      return fetchedProposals;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ [OptimizedProposals] Error:', error);
      
      setError(errorMessage);
      errorLogger.logError({ 
        message: `Error in fetchProposals: ${errorMessage}`,
        context: { error }
      });
      
      toast({
        title: "Erro ao carregar propostas",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Se há cache, usar como fallback
      if (state.cache.proposals.length > 0) {
        setProposals(state.cache.proposals);
        return state.cache.proposals;
      }
      
      return [];
    } finally {
      setLoading('proposals', false);
    }
  }, [isCacheValid, state.cache.proposals, finalOptions.enableCache, cacheProposals, setLoading, toast]);

  // Salvar proposta otimizada
  const saveProposal = useCallback(async (proposalData: Omit<ProposalData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading('saving', true);

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const enrichedData = {
        ...proposalData,
        seller_id: user.id,
        seller_name: user.email,
      };

      const { data, error } = await supabase
        .from('proposals')
        .insert([enrichedData])
        .select()
        .single();

      if (error) throw error;

      // Atualizar cache local
      const updatedProposals = [data as ProposalData, ...proposals];
      setProposals(updatedProposals);
      
      if (finalOptions.enableCache) {
        cacheProposals(updatedProposals);
      }

      toast({
        title: "Proposta salva com sucesso!",
        description: `Proposta para ${proposalData.client_name} foi salva.`,
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar proposta';
      console.error('❌ [OptimizedProposals] Save error:', error);
      
      errorLogger.logError({ 
        message: `Error in saveProposal: ${errorMessage}`,
        context: { error }
      });
      
      toast({
        title: "Erro ao salvar proposta",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading('saving', false);
    }
  }, [user, proposals, cacheProposals, finalOptions.enableCache, setLoading, toast]);

  // Deletar proposta otimizada
  const deleteProposal = useCallback(async (id: string) => {
    try {
      setLoading('deleting', true);

      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualizar cache local
      const updatedProposals = proposals.filter(p => p.id !== id);
      setProposals(updatedProposals);
      
      if (finalOptions.enableCache) {
        cacheProposals(updatedProposals);
      }

      toast({
        title: "Proposta removida",
        description: "A proposta foi removida com sucesso.",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar proposta';
      console.error('❌ [OptimizedProposals] Delete error:', error);
      
      errorLogger.logError({ 
        message: `Error in deleteProposal: ${errorMessage}`,
        context: { error }
      });
      
      toast({
        title: "Erro ao remover proposta",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading('deleting', false);
    }
  }, [proposals, cacheProposals, finalOptions.enableCache, setLoading, toast]);

  // Auto-refresh
  useEffect(() => {
    if (!finalOptions.autoRefresh) return;

    const interval = setInterval(() => {
      fetchProposals(false);
    }, finalOptions.refreshInterval! * 60 * 1000);

    return () => clearInterval(interval);
  }, [finalOptions.autoRefresh, finalOptions.refreshInterval, fetchProposals]);

  // Load inicial
  useEffect(() => {
    if (user) {
      fetchProposals(false);
    }
  }, [user, fetchProposals]);

  // Estados de loading derivados
  const isLoading = state.ui.loadingStates.proposals || false;
  const isSaving = state.ui.loadingStates.saving || false;
  const isDeleting = state.ui.loadingStates.deleting || false;

  // Métricas derivadas
  const metrics = useMemo(() => {
    const total = proposals.length;
    const totalValue = proposals.reduce((sum, p) => sum + (p.total_value || 0), 0);
    const averageValue = total > 0 ? totalValue / total : 0;
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthProposals = proposals.filter(p => 
      p.created_at && new Date(p.created_at) >= thisMonth
    );
    
    return {
      total,
      totalValue,
      averageValue,
      thisMonth: thisMonthProposals.length,
      thisMonthValue: thisMonthProposals.reduce((sum, p) => sum + (p.total_value || 0), 0),
    };
  }, [proposals]);

  return {
    // Dados
    proposals,
    metrics,
    error,
    
    // Estados
    isLoading,
    isSaving,
    isDeleting,
    isCacheValid,
    
    // Ações
    fetchProposals,
    saveProposal,
    deleteProposal,
    refresh: () => fetchProposals(true),
    
    // Cache info
    cacheInfo: {
      enabled: finalOptions.enableCache,
      lastFetch: state.cache.lastFetch,
      itemCount: state.cache.proposals.length,
    },
  };
};
