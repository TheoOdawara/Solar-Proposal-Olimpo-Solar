import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ProposalData {
  id?: string;
  client_name: string;
  system_power: number;
  monthly_generation: number;
  monthly_savings: number;
  total_value: number;
  seller_name?: string;
  seller_id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Novos campos expandidos
  status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'closed';
  cep?: string;
  address?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  complement?: string;
  monthly_consumption?: number;
  average_bill?: number;
  module_brand?: string;
  module_model?: string;
  module_power?: number;
  module_quantity?: number;
  inverter_brand?: string;
  inverter_model?: string;
  payment_method?: string;
  payment_conditions?: string;
  valid_until?: string;
  notes?: string;
  required_area?: number;
  phone?: string;
  email?: string;
}

export const useProposals = () => {
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProposals = async () => {
    try {
      setLoading(true);
      console.log('Fetching proposals...');
      
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw new Error('Usuário não autenticado');
      }
      
      if (!user) {
        console.error('No user found');
        throw new Error('Usuário não encontrado');
      }
      
      console.log('User authenticated:', user.id);
      
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Proposals fetched:', data?.length || 0);
      setProposals((data || []).map(item => ({
        ...item,
        status: item.status as ProposalData['status'] || 'draft'
      })));
    } catch (error: any) {
      console.error('Error fetching proposals:', error);
      toast({
        title: "Erro ao carregar propostas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProposal = async (proposalData: Omit<ProposalData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proposals')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...proposalData
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Proposta salva!",
        description: "A proposta foi salva com sucesso.",
      });

      // Refresh the list
      await fetchProposals();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao salvar proposta",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProposal = async (id: string, proposalData: Partial<ProposalData>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proposals')
        .update(proposalData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setProposals(prev => prev.map(p => p.id === id ? { 
        ...p, 
        ...data,
        status: data.status as ProposalData['status'] || p.status 
      } : p));
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar proposta",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const autoSaveProposal = async (id: string | undefined, proposalData: Partial<ProposalData>) => {
    try {
      if (!id) {
        // Create new draft proposal
        const { data, error } = await supabase
          .from('proposals')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            status: 'draft',
            client_name: proposalData.client_name || '',
            system_power: proposalData.system_power || 0,
            monthly_generation: proposalData.monthly_generation || 0,
            monthly_savings: proposalData.monthly_savings || 0,
            total_value: proposalData.total_value || 0,
            ...proposalData
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Update existing proposal
        return await updateProposal(id, proposalData);
      }
    } catch (error: any) {
      console.error("Auto-save failed:", error);
      // Don't show toast for auto-save failures to avoid annoying user
      throw error;
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Proposta excluída",
        description: "A proposta foi excluída com sucesso.",
      });

      // Refresh the list
      await fetchProposals();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir proposta",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return {
    proposals,
    loading,
    saveProposal,
    updateProposal,
    autoSaveProposal,
    deleteProposal,
    fetchProposals
  };
};