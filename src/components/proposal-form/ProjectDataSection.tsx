import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from 'react-hook-form';

export const ProjectDataSection: React.FC = () => {
  const { register } = useFormContext();

  return (
    <div className="bg-[#F6F6F6] border border-[#E0E7EF] shadow-lg rounded-2xl overflow-hidden px-8 pt-6 pb-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="monthlyConsumption">Consumo Médio Mensal (kWh) *</Label>
            <Input
              id="monthlyConsumption"
              type="number"
              step="1"
              placeholder="800"
              className="placeholder:text-gray-400"
              {...register('monthlyConsumption')}
            />
          </div>

          <div>
            <Label htmlFor="desiredKwh">Quantidade de kWh desejados/mês *</Label>
            <Input
              id="desiredKwh"
              type="number"
              step="1"
              placeholder="600"
              className="placeholder:text-gray-400"
              {...register('desiredKwh')}
            />
          </div>

          <div>
            <Label htmlFor="modulePower">Potência do Módulo (W) *</Label>
            <Input
              id="modulePower"
              type="number"
              placeholder="450"
              className="placeholder:text-gray-400"
              {...register('modulePower')}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="moduleBrand">Marca dos Módulos *</Label>
          <Input
            id="moduleBrand"
            placeholder="Canadian Solar"
            className="placeholder:text-gray-400"
            {...register('moduleBrand')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="inverterBrand">Marca do Inversor *</Label>
            <Input
              id="inverterBrand"
              placeholder="Fronius"
              className="placeholder:text-gray-400"
              {...register('inverterBrand')}
            />
          </div>

          <div>
            <Label htmlFor="inverterPower">Potência do Inversor (W) *</Label>
            <Input
              id="inverterPower"
              type="number"
              placeholder="5000"
              className="placeholder:text-gray-400"
              {...register('inverterPower')}
            />
          </div>

          <div>
            <Label htmlFor="pricePerKwp">Preço por kWp (R$) *</Label>
            <Input
              id="pricePerKwp"
              type="number"
              step="0.01"
              placeholder="2450.00"
              className="placeholder:text-gray-400"
              {...register('pricePerKwp')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
