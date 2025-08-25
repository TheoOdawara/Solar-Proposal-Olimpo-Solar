import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { downloadCsvAsXlsx } from '@/utils/downloadCsvAsXlsx';

export interface ProposalAnalytics {
  id: string;
  client_name: string;
  seller_name: string;
  seller_id: string;
  system_power: number;
  total_value: number;
  created_at: string;
  monthly_generation: number;
  monthly_savings: number;
}

export interface DailyStats {
  date: string;
  proposals_count: number;
  total_value: number;
}

export interface NotificationData {
  id: string;
  type: 'old_proposal' | 'low_productivity';
  title: string;
  description: string;
  data?: number | Array<{ id: string; name: string; decline: string }>;
}

export interface AdvancedFilters {
  clientName: string;
  sellerName: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  valueMin: number;
  valueMax: number;
}

export const useAdvancedAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [proposals, setProposals] = useState<ProposalAnalytics[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdvancedFilters>({
    clientName: '',
    sellerName: '',
    dateFrom: null,
    dateTo: null,
    valueMin: 0,
    valueMax: 1000000
  });

  // Get current month data
  const getCurrentMonthData = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return proposals.filter(p => {
      const proposalDate = new Date(p.created_at);
      return proposalDate >= startOfMonth && proposalDate <= endOfMonth;
    });
  };

  // Get unique sellers count
  const getActiveSellersCount = () => {
    const currentMonthData = getCurrentMonthData();
    const uniqueSellers = new Set(currentMonthData.map(p => p.seller_id));
    return uniqueSellers.size;
  };

  // Calculate monthly metrics
  const getMonthlyMetrics = () => {
    const monthlyData = getCurrentMonthData();
    const totalProposals = monthlyData.length;
    const totalValue = monthlyData.reduce((sum, p) => sum + p.total_value, 0);
    const activeSellers = getActiveSellersCount();
    const averageValue = totalProposals > 0 ? totalValue / totalProposals : 0;

    return {
      totalProposals,
      totalValue,
      activeSellers,
      averageValue
    };
  };

  // Load all proposals
  const generateDailyStats = useCallback((data: ProposalAnalytics[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const stats: DailyStats[] = last30Days.map(date => {
      const dayData = data.filter(p => 
        p.created_at.startsWith(date)
      );
      
      return {
        date,
        proposals_count: dayData.length,
        total_value: dayData.reduce((sum, p) => sum + p.total_value, 0)
      };
    });

    setDailyStats(stats);
  }, []);

  const generateNotifications = useCallback((data: ProposalAnalytics[]) => {
    const notifications: NotificationData[] = [];
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Check for old proposals (>48h)
    const oldProposals = data.filter(p => 
      new Date(p.created_at) < twoDaysAgo
    );

    if (oldProposals.length > 0) {
      notifications.push({
        id: 'old_proposals',
        type: 'old_proposal',
        title: 'Propostas Antigas',
        description: `${oldProposals.length} propostas não visualizadas há mais de 48h`,
        data: oldProposals.length
      });
    }

    // Check for sellers with declining productivity
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previousWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const lastWeekData = data.filter(p => 
      new Date(p.created_at) >= lastWeek && new Date(p.created_at) < now
    );
    
    const previousWeekData = data.filter(p => 
      new Date(p.created_at) >= previousWeek && new Date(p.created_at) < lastWeek
    );

    const sellerStats: { [key: string]: { current: number; previous: number; name: string } } = {};

    lastWeekData.forEach(p => {
      if (!sellerStats[p.seller_id]) {
        sellerStats[p.seller_id] = { current: 0, previous: 0, name: p.seller_name };
      }
      sellerStats[p.seller_id].current++;
    });

    previousWeekData.forEach(p => {
      if (!sellerStats[p.seller_id]) {
        sellerStats[p.seller_id] = { current: 0, previous: 0, name: p.seller_name };
      }
      sellerStats[p.seller_id].previous++;
    });

    const decliningSellersByFiftyPercent = Object.entries(sellerStats).filter(([_, stats]) => 
      stats.previous > 0 && (stats.current / stats.previous) < 0.5
    );

    if (decliningSellersByFiftyPercent.length > 0) {
      notifications.push({
        id: 'low_productivity',
        type: 'low_productivity',
        title: 'Queda de Produtividade',
        description: `${decliningSellersByFiftyPercent.length} vendedor(es) com queda >50% nas propostas`,
        data: decliningSellersByFiftyPercent.map(([id, stats]) => ({
          id,
          name: stats.name,
          decline: ((1 - stats.current / stats.previous) * 100).toFixed(0)
        }))
      });
    }

    setNotifications(notifications);
  }, []);

  const loadProposals = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProposals(data || []);
      generateDailyStats(data || []);
      generateNotifications(data || []);
    } catch (error: unknown) {
      console.error('Error loading proposals:', error);
      toast({
        title: "Erro ao carregar propostas",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
    }
  }, [generateDailyStats, generateNotifications, toast]);

  // Generate daily statistics for chart

  // Apply filters to proposals
  const getFilteredProposals = () => {
    return proposals.filter(proposal => {
      const matchesClientName = !filters.clientName || 
        proposal.client_name.toLowerCase().includes(filters.clientName.toLowerCase());
      
      const matchesSellerName = !filters.sellerName || 
        proposal.seller_name.toLowerCase().includes(filters.sellerName.toLowerCase());
      
      const proposalDate = new Date(proposal.created_at);
      const matchesDateFrom = !filters.dateFrom || proposalDate >= filters.dateFrom;
      const matchesDateTo = !filters.dateTo || proposalDate <= filters.dateTo;
      
      const matchesValueMin = proposal.total_value >= filters.valueMin;
      const matchesValueMax = proposal.total_value <= filters.valueMax;

      return matchesClientName && matchesSellerName && matchesDateFrom && 
             matchesDateTo && matchesValueMin && matchesValueMax;
    });
  };

  // Export filtered data to Excel
  const exportToExcel = (filteredData?: ProposalAnalytics[]) => {
    const dataToExport = filteredData || getFilteredProposals();
    
    const csvContent = [
      ['Data', 'Vendedor', 'Cliente', 'Potência (kWp)', 'Valor Total (R$)', 'Geração Mensal (kWh)', 'Economia Mensal (R$)'],
      ...dataToExport.map(proposal => [
        new Date(proposal.created_at).toLocaleDateString('pt-BR'),
        proposal.seller_name,
        proposal.client_name,
        proposal.system_power.toString(),
        proposal.total_value.toString(),
        proposal.monthly_generation.toString(),
        proposal.monthly_savings.toString()
      ])
    ].map(row => row.join(',')).join('\n');

  downloadCsvAsXlsx(csvContent, `propostas_olimpo_${new Date().toISOString().split('T')[0]}`);

    toast({
      title: "Exportação realizada!",
      description: `${dataToExport.length} propostas exportadas com sucesso.`,
    });
  };

  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user, loadProposals]);

  useEffect(() => {
    setLoading(false);
  }, [proposals]);

  return {
    proposals: getFilteredProposals(),
    allProposals: proposals,
    dailyStats,
    notifications,
    loading,
    filters,
    setFilters,
    monthlyMetrics: getMonthlyMetrics(),
    exportToExcel,
    refreshData: loadProposals
  };
};