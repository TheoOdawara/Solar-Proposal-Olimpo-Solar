import React, { useState, useEffect } from 'react';
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

import { useProposals, ProposalData } from "@/hooks/useProposals";
import { useAuth } from "@/hooks/useAuth";
import ProposalsHistory from "@/components/ProposalsHistory";
import ProposalPreview from "@/components/ProposalPreview";
import { SplineHero } from "@/components/SplineHero";
import ProposalSummary from "@/components/ProposalSummary";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Importar tipos e utilitários centralizados
import type { FormData, Calculations, ProposalFormProps } from '@/types/proposal';
import { useProposalCalculations } from '@/hooks/useProposalCalculations';
import { formatCurrency, formatPhone, formatCep } from '@/utils/formatters';
import { SOLAR_CONSTANTS } from '@/constants/solarData';
const ProposalForm = ({
  onProposalDataChange
}: ProposalFormProps) => {
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const {
    saveProposal
  } = useProposals();
  const [showHistory, setShowHistory] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
    observations: ''
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [hasNoAddress, setHasNoAddress] = useState(false);

  // Usar hook centralizado para cálculos
  const { calculations, calculateDerivedFields } = useProposalCalculations({
    formData,
    onCalculationsChange: (newCalculations) => {
      // Callback para quando os cálculos mudarem
      if (onProposalDataChange && newCalculations.totalValue > 0) {
        onProposalDataChange({
          clientName: formData.clientName,
          systemPower: formData.systemPower,
          monthlyGeneration: newCalculations.monthlyGeneration,
          monthlySavings: newCalculations.monthlySavings,
          totalValue: newCalculations.totalValue
        });
      }
    }
  });

  // Atualizar campos derivados automaticamente
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

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('phone', formatted);
  };

  // Busca endereço via ViaCEP
  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) return;
    
    setIsLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado e tente novamente.",
          variant: "destructive",
        });
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        city: data.localidade || "",
        state: data.uf || "",
        neighborhood: data.bairro || prev.neighborhood,
        address: data.logradouro || prev.address,
      }));

      toast({
        title: "Endereço encontrado!",
        description: "Dados preenchidos automaticamente via CEP.",
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    handleInputChange('cep', formatted);
    
    // Busca automaticamente quando CEP tiver 8 dígitos e não estiver com "não tenho endereço" marcado
    const cleanCep = formatted.replace(/\D/g, "");
    if (cleanCep.length === 8 && !hasNoAddress) {
      fetchAddressByCep(formatted);
    }
  };

  const handleNoAddressChange = (checked: boolean) => {
    setHasNoAddress(checked);
    if (checked) {
      // Limpar campos de endereço quando marcado
      setFormData(prev => ({
        ...prev,
        cep: '',
        address: '',
        number: '',
        neighborhood: '',
        city: '',
        state: ''
      }));
    }
  };
  // Validação aprimorada com campos obrigatórios (endereço opcional)
  const validateForm = () => {
    const requiredFields = [
      { field: 'clientName', label: 'Nome do Cliente' },
      { field: 'phone', label: 'Telefone' },
      { field: 'monthlyConsumption', label: 'Consumo Mensal' },
      { field: 'desiredKwh', label: 'kWh Desejados' },
      { field: 'modulePower', label: 'Potência do Módulo' },
      { field: 'moduleBrand', label: 'Marca dos Módulos' },
      { field: 'inverterBrand', label: 'Marca do Inversor' },
      { field: 'inverterPower', label: 'Potência do Inversor' },
      { field: 'pricePerKwp', label: 'Preço por kWp' },
      { field: 'averageBill', label: 'Valor Médio da Conta' },
      { field: 'connectionType', label: 'Tipo de Ligação' },
      { field: 'paymentMethod', label: 'Forma de Pagamento' }
    ];

    for (const { field, label } of requiredFields) {
      const value = formData[field as keyof FormData];
      if (!value || value === 0 || value === '') {
        toast({
          title: "Campo obrigatório",
          description: `Por favor, preencha o campo: ${label}.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    // Validação específica para averageBill
    if (formData.averageBill <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor médio da conta de luz deve ser um número positivo.",
        variant: "destructive"
      });
      return false;
    }
    
    // Validação do CEP apenas se não tiver marcado "não tenho endereço"
    if (!hasNoAddress) {
      const cleanCep = formData.cep.replace(/\D/g, "");
      if (cleanCep.length !== 8) {
        toast({
          title: "CEP inválido",
          description: "Por favor, digite um CEP válido com 8 dígitos ou marque que não tem o endereço.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };
  const isFormValid = () => {
    const requiredFields = ['clientName', 'phone', 'desiredKwh', 'modulePower', 'moduleBrand', 'inverterBrand', 'inverterPower', 'pricePerKwp', 'averageBill', 'connectionType', 'paymentMethod'];
    return requiredFields.every(field => {
      const value = formData[field as keyof FormData];
      return value !== '' && value !== 0;
    }) && formData.averageBill > 0 && formData.pricePerKwp > 0;
  };

  // Validações específicas para cada seção
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

  const isEconomyDataComplete = () => {
    return formData.connectionType.trim() !== '' && 
           formData.averageBill > 0;
  };

  const isExtrasComplete = () => {
    return formData.paymentMethod.trim() !== '';
  };
  const generateProposal = () => {
    if (!validateForm()) return;
    setShowPreview(true);
  };
const generatePDFFromHTML = async () => {
    // Ocultar elementos sticky/nav apenas durante a captura
    const container = document.getElementById('pdf-content');
    try {
      if (!container) {
        throw new Error('Elemento de proposta não encontrado');
      }

      const hiddenEls = Array.from(container.querySelectorAll('[data-hide-in-pdf]')) as HTMLElement[];
      const prevVisibilities = hiddenEls.map((el) => el.style.visibility);
      hiddenEls.forEach((el) => (el.style.visibility = 'hidden'));

      const pages = Array.from(container.querySelectorAll('.a4-page')) as HTMLElement[];
      if (pages.length === 0) {
        pages.push(container as HTMLElement);
      }

      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Esperar imagens carregarem
        const imgs = Array.from(page.querySelectorAll('img')) as HTMLImageElement[];
        await Promise.all(
          imgs.map((img) => {
            if (img.complete) return Promise.resolve(true);
            return new Promise((resolve) => {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            });
          })
        );

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: page.scrollWidth,
          windowHeight: page.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      const fileName = `Proposta_${formData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Proposta gerada com sucesso!",
        description: "O PDF foi baixado automaticamente.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar a proposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      // Restaurar visibilidade
      const container = document.getElementById('pdf-content');
      if (container) {
        const hiddenEls = Array.from(container.querySelectorAll('[data-hide-in-pdf]')) as HTMLElement[];
        hiddenEls.forEach((el) => (el.style.visibility = ''));
      }
    }
  };
  const saveCurrentProposal = async () => {
    if (!validateForm()) return;
    try {
      await saveProposal({
        client_name: formData.clientName,
        system_power: formData.systemPower,
        monthly_generation: calculations.monthlyGeneration,
        monthly_savings: calculations.monthlySavings,
        total_value: calculations.totalValue,
        seller_name: user?.email?.split('@')[0] || 'Vendedor',
        seller_id: user?.id,
        
        // Dados básicos do cliente
        cep: formData.cep,
        address: `${formData.address}, ${formData.number}`.trim(),
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
        complement: formData.complement,
        phone: formData.phone,
        email: formData.email,
        
        // Dados técnicos do sistema (apenas campos que existem)
        monthly_consumption: formData.monthlyConsumption,
        average_bill: formData.averageBill,
        module_brand: formData.moduleBrand,
        module_model: formData.moduleBrand, // Usando module_brand como fallback
        module_power: formData.modulePower,
        module_quantity: formData.moduleQuantity,
        inverter_brand: formData.inverterBrand,
        inverter_model: formData.inverterBrand, // Usando inverter_brand como fallback
        required_area: calculations.requiredArea,
        
        // Dados comerciais
        payment_method: formData.paymentMethod,
        notes: formData.observations,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias a partir de hoje
        
        // Campos técnicos adicionais (apenas os que existem na migration)
        connection_type: formData.connectionType,
        desired_kwh: formData.desiredKwh,
        price_per_kwp: formData.pricePerKwp,
        
        status: 'draft'
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };
  const loadProposal = (proposal: ProposalData) => {
    setFormData(prev => ({
      ...prev,
      clientName: proposal.client_name,
      systemPower: proposal.system_power,
      
      // Carregar dados expandidos se disponíveis (convertendo de snake_case)
      desiredKwh: proposal.desired_kwh || proposal.monthly_generation || prev.desiredKwh,
      modulePower: proposal.module_power || prev.modulePower,
      moduleQuantity: proposal.module_quantity || prev.moduleQuantity,
      moduleBrand: proposal.module_brand || prev.moduleBrand,
      inverterBrand: proposal.inverter_brand || prev.inverterBrand,
      paymentMethod: proposal.payment_method || prev.paymentMethod,
      
      // Dados do cliente
      averageBill: proposal.average_bill || prev.averageBill,
      monthlyConsumption: proposal.monthly_consumption || prev.monthlyConsumption,
      phone: proposal.phone || prev.phone,
      email: proposal.email || prev.email,
      
      // Endereço
      address: proposal.address || prev.address,
      city: proposal.city || prev.city,
      state: proposal.state || prev.state,
      cep: proposal.cep || prev.cep,
      neighborhood: proposal.neighborhood || prev.neighborhood,
      complement: proposal.complement || prev.complement,
      
      // Dados técnicos (convertendo de snake_case)
      connectionType: proposal.connection_type || prev.connectionType,
      pricePerKwp: proposal.price_per_kwp || prev.pricePerKwp,
      
      // Observações
      observations: proposal.notes || prev.observations,
    }));

    // Update parent component (os cálculos serão feitos automaticamente pelo hook)
    if (onProposalDataChange) {
      onProposalDataChange({
        clientName: proposal.client_name,
        systemPower: proposal.system_power,
        monthlyGeneration: proposal.monthly_generation,
        monthlySavings: proposal.monthly_savings,
        totalValue: proposal.total_value
      });
    }
    setShowHistory(false);
    toast({
      title: "Proposta carregada!",
      description: "Os dados foram preenchidos automaticamente."
    });
  };

  // Se está no modo preview, mostra o componente de visualização
  if (showPreview) {
    return <ProposalPreview formData={formData} calculations={calculations} onEdit={() => setShowPreview(false)} onGeneratePDF={generatePDFFromHTML} />;
  }
  return <div className="min-h-screen p-4">
      <div className="max-w-screen-4xl mx-auto animate-fade-in">
        {/* Spline Hero Section */}
        <div className="mb-8">
          <SplineHero />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Form - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* História de propostas */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="hover:bg-primary/5 hover:border-primary/40 transition-smooth">
                <History className="h-4 w-4 mr-2" />
                {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
              </Button>
            </div>

            {/* Accordion Form Structure */}
            <Accordion type="single" collapsible defaultValue="client" className="space-y-4">
              {/* Client data section */}
              <AccordionItem value="client" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-primary to-primary-hover rounded-lg">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-inter font-semibold">Dados do Cliente</span>
                    {isClientDataComplete() && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="clientName">Nome do Cliente *</Label>
                      <Input 
                        id="clientName" 
                        value={formData.clientName} 
                        onChange={e => handleInputChange('clientName', e.target.value)} 
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
                          onChange={e => handlePhoneChange(e.target.value)} 
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
                        onChange={e => handleInputChange('email', e.target.value)} 
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
                          onCheckedChange={handleNoAddressChange}
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
                              onChange={e => handleCepChange(e.target.value)} 
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
                            onChange={e => handleInputChange('address', e.target.value)} 
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
                            onChange={e => handleInputChange('number', e.target.value)} 
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
                            onChange={e => handleInputChange('neighborhood', e.target.value)} 
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
                            onChange={e => handleInputChange('city', e.target.value)} 
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
                            onChange={e => handleInputChange('state', e.target.value)} 
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
                            onChange={e => handleInputChange('complement', e.target.value)} 
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

              {/* Projeto Solar section */}
              <AccordionItem value="project" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-secondary to-secondary-hover rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xl font-inter font-semibold">Dados do Projeto Solar</span>
                    {isProjectDataComplete() && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="monthlyConsumption">Consumo Médio Mensal (kWh) *</Label>
                        <Input id="monthlyConsumption" type="number" step="1" value={formData.monthlyConsumption || ''} onChange={e => handleInputChange('monthlyConsumption', parseFloat(e.target.value) || 0)} placeholder="800" />
                      </div>
                      
                      <div>
                        <Label htmlFor="desiredKwh">Quantidade de kWh desejados/mês *</Label>
                        <Input id="desiredKwh" type="number" step="1" value={formData.desiredKwh || ''} onChange={e => handleInputChange('desiredKwh', parseFloat(e.target.value) || 0)} placeholder="600" />
                      </div>
                      
                      <div>
                        <Label htmlFor="modulePower">Potência do Módulo (W) *</Label>
                        <Input id="modulePower" type="number" value={formData.modulePower || ''} onChange={e => handleInputChange('modulePower', parseInt(e.target.value) || 0)} placeholder="450" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="moduleBrand">Marca dos Módulos *</Label>
                      <Input id="moduleBrand" value={formData.moduleBrand} onChange={e => handleInputChange('moduleBrand', e.target.value)} placeholder="Canadian Solar" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="inverterBrand">Marca do Inversor *</Label>
                        <Input id="inverterBrand" value={formData.inverterBrand} onChange={e => handleInputChange('inverterBrand', e.target.value)} placeholder="Fronius" />
                      </div>
                      
                      <div>
                        <Label htmlFor="inverterPower">Potência do Inversor (W) *</Label>
                        <Input id="inverterPower" type="number" value={formData.inverterPower || ''} onChange={e => handleInputChange('inverterPower', parseInt(e.target.value) || 0)} placeholder="5000" />
                      </div>

                      <div>
                        <Label htmlFor="pricePerKwp">Preço por kWp (R$) *</Label>
                        <Input 
                          id="pricePerKwp" 
                          type="number" 
                          step="0.01"
                          value={formData.pricePerKwp || ''} 
                          onChange={e => handleInputChange('pricePerKwp', parseFloat(e.target.value) || 0)} 
                          placeholder="2450.00" 
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Economia section */}
              <AccordionItem value="economy" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-primary to-primary-hover rounded-lg shadow-sm">
                        <Calculator className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xl font-inter font-semibold text-foreground">Dados de Economia</span>
                    </div>
                    {isEconomyDataComplete() && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="averageBill" className="text-sm font-medium text-foreground">
                        Valor médio da conta de luz (R$/mês) *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Calculado automaticamente com base no consumo
                      </p>
                      <Input 
                        id="averageBill" 
                        type="number" 
                        step="0.01"
                        value={formData.averageBill || ''} 
                        readOnly
                        className="bg-muted/30 cursor-not-allowed border-muted"
                        placeholder="Será calculado automaticamente" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="connectionType" className="text-sm font-medium text-foreground">
                        Tipo de ligação elétrica *
                      </Label>
                      <p className="text-xs text-muted-foreground invisible">
                        &nbsp;
                      </p>
                      <Select value={formData.connectionType} onValueChange={value => handleInputChange('connectionType', value)}>
                        <SelectTrigger className="bg-muted/30 border-muted hover:bg-muted/40 focus:bg-muted/30">
                          <SelectValue placeholder="Selecione o tipo de ligação" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg">
                          <SelectItem value="bifasico" className="hover:bg-muted focus:bg-muted">
                            Bifásico (220V)
                          </SelectItem>
                          <SelectItem value="trifasico" className="hover:bg-muted focus:bg-muted">
                            Trifásico (380V)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Complementos section */}
              <AccordionItem value="extras" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-accent to-accent rounded-lg">
                      <Zap className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <span className="text-xl font-inter font-semibold">Complementos</span>
                    {isExtrasComplete() && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
                      <Select value={formData.paymentMethod} onValueChange={value => handleInputChange('paymentMethod', value)}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                          <SelectItem value="financiamento">Financiamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="observations">Observações Gerais</Label>
                      <Textarea id="observations" value={formData.observations} onChange={e => handleInputChange('observations', e.target.value)} placeholder="Informações adicionais sobre o projeto..." className="min-h-[100px]" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Desktop sticky actions */}
            <div className="hidden sm:block sticky-actions">
              <div className="flex gap-4 justify-center">
                <Button onClick={saveCurrentProposal} size="lg" variant="secondary" className="px-6 py-3 transition-smooth">
                  <Save className="mr-2 h-5 w-5" />
                  Salvar Proposta
                </Button>
                
                <Button 
                  onClick={generateProposal} 
                  size="lg" 
                  disabled={!isFormValid()} 
                  className="px-8 py-3 text-lg font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!isFormValid() ? "Complete todos os campos obrigatórios para pré-visualizar" : ""}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Pré-visualizar Proposta
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <ProposalSummary calculations={calculations} />
            </div>
          </div>
        </div>


        {/* Histórico de Propostas */}
        {showHistory && <ProposalsHistory onLoadProposal={loadProposal} />}

        {/* Barra de ações fixa no mobile */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t border-border p-3">
          <div className="max-w-screen-3xl mx-auto flex gap-3">
            <Button onClick={saveCurrentProposal} variant="secondary" className="flex-1">
              <Save className="mr-2 h-5 w-5" /> Salvar
            </Button>
            <Button onClick={generateProposal} disabled={!isFormValid()} className="flex-1">
              <Eye className="mr-2 h-5 w-5" /> Pré-visualizar
            </Button>
          </div>
        </div>

        <div className="pb-24"></div>
      </div>
    </div>;
  };
  export default ProposalForm;