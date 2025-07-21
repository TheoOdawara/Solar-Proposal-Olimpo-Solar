import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Trash2, Eye, User } from "lucide-react";
import { useProposals, ProposalData } from "@/hooks/useProposals";
import { Skeleton } from "@/components/ui/skeleton";

interface ProposalsHistoryProps {
  onLoadProposal?: (proposal: ProposalData) => void;
}

const ProposalsHistory = ({ onLoadProposal }: ProposalsHistoryProps) => {
  const { proposals, loading, deleteProposal } = useProposals();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5 text-primary" />
            Histórico de Propostas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (proposals.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5 text-primary" />
            Histórico de Propostas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma proposta salva encontrada.</p>
            <p className="text-sm text-muted-foreground">Salve sua primeira proposta para vê-la aqui.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="h-5 w-5 text-primary" />
          Histórico de Propostas ({proposals.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="p-4 border rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {proposal.client_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {proposal.created_at && formatDate(proposal.created_at)}
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {proposal.system_power} kWp
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-3">
              <div>
                <span className="text-muted-foreground">Geração:</span>
                <div className="font-medium">{proposal.monthly_generation} kWh/mês</div>
              </div>
              <div>
                <span className="text-muted-foreground">Economia:</span>
                <div className="font-medium">{formatCurrency(proposal.monthly_savings)}/mês</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <span className="text-muted-foreground">Valor:</span>
                <div className="font-medium text-primary">{formatCurrency(proposal.total_value)}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onLoadProposal?.(proposal)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Carregar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteProposal(proposal.id!)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProposalsHistory;