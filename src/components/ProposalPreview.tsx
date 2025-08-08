import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileDown, MapPin, Calendar, Zap, CheckCircle, Star, Globe, Shield, Wrench, Clock, Battery, BarChart3, TrendingUp, Lightbulb, DollarSign, Home, Leaf, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import olimpoLogo from "/lovable-uploads/568489ba-4d5c-47e2-a032-5a3030b5507b.png";
import ProposalCoverPage from "./ProposalCoverPage";
interface FormData {
  clientName: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  systemPower: number;
  moduleQuantity: number;
  modulePower: number;
  moduleBrand: string;
  inverterBrand: string;
  inverterPower: number;
  averageBill: number;
  connectionType: string;
  paymentMethod: string;
  observations: string;
}
interface Calculations {
  monthlyGeneration: number;
  monthlySavings: number;
  requiredArea: number;
  totalValue: number;
}
interface ProposalPreviewProps {
  formData: FormData;
  calculations: Calculations;
  onEdit: () => void;
  onGeneratePDF: () => void;
}
const ProposalPreview: React.FC<ProposalPreviewProps> = ({
  formData,
  calculations,
  onEdit,
  onGeneratePDF
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const calculateYearlySavings = () => calculations.monthlySavings * 12;
  const calculateCurrentBill = () => calculations.monthlySavings;

  // Cálculos reais para as métricas do gráfico
  const calculateRealMetrics = () => {
    // Considerando irradiação de Campo Grande ≈ 5,0 kWh/m²/dia
    const energiaMensal = formData.systemPower * 5.0 * 30; // produção em kWh/mês
    const consumoMedio = calculations.monthlyGeneration; // usar o valor do cálculo existente
    const economia = Math.min(Math.round((1 - consumoMedio / energiaMensal) * 100), 100); // cálculo correto da economia

    return {
      geracaoMedia: Math.round(energiaMensal),
      consumoMedio: Math.round(consumoMedio),
      economia: Math.max(economia, 0) // garantir que não seja negativo
    };
  };

  // Calcular ROI para energia solar
  const calculateSolarROI = () => {
    const annualSavings = calculations.monthlySavings * 12;
    const roi = annualSavings / calculations.totalValue * 100;
    return Math.round(roi * 10) / 10; // arredondar para 1 casa decimal
  };

  // Cálculos da economia baseados nos novos campos
  const calculateEconomyData = () => {
    // Usar valores padrão quando os dados não estão disponíveis
    const averageBill = formData.averageBill || 500; // Valor padrão: R$ 500
    const connectionType = formData.connectionType || 'bifasico'; // Tipo padrão: bifásico

    // Definir valor da conta com energia solar baseado no tipo de ligação
    const solarBill = connectionType === 'bifasico' ? 120 : 300;

    // Cálculos
    const currentBillPerYear = averageBill * 12;
    const billWithSolarPerYear = solarBill * 12;
    const savingsPerMonth = averageBill - solarBill;
    const savingsPerYear = currentBillPerYear - billWithSolarPerYear;
    return {
      currentBillPerYear,
      currentBillPerMonth: averageBill,
      billWithSolarPerYear,
      billWithSolarPerMonth: solarBill,
      savingsPerYear,
      savingsPerMonth
    };
  };
  const metricas = calculateRealMetrics();
  const economyData = calculateEconomyData();
  return <div className="min-h-screen bg-background">
      {/* Navegação */}
      <div data-hide-in-pdf className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button onClick={onEdit} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Editar Dados
          </Button>
          <Button onClick={onGeneratePDF} className="gap-2 bg-gradient-solar text-white">
            <FileDown className="h-4 w-4" />
            Gerar PDF
          </Button>
        </div>
      </div>

      {/* Conteúdo da Proposta */}
      <div id="pdf-content" className="max-w-4xl mx-auto bg-white print-optimized">
        
        {/* PÁGINA 1: NOVA CAPA PERSONALIZADA */}
        <ProposalCoverPage formData={formData} calculations={calculations} />
        
        {/* PÁGINA 2: CAPA ANTERIOR - Baseado na primeira imagem */}
        

        {/* PÁGINA 2: QUEM SOMOS */}
        <section className="a4-page bg-white p-8 page-break">
          <div className="flex items-center justify-center h-full">
            <img src="/lovable-uploads/cf2959e7-1b60-4018-ade3-b147470bd528.png" alt="Quem Somos - Olimpo Solar" className="w-full h-auto max-w-4xl" loading="lazy" />
          </div>
        </section>

        {/* PÁGINA 3: COMO FUNCIONA */}
        <section className="a4-page bg-white p-8 page-break">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Logo */}
            <div className="flex justify-end mb-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" loading="lazy" />
            </div>

            {/* Título */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-800">Como Funciona</h2>
            </div>

            {/* Conteúdo baseado na primeira imagem do usuário */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Sol */}
              <div className="mb-8">
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center relative">
                  {/* Raios do sol */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-1 h-6 bg-yellow-400 rotate-0"></div>
                    <div className="absolute top-2 right-2 w-1 h-6 bg-yellow-400 rotate-45"></div>
                    <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-6 h-1 bg-yellow-400"></div>
                    <div className="absolute bottom-2 right-2 w-1 h-6 bg-yellow-400 rotate-135"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-1 h-6 bg-yellow-400 rotate-180"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-6 bg-yellow-400 rotate-225"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-6 h-1 bg-yellow-400"></div>
                    <div className="absolute top-2 left-2 w-1 h-6 bg-yellow-400 rotate-315"></div>
                  </div>
                  <Zap className="h-12 w-12 text-yellow-600" />
                </div>
              </div>

              {/* Número 1 */}
              <div className="mb-12">
                <div className="w-16 h-16 bg-slate-800 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  1
                </div>
              </div>

              {/* Casa com painéis solares */}
              <div className="relative">
                {/* Casa */}
                <div className="w-80 h-48 bg-orange-400 relative rounded-lg">
                  {/* Telhado */}
                  <div className="absolute -top-8 left-0 right-0 h-16 bg-red-500 transform -skew-x-12 rounded-t-lg"></div>
                  
                  {/* Painéis solares no telhado */}
                  <div className="absolute -top-4 left-8 flex space-x-2">
                    <div className="w-16 h-12 bg-slate-800 border-2 border-yellow-400 rounded grid grid-cols-4 gap-0.5 p-1">
                      {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="bg-slate-600 rounded-sm"></div>
                      ))}
                    </div>
                    <div className="w-16 h-12 bg-slate-800 border-2 border-yellow-400 rounded grid grid-cols-4 gap-0.5 p-1">
                      {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="bg-slate-600 rounded-sm"></div>
                      ))}
                    </div>
                    <div className="w-16 h-12 bg-slate-800 border-2 border-yellow-400 rounded grid grid-cols-4 gap-0.5 p-1">
                      {Array.from({length: 8}).map((_, i) => (
                        <div key={i} className="bg-slate-600 rounded-sm"></div>
                      ))}
                    </div>
                  </div>

                  {/* Porta */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-red-600 rounded-t-lg"></div>
                  
                  {/* Janelas */}
                  <div className="absolute bottom-16 left-8 w-12 h-12 bg-yellow-300 rounded"></div>
                  <div className="absolute bottom-16 right-8 w-12 h-12 bg-yellow-300 rounded"></div>

                  {/* Medidor */}
                  <div className="absolute bottom-8 right-4 w-8 h-12 bg-white border-2 border-slate-400 rounded flex items-center justify-center">
                    <div className="w-4 h-6 bg-slate-200 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer de contato */}
            <div className="mt-auto bg-slate-800 py-4 text-center rounded-lg">
              <div className="flex justify-center space-x-6 text-white text-sm">
                <span>(67) 99668-0242</span>
                <span>olimpo.energiasolar</span>
                <span>adm.olimposolar@gmail.com</span>
                <span>R. Eduardo Santos Pereira, 1831 Centro, Campo Grande</span>
              </div>
            </div>
          </div>
        </section>

        {/* PÁGINA 4: BENEFÍCIOS */}
        <section className="a4-page bg-white p-8 page-break">
          <div className="flex items-center justify-center h-full">
            <img src="/lovable-uploads/ceca57ec-051c-443f-b209-5313002bb56c.png" alt="Benefícios da Energia Solar" className="w-full h-auto max-w-4xl" loading="lazy" />
          </div>
        </section>

        {/* PÁGINA 5: NOSSOS PROJETOS */}
        <section className="a4-page bg-white p-8 page-break">
          <div className="relative max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            <h2 className="text-4xl font-bold text-slate-800 mb-16 text-center">
              Nossos Projetos:
            </h2>

            {/* Projects Grid */}
            <div className="mb-16">
              <img src="/lovable-uploads/5839951b-6ca3-4221-b6f5-945748cf80a3.png" alt="Grid de projetos da Olimpo Solar" className="w-full h-auto rounded-lg shadow-lg" loading="lazy" />
            </div>

            {/* Footer contact */}
            <div className="mt-16 bg-slate-800 py-4 text-center rounded-lg">
              <div className="flex justify-center space-x-6 text-white text-sm">
                <span>(67) 99668-0242</span>
                <span>olimpo.energiasolar</span>
                <span>adm.olimposolar@gmail.com</span>
                <span>R. Eduardo Santos Pereira, 1831 Centro, Campo Grande</span>
              </div>
            </div>
          </div>
        </section>

        {/* PÁGINA 6: PROJETO 360° */}
        <section className="a4-page bg-white p-8 page-break">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Logo */}
            <div className="flex justify-end mb-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" loading="lazy" />
            </div>

            {/* Título */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800">Projeto</h2>
              <p className="text-lg text-slate-600 mt-4">
                Nosso compromisso é satisfazer as necessidades e expectativas até o
                fim de cada projeto fotovoltaico. Por isso, temos um processo de 
                gerenciamento que torna mais ágeis as seguintes etapas:
              </p>
            </div>

            {/* Grade de ícones baseada na segunda imagem */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
              {/* Estudo de Necessidade */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Estudo de</h3>
                <h3 className="text-lg font-bold text-slate-800">Necessidade</h3>
              </div>

              {/* Apresentação da Proposta */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Apresentação da</h3>
                <h3 className="text-lg font-bold text-slate-800">Proposta</h3>
              </div>

              {/* Instalação */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Instalação</h3>
              </div>

              {/* Botão START */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-2 text-black font-bold">
                    <span className="text-2xl">▶</span>
                    <span className="text-lg">START</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Início do</h3>
                <h3 className="text-lg font-bold text-slate-800">Projeto</h3>
              </div>

              {/* Apresentação do Canal do Cliente */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Apresentação do</h3>
                <h3 className="text-lg font-bold text-slate-800">Canal do Cliente</h3>
              </div>

              {/* Homologação */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Homologação</h3>
              </div>
            </div>

            {/* Footer de contato */}
            <div className="mt-auto bg-slate-800 py-4 text-center rounded-lg">
              <div className="flex justify-center space-x-6 text-white text-sm">
                <span>(67) 99668-0242</span>
                <span>olimpo.energiasolar</span>
                <span>adm.olimposolar@gmail.com</span>
                <span>R. Eduardo Santos Pereira, 1831 Centro, Campo Grande</span>
              </div>
            </div>
          </div>
        </section>

        {/* PÁGINA 7: SEU PROJETO */}
       <section className="a4-page bg-white p-8 page-break">
  <div className="max-w-5xl mx-auto relative">

    {/* Logo */}
    <div className="absolute top-6 right-6">
      
    </div>

    <h2 className="text-4xl font-extrabold text-center text-slate-800 mb-12">Seu Projeto:</h2>

    {/* Imagem principal */}
    <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-sm p-6 mb-12">
      <div className="w-full h-64 flex items-center justify-center">
        <img src="/lovable-uploads/898d9890-e943-4493-9ab7-cad6efc48286.png" alt="Equipamentos do Sistema Solar" className="max-h-full object-contain" loading="lazy" />
      </div>
    </div>

    {/* Ícones dos Equipamentos */}
    <div className="grid grid-cols-3 gap-6 mb-12">
      {[{
              icon: <Zap />,
              label: `${formData.moduleQuantity} Painéis`
            }, {
              icon: <Battery />,
              label: `Inversor ${formData.inverterBrand}`
            }, {
              icon: <Wrench />,
              label: 'Estrutura'
            }, {
              icon: <Lightbulb />,
              label: 'Monitoramento'
            }, {
              icon: <DollarSign />,
              label: 'Economia'
            }, {
              icon: <BarChart3 />,
              label: `Potência ${formData.systemPower}kWp`
            }].map((item, idx) => <div key={idx} className="flex flex-col items-center bg-white rounded-xl border border-slate-200 shadow-md p-4 text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 mb-3">
            {React.cloneElement(item.icon, {
                  className: "h-6 w-6 text-yellow-600"
                })}
          </div>
          <p className="text-sm font-medium text-slate-700">{item.label}</p>
        </div>)}
    </div>

    {/* Garantias */}
    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-8 mb-8">
      <h3 className="text-2xl font-bold text-yellow-800 text-center mb-6">Garantias do Sistema</h3>
      <div className="space-y-4 text-sm text-slate-700">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">Módulos solares</span>
          <span>25 anos de eficiência / 12 anos fabricação</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">Inversores</span>
          <span>10 anos</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">Micro Inversores</span>
          <span>15 anos</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">Estrutura</span>
          <span>10 anos</span>
        </div>
        <div className="flex justify-between italic">
          <span>Instalação</span>
          <span>12 meses</span>
        </div>
      </div>
    </div>

    {/* Rodapé de Contato */}
    
  </div>
      </section>

        {/* PÁGINA 8: SUA ECONOMIA - Nova seção */}
        {economyData && <section className="a4-page page-break" style={{
        backgroundColor: '#022136'
      }}>
            <div className="relative h-full flex flex-col justify-between max-w-4xl mx-auto px-8 py-16">
              {/* Logo */}
              <div className="absolute top-8 right-8">
                <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto brightness-0 invert" />
              </div>

              {/* Título */}
              <h2 className="text-4xl font-bold text-center mb-16" style={{
            color: '#ffffff'
          }}>
                SUA <span style={{
              color: '#ffbf06'
            }}>ECONOMIA</span>
              </h2>

              {/* Three columns layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
                {/* Sem energia solar */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-8">Sem energia solar</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold">{formatCurrency(economyData.currentBillPerYear)}</div>
                      <div className="text-lg">/ ano</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(economyData.currentBillPerMonth)}</div>
                      <div className="text-base">/ mês</div>
                    </div>
                  </div>
                </div>

                {/* Com energia solar */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-8">Com energia solar</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold">{formatCurrency(economyData.billWithSolarPerYear)}</div>
                      <div className="text-lg">/ ano</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(economyData.billWithSolarPerMonth)}</div>
                      <div className="text-base">/ mês</div>
                    </div>
                  </div>
                </div>

                {/* Sua economia será de */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-8">Sua economia será de:</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold" style={{
                    color: '#ffbf06'
                  }}>{formatCurrency(economyData.savingsPerYear)}</div>
                      <div className="text-lg">/ ano</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold" style={{
                    color: '#ffbf06'
                  }}>{formatCurrency(economyData.savingsPerMonth)}</div>
                      <div className="text-base">/ mês</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer contact */}
              <div className="mt-auto py-4 text-center rounded-lg" style={{
            backgroundColor: '#ffbf06'
          }}>
                <div className="flex justify-center space-x-6 text-black text-sm font-semibold">
                  <span>(67) 99668-0242</span>
                  <span>olimpo.energiasolar</span>
                  <span>adm.olimposolar@gmail.com</span>
                  <span>R. Eduardo Santos Pereira, 1831 Centro, Campo Grande</span>
                </div>
              </div>
            </div>
          </section>}

        {/* GRÁFICOS INFORMATIVOS - SEU RETORNO E SUA RENTABILIDADE */}
        <section className="a4-page page-break" style={{
        backgroundColor: '#022136'
      }}>
            <div className="relative h-full flex flex-col justify-between max-w-4xl mx-auto px-8 py-16">
              {/* Logo */}
              <div className="absolute top-8 right-8">
                <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto brightness-0 invert" />
              </div>

              {/* GRÁFICO 1: SEU RETORNO */}
              <div className="mb-16">
                {(() => {
              // Calcular dados do retorno
              const annualSavings = economyData.savingsPerYear;
              const investmentValue = calculations.totalValue;
              const paybackYears = Math.ceil(investmentValue / annualSavings);

              // Gerar dados para 25 anos
              const returnData = [];
              let cumulativeReturn = -investmentValue; // Começar negativo (investimento)

              for (let year = 0; year <= 25; year++) {
                if (year === 0) {
                  returnData.push({
                    year: `Ano ${year}`,
                    accumulated: cumulativeReturn,
                    color: cumulativeReturn < 0 ? '#ef4444' : '#22c55e'
                  });
                } else {
                  cumulativeReturn += annualSavings;
                  returnData.push({
                    year: `Ano ${year}`,
                    accumulated: cumulativeReturn,
                    color: cumulativeReturn < 0 ? '#ef4444' : '#22c55e'
                  });
                }
              }
              return <>
                      <h2 className="text-4xl font-bold text-center mb-4" style={{
                  color: '#ffffff'
                }}>
                        SEU <span style={{
                    color: '#ffbf06'
                  }}>RETORNO</span>
                      </h2>
                      <h3 className="text-xl text-center mb-8" style={{
                  color: '#ffffff'
                }}>
                        Retorno de investimento em {paybackYears} anos
                      </h3>
                      
                      <div className="bg-white rounded-lg p-6">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={returnData.filter((_, index) => index % 2 === 0 || index <= 10)} margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20
                      }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="year" axisLine={{
                          stroke: '#374151',
                          strokeWidth: 1
                        }} tickLine={{
                          stroke: '#374151'
                        }} tick={{
                          fill: '#374151',
                          fontSize: 12
                        }} angle={-45} textAnchor="end" height={60} />
                              <YAxis axisLine={{
                          stroke: '#374151',
                          strokeWidth: 1
                        }} tickLine={{
                          stroke: '#374151'
                        }} tick={{
                          fill: '#374151',
                          fontSize: 12
                        }} tickFormatter={value => `R$ ${(value / 1000).toFixed(0)}k`} />
                              <Tooltip contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#374151'
                        }} formatter={value => [formatCurrency(Number(value)), 'Retorno Acumulado']} />
                              <Bar dataKey="accumulated" radius={[2, 2, 0, 0]}>
                                {returnData.filter((_, index) => index % 2 === 0 || index <= 10).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Bar>
                              {/* Linha de referência no zero */}
                              <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </>;
            })()}
              </div>

              {/* GRÁFICO 2: SUA RENTABILIDADE */}
              <div className="mb-8">
                {(() => {
              // Validação e cálculos baseados em dados reais
              const investmentBase = calculations.totalValue || 50000;
              const annualSavings = calculations.monthlySavings * 12;
              const fiveYearsSavings = annualSavings * 5;
              
              // Cálculo da rentabilidade real da energia solar
              const solarRentabilityPercentage = investmentBase > 0 
                ? Math.round((fiveYearsSavings / investmentBase) * 100)
                : 180;
              
              // Ajuste proporcional das outras opções baseado no investimento real
              const savingsPercentage = Math.round((investmentBase * 0.27) / 1000) * 1000;
              const cdbPercentage = Math.round((investmentBase * 0.45) / 1000) * 1000;
              
              const rentabilityData = [{
                investment: 'Poupança',
                percentage: 27,
                value: investmentBase * 1.27,
                color: '#9ca3af'
              }, {
                investment: 'CDB',
                percentage: 45,
                value: investmentBase * 1.45,
                color: '#f97316'
              }, {
                investment: 'Energia Solar',
                percentage: solarRentabilityPercentage,
                value: investmentBase + fiveYearsSavings,
                color: '#ffbf06'
              }];
              return <>
                      <h2 className="text-4xl font-bold text-center mb-8" style={{
                  color: '#ffffff'
                }}>
                        SUA <span style={{
                    color: '#ffbf06'
                  }}>RENTABILIDADE</span>
                      </h2>
                      
                      <div className="bg-white rounded-lg p-6">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="horizontal" data={rentabilityData} margin={{
                        top: 20,
                        right: 30,
                        left: 120,
                        bottom: 20
                      }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis type="number" domain={[0, 100000]} axisLine={{
                          stroke: '#374151',
                          strokeWidth: 1
                        }} tickLine={{
                          stroke: '#374151'
                        }} tick={{
                          fill: '#374151',
                          fontSize: 12
                        }} tickFormatter={value => `R$ ${(value / 1000).toFixed(0)}k`} />
                              <YAxis type="category" dataKey="investment" axisLine={{
                          stroke: '#374151',
                          strokeWidth: 1
                        }} tickLine={{
                          stroke: '#374151'
                        }} tick={{
                          fill: '#374151',
                          fontSize: 14,
                          fontWeight: 'bold'
                        }} width={120} />
                              <Tooltip contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#374151'
                        }} formatter={(value, name, props) => [`${formatCurrency(Number(value))} (${props.payload.percentage}%)`, 'Retorno em 5 anos']} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {rentabilityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        
                        {/* Texto explicativo */}
                        <div className="mt-4 text-center text-sm text-gray-600">
                          <p>Comparação baseada em investimento de {formatCurrency(investmentBase)} em 5 anos</p>
                        </div>
                      </div>
                    </>;
            })()}
              </div>

              {/* Footer contact */}
              <div className="mt-16 py-4 text-center rounded-lg" style={{
            backgroundColor: '#ffbf06'
          }}>
                <div className="flex justify-center space-x-6 text-black text-sm font-semibold">
                  <span>(67) 99668-0242</span>
                  <span>olimpo.energiasolar</span>
                  <span>adm.olimposolar@gmail.com</span>
                  <span>R. Eduardo Santos Pereira, 1831 Centro, Campo Grande</span>
                </div>
              </div>
            </div>
          </section>

        {/* PÁGINA 9: RENTABILIDADE */}
        <section className="a4-page bg-white p-8 page-break">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            {/* Aerial View Placeholder */}
            

            {/* Horizontal Bar Chart - Rentabilidade */}
            

            {/* Vertical Bar Chart - Capacidade de Geração */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-2" style={{
              color: '#022136'
            }}>
                Capacidade de geração:
              </h3>
              <p className="text-lg text-center mb-8" style={{
              color: '#022136'
            }}>
                Energia Consumida X Gerada (kWh/mês)
              </p>

              <div className="flex justify-center gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{
                  backgroundColor: '#ffbf06'
                }}></div>
                  <span className="text-sm font-semibold">Geração</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm font-semibold">Consumo</span>
                </div>
              </div>

              <div className="h-80 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(() => {
                  // Calcular variação sazonal baseada no padrão de irradiação solar
                  const baseGeneration = formData.systemPower * 5.0 * 30;
                  const baseConsumption = calculations.monthlyGeneration;
                  const monthlyData = [];

                  // Variações sazonais de irradiação para Campo Grande
                  const seasonalVariations = [{
                    month: 'Jan',
                    genVar: 1.15,
                    consVar: 1.1
                  },
                  // Verão - mais geração e consumo
                  {
                    month: 'Fev',
                    genVar: 1.1,
                    consVar: 1.05
                  }, {
                    month: 'Mar',
                    genVar: 1.0,
                    consVar: 1.0
                  }, {
                    month: 'Abr',
                    genVar: 0.95,
                    consVar: 0.9
                  }, {
                    month: 'Mai',
                    genVar: 0.85,
                    consVar: 0.8
                  },
                  // Inverno - menos geração
                  {
                    month: 'Jun',
                    genVar: 0.8,
                    consVar: 0.75
                  }, {
                    month: 'Jul',
                    genVar: 0.85,
                    consVar: 0.8
                  }, {
                    month: 'Ago',
                    genVar: 0.9,
                    consVar: 0.85
                  }, {
                    month: 'Set',
                    genVar: 1.0,
                    consVar: 0.95
                  }, {
                    month: 'Out',
                    genVar: 1.1,
                    consVar: 1.05
                  }, {
                    month: 'Nov',
                    genVar: 1.15,
                    consVar: 1.1
                  }, {
                    month: 'Dez',
                    genVar: 1.2,
                    consVar: 1.15
                  }];
                  seasonalVariations.forEach(({
                    month,
                    genVar,
                    consVar
                  }) => {
                    monthlyData.push({
                      month,
                      generation: Math.round(baseGeneration * genVar),
                      consumption: Math.round(baseConsumption * consVar)
                    });
                  });
                  return monthlyData;
                })()} margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20
                }}>
                    <CartesianGrid stroke="#e5e7eb" strokeWidth={1} />
                    <XAxis dataKey="month" axisLine={{
                    stroke: '#022136',
                    strokeWidth: 1
                  }} tickLine={{
                    stroke: '#022136'
                  }} tick={{
                    fill: '#022136',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} />
                    <YAxis domain={[0, 8000]} axisLine={{
                    stroke: '#022136',
                    strokeWidth: 1
                  }} tickLine={{
                    stroke: '#022136'
                  }} tick={{
                    fill: '#022136',
                    fontSize: 12,
                    fontWeight: 'bold'
                  }} />
                    <Tooltip contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #022136',
                    borderRadius: '8px',
                    color: '#022136'
                  }} formatter={(value, name) => [`${value} kWh`, name === 'generation' ? 'Geração' : 'Consumo']} />
                    <Legend verticalAlign="top" height={36} formatter={value => value === 'generation' ? 'Geração' : 'Consumo'} />
                    <Bar dataKey="generation" fill="#ffbf06" name="generation" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="consumption" fill="#9ca3af" name="consumption" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Métricas extras */}
              <div className="grid grid-cols-3 gap-6 text-center bg-gray-50 p-6 rounded-lg border">
                <div>
                  <div className="font-bold text-3xl" style={{
                  color: '#ffbf06'
                }}>{metricas.geracaoMedia.toLocaleString()}</div>
                  <div className="text-sm font-semibold" style={{
                  color: '#022136'
                }}>Geração média (kWh)</div>
                </div>
                <div>
                  <div className="font-bold text-3xl" style={{
                  color: '#9ca3af'
                }}>{metricas.consumoMedio.toLocaleString()}</div>
                  <div className="text-sm font-semibold" style={{
                  color: '#022136'
                }}>Consumo médio (kWh)</div>
                </div>
                <div>
                  <div className="font-bold text-3xl" style={{
                  color: '#22c55e'
                }}>{metricas.economia}%</div>
                  <div className="text-sm font-semibold" style={{
                  color: '#022136'
                }}>Economia mensal estimada</div>
                </div>
              </div>
            </div>

            {/* Footer contact */}
            <div className="mt-8 bg-slate-800 py-4 text-center rounded-lg">
              <div className="flex justify-center space-x-6 text-white text-sm">
                <span>67 99668-0242</span>
                <span>Olimpo.energiasolar</span>
                <span>adm.olimposolar@gmail.com</span>
                <span>R. Eduardo Santos Pereira, 1831 Centro, Campo Grande</span>
              </div>
            </div>
          </div>
        </section>

        {/* PÁGINA 9: SEU INVESTIMENTO - Baseado na imagem 9 */}
        <section className="a4-page bg-gradient-to-b from-yellow-50 to-white p-8 page-break">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            <h2 className="text-4xl font-bold text-slate-800 mb-8 text-center">
              Seu investimento:
            </h2>

            {/* Investment Value - Valor em destaque amarelo */}
            <div className="bg-yellow-400 py-6 px-12 rounded-lg mb-8 text-center">
              <div className="text-4xl font-bold text-slate-800">
                {formatCurrency(calculations.totalValue)}
              </div>
            </div>

            {/* Financing Table - Exatamente como na imagem */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-400 text-white">
                    <th className="py-4 px-6 text-left font-bold">Descrição</th>
                    <th className="py-4 px-6 text-center font-bold">Qtd Meses</th>
                    <th className="py-4 px-6 text-center font-bold">Parcela</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-yellow-400 border-b border-yellow-600">
                    <td className="py-3 px-6 font-bold text-black">Cartão de crédito</td>
                    <td className="py-3 px-6 text-center font-bold text-black">18 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-black">{formatCurrency(calculations.totalValue / 18)}</td>
                  </tr>
                  <tr className="bg-yellow-400 border-b border-yellow-600">
                    <td className="py-3 px-6 font-bold text-black">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-black">24 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-black">{formatCurrency(calculations.totalValue / 24)}</td>
                  </tr>
                  <tr className="bg-yellow-400 border-b border-yellow-600">
                    <td className="py-3 px-6 font-bold text-black">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-black">36 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-black">{formatCurrency(calculations.totalValue / 36)}</td>
                  </tr>
                  <tr className="bg-yellow-400 border-b border-yellow-600">
                    <td className="py-3 px-6 font-bold text-black">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-black">48 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-black">{formatCurrency(calculations.totalValue / 48)}</td>
                  </tr>
                  <tr className="bg-yellow-400 border-b border-yellow-600">
                    <td className="py-3 px-6 font-bold text-black">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-black">64 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-black">{formatCurrency(calculations.totalValue / 64)}</td>
                  </tr>
                  <tr className="bg-yellow-400 border-b border-yellow-600">
                    <td className="py-3 px-6 font-bold text-black">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-black">72 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-black">{formatCurrency(calculations.totalValue / 72)}</td>
                  </tr>
                  <tr className="bg-yellow-400">
                    <td className="py-3 px-6 font-bold text-black">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-black">84 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-black">{formatCurrency(calculations.totalValue / 84)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Texto explicativo */}
            <div className="text-center text-sm text-slate-600 mb-8">
              <p>Simulação sujeita a análise de crédito de acordo com a instituição financeira selecionada.</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg mb-8 text-sm text-slate-700 leading-relaxed">
              <p>
                Para dimensionar e precificar adequadamente o seu projeto, nossa visita técnica é essencial. A inclinação e a 
                face do telhado podem impactar a geração de energia do sistema fotovoltaico. Durante a visita, também 
                iremos analisar as condições da estrutura física e elétrica. Pode ser necessário realizar ajustes para garantir sua 
                segurança e a correta homologação do sistema com a Concessionária de Energia.
              </p>
            </div>

            {/* Bandeiras de cartão */}
            <div className="flex justify-center gap-4 mb-6">
              <img src="/lovable-uploads/49c651a9-aa2e-42d3-ae77-f741c6d2caf9.png" alt="Bandeiras de cartão aceitas" className="h-8 object-contain" loading="lazy" />
            </div>

            {/* Logos dos bancos */}
            <div className="grid grid-cols-7 gap-4 mb-12 max-w-3xl mx-auto">
              {['BV', 'Sicredi', 'Sol Agora', 'SICOOB', 'Viacredi', 'Santander', 'BNDES'].map(bank => <div key={bank} className="bg-gray-200 h-12 rounded flex items-center justify-center text-xs font-bold text-slate-600">
                  {bank}
                </div>)}
            </div>

            {/* Seção de rentabilidade - baseado na parte inferior da imagem 9 */}
            

            {/* Footer contact */}
            
          </div>
        </section>

        {/* PÁGINA 10: TERMO DE COMPROMISSO - Baseado na imagem 10 */}
        <section className="a4-page bg-gradient-to-b from-yellow-100 to-yellow-50 p-8 page-break">
          <div className="max-w-4xl mx-auto py-16">
            
            <h2 className="text-5xl font-bold text-slate-800 mb-12 leading-tight">
              Termo de<br />
              compromisso:
            </h2>

            <div className="space-y-6 text-base text-slate-800 leading-relaxed mb-20">
              <p>
                Para o entendimento da contratação de ambas as partes, logo abaixo se encontram algumas informações 
                importantes para todo o processo de aquisição da usina solar.
              </p>

              <p>
                O <strong>COMPROMISSÁRIO COMPRADOR</strong> se obriga a viabilizar a realização da visita técnica pelo <strong>COMPROMISSÁRIO 
                VENDEDOR</strong> afim de comprovar a viabilidade técnica do local para instalação do sistema fotovoltaico. As partes 
                poderão renunciar a assinatura <strong>CONTRATO DE COMPRA, VENDA, PRESTAÇÃO DE SERVIÇOS E OUTRAS AVENÇAS PARA 
                IMPLANTAÇÃO DE SISTEMA DE GERAÇÃO DE ENERGIA FOTOVOLTAICO</strong>, sem qualquer tipo de penalidade, nos casos de:
              </p>

              <div className="ml-6 space-y-3 text-base">
                <p><strong>A)</strong> Inviabilidade técnica para instalação do sistema;</p>
                <p><strong>B)</strong> Inviabilidade financeira do projeto.</p>
                <p><strong>C)</strong> Salientamos que a aceitação da proposta vigente terá validade jurídica após contrato de compra e venda, 
                aprovação das formas de pagamento ou financiamento ofertado.</p>
              </div>
            </div>

            {/* Signature Section - Exatamente como na imagem */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
              <div className="text-center">
                <div className="border-b-4 border-slate-800 pb-4 mb-6 min-h-[80px]">
                  {/* Espaço para assinatura */}
                </div>
                <p className="font-bold italic text-xl text-slate-800">Contratante</p>
                <div className="mt-4">
                  <p className="font-semibold text-slate-800">{formData.clientName}</p>
                  <p className="text-slate-700 text-sm">{formData.address}, {formData.number}</p>
                  <p className="text-slate-700 text-sm">{formData.neighborhood} - {formData.city}</p>
                  <p className="text-slate-700 text-sm">Data: {formatDate()}</p>
                </div>
              </div>

              <div className="text-center">
                <div className="border-b-4 border-slate-800 pb-4 mb-6 min-h-[80px]">
                  {/* Espaço para assinatura */}
                </div>
                <p className="font-bold italic text-xl text-slate-800">Contratado</p>
                <div className="mt-4">
                  <p className="font-semibold text-slate-800">Olimpo Solar</p>
                  <p className="text-slate-700 text-sm">CNPJ: 55.139.821/0001-03</p>
                  <p className="text-slate-700 text-sm">Campo Grande - MS</p>
                </div>
              </div>
            </div>

            {/* Logo e informações da empresa */}
            <div className="flex justify-center mb-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-20 w-auto" loading="lazy" />
            </div>

            {/* Footer da empresa */}
            <div className="bg-slate-800 rounded-lg p-6 text-center">
              <div className="text-white">
                <div className="flex justify-center items-center space-x-8 text-sm">
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                    (67) 99668-0242
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                    olimpo.energiasolar
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                    adm.olimposolar@gmail.com
                  </span>
                  <span className="flex items-center">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                    R. Eduardo Santos Pereira, 1831 Centro, Campo Grande
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Botões Fixos no Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
        <div className="flex gap-2">
          <Button onClick={onEdit} variant="outline" className="flex-1 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Editar
          </Button>
          <Button onClick={onGeneratePDF} className="flex-1 gap-2 bg-gradient-solar text-white">
            <FileDown className="h-4 w-4" />
            Gerar PDF
          </Button>
        </div>
      </div>
    </div>;
};
export default ProposalPreview;