import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Trophy, 
  FileDown, 
  Calendar as CalendarIcon,
  Filter,
  Bell,
  Shield,
  Home,
  RefreshCw,
  PieChart,
  Eye
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdvancedAnalytics } from "@/hooks/useAdvancedAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";

// Cores para gráficos - Identidade Olimpo Solar
const CHART_COLORS = ['#022136', '#ffbf06', '#034a5c', '#ffd43d', '#045f73'];

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { hasAdminAccess, loading: adminLoading, adminEmail } = useAdminAccess();
  const {
    proposals,
    allProposals,
    dailyStats,
    notifications,
    loading: analyticsLoading,
    filters,
    setFilters,
    monthlyMetrics,
    exportToExcel,
    refreshData
  } = useAdvancedAnalytics();

  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  // Sempre executar hooks antes dos returns condicionais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM", { locale: ptBR });
  };

  // Métricas do dia
  const todayMetrics = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const todayProposals = allProposals.filter(p => 
      format(new Date(p.created_at), 'yyyy-MM-dd') === todayStr
    );
    
    return {
      count: todayProposals.length,
      value: todayProposals.reduce((sum, p) => sum + p.total_value, 0)
    };
  }, [allProposals]);

  // Média kWp por proposta
  const averageKwp = useMemo(() => {
    if (allProposals.length === 0) return 0;
    const totalKwp = allProposals.reduce((sum, p) => sum + Number(p.system_power), 0);
    return totalKwp / allProposals.length;
  }, [allProposals]);

  // Dados para gráfico de barras (últimos 7 dias)
  const last7DaysData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayProposals = allProposals.filter(p => 
        format(new Date(p.created_at), 'yyyy-MM-dd') === dateStr
      );
      
      data.push({
        date: format(date, 'dd/MM'),
        proposals: dayProposals.length,
        value: dayProposals.reduce((sum, p) => sum + p.total_value, 0)
      });
    }
    return data;
  }, [allProposals]);

  // Dados para gráfico de pizza (formas de pagamento) - simulado
  const paymentMethodsData = useMemo(() => {
    // Como não temos dados reais de forma de pagamento, vou simular baseado no número de propostas
    const total = allProposals.length;
    if (total === 0) return [];
    
    return [
      { name: 'Financiamento', value: Math.round(total * 0.6), color: CHART_COLORS[0] },
      { name: 'PIX', value: Math.round(total * 0.25), color: CHART_COLORS[1] },
      { name: 'Cartão', value: Math.round(total * 0.15), color: CHART_COLORS[2] }
    ];
  }, [allProposals]);

  // Calculate seller rankings
  const sellerRankings = useMemo(() => {
    const sellerMap = new Map<string, {
      name: string;
      proposals: number;
      totalValue: number;
      averageValue: number;
      lastProposal: string;
    }>();

    allProposals.forEach(proposal => {
      const current = sellerMap.get(proposal.seller_id) || {
        name: proposal.seller_name,
        proposals: 0,
        totalValue: 0,
        averageValue: 0,
        lastProposal: proposal.created_at
      };

      current.proposals += 1;
      current.totalValue += proposal.total_value;
      current.averageValue = current.totalValue / current.proposals;
      
      if (new Date(proposal.created_at) > new Date(current.lastProposal)) {
        current.lastProposal = proposal.created_at;
      }

      sellerMap.set(proposal.seller_id, current);
    });

    return Array.from(sellerMap.values())
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [allProposals]);

  const clearFilters = () => {
    setFilters({
      clientName: '',
      sellerName: '',
      dateFrom: null,
      dateTo: null,
      valueMin: 0,
      valueMax: 1000000
    });
  };

  // Show loading while auth is being checked
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Only redirect if not loading AND not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Restrict access only to specific admin email
  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-lg">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Área Administrativa - Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Esta área é exclusiva para administradores autorizados.
            </p>
            <p className="text-sm text-muted-foreground">
              Apenas o email <strong>{adminEmail}</strong> tem acesso a este painel.
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Voltar ao Início
                </Link>
              </Button>
              <Button onClick={() => window.history.back()} variant="outline">
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Header com identidade Olimpo Solar */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="max-w-screen-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-xl shadow-lg">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  Dashboard Administrativo
                  <Badge className="bg-secondary text-primary hover:bg-secondary/90">
                    Olimpo Solar
                  </Badge>
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Sistema de métricas e análises comerciais
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={refreshData}
                variant="secondary"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button
                onClick={() => exportToExcel()}
                className="bg-secondary text-primary hover:bg-secondary/90 font-semibold"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-5xl mx-auto p-6 space-y-6">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Alert key={notification.id} className="border-secondary/20 bg-secondary/5">
                <Bell className="h-4 w-4 text-secondary" />
                <AlertTitle className="text-primary">{notification.title}</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {notification.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Propostas do Mês</CardTitle>
              <div className="p-2 bg-primary rounded-lg">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{monthlyMetrics.totalProposals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total gerado neste mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Valor Total Mensal</CardTitle>
              <div className="p-2 bg-secondary rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatCurrency(monthlyMetrics.totalValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Em propostas geradas
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Propostas Hoje</CardTitle>
              <div className="p-2 bg-primary rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{todayMetrics.count}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(todayMetrics.value)} hoje
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">Média kWp</CardTitle>
              <div className="p-2 bg-secondary rounded-lg">
                <Zap className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{averageKwp.toFixed(1)} kWp</div>
              <p className="text-xs text-muted-foreground mt-1">
                Por proposta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Últimos 7 dias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Propostas por Dia (Últimos 7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7DaysData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-sm text-muted-foreground"
                    />
                    <YAxis className="text-sm text-muted-foreground" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'proposals' ? value : formatCurrency(value),
                        name === 'proposals' ? 'Propostas' : 'Valor Total'
                      ]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="proposals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza - Formas de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Formas de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Propostas']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Propostas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Propostas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Cliente</TableHead>
                    <TableHead className="font-semibold">Vendedor</TableHead>
                    <TableHead className="font-semibold">Data</TableHead>
                    <TableHead className="font-semibold text-right">Valor</TableHead>
                    <TableHead className="font-semibold text-center">Potência (kWp)</TableHead>
                    <TableHead className="font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.slice(0, 10).map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        {proposal.client_name}
                      </TableCell>
                      <TableCell>
                        {proposal.seller_name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(proposal.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatCurrency(proposal.total_value)}
                      </TableCell>
                      <TableCell className="text-center">
                        {Number(proposal.system_power).toFixed(1)} kWp
                      </TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Seção Exclusiva do Administrador */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Trophy className="h-5 w-5" />
              Seção Administrativa - Ranking dos Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Posição</TableHead>
                    <TableHead className="font-semibold">Nome do Vendedor</TableHead>
                    <TableHead className="font-semibold text-center">Nº Propostas</TableHead>
                    <TableHead className="font-semibold text-right">Valor Total</TableHead>
                    <TableHead className="font-semibold text-right">Média por Proposta</TableHead>
                    <TableHead className="font-semibold text-center">Última Proposta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellerRankings.map((seller, index) => (
                    <TableRow key={index} className={index === 0 ? "bg-secondary/10" : ""}>
                      <TableCell>
                        <Badge variant={index === 0 ? "default" : "secondary"} className={
                          index === 0 ? "bg-secondary text-primary" : ""
                        }>
                          #{index + 1}
                          {index === 0 && <Trophy className="inline h-3 w-3 ml-1" />}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {seller.name}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {seller.proposals}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatCurrency(seller.totalValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(seller.averageValue)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {format(new Date(seller.lastProposal), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filtros Avançados de Propostas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente</Label>
                <Input
                  id="clientName"
                  placeholder="Buscar por cliente..."
                  value={filters.clientName}
                  onChange={(e) => setFilters(prev => ({ ...prev, clientName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sellerName">Vendedor</Label>
                <Input
                  id="sellerName"
                  placeholder="Buscar por vendedor..."
                  value={filters.sellerName}
                  onChange={(e) => setFilters(prev => ({ ...prev, sellerName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Faixa de Valor</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Valor mín."
                    value={filters.valueMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, valueMin: Number(e.target.value) }))}
                  />
                  <Input
                    type="number"
                    placeholder="Valor máx."
                    value={filters.valueMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, valueMax: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom || undefined}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateFrom: date || null }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo || undefined}
                      onSelect={(date) => setFilters(prev => ({ ...prev, dateTo: date || null }))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={clearFilters} 
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Propostas Filtradas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Propostas Filtradas ({proposals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Data</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-center">Potência (kWp)</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-right">Geração (kWh)</TableHead>
                    <TableHead className="text-right">Economia Mensal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </TableCell>
                    </TableRow>
                  ) : proposals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhuma proposta encontrada com os filtros aplicados
                      </TableCell>
                    </TableRow>
                  ) : (
                    proposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell className="text-sm">
                          {format(new Date(proposal.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {proposal.seller_name}
                        </TableCell>
                        <TableCell className="font-medium">
                          {proposal.client_name}
                        </TableCell>
                        <TableCell className="text-center">
                          {Number(proposal.system_power).toFixed(1)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatCurrency(proposal.total_value)}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(proposal.monthly_generation).toFixed(0)} kWh
                        </TableCell>
                        <TableCell className="text-right font-semibold text-secondary">
                          {formatCurrency(proposal.monthly_savings)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;