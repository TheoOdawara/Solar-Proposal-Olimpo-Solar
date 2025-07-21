import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

export interface SalesData {
  id: string;
  seller_name: string;
  seller_id: string;
  client_name: string;
  system_power: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface SellerMetrics {
  seller_name: string;
  seller_id: string;
  total_proposals: number;
  total_value: number;
  average_power: number;
  average_value: number;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export const useSalesAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [sellerMetrics, setSellerMetrics] = useState<SellerMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [selectedSeller, setSelectedSeller] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadSalesData();
    }
  }, [user, dateRange, selectedSeller]);

  const loadSalesData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('proposals')
        .select(`
          id,
          seller_name,
          seller_id,
          client_name,
          system_power,
          total_value,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      // Apply date filters
      if (dateRange.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      // Apply seller filter
      if (selectedSeller !== 'all') {
        query = query.eq('seller_id', selectedSeller);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSalesData(data || []);
      calculateSellerMetrics(data || []);
    } catch (error) {
      console.error('Error loading sales data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de vendas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSellerMetrics = (data: SalesData[]) => {
    const sellerGroups = data.reduce((acc, proposal) => {
      const sellerId = proposal.seller_id;
      if (!acc[sellerId]) {
        acc[sellerId] = {
          seller_name: proposal.seller_name || 'Vendedor',
          seller_id: sellerId,
          proposals: [],
          total_value: 0,
          total_power: 0
        };
      }
      acc[sellerId].proposals.push(proposal);
      acc[sellerId].total_value += proposal.total_value;
      acc[sellerId].total_power += proposal.system_power;
      return acc;
    }, {} as Record<string, any>);

    const metrics = Object.values(sellerGroups).map((seller: any) => ({
      seller_name: seller.seller_name,
      seller_id: seller.seller_id,
      total_proposals: seller.proposals.length,
      total_value: seller.total_value,
      average_power: seller.total_power / seller.proposals.length || 0,
      average_value: seller.total_value / seller.proposals.length || 0
    })) as SellerMetrics[];

    // Sort by total value descending
    metrics.sort((a, b) => b.total_value - a.total_value);
    setSellerMetrics(metrics);
  };

  const exportToExcel = async () => {
    try {
      // Create CSV content
      const headers = ['Data', 'Vendedor', 'Cliente', 'Potência (kWp)', 'Valor Total'];
      const csvContent = [
        headers.join(','),
        ...salesData.map(proposal => [
          new Date(proposal.created_at).toLocaleDateString('pt-BR'),
          proposal.seller_name,
          proposal.client_name,
          proposal.system_power.toFixed(2),
          `R$ ${proposal.total_value.toFixed(2)}`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-vendas-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Relatório exportado!",
        description: "O arquivo CSV foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive"
      });
    }
  };

  // Get unique sellers for filter
  const sellers = Array.from(new Set(salesData.map(d => d.seller_id)))
    .map(id => {
      const proposal = salesData.find(d => d.seller_id === id);
      return {
        id,
        name: proposal?.seller_name || 'Vendedor'
      };
    });

  // Get top seller
  const topSeller = sellerMetrics.length > 0 ? sellerMetrics[0] : null;

  return {
    salesData,
    sellerMetrics,
    loading,
    dateRange,
    setDateRange,
    selectedSeller,
    setSelectedSeller,
    sellers,
    topSeller,
    exportToExcel,
    refresh: loadSalesData
  };
};