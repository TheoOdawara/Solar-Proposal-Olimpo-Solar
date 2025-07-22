import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  AlertTriangle,
  Clock,
  Shield,
  Home,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useAdvancedAnalytics } from "@/hooks/useAdvancedAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
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

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões administrativas...</p>
        </div>
      </div>
    );
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM", { locale: ptBR });
  };

  // Calculate seller rankings
  const sellerRankings = React.useMemo(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Enhanced Header with Olimpo branding */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-400 rounded-xl shadow-lg">
                <Zap className="h-8 w-8 text-blue-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  Dashboard Administrativo
                  <Badge className="bg-yellow-400 text-blue-800 hover:bg-yellow-500">
                    Olimpo Solar
                  </Badge>
                </h1>
                <p className="text-blue-100 mt-1">
                  Monitoramento executivo da performance comercial
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
                className="bg-yellow-400 text-blue-800 hover:bg-yellow-500 font-semibold"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Alert key={notification.id} className="border-yellow-200 bg-yellow-50">
                <Bell className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">{notification.title}</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  {notification.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Monthly Key Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Propostas do Mês</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{monthlyMetrics.totalProposals}</div>
              <p className="text-xs text-blue-600 mt-1">
                Total gerado neste mês
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Valor Total Mensal</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{formatCurrency(monthlyMetrics.totalValue)}</div>
              <p className="text-xs text-green-600 mt-1">
                Em propostas geradas
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Vendedores Ativos</CardTitle>
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">{monthlyMetrics.activeSellers}</div>
              <p className="text-xs text-yellow-600 mt-1">
                Equipe comercial ativa
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Média por Proposta</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <Trophy className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{formatCurrency(monthlyMetrics.averageValue)}</div>
              <p className="text-xs text-purple-600 mt-1">
                Ticket médio mensal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Evolução das Propostas (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    className="text-sm text-gray-600"
                  />
                  <YAxis className="text-sm text-gray-600" />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
                    formatter={(value: number, name: string) => [
                      name === 'proposals_count' ? value : formatCurrency(value),
                      name === 'proposals_count' ? 'Propostas' : 'Valor Total'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="proposals_count" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Seller Ranking Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Ranking dos Vendedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
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
                    <TableRow key={index} className={index === 0 ? "bg-yellow-50" : ""}>
                      <TableCell>
                        <Badge variant={index === 0 ? "default" : "secondary"} className={
                          index === 0 ? "bg-yellow-500 text-white" : ""
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
                      <TableCell className="text-right font-semibold text-green-700">
                        {formatCurrency(seller.totalValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(seller.averageValue)}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
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
              <Filter className="h-5 w-5 text-blue-600" />
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
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Proposals Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Todas as Propostas ({proposals.length})
            </CardTitle>
            <Button onClick={() => exportToExcel(proposals)} className="bg-blue-600 hover:bg-blue-700">
              <FileDown className="h-4 w-4 mr-2" />
              Exportar Filtradas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Data</TableHead>
                    <TableHead className="font-semibold">Vendedor</TableHead>
                    <TableHead className="font-semibold">Cliente</TableHead>
                    <TableHead className="font-semibold text-center">Potência</TableHead>
                    <TableHead className="font-semibold text-right">Valor Total</TableHead>
                    <TableHead className="font-semibold text-center">Geração</TableHead>
                    <TableHead className="font-semibold text-center">Economia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.slice(0, 50).map((proposal) => (
                    <TableRow key={proposal.id} className="hover:bg-gray-50">
                      <TableCell className="text-sm">
                        {format(new Date(proposal.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        <br />
                        <span className="text-gray-500 text-xs">
                          {format(new Date(proposal.created_at), "HH:mm", { locale: ptBR })}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {proposal.seller_name}
                      </TableCell>
                      <TableCell>
                        {proposal.client_name}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {proposal.system_power} kWp
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-700">
                        {formatCurrency(proposal.total_value)}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {proposal.monthly_generation.toFixed(0)} kWh/mês
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium text-green-600">
                        {formatCurrency(proposal.monthly_savings)}/mês
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {proposals.length > 50 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Mostrando 50 de {proposals.length} propostas. Use os filtros para refinar os resultados.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;