/**
 * Utilitários de mapeamento entre FormData (camelCase, UI) e ProposalData (snake_case, DB)
 * Centraliza a conversão para evitar inconsistências e duplicação
 */

import type { FormData, ProposalData, Calculations } from '@/types/proposal';

/**
 * Converte dados do formulário (camelCase) para payload do banco (snake_case)
 */
export function mapFormToProposalPayload(
  formData: FormData,
  calculations: Calculations,
  sellerData?: { seller_id?: string; seller_name?: string }
): Omit<ProposalData, 'id' | 'created_at' | 'updated_at'> {
  return {
    // Dados do cliente
    client_name: formData.clientName,
    phone: formData.phone,
    email: formData.email,
    cep: formData.cep,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    neighborhood: formData.neighborhood,
    complement: formData.complement,

    // Dados do sistema
    system_power: formData.systemPower,
    module_quantity: formData.moduleQuantity,
    module_power: formData.modulePower,
    module_brand: formData.moduleBrand,
    inverter_brand: formData.inverterBrand,
    inverter_power: formData.inverterPower,
    
    // Características do projeto
    structure_type: formData.structureType,
    monitoring: formData.monitoring,

    // Dados de consumo e conexão
    monthly_consumption: formData.monthlyConsumption,
    desired_kwh: formData.desiredKwh,
    average_bill: formData.averageBill,
    connection_type: formData.connectionType,

    // Cálculos
    monthly_generation: calculations.monthlyGeneration,
    monthly_savings: calculations.monthlySavings,
    required_area: calculations.requiredArea,
    total_value: calculations.totalValue,

    // Dados comerciais
    payment_method: formData.paymentMethod,
    price_per_kwp: formData.pricePerKwp,
    notes: formData.observations,

    // Garantias
    module_warranty: formData.moduleWarranty,
    inverter_warranty: formData.inverterWarranty,
    micro_inverter_warranty: formData.microInverterWarranty,
    structure_warranty: formData.structureWarranty,
    installation_warranty: formData.installationWarranty,

    // Dados do vendedor (se fornecidos)
    seller_id: sellerData?.seller_id,
    seller_name: sellerData?.seller_name,

    // Status padrão
    status: 'draft',
  };
}

/**
 * Converte dados do banco (snake_case) para formato do formulário (camelCase)
 */
export function mapProposalToForm(proposal: ProposalData): FormData {
  return {
    // Dados do cliente
    clientName: proposal.client_name,
    phone: proposal.phone || '',
    email: proposal.email || '',
    cep: proposal.cep || '',
    address: proposal.address || '',
    number: '', // Não armazenado separadamente no banco atual
    city: proposal.city || '',
    state: proposal.state || '',
    neighborhood: proposal.neighborhood || '',
    complement: proposal.complement || '',

    // Dados do sistema
    systemPower: proposal.system_power,
    moduleQuantity: proposal.module_quantity || 0,
    modulePower: proposal.module_power || 0,
    moduleBrand: proposal.module_brand || '',
    inverterBrand: proposal.inverter_brand || '',
    inverterPower: proposal.inverter_power || 0,

    // Características do projeto
    structureType: proposal.structure_type || '',
    monitoring: proposal.monitoring || '',

    // Dados de consumo
    monthlyConsumption: proposal.monthly_consumption || 0,
    desiredKwh: proposal.desired_kwh || 0,
    averageBill: proposal.average_bill || 0,
    connectionType: proposal.connection_type || 'bifasico',

    // Dados comerciais
    paymentMethod: proposal.payment_method || '',
    pricePerKwp: proposal.price_per_kwp || 0,
    observations: proposal.notes || '',

    // Garantias
    moduleWarranty: proposal.module_warranty || '25 anos de eficiência e 12 anos fabricação',
    inverterWarranty: proposal.inverter_warranty || '',
    microInverterWarranty: proposal.micro_inverter_warranty || '',
    structureWarranty: proposal.structure_warranty || '',
    installationWarranty: proposal.installation_warranty || '',
  };
}

/**
 * Cria um objeto Calculations a partir dos dados da proposta no banco
 */
export function extractCalculationsFromProposal(proposal: ProposalData): Calculations {
  return {
    monthlyGeneration: proposal.monthly_generation,
    monthlySavings: proposal.monthly_savings,
    requiredArea: proposal.required_area || 0,
    totalValue: proposal.total_value,
  };
}
