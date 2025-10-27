import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, MapPin } from "lucide-react";
import { useFormContext, Controller } from 'react-hook-form';
import { formatPhone, formatCep } from '@/utils/formatters';

interface ClientDataSectionProps {
  hasNoAddress: boolean;
  onNoAddressChange: (checked: boolean) => void;
  isLoadingCep: boolean;
  fetchAddressByCep?: (cep: string) => Promise<void>;
}

export const ClientDataSection: React.FC<ClientDataSectionProps> = ({
  hasNoAddress,
  onNoAddressChange,
  isLoadingCep,
  fetchAddressByCep
}) => {
  const { register, control, setValue } = useFormContext();

  const handleNoAddressToggle = (checked: boolean) => {
    onNoAddressChange(checked);
    if (checked) {
      setValue('cep', '');
      setValue('address', '');
      setValue('number', '');
      setValue('neighborhood', '');
      setValue('city', '');
      setValue('state', '');
      setValue('complement', '');
    }
  };

  return (
    <div className="bg-[#F6F6F6] border border-[#E0E7EF] shadow-lg rounded-2xl overflow-hidden px-8 pt-6 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        {/* Nome */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="clientName" className="text-xs font-semibold text-[#2A6F97] uppercase">Nome do Cliente *</Label>
          <Input
            id="clientName"
            placeholder="Nome completo do cliente"
            className="text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
            {...register('clientName')}
          />
        </div>

        {/* Telefone */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="phone" className="text-xs font-semibold text-[#2A6F97] uppercase">Telefone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#468FAF]" />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  id="phone"
                  placeholder="(67) 99999-9999"
                  className="pl-10 text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
                  maxLength={15}
                  value={field.value || ''}
                  onChange={(e) => {
                    const v = formatPhone(e.target.value);
                    field.onChange(v);
                  }}
                />
              )}
            />
          </div>
        </div>

        {/* E-mail */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-xs font-semibold text-[#2A6F97] uppercase">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="cliente@email.com"
            className="text-base text-[#468FAF] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
            {...register('email')}
          />
        </div>

        {/* Checkbox endereço */}
        <div className="flex items-center gap-2 col-span-1 sm:col-span-2 lg:col-span-3 mt-2">
          <Checkbox
            id="hasNoAddress"
            checked={hasNoAddress}
            onCheckedChange={handleNoAddressToggle}
            className="accent-[#0D3B66] w-4 h-4"
          />
          <Label htmlFor="hasNoAddress" className="text-[#2A6F97] text-sm font-medium">Não tenho o endereço agora</Label>
        </div>

        {/* CEP */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="cep" className="text-xs font-semibold text-[#2A6F97] uppercase">CEP {!hasNoAddress && "*"}</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#468FAF]" />
            <Controller
              name="cep"
              control={control}
              render={({ field }) => (
                <Input
                  id="cep"
                  placeholder="00000-000"
                  className="pl-10 text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
                  disabled={isLoadingCep || hasNoAddress}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(formatCep(e.target.value))}
                  onBlur={() => {
                    const clean = (field.value || '').replace(/\D/g, '');
                    if (clean.length === 8 && !hasNoAddress && fetchAddressByCep) fetchAddressByCep(field.value || '');
                  }}
                />
              )}
            />
            {isLoadingCep && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0D3B66]"></div>
              </div>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="address" className="text-xs font-semibold text-[#2A6F97] uppercase">Endereço</Label>
          <Input
            id="address"
            placeholder="Rua, Avenida..."
            className="text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
            disabled={hasNoAddress}
            {...register('address')}
          />
        </div>

        {/* Número */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="number" className="text-xs font-semibold text-[#2A6F97] uppercase">Número</Label>
          <Input
            id="number"
            placeholder="123"
            className="text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
            disabled={hasNoAddress}
            {...register('number')}
          />
        </div>

        {/* Bairro */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="neighborhood" className="text-xs font-semibold text-[#2A6F97] uppercase">Bairro</Label>
          <Input
            id="neighborhood"
            placeholder="Nome do bairro"
            className="text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
            disabled={hasNoAddress}
            {...register('neighborhood')}
          />
        </div>

        {/* Cidade */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="city" className="text-xs font-semibold text-[#2A6F97] uppercase">Cidade</Label>
          <Input
            id="city"
            placeholder="Campo Grande"
            className="text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
            disabled={hasNoAddress}
            {...register('city')}
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="state" className="text-xs font-semibold text-[#2A6F97] uppercase">Estado</Label>
          <Input
            id="state"
            placeholder="MS"
            className="text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
            maxLength={2}
            disabled={hasNoAddress}
            {...register('state')}
          />
        </div>

        {/* Complemento */}
        <div className="flex flex-col gap-1 lg:col-span-3 sm:col-span-2">
          <Label htmlFor="complement" className="text-xs font-semibold text-[#2A6F97] uppercase">Complemento</Label>
          <Input
            id="complement"
            placeholder="Apto 101, Bloco A..."
            className="text-base text-[#468FAF] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-white"
            disabled={hasNoAddress}
            {...register('complement')}
          />
        </div>
      </div>
    </div>
  );
};
