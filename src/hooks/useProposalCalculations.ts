/**
 * Hook centralizado para cálculos de propostas
 * Gerencia estado e lógica de cálculos de forma reativa
 */

import { useState, useEffect, useRef } from 'react';
import { calculateSolarMetrics, calculateAverageBill, calculateRequiredPower, calculateModuleQuantity } from '@/utils/calculations';
import { SOLAR_CONSTANTS } from '@/constants/solarData';
import type { FormData, Calculations } from '@/types/proposal';

interface UseProposalCalculationsProps {
  formData: FormData;
  onCalculationsChange?: (calculations: Calculations) => void;
}

export const useProposalCalculations = ({ 
  formData, 
  onCalculationsChange 
}: UseProposalCalculationsProps) => {
  const [calculations, setCalculations] = useState<Calculations>({
    monthlyGeneration: 0,
    monthlySavings: 0,
    requiredArea: 0,
    totalValue: 0,
  });

  // Usar ref para evitar dependência que causa loop infinito
  const onCalculationsChangeRef = useRef(onCalculationsChange);
  onCalculationsChangeRef.current = onCalculationsChange;

  // Recalcula sempre que os dados do formulário mudarem
  useEffect(() => {
    const { desiredKwh, modulePower, pricePerKwp, monthlyConsumption } = formData;

    // Calcular métricas principais
    const newCalculations = calculateSolarMetrics({
      desiredKwh,
      modulePower,
      pricePerKwp,
      monthlyConsumption,
    });

    setCalculations(newCalculations);
    
    // Notificar componente pai sobre mudanças
    if (onCalculationsChangeRef.current) {
      onCalculationsChangeRef.current(newCalculations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.desiredKwh,
    formData.modulePower, 
    formData.pricePerKwp,
    formData.monthlyConsumption,
  ]);

  // Função para calcular campos derivados automaticamente
  const calculateDerivedFields = (partialFormData: Partial<FormData>) => {
    const updates: Partial<FormData> = {};

    // Calcular valor médio da conta automaticamente
    if (partialFormData.monthlyConsumption && partialFormData.monthlyConsumption > 0) {
      updates.averageBill = calculateAverageBill(partialFormData.monthlyConsumption);
    }

    // Calcular potência e quantidade de módulos se necessário
    if (partialFormData.desiredKwh && partialFormData.desiredKwh > 0) {
      const calculatedSystemPower = calculateRequiredPower(partialFormData.desiredKwh);
      updates.systemPower = Math.round(calculatedSystemPower * 10) / 10;

      // Calcular quantidade de módulos se tiver potência do módulo
      if (partialFormData.modulePower && partialFormData.modulePower > 0) {
        updates.moduleQuantity = calculateModuleQuantity(calculatedSystemPower, partialFormData.modulePower);
      }
    }

    return updates;
  };

  // Função auxiliar para calcular conta média
  const getCalculatedAverageBill = (monthlyConsumption: number): number => {
    return calculateAverageBill(monthlyConsumption);
  };

  // Função auxiliar para calcular potência necessária
  const getRequiredPowerForConsumption = (desiredKwh: number): number => {
    return calculateRequiredPower(desiredKwh);
  };

  // Função auxiliar para calcular quantidade de módulos
  const getModuleQuantityForPower = (systemPower: number, modulePower: number): number => {
    return calculateModuleQuantity(systemPower, modulePower);
  };

  return {
    calculations,
    calculateDerivedFields,
    getCalculatedAverageBill,
    getRequiredPowerForConsumption,
    getModuleQuantityForPower,
  };
};