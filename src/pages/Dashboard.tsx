import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Trophy, 
  FileDown, 
  Calendar as CalendarIcon,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useRoles } from "@/hooks/useRoles";
import { useSalesAnalytics, DateRange } from "@/hooks/useSalesAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading: rolesLoading } = useRoles();
  const {
    salesData,
    sellerMetrics,
    loading: analyticsLoading,
    dateRange,
    setDateRange,
    selectedSeller,
    setSelectedSeller,
    sellers,
    topSeller,
    exportToExcel
  } = useSalesAnalytics();

  // Redirect if not authenticated or not admin
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (rolesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Você não tem permissão para acessar esta página.
            </p>
            <Button 
              onClick={() => window.history.back()} 
              className="mt-4"
              variant="outline"
            >
              Voltar
            </Button>
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

  const totalProposals = salesData.length;
  const totalValue = salesData.reduce((sum, p) => sum + p.total_value, 0);
  const averageValue = totalProposals > 0 ? totalValue / totalProposals : 0;
  const totalPower = salesData.reduce((sum, p) => sum + p.system_power, 0);

  const setQuickDateRange = (days: number) => {
    const to = new Date();
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateRange({ from, to });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Dashboard de Vendas
              </h1>
              <p className="text-muted-foreground">
                Monitoramento de performance da equipe comercial
              </p>
            </div>
            <Button onClick={exportToExcel} className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* Quick Date Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Período Rápido</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(1)}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(7)}
                  >
                    7 dias
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(30)}
                  >
                    30 dias
                  </Button>
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Período Personalizado</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          "Data inicial"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? (
                          format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          "Data final"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Seller Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Vendedor</label>
                <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os vendedores</SelectItem>
                    {sellers.map((seller) => (
                      <SelectItem key={seller.id} value={seller.id}>
                        {seller.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProposals}</div>
              <p className="text-xs text-muted-foreground">
                +{Math.round((totalProposals / 30) * 7)} esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Média de {formatCurrency(averageValue)} por proposta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potência Total</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPower.toFixed(1)} kWp</div>
              <p className="text-xs text-muted-foreground">
                Média de {(totalPower / totalProposals || 0).toFixed(1)} kWp por proposta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendedor do Mês</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {topSeller?.seller_name || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {topSeller ? formatCurrency(topSeller.total_value) : 'Sem dados'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seller Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance por Vendedor
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
                  <TableRow>
                    <TableHead>Ranking</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Propostas</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Potência Média</TableHead>
                    <TableHead>Valor Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellerMetrics.map((seller, index) => (
                    <TableRow key={seller.seller_id}>
                      <TableCell>
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {seller.seller_name}
                        {index === 0 && (
                          <Trophy className="inline h-4 w-4 text-yellow-500 ml-2" />
                        )}
                      </TableCell>
                      <TableCell>{seller.total_proposals}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(seller.total_value)}
                      </TableCell>
                      <TableCell>{seller.average_power.toFixed(1)} kWp</TableCell>
                      <TableCell>{formatCurrency(seller.average_value)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Proposals */}
        <Card>
          <CardHeader>
            <CardTitle>Propostas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Potência</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.slice(0, 10).map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      {format(new Date(proposal.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>{proposal.seller_name}</TableCell>
                    <TableCell>{proposal.client_name}</TableCell>
                    <TableCell>{proposal.system_power} kWp</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(proposal.total_value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;