import React from 'react';
import ProposalCoverPage from './ProposalCoverPage';

const ProposalCoverPageDemo = () => {
  // Dados de exemplo para demonstração - agora completos com a nova interface
  const mockFormData = {
    // Dados do cliente
    clientName: "João Silva Santos",
    address: "Rua das Flores, 123",
    number: "123",
    neighborhood: "Centro",
    city: "Campo Grande",
    state: "MS",
    cep: "79002-073",
    phone: "(67) 99999-9999",

    // Dados do projeto
    monthlyConsumption: 950,
    desiredKwh: 1200,
    systemPower: 8.5,
    moduleQuantity: 18,
    modulePower: 470,
    moduleBrand: "Canadian Solar",
    inverterBrand: "Fronius",
    inverterPower: 8,
    pricePerKwp: 2450,

    // Dados da economia
    averageBill: 1206.50,
    connectionType: "bifasico",

    // Complementos
    paymentMethod: "financiamento",
    observations: "Sistema dimensionado para atender 100% do consumo atual."
  };

  const mockCalculations = {
    monthlyGeneration: 1200,
    monthlySavings: 1524,
    requiredArea: 50.4,
    totalValue: 42000
  };

  const mockCompanyData = {
    phone: "(67) 99668-0242",
    address: "R. Eduardo Santos Pereira, 1831 Centro, Campo Grande - MS",
    cnpj: "12.345.678/0001-90"
  };

  return (
    <div className="w-full">
      <ProposalCoverPage 
        formData={mockFormData}
        calculations={mockCalculations}
        companyData={mockCompanyData}
      />
    </div>
  );
};

export default ProposalCoverPageDemo;