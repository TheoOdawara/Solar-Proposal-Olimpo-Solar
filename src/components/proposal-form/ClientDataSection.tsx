import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Phone, MapPin, CheckCircle } from "lucide-react";
import type { FormData } from '@/types/proposal';

interface ClientDataSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string | number) => void;
  onPhoneChange: (value: string) => void;
  onCepChange: (value: string) => void;
  hasNoAddress: boolean;
  onNoAddressChange: (checked: boolean) => void;
  isLoadingCep: boolean;
  isComplete: boolean;
}

export const ClientDataSection: React.FC<ClientDataSectionProps> = ({
  formData,
  onFieldChange,
  onPhoneChange,
  onCepChange,
  hasNoAddress,
  onNoAddressChange,
  isLoadingCep,
  isComplete
}) => {
  return (
    <AccordionItem value="client" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
      <AccordionTrigger className="px-6 py-4 hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-primary to-primary-hover rounded-lg">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-inter font-semibold">Dados do Cliente</span>
          {isComplete && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="md:col-span-2">
            <Label htmlFor="clientName">Nome do Cliente *</Label>
            <Input 
              id="clientName" 
              value={formData.clientName} 
              onChange={e => onFieldChange('clientName', e.target.value)} 
              placeholder="Nome completo do cliente" 
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="phone" 
                value={formData.phone} 
                onChange={e => onPhoneChange(e.target.value)} 
                placeholder="(67) 99999-9999" 
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                maxLength={15}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email} 
              onChange={e => onFieldChange('email', e.target.value)} 
              placeholder="cliente@email.com" 
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Endereço opcional */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasNoAddress" 
                checked={hasNoAddress} 
                onCheckedChange={onNoAddressChange}
              />
              <Label htmlFor="hasNoAddress" className="text-sm font-medium text-muted-foreground">
                Não tenho o endereço agora
              </Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cep">CEP {!hasNoAddress && "*"}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="cep" 
                    value={formData.cep} 
                    onChange={e => onCepChange(e.target.value)} 
                    placeholder="00000-000" 
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    disabled={isLoadingCep || hasNoAddress}
                  />
                  {isLoadingCep && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={e => onFieldChange('address', e.target.value)} 
                  placeholder="Rua, Avenida..." 
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={hasNoAddress}
                />
              </div>
              
              <div>
                <Label htmlFor="number">Número</Label>
                <Input 
                  id="number" 
                  value={formData.number} 
                  onChange={e => onFieldChange('number', e.target.value)} 
                  placeholder="123" 
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={hasNoAddress}
                />
              </div>
              
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input 
                  id="neighborhood" 
                  value={formData.neighborhood} 
                  onChange={e => onFieldChange('neighborhood', e.target.value)} 
                  placeholder="Nome do bairro" 
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={hasNoAddress}
                />
              </div>
              
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input 
                  id="city" 
                  value={formData.city} 
                  onChange={e => onFieldChange('city', e.target.value)} 
                  placeholder="Campo Grande" 
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={hasNoAddress}
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Input 
                  id="state" 
                  value={formData.state} 
                  onChange={e => onFieldChange('state', e.target.value)} 
                  placeholder="MS" 
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  maxLength={2}
                  disabled={hasNoAddress}
                />
              </div>

              <div>
                <Label htmlFor="complement">Complemento</Label>
                <Input 
                  id="complement" 
                  value={formData.complement} 
                  onChange={e => onFieldChange('complement', e.target.value)} 
                  placeholder="Apto 101, Bloco A..." 
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={hasNoAddress}
                />
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
