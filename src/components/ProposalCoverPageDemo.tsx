import React from 'react';
import ProposalCoverPage from './ProposalCoverPage';

const ProposalCoverPageDemo = () => {
  // Dados de exemplo para demonstração
  const mockFormData = {
    clientName: "João Silva Santos",
    address: "Rua das Flores, 123",
    number: "123",
    neighborhood: "Centro",
    city: "Campo Grande",
    state: "MS",
    phone: "(67) 99999-9999",
    systemPower: 8.5
  };

  const mockCalculations = {
    monthlyGeneration: 1200,
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