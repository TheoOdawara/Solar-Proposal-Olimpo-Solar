/**
 * Versão otimizada do ProposalForm
 * Implementa memoização e otimizações de performance
 */

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, FileDown, Zap, Home, MapPin, Phone, Settings, Save, History, Eye, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuth } from "@/hooks/useAuth";
import { useOptimizedProposals } from "@/hooks/useOptimizedProposals";
import { useAppContext } from "@/contexts/AppContext";
import { SplineHero } from "@/components/SplineHero";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Lazy imports para componentes pesados
const ProposalsHistory = React.lazy(() => import("@/components/ProposalsHistory"));
const ProposalPreview = React.lazy(() => import("@/components/ProposalPreview"));
const ProposalSummary = React.lazy(() => import("@/components/ProposalSummary"));

// Importar tipos e utilitários centralizados
import type { FormData, Calculations, ProposalFormProps } from '@/types/proposal';
import { useProposalCalculations } from '@/hooks/useProposalCalculations';
import { formatCurrency, formatPhone, formatCep } from '@/utils/formatters';
import { SOLAR_CONSTANTS } from '@/constants/solarData';
import { LoadingState } from '@/components/ui/loading-state';

// Componente de input memoizado
const MemoizedInput = memo<{
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}>(({ id, label, value, onChange, type = "text", placeholder, required, disabled }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className="w-full"
    />
  </div>
));

// Componente de select memoizado
const MemoizedSelect = memo<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}>(({ id, label, value, onChange, options, placeholder, required }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
));

const OptimizedProposalForm: React.FC<ProposalFormProps> = ({ onProposalDataChange }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { state, setLoading } = useAppContext();
  const { saveProposal, isLoading, isSaving } = useOptimizedProposals({
    enableCache: true,
    cacheTimeout: 5,
  });

  const [showHistory, setShowHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [hasNoAddress, setHasNoAddress] = useState(false);

  // Estado do formulário otimizado
  const [formData, setFormData] = useState<FormData>(() => ({
    clientName: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    cep: '',
    phone: '',
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
    observations: ''
  }));

  // Hook centralizado para cálculos com memoização
  const { calculations, calculateDerivedFields } = useProposalCalculations({
    formData,
    onCalculationsChange: useCallback((newCalculations: Calculations) => {
      if (onProposalDataChange && newCalculations.totalValue > 0) {
        onProposalDataChange({
          clientName: formData.clientName,
          systemPower: formData.systemPower,
          monthlyGeneration: newCalculations.monthlyGeneration,
          monthlySavings: newCalculations.monthlySavings,
          totalValue: newCalculations.totalValue
        });
      }
    }, [formData.clientName, formData.systemPower, onProposalDataChange])
  });

  // Handler otimizado para mudanças no formulário
  const handleInputChange = useCallback((field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Formatadores memoizados
  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('phone', formatted);
  }, [handleInputChange]);

  const handleCepChange = useCallback((value: string) => {
    const formatted = formatCep(value);
    handleInputChange('cep', formatted);
  }, [handleInputChange]);

  // Busca de CEP otimizada
  const searchCep = useCallback(async (cep: string) => {
    if (cep.length !== 9) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  }, []);

  // Effect para busca automática de CEP
  useEffect(() => {
    if (formData.cep.length === 9 && !hasNoAddress) {
      searchCep(formData.cep);
    }
  }, [formData.cep, hasNoAddress, searchCep]);

  // Effect para atualizar campos derivados
  useEffect(() => {
    const derivedFields = calculateDerivedFields({
      monthlyConsumption: formData.monthlyConsumption,
      desiredKwh: formData.desiredKwh,
      modulePower: formData.modulePower,
    });
    
    if (Object.keys(derivedFields).length > 0) {
      setFormData(prev => ({ ...prev, ...derivedFields }));
    }
  }, [formData.monthlyConsumption, formData.desiredKwh, formData.modulePower, calculateDerivedFields]);

  // Opções de select memoizadas
  const connectionTypeOptions = useMemo(() => [
    { value: 'bifasico', label: 'Bifásico' },
    { value: 'trifasico', label: 'Trifásico' },
  ], []);

  const paymentMethodOptions = useMemo(() => [
    { value: 'à vista', label: 'À Vista' },
    { value: 'financiado', label: 'Financiado' },
    { value: 'cartão', label: 'Cartão de Crédito' },
  ], []);

  const moduleOptions = useMemo(() => [
    { value: 'Canadian Solar', label: 'Canadian Solar' },
    { value: 'Jinko Solar', label: 'Jinko Solar' },
    { value: 'Trina Solar', label: 'Trina Solar' },
  ], []);

  const inverterOptions = useMemo(() => [
    { value: 'Growatt', label: 'Growatt' },
    { value: 'Fronius', label: 'Fronius' },
    { value: 'SMA', label: 'SMA' },
  ], []);

  // Handler para salvar proposta
  const handleSaveProposal = useCallback(async () => {
    if (!formData.clientName || !formData.systemPower) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o nome do cliente e potência do sistema.",
        variant: "destructive",
      });
      return;
    }

    try {
      const proposalData = {
        client_name: formData.clientName,
        system_power: formData.systemPower,
        monthly_generation: calculations.monthlyGeneration,
        monthly_savings: calculations.monthlySavings,
        total_value: calculations.totalValue,
        cep: formData.cep,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
        monthly_consumption: formData.monthlyConsumption,
        average_bill: formData.averageBill,
        module_brand: formData.moduleBrand,
        module_power: formData.modulePower,
        module_quantity: formData.moduleQuantity,
        inverter_brand: formData.inverterBrand,
        payment_method: formData.paymentMethod,
        required_area: calculations.requiredArea,
        phone: formData.phone,
      };

      await saveProposal(proposalData);
    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
    }
  }, [formData, calculations, saveProposal, toast]);

  // Loading state melhorado
  if (isLoading) {
    return <LoadingState message="Carregando formulário..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header com ações principais */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gerador de Propostas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Crie propostas profissionais para sistemas de energia solar
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            {showHistory ? 'Ocultar' : 'Histórico'}
          </Button>
          
          <Button
            onClick={() => setShowPreview(!showPreview)}
            disabled={!formData.clientName}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Ocultar' : 'Visualizar'}
          </Button>
        </div>
      </div>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna principal - Formulário */}
        <div className={`lg:col-span-${showHistory || showPreview ? '8' : '12'} space-y-6`}>
          {/* Seção: Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MemoizedInput
                  id="clientName"
                  label="Nome do Cliente"
                  value={formData.clientName}
                  onChange={(value) => handleInputChange('clientName', value)}
                  placeholder="Nome completo"
                  required
                />
                
                <MemoizedInput
                  id="phone"
                  label="Telefone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(67) 99999-9999"
                />
              </div>

              {/* Accordion para endereço */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="address">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço Completo
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasNoAddress"
                        checked={hasNoAddress}
                        onCheckedChange={(checked) => setHasNoAddress(!!checked)}
                      />
                      <Label htmlFor="hasNoAddress" className="text-sm">
                        Cliente não possui endereço definido
                      </Label>
                    </div>

                    {!hasNoAddress && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MemoizedInput
                          id="cep"
                          label="CEP"
                          value={formData.cep}
                          onChange={handleCepChange}
                          placeholder="00000-000"
                          disabled={isLoadingCep}
                        />
                        
                        <div className="md:col-span-2">
                          <MemoizedInput
                            id="address"
                            label="Endereço"
                            value={formData.address}
                            onChange={(value) => handleInputChange('address', value)}
                            placeholder="Rua, Avenida..."
                            disabled={isLoadingCep}
                          />
                        </div>
                        
                        <MemoizedInput
                          id="number"
                          label="Número"
                          value={formData.number}
                          onChange={(value) => handleInputChange('number', value)}
                          placeholder="123"
                        />
                        
                        <MemoizedInput
                          id="neighborhood"
                          label="Bairro"
                          value={formData.neighborhood}
                          onChange={(value) => handleInputChange('neighborhood', value)}
                          placeholder="Nome do bairro"
                          disabled={isLoadingCep}
                        />
                        
                        <MemoizedInput
                          id="city"
                          label="Cidade"
                          value={formData.city}
                          onChange={(value) => handleInputChange('city', value)}
                          placeholder="Nome da cidade"
                          disabled={isLoadingCep}
                        />
                        
                        <MemoizedInput
                          id="state"
                          label="Estado"
                          value={formData.state}
                          onChange={(value) => handleInputChange('state', value)}
                          placeholder="MS"
                          disabled={isLoadingCep}
                        />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Seção: Dados Técnicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuração do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MemoizedInput
                  id="monthlyConsumption"
                  label="Consumo Mensal (kWh)"
                  type="number"
                  value={formData.monthlyConsumption}
                  onChange={(value) => handleInputChange('monthlyConsumption', Number(value))}
                  placeholder="500"
                  required
                />
                
                <MemoizedInput
                  id="averageBill"
                  label="Conta Média (R$)"
                  type="number"
                  value={formData.averageBill}
                  onChange={(value) => handleInputChange('averageBill', Number(value))}
                  placeholder="350.00"
                />
                
                <MemoizedSelect
                  id="connectionType"
                  label="Tipo de Ligação"
                  value={formData.connectionType}
                  onChange={(value) => handleInputChange('connectionType', value)}
                  options={connectionTypeOptions}
                  placeholder="Selecione..."
                  required
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MemoizedInput
                  id="systemPower"
                  label="Potência do Sistema (kWp)"
                  type="number"
                  value={formData.systemPower}
                  onChange={(value) => handleInputChange('systemPower', Number(value))}
                  placeholder="5.0"
                  required
                />
                
                <MemoizedInput
                  id="moduleQuantity"
                  label="Quantidade de Módulos"
                  type="number"
                  value={formData.moduleQuantity}
                  onChange={(value) => handleInputChange('moduleQuantity', Number(value))}
                  placeholder="12"
                />
                
                <MemoizedInput
                  id="modulePower"
                  label="Potência do Módulo (W)"
                  type="number"
                  value={formData.modulePower}
                  onChange={(value) => handleInputChange('modulePower', Number(value))}
                  placeholder="440"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MemoizedSelect
                  id="moduleBrand"
                  label="Marca do Módulo"
                  value={formData.moduleBrand}
                  onChange={(value) => handleInputChange('moduleBrand', value)}
                  options={moduleOptions}
                  placeholder="Selecione a marca..."
                />
                
                <MemoizedSelect
                  id="inverterBrand"
                  label="Marca do Inversor"
                  value={formData.inverterBrand}
                  onChange={(value) => handleInputChange('inverterBrand', value)}
                  options={inverterOptions}
                  placeholder="Selecione a marca..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Seção: Valores e Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Investimento e Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MemoizedInput
                  id="pricePerKwp"
                  label="Preço por kWp (R$)"
                  type="number"
                  value={formData.pricePerKwp}
                  onChange={(value) => handleInputChange('pricePerKwp', Number(value))}
                  placeholder="2450.00"
                />
                
                <MemoizedSelect
                  id="paymentMethod"
                  label="Forma de Pagamento"
                  value={formData.paymentMethod}
                  onChange={(value) => handleInputChange('paymentMethod', value)}
                  options={paymentMethodOptions}
                  placeholder="Selecione..."
                />
              </div>

              {/* Resumo dos cálculos */}
              {calculations.totalValue > 0 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-3">
                    Resumo do Sistema
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Geração Mensal:</span>
                      <p className="font-medium">{calculations.monthlyGeneration.toFixed(0)} kWh</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Economia Mensal:</span>
                      <p className="font-medium">{formatCurrency(calculations.monthlySavings)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Área Necessária:</span>
                      <p className="font-medium">{calculations.requiredArea.toFixed(1)} m²</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Valor Total:</span>
                      <p className="font-medium text-lg text-green-600 dark:text-green-400">
                        {formatCurrency(calculations.totalValue)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="observations">Observações Adicionais</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Informações adicionais sobre o projeto..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ações principais */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSaveProposal}
                  disabled={isSaving || !formData.clientName}
                  className="flex items-center gap-2 flex-1"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar Proposta
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!formData.clientName}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Visualizar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral - Histórico ou Preview */}
        {(showHistory || showPreview) && (
          <div className="lg:col-span-4">
            <React.Suspense fallback={<LoadingState message="Carregando..." />}>
              {showHistory && (
                <ProposalsHistory
                  onLoadProposal={(proposal) => {
                    // Implementar carregamento de proposta
                    console.log('Carregar proposta:', proposal);
                  }}
                />
              )}
              
              {showPreview && formData.clientName && (
                <ProposalPreview
                  formData={formData}
                  calculations={calculations}
                  onEdit={() => setShowPreview(false)}
                  onGeneratePDF={() => {
                    // Implementar geração de PDF
                    console.log('Gerar PDF');
                  }}
                />
              )}
            </React.Suspense>
          </div>
        )}
      </div>

      {/* 3D Hero no final */}
      <div className="mt-12">
        <SplineHero />
      </div>
    </div>
  );
};

export default memo(OptimizedProposalForm);
