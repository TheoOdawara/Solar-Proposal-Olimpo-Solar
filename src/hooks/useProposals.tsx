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
}

export const useProposals = () => {
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error: any) {
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
    deleteProposal,
    fetchProposals
  };
};