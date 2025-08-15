/**
 * Tipos centralizados para propostas e dados relacionados
 * Centralizando todas as interfaces para evitar duplicação
 */

export interface FormData {
  // Dados do cliente
  clientName: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  complement: string;
  phone: string;
  email: string;

  // Dados do projeto
  monthlyConsumption: number;
  desiredKwh: number;
  systemPower: number;
  moduleQuantity: number;
  modulePower: number;
  moduleBrand: string;
  inverterBrand: string;
  inverterPower: number;
  pricePerKwp: number;

  // Dados da economia
  averageBill: number;
  connectionType: string;

  // Complementos
  paymentMethod: string;
  observations: string;
}

export interface Calculations {
  monthlyGeneration: number;
  monthlySavings: number;
  requiredArea: number;
  totalValue: number;
}

export interface ProposalData {
  id?: string;
  client_name: string;
  system_power: number;
  monthly_generation: number;
  monthly_savings: number;
  total_value: number;
  seller_name?: string;
  seller_id?: string;
  created_at?: string;
  updated_at?: string;
  
  // Campos expandidos (usando snake_case para compatibilidade com banco)
  status?: 'draft' | 'sent' | 'approved' | 'rejected' | 'closed';
  cep?: string;
  address?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  complement?: string;
  monthly_consumption?: number;
  average_bill?: number;
  module_brand?: string;
  module_model?: string;
  module_power?: number;
  module_quantity?: number;
  inverter_brand?: string;
  inverter_model?: string;
  inverter_power?: number; // Campo que estava faltando
  connection_type?: string; // Campo que estava faltando para tipo de ligação
  payment_method?: string;
  payment_conditions?: string;
  valid_until?: string;
  notes?: string;
  required_area?: number;
  phone?: string;
  email?: string;
}

export interface CompanyData {
  phone: string;
  address: string;
  cnpj: string;
}

export interface ProposalFormProps {
  onProposalDataChange?: (data: {
    clientName: string;
    systemPower: number;
    monthlyGeneration: number;
    monthlySavings: number;
    totalValue: number;
  }) => void;
}

export interface ProposalPreviewProps {
  formData: FormData;
  calculations: Calculations;
  onEdit: () => void;
  onGeneratePDF: () => void;
}

export interface ProposalCoverPageProps {
  formData: FormData;
  calculations: Calculations;
  companyData?: CompanyData;
}