import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calculator, FileDown, Zap, Home, MapPin, Phone, Settings, Save, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateProposalPDF } from "@/lib/pdf-generator";
import { useProposals, ProposalData } from "@/hooks/useProposals";
import ProposalsHistory from "@/components/ProposalsHistory";

interface FormData {
  // Dados do cliente
  clientName: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  phone: string;
  
  // Dados do projeto
  systemPower: number;
  moduleQuantity: number;
  modulePower: number;
  moduleBrand: string;
  inverterBrand: string;
  inverterModel: string;
  
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

const ProposalForm = ({ onProposalDataChange }: ProposalFormProps) => {
  const { toast } = useToast();
  const { saveProposal } = useProposals();
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    address: '',
    number: '',
    neighborhood: '',
    city: '',
    phone: '',
    systemPower: 0,
    moduleQuantity: 0,
    modulePower: 0,
    moduleBrand: '',
    inverterBrand: '',
    inverterModel: '',
    paymentMethod: '',
    observations: ''
  });

  const [calculations, setCalculations] = useState<Calculations>({
    monthlyGeneration: 0,
    monthlySavings: 0,
    requiredArea: 0,
    totalValue: 0
  });

  // Cálculos automáticos baseados nos dados do projeto
  useEffect(() => {
    const { systemPower, moduleQuantity } = formData;
    
    if (systemPower > 0) {
      // 1. Geração mensal estimada (kWh/mês)
      // Formula: potencia_kwp × 5.5 × 30 × 0.80
      // Irradiação solar média de Campo Grande-MS (5,5 kWh/m²/dia) e fator de perdas de 20%
      const monthlyGeneration = systemPower * 5.5 * 30 * 0.80;
      
      // 2. Economia mensal estimada (R$)
      // Formula: geracao_mensal × 1.27
      // Valor médio do kWh = R$1,27
      const monthlySavings = monthlyGeneration * 1.27;
      
      // 3. Área mínima necessária (m²)
      // Formula: qtd_modulos × 2.8
      // Cada módulo ocupa 2,8 m²
      const requiredArea = moduleQuantity * 2.8;
      
      // 4. Valor total do projeto (R$)
      // Formula: potencia_kwp × 1850
      // Valor fixo por kWp = R$1.850
      const totalValue = systemPower * 1850;

      const newCalculations = {
        monthlyGeneration: Math.round(monthlyGeneration),
        monthlySavings: Math.round(monthlySavings),
        requiredArea: Math.round(requiredArea * 10) / 10, // Uma casa decimal
        totalValue: Math.round(totalValue)
      };
      
      setCalculations(newCalculations);
      
      // Notifica o componente pai sobre mudanças nos dados da proposta
      if (onProposalDataChange) {
        onProposalDataChange({
          clientName: formData.clientName,
          systemPower: formData.systemPower,
          monthlyGeneration: newCalculations.monthlyGeneration,
          monthlySavings: newCalculations.monthlySavings,
          totalValue: newCalculations.totalValue
        });
      }
    } else {
      // Reset dos cálculos quando não há potência definida
      setCalculations({
        monthlyGeneration: 0,
        monthlySavings: 0,
        requiredArea: 0,
        totalValue: 0
      });
    }
  }, [formData.systemPower, formData.moduleQuantity, formData.clientName, onProposalDataChange]);

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

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleInputChange('phone', formatted);
  };

  const validateForm = () => {
    const requiredFields = [
      'clientName', 'address', 'number', 'neighborhood', 'city', 'phone',
      'systemPower', 'moduleQuantity', 'modulePower', 'moduleBrand',
      'inverterBrand', 'inverterModel', 'paymentMethod'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const generateProposal = () => {
    if (!validateForm()) return;
    
    try {
      generateProposalPDF(formData, calculations);
      
      toast({
        title: "Proposta gerada com sucesso!",
        description: "O PDF foi baixado automaticamente.",
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
        total_value: calculations.totalValue
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
      requiredArea: Math.round((proposal.system_power * 12) * 2.8 * 10) / 10, // Estimated
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
      description: "Os dados foram preenchidos automaticamente.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-solar rounded-xl shadow-button">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-solar bg-clip-text text-transparent">
                  Olimpo Solar
                </CardTitle>
                <p className="text-muted-foreground text-sm">Gerador de Propostas Comerciais</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Formulário Principal */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Home className="h-5 w-5 text-primary" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Nome completo do cliente"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, Avenida..."
                />
              </div>
              
              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange('number', e.target.value)}
                  placeholder="123"
                />
              </div>
              
              <div>
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                  placeholder="Nome do bairro"
                />
              </div>
              
              <div>
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Campo Grande"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="phone">Telefone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(67) 99999-9999"
                    className="pl-10"
                  />
                </div>
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
                <Label htmlFor="systemPower">Potência do Sistema (kWp) *</Label>
                <Input
                  id="systemPower"
                  type="number"
                  step="0.1"
                  value={formData.systemPower || ''}
                  onChange={(e) => handleInputChange('systemPower', parseFloat(e.target.value) || 0)}
                  placeholder="5.5"
                />
              </div>
              
              <div>
                <Label htmlFor="moduleQuantity">Quantidade de Módulos *</Label>
                <Input
                  id="moduleQuantity"
                  type="number"
                  value={formData.moduleQuantity || ''}
                  onChange={(e) => handleInputChange('moduleQuantity', parseInt(e.target.value) || 0)}
                  placeholder="12"
                />
              </div>
              
              <div>
                <Label htmlFor="modulePower">Potência do Módulo (W) *</Label>
                <Input
                  id="modulePower"
                  type="number"
                  value={formData.modulePower || ''}
                  onChange={(e) => handleInputChange('modulePower', parseInt(e.target.value) || 0)}
                  placeholder="450"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="moduleBrand">Marca dos Módulos *</Label>
              <Input
                id="moduleBrand"
                value={formData.moduleBrand}
                onChange={(e) => handleInputChange('moduleBrand', e.target.value)}
                placeholder="Canadian Solar"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inverterBrand">Marca do Inversor *</Label>
                <Input
                  id="inverterBrand"
                  value={formData.inverterBrand}
                  onChange={(e) => handleInputChange('inverterBrand', e.target.value)}
                  placeholder="Fronius"
                />
              </div>
              
              <div>
                <Label htmlFor="inverterModel">Modelo do Inversor *</Label>
                <Input
                  id="inverterModel"
                  value={formData.inverterModel}
                  onChange={(e) => handleInputChange('inverterModel', e.target.value)}
                  placeholder="Primo 5.0-1"
                />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              
              <div className="text-center p-4 bg-gradient-solar/10 rounded-lg border border-primary/30">
                <div className="text-2xl font-bold bg-gradient-solar bg-clip-text text-transparent">{formatCurrency(calculations.totalValue)}</div>
                <div className="text-sm text-muted-foreground">Valor Total</div>
                <div className="text-xs text-muted-foreground mt-1">do Projeto</div>
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
                <Select onValueChange={(value) => handleInputChange('paymentMethod', value)}>
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
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Informações adicionais sobre o projeto..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowHistory(!showHistory)}
              size="lg"
              variant="outline"
              className="px-6 py-3"
            >
              <History className="mr-2 h-5 w-5" />
              {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
            </Button>
            
            <Button
              onClick={saveCurrentProposal}
              size="lg"
              variant="secondary"
              className="px-6 py-3"
            >
              <Save className="mr-2 h-5 w-5" />
              Salvar Proposta
            </Button>
            
            <Button
              onClick={generateProposal}
              size="lg"
              variant="hero"
              className="px-8 py-3 text-lg font-semibold"
            >
              <FileDown className="mr-2 h-5 w-5" />
              Gerar PDF
            </Button>
          </div>
        </div>

        {/* Histórico de Propostas */}
        {showHistory && (
          <ProposalsHistory onLoadProposal={loadProposal} />
        )}

        <div className="pb-8"></div>
      </div>
    </div>
  );
};

export default ProposalForm;