import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { useProposals } from "@/hooks/useProposals";
import { useAuth } from "@/hooks/useAuth";
const ProposalPreview = React.lazy(() => import('@/components/ProposalPreview'));
import { SplineHero } from "@/components/SplineHero";
import ProposalSummary from "@/components/ProposalSummary";
// html2canvas and jsPDF are heavy; load them on demand inside generatePDFFromHTML

// Importar tipos e utilitários centralizados
import type { FormData, ProposalFormProps } from '@/types/proposal';
import { useProposalCalculations } from '@/hooks/useProposalCalculations';
import { /*formatPhone, formatCep*/ } from '@/utils/formatters';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SOLAR_CONSTANTS } from '@/constants/solarData';
import { mapFormToProposalPayload } from '@/utils/proposalMapping';

// Importar componentes modulares do formulário
import { ClientDataSection, ProjectDataSection } from '@/components/proposal-form';

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
  } = useProposals({ autoFetch: false });
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
  pricePerKwp: '',
    averageBill: 0,
    connectionType: '',
    paymentMethod: '',
    observations: '',
    // Novos campos adicionados
    structureType: '',
    monitoring: '',
    moduleWarranty: '25 anos de eficiência e 12 anos fabricação',
    inverterWarranty: '',
    microInverterWarranty: '',
    structureWarranty: '',
    installationWarranty: ''
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [hasNoAddress, setHasNoAddress] = useState(false);

  // Zod schemas for per-section validation
  const numberPreprocess = (val: unknown) => {
    if (typeof val === 'string') {
      const cleaned = val.replace(/[^0-9.,-]/g, '').replace(',', '.');
      const num = cleaned === '' ? undefined : Number(cleaned);
      return isNaN(num) ? val : num;
    }
    return val;
  };

  const clientSchema = z.object({
    clientName: z.string().min(1, 'Nome do cliente é obrigatório'),
    phone: z.string().min(1, 'Telefone é obrigatório'),
    email: z.string().email().optional().or(z.string().optional()),
    cep: z.string().optional(),
    address: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    complement: z.string().optional()
  });

  const projectSchema = z.object({
    monthlyConsumption: z.preprocess(numberPreprocess, z.number().min(1, 'Consumo deve ser maior que 0')),
    desiredKwh: z.preprocess(numberPreprocess, z.number().min(1, 'kWh desejados devem ser maior que 0')),
    modulePower: z.preprocess(numberPreprocess, z.number().min(1, 'Potência do módulo é obrigatória')),
    moduleBrand: z.string().min(1, 'Marca do módulo é obrigatória'),
    inverterBrand: z.string().min(1, 'Marca do inversor é obrigatória'),
    inverterPower: z.preprocess(numberPreprocess, z.number().min(1, 'Potência do inversor é obrigatória')),
    pricePerKwp: z.preprocess(numberPreprocess, z.number().min(0.01, 'Preço por kWp deve ser maior que 0'))
  });

  const formSchema = clientSchema.merge(projectSchema).extend({
    // keep other fields optional
    observations: z.string().optional(),
    connectionType: z.string().optional(),
    paymentMethod: z.string().optional(),
    averageBill: z.preprocess(numberPreprocess, z.number().min(0).optional())
  });

  const methods = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: formData
  });

  // Sync react-hook-form values into local state used elsewhere (calculations, saving)
  useEffect(() => {
    const unsub = methods.watch((values) => {
      setFormData((prev) => ({ ...prev, ...(values as Partial<FormData>) }));
    });
    return () => {
      try {
        // unsub can be a function or an object with unsubscribe
        if (typeof (unsub as unknown) === 'function') {
          (unsub as unknown as () => void)();
        } else {
          const sub = unsub as unknown as { unsubscribe?: () => void };
          sub.unsubscribe?.();
        }
      } catch {
        // ignore
      }
    };
  }, [methods]);

  // Usar hook centralizado para cálculos
  const handleCalculationsChange = useCallback((newCalculations) => {
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
  }, [onProposalDataChange, formData.clientName, formData.systemPower]);

  const { calculations, calculateDerivedFields, getCalculatedAverageBill } = useProposalCalculations({
    formData,
    onCalculationsChange: handleCalculationsChange
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
    
  }, [formData.monthlyConsumption, formData.desiredKwh, formData.modulePower]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      // Atualiza tanto o estado local quanto o RHF
      setFormData((prev) => ({
        ...prev,
        city: data.localidade || "",
        state: data.uf || "",
        neighborhood: data.bairro || prev.neighborhood,
        address: data.logradouro || prev.address,
      }));
      methods.setValue('city', data.localidade || "");
      methods.setValue('state', data.uf || "");
      methods.setValue('neighborhood', data.bairro || "");
      methods.setValue('address', data.logradouro || "");
      toast({
        title: "Endereço encontrado!",
        description: "Dados preenchidos automaticamente via CEP.",
      });
    } catch {
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  // CEP handling is performed inside ClientDataSection via fetchAddressByCep prop

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
  // (removed isClientDataComplete / isProjectDataComplete - child sections are self-contained now)





  // Novo handler: salva e mostra prévia - usa validação do react-hook-form
  const handleGenerateProposal = async () => {
    const valid = await methods.trigger();
    if (!valid) {
      toast({
        title: 'Há campos obrigatórios faltando',
        description: 'Por favor, corrija os erros nas seções antes de gerar a proposta.',
        variant: 'destructive'
      });
      return;
    }
    // sync form values are already set via watch
    await saveCurrentProposal();
    setShowPreview(true);
  };
const generatePDFFromHTML = async () => {
    // Ocultar elementos sticky/nav apenas durante a captura
    const container = document.getElementById('pdf-content');
    try {
      // carregar dependências pesadas sob demanda
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      if (!container) {
        throw new Error('Elemento de proposta não encontrado');
      }

      const hiddenEls = Array.from(container.querySelectorAll('[data-hide-in-pdf]')) as HTMLElement[];
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
      if (container) {
        const hiddenEls = Array.from(container.querySelectorAll('[data-hide-in-pdf]')) as HTMLElement[];
        hiddenEls.forEach((el) => (el.style.visibility = ''));
      }
    }
  };
  const saveCurrentProposal = async () => {
    if (!validateForm()) return;
    try {
      // Usar o mapeamento centralizado para converter FormData → ProposalData
      const proposalPayload = mapFormToProposalPayload(
        formData, 
        calculations,
        {
          seller_id: user?.id,
          seller_name: user?.email?.split('@')[0] || 'Vendedor'
        }
      );

      await saveProposal(proposalPayload);
    } catch {
      // Error handling is done in the hook
    }
  };
  // loadProposal removed: proposal history is accessed on the dedicated history page

  // Se está no modo preview, mostra o componente de visualização
  if (showPreview) {
    // Função para salvar proposta (usa mapeamento centralizado)
    const handleSaveProposal = async () => {
      try {
        const proposalPayload = mapFormToProposalPayload(formData, calculations);
        await saveProposal(proposalPayload);
      } catch {
        // Error handling is feito no hook
      }
    };
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando pré-visualização...</div>}>
        <ProposalPreview formData={formData} calculations={calculations} onEdit={() => setShowPreview(false)} onGeneratePDF={generatePDFFromHTML} onSaveProposal={handleSaveProposal} />
      </Suspense>
    );
  }
  return (
    <FormProvider {...methods}>
      <div className="min-h-screen p-4">
        <div className="max-w-screen-4xl mx-auto animate-fade-in">
          {/* Spline Hero Section */}
          <div className="mb-8">
            <SplineHero />
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Form - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* (Histórico removido desta página) */}

            {/* Accordion Form Structure */}
              <Accordion type="single" collapsible defaultValue="client" className="space-y-4">

              {/* Client data section - Componente Modular */}
              <AccordionItem value="client" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg shadow-sm bg-[#0D3B66]">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#fff"/></svg>
                    </div>
                    <span className="text-xl font-inter font-semibold text-foreground">Dados do Cliente</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <ClientDataSection
                    hasNoAddress={hasNoAddress}
                    onNoAddressChange={handleNoAddressChange}
                    isLoadingCep={isLoadingCep}
                    fetchAddressByCep={fetchAddressByCep}
                  />
                </AccordionContent>
              </AccordionItem>

              {/* Project data section - Componente Modular */}
              <AccordionItem value="project" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg shadow-sm bg-[#FFD600]">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 4V2m0 20v-2m8-8h2M2 12H4m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41M17.66 17.66l-1.41-1.41M6.34 6.34L4.93 4.93M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="#0D3B66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-xl font-inter font-semibold text-foreground">Dados do Projeto Solar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <ProjectDataSection />
                </AccordionContent>
              </AccordionItem>

              {/* Economia section */}
              <AccordionItem value="economy" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg shadow-sm bg-[#2A6F97]">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M8 17v-1a4 4 0 014-4h0a4 4 0 014 4v1M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-xl font-inter font-semibold text-foreground">Dados de Economia</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="bg-[#F6F6F6] border border-[#E0E7EF] shadow-lg rounded-2xl overflow-hidden px-8 pt-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {/* Valor médio da conta de luz */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="averageBill" className="text-xs font-semibold text-[#2A6F97] uppercase">Valor médio da conta de luz (R$/mês) *</Label>
                        <span className="text-xs text-muted-foreground mb-1">Calculado automaticamente com base no consumo</span>
                          <Input
                            id="averageBill"
                            type="number"
                            step="0.01"
                            className="text-base text-[#111111] font-medium transition-all duration-200 focus:ring-2 focus:ring-[#468FAF]/20 placeholder:text-gray-400 rounded-lg border border-[#E0E7EF] bg-muted/30 cursor-not-allowed border-muted"
                            value={formData.monthlyConsumption > 0 ? getCalculatedAverageBill(formData.monthlyConsumption).toFixed(2) : ''}
                            readOnly
                            placeholder="Será calculado automaticamente"
                          />
                      </div>

                      {/* Tipo de ligação elétrica */}
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="connectionType" className="text-xs font-semibold text-[#2A6F97] uppercase">Tipo de ligação elétrica *</Label>
                        <span className="text-xs text-muted-foreground mb-1">Selecione conforme o padrão do imóvel</span>
                        <div className="w-full">
                          <Select
                            value={methods.getValues('connectionType')}
                            onValueChange={value => methods.setValue('connectionType', value)}
                          >
                            <SelectTrigger id="connectionType" className="bg-white text-base text-[#111111] font-medium border border-[#E0E7EF] rounded-lg focus:ring-2 focus:ring-[#468FAF]/20">
                              <SelectValue placeholder="Selecione o tipo de ligação" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              <SelectItem value="bifasico">Bifásico (220V)</SelectItem>
                              <SelectItem value="trifasico">Trifásico (380V)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Complementos section */}
              <AccordionItem value="extras" className="bg-white border-0 shadow-card rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg shadow-sm bg-[#468FAF]">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-xl font-inter font-semibold text-foreground">Complementos</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="bg-[#F6F6F6] border border-[#E0E7EF] shadow-lg rounded-2xl overflow-hidden px-8 pt-6 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="paymentMethod" className="text-xs font-semibold text-[#2A6F97] uppercase">Forma de Pagamento *</Label>
                        <span className="text-xs text-muted-foreground mb-1">Selecione a forma de pagamento</span>
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
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="observations" className="text-xs font-semibold text-[#2A6F97] uppercase">Observações Gerais</Label>
                        <span className="text-xs text-muted-foreground mb-1">Informações adicionais sobre o projeto...</span>
                        <Textarea id="observations" value={formData.observations} onChange={e => handleInputChange('observations', e.target.value)} placeholder="Informações adicionais sobre o projeto..." className="min-h-[100px]" />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              
            </Accordion>

            {/* Desktop sticky actions */}
            <div className="hidden sm:block sticky-actions">
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={handleGenerateProposal}
                  size="lg"
                  disabled={!isFormValid()}
                  className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-[#0D3B66] to-[#2A6F97] text-white shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!isFormValid() ? "Complete todos os campos obrigatórios para gerar proposta" : ""}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Gerar Proposta
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


  {/* Histórico de Propostas removido desta tela (mantido em página dedicada) */}

        {/* Barra de ações fixa no mobile (elevada acima do footer) */}
        <div className="sm:hidden fixed bottom-20 left-0 right-0 z-40">
          <div className="max-w-screen-3xl mx-auto px-4">
            <div className="bg-white/95 backdrop-blur-sm border border-border rounded-t-xl shadow-lg p-3 flex items-center justify-center" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
              <Button
                onClick={handleGenerateProposal}
                disabled={!isFormValid()}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-[#0D3B66] to-[#2A6F97] text-white rounded-lg py-3 shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                title={!isFormValid() ? "Complete todos os campos obrigatórios para gerar proposta" : ""}
              >
                <CheckCircle className="mr-2 h-5 w-5" /> Gerar Proposta
              </Button>
            </div>
          </div>
        </div>

        <div className="pb-24"></div>
      </div>
    </div>
    </FormProvider>
  );
};
export default ProposalForm;