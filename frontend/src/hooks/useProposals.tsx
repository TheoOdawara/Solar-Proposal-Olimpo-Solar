import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiResponse } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";
import { errorLogger } from '@/utils/errorLogger';
import type { ProposalData } from '@/types/proposal';

// Re-export ProposalData para manter compatibilidade
export type { ProposalData };

export const useProposals = (options?: { autoFetch?: boolean }) => {
  type AuthUser = { id?: string; email?: string | null; [key: string]: unknown };
  type AuthSession = { user?: AuthUser | null; [key: string]: unknown };
  type ApiResult<T> = { data?: T | null; error?: unknown };

  const autoFetch = options?.autoFetch ?? true;
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getErrorMessage = (error: unknown) => {
    if (!error) return 'Erro desconhecido';
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error !== null) {
      const e = error as Record<string, unknown>;
      const maybeMessage = e['message'] || e['details'] || e['hint'];
      if (typeof maybeMessage === 'string') return maybeMessage;
      try {
        return JSON.stringify(e);
      } catch {
        return String(e);
      }
    }
    return String(error);
  };

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching proposals...');
      
      // Check authentication first (use apiClient shim)
  const sessionResp: ApiResult<{ session: AuthSession }> = await apiClient.auth.getSession();
  const user = sessionResp?.data?.session?.user ?? null;
  const authError = sessionResp?.error ?? null;
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Usuário não autenticado');
      }

      if (!user) {
        console.error('No user found');
        throw new Error('Usuário não encontrado');
      }

      console.log('User authenticated:', user.id);
      
      // Call order() before select() because the shim executes the fetch in select()
      const listResp = await apiClient
        .from('proposals')
        .order('created_at', { ascending: false })
        .select('*') as ApiResponse<ProposalData[]>;

      if (listResp.error) {
        console.error('Database error:', listResp.error);
        throw listResp.error;
      }

      const data = listResp.data ?? [];
  console.log('Proposals fetched:', (data as ProposalData[]).length || 0);
      setProposals((data || []).map(item => ({
        ...item,
        status: item.status as ProposalData['status'] || 'draft'
      })));
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error('Error fetching proposals:', message, error);
      errorLogger.logDatabaseError(error, { context: 'fetchProposals', message });
      toast({
        title: "Erro ao carregar propostas",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveProposal = async (proposalData: Omit<ProposalData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
  const userId = (await apiClient.auth.getSession())?.data?.session?.user?.id;
      const insertResp = await apiClient
        .from('proposals')
        .insert([{
          user_id: userId,
          ...proposalData
        }]) as ApiResponse<Array<ProposalData>>;

      if (insertResp.error) throw insertResp.error;

      const data = Array.isArray(insertResp.data) ? insertResp.data[0] : insertResp.data;
      toast({
        title: "Proposta salva!",
        description: "A proposta foi salva com sucesso.",
      });

      // Refresh the list
      await fetchProposals();
      return data;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast({
        title: "Erro ao salvar proposta",
        description: message,
        variant: "destructive"
      });
      errorLogger.logDatabaseError(error, { context: 'saveProposal', message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProposal = async (id: string, proposalData: Partial<ProposalData>) => {
    try {
      setLoading(true);
      // For the shim, call eq() before update(), and await the update response
      const updateResp = await apiClient
        .from('proposals')
        .eq('id', id)
        .update(proposalData) as ApiResponse<Array<ProposalData>>;

      if (updateResp.error) throw updateResp.error;

      const updated = Array.isArray(updateResp.data) ? updateResp.data[0] : updateResp.data;

      // Update local state
      setProposals(prev => prev.map(p => p.id === id ? {
        ...p,
        ...(updated as ProposalData),
        status: (updated as ProposalData).status as ProposalData['status'] || p.status
      } : p));

      return updated;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast({
        title: "Erro ao atualizar proposta",
        description: message,
        variant: "destructive"
      });
      errorLogger.logDatabaseError(error, { context: 'updateProposal', message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const autoSaveProposal = async (id: string | undefined, proposalData: Partial<ProposalData>) => {
    try {
      if (!id) {
        // Create new draft proposal
        const userId = (await apiClient.auth.getSession())?.data?.session?.user?.id;
        const insertResp = await apiClient
          .from('proposals')
          .insert([{
            user_id: userId,
            status: 'draft',
            client_name: proposalData.client_name || '',
            system_power: proposalData.system_power || 0,
            monthly_generation: proposalData.monthly_generation || 0,
            monthly_savings: proposalData.monthly_savings || 0,
            total_value: proposalData.total_value || 0,
            ...proposalData
          }]) as ApiResponse<Array<ProposalData>>;

        if (insertResp.error) throw insertResp.error;
        const data = Array.isArray(insertResp.data) ? insertResp.data[0] : insertResp.data;
        return data;
      } else {
        // Update existing proposal
        return await updateProposal(id, proposalData);
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error("Auto-save failed:", message, error);
      errorLogger.logDatabaseError(error, { context: 'autoSaveProposal', message });
      // Don't show toast for auto-save failures to avoid annoying user
      throw error;
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      setLoading(true);
      // Ensure args such as eq() are applied before terminal delete()
      const delResp = await apiClient
        .from('proposals')
        .eq('id', id)
        .delete() as ApiResponse<null>;

      if (delResp.error) throw delResp.error;

      toast({
        title: "Proposta excluída",
        description: "A proposta foi excluída com sucesso.",
      });

      // Refresh the list
      await fetchProposals();
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast({
        title: "Erro ao excluir proposta",
        description: message,
        variant: "destructive"
      });
      errorLogger.logDatabaseError(error, { context: 'deleteProposal', message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchProposals();
  }, [fetchProposals, autoFetch]);

  return {
    proposals,
    loading,
    saveProposal,
    updateProposal,
    autoSaveProposal,
    deleteProposal,
    fetchProposals,
  };
};