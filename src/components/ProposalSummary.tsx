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
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-5 w-5 text-[#0D3B66]" />
          <h3 className="text-lg sm:text-xl font-inter font-semibold text-[#0D3B66]">Resumo do Projeto</h3>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
          <div className="flex flex-col items-center justify-center min-w-0 py-1">
            <span className="text-[#0D3B66] text-2xl sm:text-3xl font-bold leading-tight">{calculations.monthlyGeneration}</span>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">kWh/mês</span>
          </div>
          <div className="flex flex-col items-center justify-center min-w-0 py-1">
            <span className="text-[#2A6F97] text-2xl sm:text-3xl font-bold leading-tight">{formatCurrency(calculations.monthlySavings)}</span>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">Economia/mês</span>
          </div>
          <div className="flex flex-col items-center justify-center min-w-0 py-1">
            <span className="text-[#468FAF] text-2xl sm:text-3xl font-bold leading-tight">{calculations.requiredArea} m²</span>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">Área Necessária</span>
          </div>
          <div className="flex flex-col items-center justify-center min-w-0 py-1">
            <span className="text-foreground text-2xl sm:text-3xl font-bold leading-tight">{formatCurrency(calculations.totalValue)}</span>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">Valor Total</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposalSummary;