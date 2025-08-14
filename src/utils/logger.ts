interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private sessionId = crypto.randomUUID();

  private formatMessage(level: keyof LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      sessionId: this.sessionId,
      userId: this.getCurrentUserId()
    };
  }

  private getCurrentUserId(): string | undefined {
    // This would be implemented to get current user ID from auth context
    return undefined;
  }

  private log(level: keyof LogLevel, message: string, data?: unknown) {
    const logEntry = this.formatMessage(level, message, data);
    
    // Always log to console in development
    if (this.isDevelopment) {
      console[level](
        `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`,
        data ? data : ''
      );
    }

    // In production, you would send logs to external service
    if (!this.isDevelopment) {
      this.sendToExternalService(logEntry);
    }
  }

  private async sendToExternalService(logEntry: LogEntry) {
    try {
      // TODO: Implement integration with logging service (Sentry, LogRocket, etc.)
      // For now, just store in localStorage for debugging
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(logEntry);
      
      // Keep only last 100 logs to prevent localStorage overflow
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  error(message: string, data?: unknown) {
    this.log('ERROR', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('WARN', message, data);
  }

  info(message: string, data?: unknown) {
    this.log('INFO', message, data);
  }

  debug(message: string, data?: unknown) {
    this.log('DEBUG', message, data);
  }

  // Business logic specific methods
  proposalCreated(proposalId: string, clientName: string) {
    this.info('Proposal created', { proposalId, clientName, action: 'proposal_created' });
  }

  proposalSaved(proposalId: string, type: 'manual' | 'auto') {
    this.info('Proposal saved', { proposalId, saveType: type, action: 'proposal_saved' });
  }

  proposalGenerated(proposalId: string, format: 'pdf' | 'preview') {
    this.info('Proposal generated', { proposalId, format, action: 'proposal_generated' });
  }

  userAction(action: string, data?: unknown) {
    const payload =
      data && typeof data === 'object' && !Array.isArray(data)
        ? { action, ...(data as Record<string, unknown>) }
        : { action, data };
    this.info(`User action: ${action}`, payload);
  }

  performanceMetric(metric: string, value: number, unit: string = 'ms') {
    this.debug(`Performance: ${metric}`, { metric, value, unit });
  }

  // Get logs for debugging (development only)
  getLogs(): LogEntry[] {
    if (!this.isDevelopment) return [];
    
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch {
      return [];
    }
  }

  clearLogs() {
    localStorage.removeItem('app_logs');
  }
}

export const logger = new Logger();
