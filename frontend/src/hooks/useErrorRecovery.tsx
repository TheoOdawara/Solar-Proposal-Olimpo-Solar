import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorLogger } from '@/utils/errorLogger';
import { apiClient, ApiResponse } from '@/integrations/api/client';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
  lastErrorTime: number;
}

export const useErrorRecovery = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorCount: 0,
    lastErrorTime: 0,
  });
  const { toast } = useToast();

  const reportError = useCallback((error: Error, context?: Record<string, unknown>) => {
    const now = Date.now();
    const timeSinceLastError = now - errorState.lastErrorTime;
    
    // Avoid spam reporting (less than 1 second between errors)
    if (timeSinceLastError < 1000) {
      return;
    }

    setErrorState(prev => ({
      hasError: true,
      error,
      errorCount: prev.errorCount + 1,
      lastErrorTime: now,
    }));

    errorLogger.logError({
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        errorCount: errorState.errorCount + 1,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
    });

    // Show user-friendly error message
    const isNetworkError = error.message.includes('fetch') || 
                          error.message.includes('network') ||
                          error.message.includes('offline');
    
    const isAuthError = error.message.includes('auth') ||
                       error.message.includes('unauthorized') ||
                       error.message.includes('session');

    let userMessage = 'Ocorreu um erro inesperado.';
    let description = 'Tente novamente em alguns instantes.';

    if (isNetworkError) {
      userMessage = 'Erro de conexão';
      description = 'Verifique sua conexão com a internet e tente novamente.';
    } else if (isAuthError) {
      userMessage = 'Erro de autenticação';
      description = 'Você precisa fazer login novamente.';
    }

    toast({
      title: userMessage,
      description,
      variant: 'destructive',
    });

  }, [errorState.lastErrorTime, errorState.errorCount, toast]);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorCount: 0,
      lastErrorTime: 0,
    });
  }, []);

  const retryLastAction = useCallback(async (retryFn?: () => Promise<void>) => {
    if (!retryFn) return;

    try {
      await retryFn();
      clearError();
      toast({
        title: 'Operação bem-sucedida',
        description: 'A ação foi executada com sucesso.',
      });
    } catch (error) {
      reportError(error as Error, { context: 'retry_attempt' });
    }
  }, [clearError, reportError, toast]);

  const checkConnection = useCallback(async () => {
    try {
      // Test connection to API — the shim executes fetch inside `.select()`,
      // so ensure any chain modifiers (limit/order/eq) are called before select.
      const resp = await apiClient.from('proposals').limit(1).select('id') as ApiResponse<Array<{ id?: string }>>;
      if (resp.error) {
        const e = resp.error instanceof Error ? resp.error : new Error(String(resp.error));
        throw e;
      }

      return true;
    } catch (error) {
      reportError(error as Error, { context: 'connection_check' });
      return false;
    }
  }, [reportError]);

  // Automatic connection checking when errors occur
  useEffect(() => {
    if (errorState.hasError && errorState.errorCount > 2) {
      // If we have multiple errors, check connection
      const checkTimer = setTimeout(() => {
        checkConnection();
      }, 2000);

      return () => clearTimeout(checkTimer);
    }
  }, [errorState.hasError, errorState.errorCount, checkConnection]);

  return {
    hasError: errorState.hasError,
    error: errorState.error,
    errorCount: errorState.errorCount,
    reportError,
    clearError,
    retryLastAction,
    checkConnection,
  };
};