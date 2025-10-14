/**
 * Componente de teste para validar os novos componentes modulares
 * Este arquivo pode ser deletado após validação
 */

import React, { useState } from 'react';
import { Accordion } from "@/components/ui/accordion";
import { ClientDataSection, ProjectDataSection, WarrantiesSection } from '@/components/proposal-form';
import type { FormData } from '@/types/proposal';
import { formatPhone, formatCep } from '@/utils/formatters';
import { SOLAR_CONSTANTS } from '@/constants/solarData';

export const TestProposalFormSections = () => {
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    complement: '',
    phone: '',
    email: '',
    monthlyConsumption: 0,
    desiredKwh: 0,
    systemPower: 0,
    moduleQuantity: 0,
    modulePower: 0,
    moduleBrand: '',
    inverterBrand: '',
    inverterPower: 0,
    pricePerKwp: SOLAR_CONSTANTS.DEFAULT_PRICE_PER_KWP,
    averageBill: 0,
    connectionType: '',
    paymentMethod: '',
    observations: '',
    // Novos campos
    structureType: '',
    monitoring: '',
    moduleWarranty: '25 anos de eficiência e 12 anos fabricação',
    inverterWarranty: '',
    microInverterWarranty: '',
    structureWarranty: '',
    installationWarranty: ''
  });

  const [hasNoAddress, setHasNoAddress] = useState(false);
  const [isLoadingCep] = useState(false); // Estado controlado pelo componente pai no uso real

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('phone', formatted);
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    handleInputChange('cep', formatted);
  };

  const isClientDataComplete = () => {
    return formData.clientName.trim() !== '' && formData.phone.trim() !== '';
  };

  const isProjectDataComplete = () => {
    return formData.desiredKwh > 0 && 
           formData.modulePower > 0 && 
           formData.moduleBrand.trim() !== '' &&
           formData.inverterBrand.trim() !== '' &&
           formData.inverterPower > 0 &&
           formData.pricePerKwp > 0;
  };

  const isWarrantiesComplete = () => {
    return formData.structureType.trim() !== '' || 
           formData.monitoring.trim() !== '' ||
           formData.moduleWarranty.trim() !== '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teste dos Componentes Modulares</h1>
      
      <Accordion type="single" collapsible defaultValue="client" className="space-y-4">
        <ClientDataSection
          formData={formData}
          onFieldChange={handleInputChange}
          onPhoneChange={handlePhoneChange}
          onCepChange={handleCepChange}
          hasNoAddress={hasNoAddress}
          onNoAddressChange={setHasNoAddress}
          isLoadingCep={isLoadingCep}
          isComplete={isClientDataComplete()}
        />

        <ProjectDataSection
          formData={formData}
          onFieldChange={handleInputChange}
          isComplete={isProjectDataComplete()}
        />

        <WarrantiesSection
          formData={formData}
          onFieldChange={handleInputChange}
          isComplete={isWarrantiesComplete()}
        />
      </Accordion>

      {/* Debug: Mostrar estado atual */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Estado Atual (Debug):</h3>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};
