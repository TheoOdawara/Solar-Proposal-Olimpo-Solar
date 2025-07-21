import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileDown, MapPin, Calendar, Zap, CheckCircle, Star, Globe, Shield, Wrench, Clock, Battery, BarChart3, TrendingUp, Lightbulb, DollarSign, Home, Leaf } from "lucide-react";
import olimpoLogo from "@/assets/olimpo-solar-logo.png";
interface FormData {
  clientName: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  phone: string;
  systemPower: number;
  moduleQuantity: number;
  modulePower: number;
  moduleBrand: string;
  inverterBrand: string;
  inverterPower: number;
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
  return <div className="min-h-screen bg-background">
      {/* Navegação */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 p-4">
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
      <div id="proposal-content" className="max-w-4xl mx-auto bg-white">
        
        {/* PÁGINA 1: CAPA - Baseado na primeira imagem */}
        <section className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
          {/* Formas geométricas 3D amarelas/douradas */}
          <div className="absolute top-1/4 right-1/4 transform -translate-y-1/2">
            {/* Cubo grande */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 transform rotate-12 shadow-2xl"></div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-400 transform rotate-45 shadow-xl"></div>
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-yellow-200 to-yellow-300 transform rotate-12 shadow-lg"></div>
            </div>
          </div>

          {/* Padrão de pontos no lado esquerdo */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <div className="grid grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => <div key={i} className="w-3 h-3 bg-white rounded-full opacity-80"></div>)}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex items-center justify-between px-16 py-16">
            {/* Main Title */}
            <div className="max-w-xl">
              <h1 className="text-7xl font-bold text-white leading-none mb-4">
                PROPOSTA<br />
                COMERCIAL
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Sistema fotovoltaico
              </p>
              
              {/* Cliente info integrado no design */}
              <div className="mt-12 space-y-2 text-white/90">
                <div className="text-lg font-semibold">{formData.clientName}</div>
                <div className="text-sm">{formData.address}, {formData.number} - {formData.neighborhood}</div>
                <div className="text-sm">{formData.city}</div>
                <div className="text-sm">{formData.phone}</div>
                <div className="text-sm">Data: {formatDate()}</div>
              </div>

              {/* Box com potência do sistema */}
              <div className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 px-6 py-3 rounded-lg inline-block transform -rotate-3 shadow-xl">
                <div className="font-bold text-lg">{formData.systemPower} kWp</div>
                <div className="text-sm">Sistema Solar</div>
              </div>
            </div>

            {/* Logo */}
            <div className="absolute bottom-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-24 w-auto brightness-0 invert" />
            </div>
          </div>
        </section>

        {/* PÁGINA 2: QUEM SOMOS */}
        <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-8">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            <h2 className="text-4xl font-bold text-slate-800 mb-8 text-center">
              QUEM SOMOS:
            </h2>

            <div className="space-y-8">
              <p className="text-lg text-slate-700 text-center leading-relaxed max-w-3xl mx-auto">
                A Olimpo Solar, localizada em Campo Grande-MS, transforma o 
                consumo de energia ao ajudar cidadãos a economizarem para 
                investir no que realmente importa – suas famílias.
              </p>

              <p className="text-lg text-slate-700 text-center leading-relaxed max-w-3xl mx-auto">
                Com soluções inovadoras e sustentáveis em energia solar, 
                reduzimos suas despesas mensais e contribuímos para a 
                preservação ambiental. Nosso diferencial está em trabalhar 
                exclusivamente com materiais de alta qualidade e garantir 
                produtos a pronta entrega, assegurando rapidez e e ciência no 
                atendimento.
              </p>

              <div className="mt-16">
                <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">
                  Por que escolher a<br />
                  Olimpo Energia Renovável
                </h3>
                
                <p className="text-lg text-slate-700 text-center leading-relaxed max-w-3xl mx-auto mb-16">
                  Escolher a Olimpo Solar significa optar por um futuro onde a 
                  economia e a sustentabilidade andam lado a lado, beneficiando 
                  tanto o seu bolso quanto o planeta.
                </p>
              </div>

              {/* Compromisso Section */}
              <div className="bg-slate-800 rounded-lg p-8 text-white mt-16">
                <h3 className="text-3xl font-bold text-center mb-12">
                  NOSSO COMPROMISSO
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <Leaf className="h-8 w-8 text-slate-800" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">COM A NATUREZA</h4>
                    <p className="text-sm">Energia limpa totalmente sustentável</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-slate-800" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">COM SEU PROJETO</h4>
                    <p className="text-sm">Equipamentos profissionais altamente qualificados.</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-8 w-8 text-slate-800" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">COM SEU BOLSO</h4>
                    <p className="text-sm">Economia de até 95% na sua fatura de energia.</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-12 text-center">
                  <div className="flex justify-center space-x-8 text-sm">
                    <span>(67) 99668-0242</span>
                    <span>olimpo.energiasolar</span>
                    <span>adm.olimposolar@gmail.com</span>
                    <span>R. Eduardo Santos Pereira, 1835 Centro, Campo Grande</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PÁGINA 3: COMO FUNCIONA */}
        <section className="min-h-screen bg-white p-8">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            <h2 className="text-4xl font-bold text-slate-800 mb-16 text-center">
              Como Funciona:
            </h2>

            {/* Solar System Diagram */}
            <div className="flex justify-center mb-16">
              <img 
                src="/lovable-uploads/eec5512b-b132-4591-8437-18986fe56e01.png" 
                alt="Como funciona a energia solar" 
                className="max-w-full h-auto max-h-96 object-contain"
              />
            </div>

            {/* Yellow banner */}
            <div className="bg-yellow-400 py-4 px-8 rounded-lg mb-8">
              <h3 className="text-2xl font-bold text-slate-800 text-center">
                SIMPLES, ECONÔMICO E EFICIENTE
              </h3>
            </div>

            {/* Steps explanation */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-xl font-bold text-slate-800">1.</span>
                <p className="text-lg text-slate-700">Placas solares captam energia do calor do sol.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xl font-bold text-slate-800">2.</span>
                <p className="text-lg text-slate-700">O sistema converte essa energia para uso direto na residência ou indústria.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xl font-bold text-slate-800">3.</span>
                <p className="text-lg text-slate-700">A energia convertida pode ser utilizada em todos os aparelhos elétricos.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xl font-bold text-slate-800">4.</span>
                <p className="text-lg text-slate-700">A energia não usada é armazenada, gerando crédito na concessionária.</p>
              </div>
            </div>

            {/* Footer contact */}
            <div className="mt-16 bg-slate-800 py-4 text-center">
              <div className="flex justify-center space-x-8 text-white text-sm">
                <span>67 99668-0242</span>
                <span>Olimpo.energiasolar</span>
                <span>adm.olimposolar@gmail.com</span>
                <span>R. Eduardo Santos Pereira, 1831 Centro, Campo Grande</span>
              </div>
            </div>
          </div>
        </section>

        {/* PÁGINA 4: BENEFÍCIOS */}
        <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-8">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Benefícios:
              </h2>
              <div className="inline-block bg-yellow-400 px-6 py-2 rounded">
                <span className="text-xl font-bold text-slate-800">DA ENERGIA SOLAR</span>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Row 1 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <div className="text-4xl">%</div>
                </div>
                <h3 className="font-bold text-lg mb-2">Sem Tarifário</h3>
                <p className="text-sm text-slate-600">Não é afetado pelo impacto tarifário. Isento dos aumentos anuais da tarifa de energia elétrica.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">Isenção de Impostos</h3>
                <p className="text-sm text-slate-600">Isenção de determinados tributos incluídos na sua fatura de energia elétrica.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Home className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">Valorização</h3>
                <p className="text-sm text-slate-600">Compartilhamento da energia excedente. Valorização de 3% a 6% do seu imóvel.</p>
              </div>

              {/* Row 2 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Leaf className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">Contribuição para a Sustentabilidade</h3>
                <p className="text-sm text-slate-600">Ao optar pela energia solar, você apoia práticas sustentáveis e reduz seu impacto ambiental.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">Durabilidade</h3>
                <p className="text-sm text-slate-600">Painéis solares têm uma vida útil longa, geralmente de 25 anos ou mais, garantindo um bom retorno sobre o investimento.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">Baixos Custos de Manutenção</h3>
                <p className="text-sm text-slate-600">Os sistemas solares exigem pouca manutenção após a instalação, o que reduz gastos adicionais.</p>
              </div>

              {/* Row 3 */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">Garantia</h3>
                <p className="text-sm text-slate-600">Módulos fotovoltaicos com uma garantia de 25 anos.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Wrench className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">Projeto Sob Medida</h3>
                <p className="text-sm text-slate-600">Análise exclusiva de sombreamento utilizando software especializado.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-12 w-12 text-slate-700" />
                </div>
                <h3 className="font-bold text-lg mb-2">1 Ano de Garantia na Instalação</h3>
                <p className="text-sm text-slate-600">Sistema de Monitoramento Online.</p>
              </div>
            </div>

            {/* Family image */}
            <div className="rounded-lg overflow-hidden mb-8">
              <img 
                src="/lovable-uploads/06944c3f-9aae-47db-9ab8-0d13b80138a5.png" 
                alt="Família feliz" 
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Footer contact */}
            <div className="bg-slate-800 py-4 text-center rounded-lg">
              <div className="flex justify-center space-x-6 text-white text-sm">
                <span>(67) 99668-0242</span>
                <span>olimpo.energiasolar</span>
                <span>adm.olimposolar@gmail.com</span>
                <span>R. Eduardo Santos Pereira, 1831 Centro, Campo Grande</span>
              </div>
            </div>
          </div>
        </section>

        {/* PÁGINA 5: NOSSOS PROJETOS */}
        <section className="min-h-screen bg-white p-8">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            <h2 className="text-4xl font-bold text-slate-800 mb-16 text-center">
              Nossos Projetos:
            </h2>

            {/* Projects Grid */}
            <div className="mb-16">
              <img 
                src="/lovable-uploads/5839951b-6ca3-4221-b6f5-945748cf80a3.png" 
                alt="Grid de projetos da Olimpo Solar" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
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
        <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-8">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            <h2 className="text-4xl font-bold text-slate-800 mb-8 text-center">
              Projeto 360°
            </h2>

            <p className="text-lg text-slate-700 text-center leading-relaxed max-w-3xl mx-auto mb-16">
              Nosso compromisso é satisfazer as necessidades dos clientes do início ao 
              fim de cada projeto fotovoltaico. Por isso, adotamos um processo de 
              gerenciamento que torna mais ágeis as ações durante a negociação.
            </p>

            {/* Process Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {/* Row 1 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Estudo de Necessidade</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FileDown className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Apresentação da Proposta</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Escolha de opções de pagamento</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Assinatura de Contrato</h3>
              </div>

              {/* Row 2 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="font-bold text-slate-800">START</span>
                </div>
                <h3 className="font-bold text-sm">Apresentação do Canal do Cliente</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Vistoria do Projeto</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Wrench className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Elaboração de Projeto</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Pedido de Equipamentos</h3>
              </div>

              {/* Row 3 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <FileDown className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Transporte e Entrega</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Aprovação do Projeto</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Wrench className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Instalação</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Battery className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Troca do medidor</h3>
              </div>

              {/* Row 4 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="h-10 w-10 text-slate-800" />
                </div>
                <h3 className="font-bold text-sm">Início da Geração</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Monitoramento</h3>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="font-bold text-sm">Economia</h3>
              </div>
            </div>

            {/* Footer contact */}
            <div className="bg-slate-800 py-4 text-center rounded-lg">
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
        <section className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-50 p-8">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            <h2 className="text-4xl font-bold text-slate-800 mb-16 text-center">
              Seu Projeto:
            </h2>

            {/* Project Equipment Image Placeholder */}
            <div className="bg-white rounded-lg p-8 mb-12 text-center">
              <div className="w-80 h-60 mx-auto mb-8 flex items-center justify-center">
                <img src="/lovable-uploads/898d9890-e943-4493-9ab7-cad6efc48286.png" alt="Equipamentos do Sistema Solar" className="max-h-full max-w-full object-contain" />
              </div>
              
              {/* Equipment Icons */}
              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-600">{formData.moduleQuantity} Painéis</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Battery className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-600">Inversor {formData.inverterBrand}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-600">Estrutura</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Lightbulb className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-600">Monitoramento</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-600">Economia</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-600">Potência {formData.systemPower}kWp</p>
                </div>
              </div>
            </div>

            {/* Warranties Section */}
            <div className="bg-slate-800 rounded-lg p-8 text-white">
              <h3 className="text-3xl font-bold text-center mb-8">GARANTIAS</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="font-semibold">Módulos solares</span>
                  <span>25 anos de eficiência e 12 anos para defeito de fabricação</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="font-semibold">Inversores</span>
                  <span>10 anos</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="font-semibold">Micro Inversores</span>
                  <span>15 anos</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="font-semibold">Estrutura</span>
                  <span>10 anos</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold italic">Instalação</span>
                  <span className="italic">12 meses</span>
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

        {/* PÁGINA 8: RENTABILIDADE */}
        <section className="min-h-screen bg-white p-8">
          <div className="max-w-4xl mx-auto py-16">
            {/* Logo */}
            <div className="absolute top-8 right-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            {/* Aerial View Placeholder */}
            <div className="bg-gray-200 h-64 rounded-lg mb-12 flex items-center justify-center">
              <p className="text-gray-500">Vista Aérea - Imagem Personalizada do Cliente: {formData.clientName}</p>
            </div>

            <div className="bg-slate-800 rounded-t-lg p-8 text-white mb-8">
              <h2 className="text-3xl font-bold text-center mb-4">Rentabilidade:</h2>
              <p className="text-xl text-center">Comparativo de Investimento</p>
            </div>

            {/* Investment Comparison */}
            <div className="space-y-6 mb-12 bg-slate-800 p-8 text-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Investimento: Poupança</span>
                  <div className="flex-1 mx-4 bg-gray-600 h-8 rounded">
                    <div className="h-8 bg-red-500 rounded" style={{
                    width: '20%'
                  }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Investimento: CBD</span>
                  <div className="flex-1 mx-4 bg-gray-600 h-8 rounded">
                    <div className="h-8 bg-orange-500 rounded" style={{
                    width: '35%'
                  }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Investimento: Energia Solar</span>
                  <div className="flex-1 mx-4 bg-gray-600 h-8 rounded">
                    <div className="h-8 bg-green-500 rounded" style={{
                    width: '80%'
                  }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generation Capacity Chart */}
            <div className="bg-yellow-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">
                Capacidade de geração:
              </h3>
              <p className="text-lg text-slate-700 text-center mb-6">
                Energia Consumida X Gerada (KwH/mês) - Projeto {formData.clientName}
              </p>

              <div className="flex justify-center gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-sm">Geração</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">Consumo</span>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="flex justify-between items-end h-40 border-b-2 border-gray-300">
                {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Média'].map((month, i) => <div key={month} className="flex flex-col items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-6 bg-yellow-400 rounded-t" style={{
                    height: `${120 + Math.random() * 20}px`
                  }}></div>
                      <div className="w-6 bg-gray-400 rounded-t" style={{
                    height: `${100 + Math.random() * 15}px`
                  }}></div>
                    </div>
                    <span className="text-xs text-slate-600 transform -rotate-45">{month}</span>
                  </div>)}
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                <div>
                  <div className="font-bold text-2xl text-yellow-600">{calculations.monthlyGeneration}</div>
                  <div className="text-sm text-slate-600">kWh Geração Média</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-gray-600">{Math.round(calculations.monthlyGeneration * 0.85)}</div>
                  <div className="text-sm text-slate-600">kWh Consumo Médio</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-green-600">{Math.round(calculations.monthlyGeneration * 0.15)}</div>
                  <div className="text-sm text-slate-600">kWh Excedente</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-blue-600">95%</div>
                  <div className="text-sm text-slate-600">Economia Mensal</div>
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
        <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-8">
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
              <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">VISA</div>
              <div className="bg-blue-400 text-white px-3 py-1 rounded text-sm font-bold">AMERICAN EXPRESS</div>
              <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">MASTERCARD</div>
              <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">ELO</div>
            </div>

            {/* Logos dos bancos */}
            <div className="grid grid-cols-7 gap-4 mb-12 max-w-3xl mx-auto">
              {['BV', 'Sicredi', 'Sol Agora', 'SICOOB', 'Viacredi', 'Santander', 'BNDES'].map(bank => <div key={bank} className="bg-gray-200 h-12 rounded flex items-center justify-center text-xs font-bold text-slate-600">
                  {bank}
                </div>)}
            </div>

            {/* Seção de rentabilidade - baseado na parte inferior da imagem 9 */}
            <div className="bg-slate-800 rounded-lg p-8 text-white">
              <h3 className="text-3xl font-bold text-center mb-8">Sua rentabilidade:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h4 className="font-bold mb-4 text-lg">Sua conta de energia<br />sem Energia Solar:</h4>
                  <div className="text-2xl font-bold text-red-400">R$ 8.000,00 / ano</div>
                  <div className="text-lg">R$ 8.000,00 / mês</div>
                </div>

                <div>
                  <h4 className="font-bold mb-4 text-lg">Sua conta de energia<br />com Energia Solar:</h4>
                  <div className="text-2xl font-bold text-green-400">R$ 3.840,00 / ano</div>
                  <div className="text-lg">R$ 320,00 / mês</div>
                </div>

                <div>
                  <h4 className="font-bold mb-4 text-lg">Sua economia será de:</h4>
                  <div className="text-2xl font-bold text-yellow-400">R$ 90.852 / ano</div>
                  <div className="text-lg">R$ 7.571,00 / mês</div>
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

        {/* PÁGINA 10: TERMO DE COMPROMISSO - Baseado na imagem 10 */}
        <section className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-50 p-8">
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
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-20 w-auto" />
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