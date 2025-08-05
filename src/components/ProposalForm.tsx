import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, FileDown, Zap, Home, MapPin, Phone, Settings, Save, History, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateProposalPDF } from "@/lib/pdf-generator";
import { useProposals, ProposalData } from "@/hooks/useProposals";
import { useAuth } from "@/hooks/useAuth";
import ProposalsHistory from "@/components/ProposalsHistory";
import ProposalPreview from "@/components/ProposalPreview";
import html2pdf from 'html2pdf.js';
interface FormData {
  // Dados do cliente
  clientName: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  phone: string;

  // Dados do projeto
  monthlyConsumption: number;
  desiredKwh: number;
  systemPower: number;
  moduleQuantity: number;
  modulePower: number;
  moduleBrand: string;
  inverterBrand: string;
  inverterPower: number;
  pricePerKwp: number;

  // Dados da economia
  averageBill: number;
  connectionType: string;

  // Complementos
  paymentMethod: string;
  observations: string;
}
interface Calculations {
  monthlyGeneration: number;
  monthlySavings: number;
  requiredArea: number;
  totalValue: number;
}
interface ProposalFormProps {
  onProposalDataChange?: (data: {
    clientName: string;
    systemPower: number;
    monthlyGeneration: number;
    monthlySavings: number;
    totalValue: number;
  }) => void;
}
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
    phone: '',
    monthlyConsumption: 0,
    desiredKwh: 0,
    systemPower: 0,
    moduleQuantity: 0,
    modulePower: 0,
    moduleBrand: '',
    inverterBrand: '',
    inverterPower: 0,
    pricePerKwp: 2450,
    averageBill: 0,
    connectionType: '',
    paymentMethod: '',
    observations: ''
  });
  const [calculations, setCalculations] = useState<Calculations>({
    monthlyGeneration: 0,
    monthlySavings: 0,
    requiredArea: 0,
    totalValue: 0
  });
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Cálculos automáticos baseados nos dados do projeto
  useEffect(() => {
    const {
      desiredKwh,
      modulePower,
      monthlyConsumption,
      pricePerKwp
    } = formData;

    // Calcular valor médio da conta de luz automaticamente
    if (monthlyConsumption > 0) {
      const calculatedAverageBill = monthlyConsumption * 1.27;
      setFormData(prev => ({
        ...prev,
        averageBill: Math.round(calculatedAverageBill * 100) / 100
      }));
    }

    if (desiredKwh > 0) {
      // Calcular potência necessária: potência = kWh desejados / (5.5 × 30 × 0.80)
      const calculatedSystemPower = desiredKwh / (5.5 * 30 * 0.80);

      // Calcular quantidade de módulos baseada na potência desejada e potência do módulo
      let calculatedModuleQuantity = 0;
      if (modulePower > 0) {
        // Converter potência do módulo de W para kW
        const modulePowerKw = modulePower / 1000;
        // Calcular quantidade de módulos necessários
        calculatedModuleQuantity = Math.ceil(calculatedSystemPower / modulePowerKw);

        // Atualizar quantidade de módulos automaticamente
        setFormData(prev => ({
          ...prev,
          systemPower: Math.round(calculatedSystemPower * 10) / 10,
          moduleQuantity: calculatedModuleQuantity
        }));
      } else {
        // Atualizar apenas potência do sistema se não tiver potência do módulo
        setFormData(prev => ({
          ...prev,
          systemPower: Math.round(calculatedSystemPower * 10) / 10
        }));
      }

      // 1. Geração mensal estimada = kWh desejados
      const monthlyGeneration = desiredKwh;

      // 2. Economia mensal estimada (R$)
      // Formula: geracao_mensal × 1.27
      // Valor médio do kWh = R$1,27
      const monthlySavings = monthlyGeneration * 1.27;

      // 3. Área mínima necessária (m²)
      // Formula: qtd_modulos × 2.8
      // Cada módulo ocupa 2,8 m²
      const moduleQuantityForArea = calculatedModuleQuantity || formData.moduleQuantity;
      const requiredArea = moduleQuantityForArea * 2.8;

      // 4. Valor total do projeto usando o preço por kWp definido
      const totalValue = calculatedSystemPower * pricePerKwp;
      const newCalculations = {
        monthlyGeneration: Math.round(monthlyGeneration),
        monthlySavings: Math.round(monthlySavings),
        requiredArea: Math.round(requiredArea * 10) / 10,
        // Uma casa decimal
        totalValue: Math.round(totalValue)
      };
      setCalculations(newCalculations);
    } else {
      // Reset dos cálculos quando não há potência definida
      setCalculations({
        monthlyGeneration: 0,
        monthlySavings: 0,
        requiredArea: 0,
        totalValue: 0
      });
    }
  }, [formData.desiredKwh, formData.modulePower, formData.monthlyConsumption, formData.pricePerKwp]);

  // Notifica o componente pai sobre mudanças nos dados da proposta
  useEffect(() => {
    if (onProposalDataChange && calculations.totalValue > 0) {
      onProposalDataChange({
        clientName: formData.clientName,
        systemPower: formData.systemPower,
        monthlyGeneration: calculations.monthlyGeneration,
        monthlySavings: calculations.monthlySavings,
        totalValue: calculations.totalValue
      });
    }
  }, [formData.clientName, formData.systemPower, calculations.monthlyGeneration, calculations.monthlySavings, calculations.totalValue]);
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  // Formatação de telefone aprimorada
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2");
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('phone', formatted);
  };

  // Formatação de CEP
  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);
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
    
    // Busca automaticamente quando CEP tiver 8 dígitos
    const cleanCep = formatted.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetchAddressByCep(formatted);
    }
  };
  // Validação aprimorada com campos obrigatórios
  const validateForm = () => {
    const requiredFields = [
      { field: 'clientName', label: 'Nome do Cliente' },
      { field: 'cep', label: 'CEP' },
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
    
    // Validação do CEP
    const cleanCep = formData.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "Por favor, digite um CEP válido com 8 dígitos.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  const isFormValid = () => {
    const requiredFields = ['clientName', 'address', 'number', 'neighborhood', 'city', 'phone', 'desiredKwh', 'modulePower', 'moduleBrand', 'inverterBrand', 'inverterPower', 'pricePerKwp', 'averageBill', 'connectionType', 'paymentMethod'];
    return requiredFields.every(field => {
      const value = formData[field as keyof FormData];
      return value !== '' && value !== 0;
    }) && formData.averageBill > 0 && formData.pricePerKwp > 0;
  };
  const generateProposal = () => {
    if (!validateForm()) return;
    setShowPreview(true);
  };
  const generatePDFFromHTML = async () => {
    try {
      const element = document.getElementById('pdf-content');
      if (!element) {
        throw new Error('Elemento de proposta não encontrado');
      }
      const fileName = `Proposta_${formData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      const options = {
        margin: 0,
        filename: fileName,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };
      await html2pdf().set(options).from(element).save();
      toast({
        title: "Proposta gerada com sucesso!",
        description: "O PDF foi baixado automaticamente."
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar a proposta. Tente novamente.",
        variant: "destructive"
      });
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
        seller_id: user?.id
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };
  const loadProposal = (proposal: ProposalData) => {
    setFormData(prev => ({
      ...prev,
      clientName: proposal.client_name,
      systemPower: proposal.system_power
    }));

    // Trigger calculations update
    setCalculations({
      monthlyGeneration: proposal.monthly_generation,
      monthlySavings: proposal.monthly_savings,
      requiredArea: Math.round(proposal.system_power * 12 * 2.8 * 10) / 10,
      // Estimated
      totalValue: proposal.total_value
    });

    // Update parent component
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
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Enhanced hero section */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-4 animate-scale-in">
            
            <div>
              
              <p className="text-muted-foreground">
                Sistema inteligente para criação de propostas solares
              </p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-1/2 mx-auto"></div>
        </div>

        {/* Client data section with enhanced design */}
        <Card className="bg-gradient-surface shadow-floating border-0 animate-slide-up">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-gradient-to-r from-primary to-primary-hover rounded-lg">
                  <Home className="h-5 w-5 text-white" />
                </div>
                Dados do Cliente
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="hover:bg-primary/5 hover:border-primary/40 transition-smooth">
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="cep">CEP *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="cep" 
                    value={formData.cep} 
                    onChange={e => handleCepChange(e.target.value)} 
                    placeholder="00000-000" 
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    disabled={isLoadingCep}
                  />
                  {isLoadingCep && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
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
                <Label htmlFor="address">Endereço</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={e => handleInputChange('address', e.target.value)} 
                  placeholder="Rua, Avenida..." 
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
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
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Projeto Solar */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5 text-secondary" />
              Dados do Projeto Solar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <Separator className="my-6" />
            
            {/* Dados para Cálculo de Economia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">Dados para Cálculo de Economia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="averageBill">Valor médio da conta de luz (R$/mês) * <span className="text-xs text-muted-foreground">(Calculado automaticamente)</span></Label>
                  <Input 
                    id="averageBill" 
                    type="number" 
                    step="0.01"
                    value={formData.averageBill || ''} 
                    readOnly
                    className="bg-muted/50 cursor-not-allowed"
                    placeholder="Será calculado automaticamente com base no consumo mensal" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="connectionType">Tipo de ligação elétrica *</Label>
                  <Select value={formData.connectionType} onValueChange={value => handleInputChange('connectionType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de ligação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bifasico">Bifásico</SelectItem>
                      <SelectItem value="trifasico">Trifásico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cálculos Automáticos */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calculator className="h-5 w-5 text-primary" />
              Cálculos Automáticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{calculations.monthlyGeneration}</div>
                <div className="text-sm text-muted-foreground">kWh/mês</div>
                <div className="text-xs text-muted-foreground mt-1">Geração Estimada</div>
              </div>
              
              <div className="text-center p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                <div className="text-2xl font-bold text-secondary">{formatCurrency(calculations.monthlySavings)}</div>
                <div className="text-sm text-muted-foreground">Economia/mês</div>
                <div className="text-xs text-muted-foreground mt-1">Estimada</div>
              </div>
              
              <div className="text-center p-4 bg-accent/20 rounded-lg border border-accent">
                <div className="text-2xl font-bold text-accent-foreground">{calculations.requiredArea} m²</div>
                <div className="text-sm text-muted-foreground">Área Necessária</div>
                <div className="text-xs text-muted-foreground mt-1">Mínima</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complementos */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
                <Select onValueChange={value => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                    <SelectItem value="financiamento">Financiamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="observations">Observações Gerais</Label>
              <Textarea id="observations" value={formData.observations} onChange={e => handleInputChange('observations', e.target.value)} placeholder="Informações adicionais sobre o projeto..." className="min-h-[100px]" />
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setShowHistory(!showHistory)} size="lg" variant="outline" className="px-6 py-3">
              <History className="mr-2 h-5 w-5" />
              {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
            </Button>
            
            <Button onClick={saveCurrentProposal} size="lg" variant="secondary" className="px-6 py-3">
              <Save className="mr-2 h-5 w-5" />
              Salvar Proposta
            </Button>
            
            <Button onClick={generateProposal} size="lg" variant="hero" className="px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isFormValid()}>
              <Eye className="mr-2 h-5 w-5" />
              Pré-visualizar Proposta
            </Button>
          </div>
        </div>

        {/* Histórico de Propostas */}
        {showHistory && <ProposalsHistory onLoadProposal={loadProposal} />}

        <div className="pb-8"></div>
      </div>
    </div>;
};
export default ProposalForm;