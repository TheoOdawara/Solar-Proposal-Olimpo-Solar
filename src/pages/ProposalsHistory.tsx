import { useProposals } from "@/hooks/useProposals";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Search, FileText, Download } from "lucide-react";

const ProposalsHistory = () => {
  const { proposals, loading } = useProposals();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProposals = proposals.filter(proposal =>
    proposal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proposal.seller_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Histórico de Propostas
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proposals.length}</div>
              <p className="text-xs text-muted-foreground">propostas criadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Badge variant="secondary">
                {formatCurrency(proposals.reduce((sum, p) => sum + Number(p.total_value), 0))}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(proposals.reduce((sum, p) => sum + Number(p.total_value), 0))}
              </div>
              <p className="text-xs text-muted-foreground">em propostas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
              <Badge variant="outline">
                {proposals.length > 0 
                  ? formatCurrency(proposals.reduce((sum, p) => sum + Number(p.total_value), 0) / proposals.length)
                  : formatCurrency(0)
                }
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {proposals.length > 0 
                  ? formatCurrency(proposals.reduce((sum, p) => sum + Number(p.total_value), 0) / proposals.length)
                  : formatCurrency(0)
                }
              </div>
              <p className="text-xs text-muted-foreground">por proposta</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtrar Propostas</CardTitle>
            <CardDescription>Busque por cliente ou vendedor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Proposals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Propostas ({filteredProposals.length})</CardTitle>
            <CardDescription>
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Todas as suas propostas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Potência (kWp)</TableHead>
                    <TableHead>Geração Mensal</TableHead>
                    <TableHead>Economia Mensal</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'Nenhuma proposta encontrada com esse filtro.' : 'Nenhuma proposta encontrada.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell>{formatDate(proposal.created_at)}</TableCell>
                        <TableCell className="font-medium">{proposal.client_name}</TableCell>
                        <TableCell>{proposal.seller_name || 'N/A'}</TableCell>
                        <TableCell>{Number(proposal.system_power).toFixed(2)} kWp</TableCell>
                        <TableCell>{Number(proposal.monthly_generation).toLocaleString('pt-BR')} kWh</TableCell>
                        <TableCell>{formatCurrency(Number(proposal.monthly_savings))}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(Number(proposal.total_value))}</TableCell>
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

export default ProposalsHistory;