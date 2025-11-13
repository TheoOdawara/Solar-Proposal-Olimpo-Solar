/**
 * Componente de teste para validar os novos componentes modulares
 * Este arquivo pode ser deletado após validação
 */

import React, { useState } from 'react';
import { Accordion } from "@/components/ui/accordion";
import { ClientDataSection, ProjectDataSection } from '@/components/proposal-form';
import type { FormData } from '@/types/proposal';
import { SOLAR_CONSTANTS } from '@/constants/solarData';
import { useForm, FormProvider } from 'react-hook-form';

export const TestProposalFormSections = () => {
  const defaultValues: FormData = ({
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

  const methods = useForm({ defaultValues });



  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teste dos Componentes Modulares</h1>
      
      <FormProvider {...methods}>
        <Accordion type="single" collapsible defaultValue="client" className="space-y-4">
          <ClientDataSection
            hasNoAddress={hasNoAddress}
            onNoAddressChange={setHasNoAddress}
            isLoadingCep={isLoadingCep}
            fetchAddressByCep={async (cep: string) => {
              // Simple stub: set city/state based on CEP (for test only)
              methods.setValue('cep', cep);
              if (cep.replace(/\D/g, '').length === 8) {
                methods.setValue('city', 'TesteCity');
                methods.setValue('state', 'TS');
              }
            }}
          />

          <ProjectDataSection />
        </Accordion>
      </FormProvider>

      {/* Debug: Mostrar estado atual */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Estado Atual (Debug):</h3>
        <pre className="text-xs overflow-auto max-h-96">
          {JSON.stringify(methods.getValues(), null, 2)}
        </pre>
      </div>
    </div>
  );
};
