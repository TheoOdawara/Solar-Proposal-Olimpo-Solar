import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileDown, MapPin, Calendar, Zap, CheckCircle, Star } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
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
        {/* PÁGINA 1: CAPA */}
        <section className="min-h-screen p-8 flex flex-col justify-center bg-white">
          {/* Logo */}
          <div className="text-center mb-12">
            <img 
              src={olimpoLogo} 
              alt="Olimpo Solar" 
              className="mx-auto h-20 w-auto mb-8"
            />
          </div>

          {/* Título */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Proposta Comercial
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-solar bg-clip-text text-transparent">
              Sistema Fotovoltaico
            </h2>
          </div>

          {/* Dados do Cliente */}
          <div className="space-y-8 max-w-2xl mx-auto">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                CLIENTE:
              </h3>
              <p className="text-lg text-foreground">{formData.clientName}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">ENDEREÇO:</h3>
              <p className="text-lg text-foreground">
                {formData.address}, {formData.number}
              </p>
              <p className="text-lg text-foreground">
                {formData.neighborhood} - {formData.city}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                DATA:
              </h3>
              <p className="text-lg text-foreground">{formatDate()}</p>
            </div>
          </div>
        </section>

        {/* PÁGINA 2: MENSAGEM INSTITUCIONAL */}
        <section className="min-h-screen p-8 bg-white">
          <div className="max-w-4xl mx-auto py-16">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-solar bg-clip-text text-transparent">
              Mensagem Institucional
            </h2>

            <Card className="border-primary/20 border-2 bg-gradient-to-br from-background to-muted/20 mb-16">
              <CardContent className="p-8 text-center">
                <p className="text-xl font-medium text-foreground mb-4">
                  Nosso compromisso é com seu bolso e com o planeta.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Escolher a Olimpo Solar é optar por economia e<br/>
                  sustentabilidade com atendimento humanizado,<br/>
                  produtos premium e instalação rápida.
                </p>
              </CardContent>
            </Card>

            {/* RESUMO DO PROJETO */}
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-solar bg-clip-text text-transparent">
              Resumo do Projeto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Potência do Sistema:</span>
                  <span className="text-primary font-bold">{formData.systemPower} kWp</span>
                </div>
                <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Módulos:</span>
                  <span className="text-primary font-bold">{formData.moduleQuantity} módulos de {formData.modulePower}W</span>
                </div>
                <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Marca dos Módulos:</span>
                  <span className="text-primary font-bold">{formData.moduleBrand}</span>
                </div>
                <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Inversor:</span>
                  <span className="text-primary font-bold">{formData.inverterBrand} - {formData.inverterPower}W</span>
                </div>
                <div className="flex justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-semibold">Forma de Pagamento:</span>
                  <span className="text-primary font-bold">{formData.paymentMethod.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <span className="font-semibold">Geração Mensal Estimada:</span>
                  <span className="text-secondary font-bold">{calculations.monthlyGeneration} kWh/mês</span>
                </div>
                <div className="flex justify-between p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <span className="font-semibold">Economia Mensal Estimada:</span>
                  <span className="text-secondary font-bold">{formatCurrency(calculations.monthlySavings)}</span>
                </div>
                <div className="flex justify-between p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <span className="font-semibold">Área Mínima Necessária:</span>
                  <span className="text-secondary font-bold">{calculations.requiredArea} m²</span>
                </div>
                <div className="flex justify-between p-4 bg-gradient-solar/10 rounded-lg border border-primary/30">
                  <span className="font-semibold">Valor Total do Projeto:</span>
                  <span className="font-bold text-xl bg-gradient-solar bg-clip-text text-transparent">
                    {formatCurrency(calculations.totalValue)}
                  </span>
                </div>
              </div>
            </div>

            {formData.observations && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Observações:</h4>
                <p className="text-muted-foreground">{formData.observations}</p>
              </div>
            )}
          </div>
        </section>

        {/* PÁGINA 3: BENEFÍCIOS */}
        <section className="min-h-screen p-8 bg-white">
          <div className="max-w-4xl mx-auto py-16">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-solar bg-clip-text text-transparent">
              Benefícios da Energia Solar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[
                { icon: CheckCircle, text: "Garantia de até 25 anos" },
                { icon: Star, text: "Valorização do imóvel" },
                { icon: Zap, text: "Baixo custo de manutenção" },
                { icon: CheckCircle, text: "Isenção de impostos e tarifas" },
                { icon: Star, text: "Sustentabilidade ambiental" },
                { icon: Zap, text: "Monitoramento online" }
              ].map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-secondary" />
                    </div>
                    <span className="text-lg font-medium text-foreground">{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            {/* ETAPAS DO PROJETO */}
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-solar bg-clip-text text-transparent">
              Etapas do Projeto
            </h3>

            <div className="space-y-6">
              {[
                "Apresentação da proposta",
                "Visita técnica",
                "Assinatura de contrato",
                "Instalação",
                "Ativação da usina",
                "Monitoramento"
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-6 p-4 bg-primary/5 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-solar rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <span className="text-lg font-medium text-foreground">{step}</span>
                  {index < 5 && (
                    <div className="flex-1 border-b-2 border-dashed border-primary/30"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PÁGINA 4: COMPARATIVO */}
        <section className="min-h-screen p-8 bg-white">
          <div className="max-w-4xl mx-auto py-16">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-solar bg-clip-text text-transparent">
              Comparativo de Investimento
            </h2>

            <div className="space-y-8 mb-16">
              {[
                { name: 'Energia Solar', value: 12, color: 'bg-gradient-solar' },
                { name: 'Poupança', value: 6, color: 'bg-muted' },
                { name: 'CDI', value: 8, color: 'bg-muted-foreground/20' }
              ].map((investment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{investment.name}</span>
                    <span className="text-lg font-bold text-primary">{investment.value}% a.a.</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-6">
                    <div 
                      className={`h-6 rounded-full ${investment.color} transition-all duration-1000`}
                      style={{ width: `${(investment.value / 12) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* RODAPÉ */}
            <div className="bg-gradient-solar rounded-lg p-8 text-center text-white">
              <img 
                src={olimpoLogo} 
                alt="Olimpo Solar" 
                className="mx-auto h-12 w-auto mb-4 brightness-0 invert"
              />
              <h3 className="text-2xl font-bold mb-4">OLIMPO SOLAR</h3>
              <div className="space-y-2 text-sm">
                <p>R. Eduardo Santos Pereira, 1831 – Centro, Campo Grande – MS</p>
                <p>WhatsApp: (67) 99668-0242</p>
                <p>Instagram: @olimpo.energiasolar</p>
                <p>E-mail: adm.olimposolar@gmail.com</p>
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
    </div>
  );
};

export default ProposalPreview;