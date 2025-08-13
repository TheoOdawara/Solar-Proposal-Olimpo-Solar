/**
 * Lógica de cálculos de energia solar centralizada
 * Evita duplicação de lógica entre componentes
 */

import { SOLAR_CONSTANTS, CONNECTION_TYPES } from '@/constants/solarData';
import type { FormData, Calculations } from '@/types/proposal';

export interface SolarCalculationParams {
  desiredKwh: number;
  modulePower: number;
  systemPower?: number;
  pricePerKwp: number;
  monthlyConsumption: number;
}

export interface EconomyCalculationParams {
  averageBill: number;
  connectionType: keyof typeof CONNECTION_TYPES;
}

export interface EconomyData {
  currentBillPerYear: number;
  currentBillPerMonth: number;
  billWithSolarPerYear: number;
  billWithSolarPerMonth: number;
  savingsPerYear: number;
  savingsPerMonth: number;
}

/**
 * Calcula as métricas principais do sistema solar
 */
export const calculateSolarMetrics = (params: SolarCalculationParams): Calculations => {
  const { desiredKwh, modulePower, pricePerKwp, monthlyConsumption } = params;

  if (desiredKwh <= 0) {
    return {
      monthlyGeneration: 0,
      monthlySavings: 0,
      requiredArea: 0,
      totalValue: 0,
    };
  }

  // 1. Calcular potência necessária
  const calculatedSystemPower = desiredKwh / (
    SOLAR_CONSTANTS.PEAK_SUN_HOURS * 
    SOLAR_CONSTANTS.DAYS_PER_MONTH * 
    SOLAR_CONSTANTS.PERFORMANCE_FACTOR
  );

  // 2. Calcular quantidade de módulos
  let calculatedModuleQuantity = 0;
  if (modulePower > 0) {
    const modulePowerKw = modulePower / 1000;
    calculatedModuleQuantity = Math.ceil(calculatedSystemPower / modulePowerKw);
  }

  // 3. Geração mensal estimada
  const monthlyGeneration = desiredKwh;

  // 4. Economia mensal estimada (R$)
  const monthlySavings = monthlyGeneration * SOLAR_CONSTANTS.KWH_PRICE;

  // 5. Área mínima necessária (m²)
  const requiredArea = calculatedModuleQuantity * SOLAR_CONSTANTS.MODULE_AREA;

  // 6. Valor total do projeto
  const totalValue = calculatedSystemPower * pricePerKwp;

  return {
    monthlyGeneration: Math.round(monthlyGeneration),
    monthlySavings: Math.round(monthlySavings),
    requiredArea: Math.round(requiredArea * 10) / 10, // Uma casa decimal
    totalValue: Math.round(totalValue),
  };
};

/**
 * Calcula automaticamente o valor médio da conta com base no consumo
 */
export const calculateAverageBill = (monthlyConsumption: number): number => {
  if (monthlyConsumption <= 0) return 0;
  return Math.round(monthlyConsumption * SOLAR_CONSTANTS.KWH_PRICE * 100) / 100;
};

/**
 * Calcula dados de economia baseados na conta atual e tipo de ligação
 */
export const calculateEconomyData = (params: EconomyCalculationParams): EconomyData => {
  const { averageBill, connectionType } = params;
  
  // Valor da conta com energia solar baseado no tipo de ligação
  const solarBill = CONNECTION_TYPES[connectionType]?.minimumBill || CONNECTION_TYPES.bifasico.minimumBill;

  // Cálculos anuais e mensais
  const currentBillPerYear = averageBill * 12;
  const billWithSolarPerYear = solarBill * 12;
  const savingsPerMonth = averageBill - solarBill;
  const savingsPerYear = currentBillPerYear - billWithSolarPerYear;

  return {
    currentBillPerYear,
    currentBillPerMonth: averageBill,
    billWithSolarPerYear,
    billWithSolarPerMonth: solarBill,
    savingsPerYear,
    savingsPerMonth,
  };
};

/**
 * Calcula métricas reais para gráficos
 */
export const calculateRealMetrics = (formData: FormData): {
  geracaoMedia: number;
  consumoMedio: number;
  economia: number;
} => {
  // Produção mensal baseada na irradiação de Campo Grande
  const energiaMensal = formData.systemPower * SOLAR_CONSTANTS.IRRADIATION_CAMPO_GRANDE * SOLAR_CONSTANTS.DAYS_PER_MONTH;
  const consumoMedio = formData.desiredKwh || formData.monthlyConsumption;
  
  // Cálculo da economia percentual
  const economia = Math.min(
    Math.round((1 - consumoMedio / energiaMensal) * 100), 
    100
  );

  return {
    geracaoMedia: Math.round(energiaMensal),
    consumoMedio: Math.round(consumoMedio),
    economia: Math.max(economia, 0), // Garantir que não seja negativo
  };
};

/**
 * Calcula ROI (Return on Investment) para energia solar
 */
export const calculateSolarROI = (monthlySavings: number, totalValue: number): number => {
  if (totalValue <= 0) return 0;
  
  const annualSavings = monthlySavings * 12;
  const roi = (annualSavings / totalValue) * 100;
  
  return Math.round(roi * 10) / 10; // Uma casa decimal
};

/**
 * Calcula tempo de retorno do investimento (payback)
 */
export const calculatePayback = (totalValue: number, monthlySavings: number): number => {
  if (monthlySavings <= 0) return 0;
  
  const annualSavings = monthlySavings * 12;
  return Math.ceil(totalValue / annualSavings);
};

/**
 * Calcula a potência necessária com base no consumo desejado
 */
export const calculateRequiredPower = (desiredKwh: number): number => {
  if (desiredKwh <= 0) return 0;
  
  return desiredKwh / (
    SOLAR_CONSTANTS.PEAK_SUN_HOURS * 
    SOLAR_CONSTANTS.DAYS_PER_MONTH * 
    SOLAR_CONSTANTS.PERFORMANCE_FACTOR
  );
};

/**
 * Calcula quantidade de módulos necessários
 */
export const calculateModuleQuantity = (systemPower: number, modulePower: number): number => {
  if (modulePower <= 0 || systemPower <= 0) return 0;
  
  const modulePowerKw = modulePower / 1000;
  return Math.ceil(systemPower / modulePowerKw);
};