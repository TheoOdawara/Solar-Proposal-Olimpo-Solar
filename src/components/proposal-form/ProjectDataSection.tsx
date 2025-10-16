import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, CheckCircle } from "lucide-react";
import type { FormData } from '@/types/proposal';

interface ProjectDataSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string | number) => void;
  isComplete: boolean;
}

export const ProjectDataSection: React.FC<ProjectDataSectionProps> = ({
  formData,
  onFieldChange,
  isComplete
}) => {
  return (
    <AccordionItem value="project" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-secondary to-secondary-hover rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-inter font-semibold">Dados do Projeto Solar</span>
          {isComplete && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="monthlyConsumption">Consumo Médio Mensal (kWh) *</Label>
              <Input 
                id="monthlyConsumption" 
                type="number" 
                step="1" 
                value={formData.monthlyConsumption || ''} 
                onChange={e => onFieldChange('monthlyConsumption', parseFloat(e.target.value) || 0)} 
                placeholder="800" 
                className="placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="desiredKwh">Quantidade de kWh desejados/mês *</Label>
              <Input 
                id="desiredKwh" 
                type="number" 
                step="1" 
                value={formData.desiredKwh || ''} 
                onChange={e => onFieldChange('desiredKwh', parseFloat(e.target.value) || 0)} 
                placeholder="600" 
                className="placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="modulePower">Potência do Módulo (W) *</Label>
              <Input 
                id="modulePower" 
                type="number" 
                value={formData.modulePower || ''} 
                onChange={e => onFieldChange('modulePower', parseInt(e.target.value) || 0)} 
                placeholder="450" 
                className="placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="moduleBrand">Marca dos Módulos *</Label>
            <Input 
              id="moduleBrand" 
              value={formData.moduleBrand} 
              onChange={e => onFieldChange('moduleBrand', e.target.value)} 
              placeholder="Canadian Solar" 
              className="placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="inverterBrand">Marca do Inversor *</Label>
              <Input 
                id="inverterBrand" 
                value={formData.inverterBrand} 
                onChange={e => onFieldChange('inverterBrand', e.target.value)} 
                placeholder="Fronius" 
                className="placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <Label htmlFor="inverterPower">Potência do Inversor (W) *</Label>
              <Input 
                id="inverterPower" 
                type="number" 
                value={formData.inverterPower || ''} 
                onChange={e => onFieldChange('inverterPower', parseInt(e.target.value) || 0)} 
                placeholder="5000" 
                className="placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="pricePerKwp">Preço por kWp (R$) *</Label>
              <Input 
                id="pricePerKwp" 
                type="number" 
                step="0.01"
                value={formData.pricePerKwp || ''} 
                onChange={e => onFieldChange('pricePerKwp', parseFloat(e.target.value) || 0)} 
                placeholder="2450.00" 
                className="placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
