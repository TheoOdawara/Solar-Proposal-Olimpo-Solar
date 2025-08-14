import { useAdminAccess } from "@/hooks/useAdminAccess";
import { Navigate } from "react-router-dom";
import { useAdvancedAnalytics } from "@/hooks/useAdvancedAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, RefreshCw } from "lucide-react";

const Metrics = () => {
  const { hasAdminAccess, loading: authLoading } = useAdminAccess();
  const {
    proposals,
    dailyStats,
    notifications,
    loading,
    refreshData,
    exportToExcel
  } = useAdvancedAnalytics();

  const getMonthlyMetrics = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyProposals = proposals.filter(p => {
      const proposalDate = new Date(p.created_at);
      return proposalDate.getMonth() === currentMonth && proposalDate.getFullYear() === currentYear;
    });

    const totalValue = monthlyProposals.reduce((sum, p) => sum + Number(p.total_value), 0);
    const activeSellers = new Set(monthlyProposals.map(p => p.seller_name)).size;
    const averageValue = monthlyProposals.length > 0 ? totalValue / monthlyProposals.length : 0;

    return {
      totalProposals: monthlyProposals.length,
      totalValue,
      activeSellers,
      averageValue
    };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return <Navigate to="/" replace />;
  }

  const monthlyMetrics = getMonthlyMetrics();
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Métricas Administrativas
            </h1>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={refreshData} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button 
                onClick={() => exportToExcel()}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-3">
            {notifications.map((notification, index) => (
              <Alert key={index}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <span className="font-medium">{notification.type === 'old_proposal' ? 'Propostas Antigas' : 'Baixa Produtividade'}:</span> {notification.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Monthly Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
              <Badge variant="secondary">{monthlyMetrics.totalProposals}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyMetrics.totalProposals}</div>
              <p className="text-xs text-muted-foreground">no mês atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Badge variant="secondary">{formatCurrency(monthlyMetrics.totalValue)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(monthlyMetrics.totalValue)}</div>
              <p className="text-xs text-muted-foreground">no mês atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendedores Ativos</CardTitle>
              <Badge variant="secondary">{monthlyMetrics.activeSellers}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyMetrics.activeSellers}</div>
              <p className="text-xs text-muted-foreground">no mês atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
              <Badge variant="secondary">{formatCurrency(monthlyMetrics.averageValue)}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(monthlyMetrics.averageValue)}</div>
              <p className="text-xs text-muted-foreground">por proposta</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Stats Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estatísticas Diárias</CardTitle>
            <CardDescription>Propostas e valores por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value: number | string, name: string) => [
                      name === 'total_value' ? formatCurrency(Number(value)) : value,
                      name === 'total_value' ? 'Valor Total' : 'Propostas'
                    ]}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="proposals_count" stroke="#8884d8" name="Propostas" />
                  <Line yAxisId="right" type="monotone" dataKey="total_value" stroke="#82ca9d" name="Valor Total" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;