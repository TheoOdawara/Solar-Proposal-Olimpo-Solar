import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle } from "lucide-react";
import type { FormData } from '@/types/proposal';

interface WarrantiesSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string | number) => void;
  isComplete: boolean;
}

export const WarrantiesSection: React.FC<WarrantiesSectionProps> = ({
  formData,
  onFieldChange,
  isComplete
}) => {
  return (
    <AccordionItem value="warranties" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-inter font-semibold">Garantias e Características</span>
          {isComplete && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="structureType">Tipo de Estrutura</Label>
              <Select 
                value={formData.structureType} 
                onValueChange={value => onFieldChange('structureType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de estrutura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fibrocimento">Fibrocimento</SelectItem>
                  <SelectItem value="metalica">Metálica</SelectItem>
                  <SelectItem value="ceramica">Cerâmica</SelectItem>
                  <SelectItem value="laje">Laje</SelectItem>
                  <SelectItem value="solo">Solo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="monitoring">Sistema de Monitoramento</Label>
              <Select 
                value={formData.monitoring} 
                onValueChange={value => onFieldChange('monitoring', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o monitoramento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app_fabricante">App do Fabricante</SelectItem>
                  <SelectItem value="monitoramento_dedicado">Monitoramento Dedicado</SelectItem>
                  <SelectItem value="sem_monitoramento">Sem Monitoramento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">Garantias do Sistema</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="moduleWarranty">Garantia dos Módulos</Label>
                <Input 
                  id="moduleWarranty" 
                  value={formData.moduleWarranty} 
                  onChange={e => onFieldChange('moduleWarranty', e.target.value)} 
                  placeholder="Ex: 25 anos de eficiência e 12 anos fabricação" 
                />
              </div>

              <div>
                <Label htmlFor="inverterWarranty">Garantia do Inversor</Label>
                <Input 
                  id="inverterWarranty" 
                  value={formData.inverterWarranty} 
                  onChange={e => onFieldChange('inverterWarranty', e.target.value)} 
                  placeholder="Ex: 10 anos" 
                />
              </div>

              <div>
                <Label htmlFor="microInverterWarranty">Garantia do Micro Inversor (se aplicável)</Label>
                <Input 
                  id="microInverterWarranty" 
                  value={formData.microInverterWarranty} 
                  onChange={e => onFieldChange('microInverterWarranty', e.target.value)} 
                  placeholder="Ex: 25 anos" 
                />
              </div>

              <div>
                <Label htmlFor="structureWarranty">Garantia da Estrutura</Label>
                <Input 
                  id="structureWarranty" 
                  value={formData.structureWarranty} 
                  onChange={e => onFieldChange('structureWarranty', e.target.value)} 
                  placeholder="Ex: 10 anos" 
                />
              </div>

              <div>
                <Label htmlFor="installationWarranty">Garantia da Instalação</Label>
                <Input 
                  id="installationWarranty" 
                  value={formData.installationWarranty} 
                  onChange={e => onFieldChange('installationWarranty', e.target.value)} 
                  placeholder="Ex: 5 anos" 
                />
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
