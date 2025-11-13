/**
 * Constantes relacionadas ao sistema de energia solar
 * Centraliza valores específicos do negócio
 */

// Constantes de irradiação solar para Campo Grande/MS
export const SOLAR_CONSTANTS = {
  // Irradiação solar média em Campo Grande (kWh/m²/dia)
  IRRADIATION_CAMPO_GRANDE: 5.0,
  
  // Fator de performance do sistema (considera perdas)
  PERFORMANCE_FACTOR: 0.80,
  
  // Dias no mês para cálculos
  DAYS_PER_MONTH: 30,
  
  // Horas de sol pico por dia
  PEAK_SUN_HOURS: 5.5,
  
  // Área ocupada por módulo (m²)
  MODULE_AREA: 2.8,
  
  // Valor médio do kWh em MS (R$)
  KWH_PRICE: 1.27,
  
  // Preço padrão por kWp (R$)
  DEFAULT_PRICE_PER_KWP: 2450,
} as const;

// Tipos de ligação elétrica e seus custos mínimos
export const CONNECTION_TYPES = {
  bifasico: {
    label: 'Bifásico',
    minimumBill: 120, // Custo mínimo com energia solar
  },
  trifasico: {
    label: 'Trifásico', 
    minimumBill: 300, // Custo mínimo com energia solar
  },
} as const;

// Garantias padrão do sistema
export const WARRANTIES = {
  modules: {
    efficiency: 25, // anos
    manufacturing: 12, // anos
  },
  inverters: 10, // anos
  microInverters: 15, // anos
  structure: 10, // anos
  installation: 12, // meses
} as const;

// Dados da empresa
export const COMPANY_DATA = {
  name: 'Olimpo Solar',
  phone: '(67) 99668-0242',
  address: 'R. Eduardo Santos Pereira, 1831 Centro, Campo Grande - MS',
  cnpj: '12.345.678/0001-90',
  email: 'adm.olimposolar@gmail.com',
  instagram: 'olimpo.energiasolar',
} as const;

// Configurações de validação
export const VALIDATION_RULES = {
  minSystemPower: 0.1, // kWp
  maxSystemPower: 100, // kWp
  minModulePower: 100, // W
  maxModulePower: 800, // W
  minInverterPower: 1, // kW
  maxInverterPower: 50, // kW
  minMonthlyConsumption: 50, // kWh
  maxMonthlyConsumption: 10000, // kWh
} as const;