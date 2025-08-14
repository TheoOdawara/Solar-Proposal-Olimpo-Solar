import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import type { Calculations } from '@/types/proposal';

interface ProposalSummaryProps {
  calculations: Calculations;
  className?: string;
}

const ProposalSummary: React.FC<ProposalSummaryProps> = ({ calculations, className = "" }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className={`bg-white border shadow-card ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-inter font-semibold text-primary">Resumo do Projeto</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-summary-number text-primary">{calculations.monthlyGeneration}</div>
            <div className="text-summary-label">kWh/mês</div>
          </div>
          
          <div className="text-center">
            <div className="text-summary-number text-secondary">{formatCurrency(calculations.monthlySavings)}</div>
            <div className="text-summary-label">Economia/mês</div>
          </div>
          
          <div className="text-center">
            <div className="text-summary-number text-accent-foreground">{calculations.requiredArea} m²</div>
            <div className="text-summary-label">Área Necessária</div>
          </div>
          
          <div className="text-center">
            <div className="text-summary-number text-foreground">{formatCurrency(calculations.totalValue)}</div>
            <div className="text-summary-label">Valor Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalSummary;