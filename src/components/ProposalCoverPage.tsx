import React from 'react';
import { MapPin, Zap, Calendar, Home } from 'lucide-react';
import olimpoLogo from "/lovable-uploads/568489ba-4d5c-47e2-a032-5a3030b5507b.png";

interface FormData {
  clientName: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  systemPower: number;
}

interface Calculations {
  monthlyGeneration: number;
  totalValue: number;
}

interface ProposalCoverPageProps {
  formData: FormData;
  calculations: Calculations;
  companyData?: {
    phone: string;
    address: string;
    cnpj: string;
  };
}

const ProposalCoverPage: React.FC<ProposalCoverPageProps> = ({
  formData,
  calculations,
  companyData = {
    phone: "(67) 99668-0242",
    address: "R. Eduardo Santos Pereira, 1831 Centro, Campo Grande - MS",
    cnpj: "00.000.000/0001-00"
  }
}) => {
  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <section className="a4-page page-break print-optimized relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022136] via-[#022136] to-[#033249]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-[#ffbf06] rounded-full opacity-10"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-[#ffbf06] rounded-full opacity-15"></div>
      <div className="absolute top-1/2 right-10 w-16 h-16 bg-white rounded-full opacity-5"></div>

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Header with logo */}
        <div className="flex justify-center pt-12 mb-8">
          <img src={olimpoLogo} alt="Olimpo Solar" className="h-20 w-auto brightness-0 invert" />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center px-16 max-w-6xl mx-auto w-full">
          
          {/* Title section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
              Proposta Comercial
            </h1>
            <h2 className="text-6xl font-bold text-[#ffbf06] mb-6 tracking-tight">
              Personalizada
            </h2>
            <p className="text-2xl text-white/80 font-light">
              Projeto de Energia Solar
            </p>
          </div>

          {/* Client data block */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Client info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ffbf06] rounded-full flex items-center justify-center">
                    <Home className="h-6 w-6 text-[#022136]" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm uppercase tracking-wide">Cliente</p>
                    <p className="text-white text-xl font-semibold">{formData.clientName}</p>
                  </div>
                </div>

                {(formData.city || formData.state) && (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#ffbf06] rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[#022136]" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm uppercase tracking-wide">Local</p>
                      <p className="text-white text-lg">
                        {[formData.city, formData.state].filter(Boolean).join(', ') || 'Local não informado'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* System info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ffbf06] rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-[#022136]" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm uppercase tracking-wide">Potência</p>
                    <p className="text-white text-xl font-semibold">{formData.systemPower} kWp</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ffbf06] rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-[#022136]" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm uppercase tracking-wide">Geração Estimada</p>
                    <p className="text-white text-xl font-semibold">{calculations.monthlyGeneration} kWh/mês</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image with overlay text */}
          <div className="relative rounded-2xl overflow-hidden mb-12">
            <div 
              className="h-80 bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?q=80&w=2670&auto=format&fit=crop')"
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#022136]/90 to-[#022136]/60"></div>
              
              {/* Overlay text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <h3 className="text-4xl font-bold text-white mb-4 leading-tight">
                    Transforme sol em economia
                  </h3>
                  <p className="text-2xl text-[#ffbf06] font-semibold">
                    com a líder em energia solar do Centro-Oeste
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#ffbf06] py-6 px-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Guarantee seal */}
            <div className="bg-[#022136] text-[#ffbf06] px-8 py-4 rounded-full transform -rotate-2 shadow-lg">
              <p className="text-lg font-bold uppercase tracking-wide">
                GARANTIA DE ATÉ 25 ANOS
              </p>
            </div>

            {/* Company info */}
            <div className="text-[#022136] text-sm space-y-1 text-center md:text-right">
              <div className="flex items-center space-x-2 justify-center md:justify-end">
                <span className="font-semibold">Telefone:</span>
                <span>{companyData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-end">
                <span className="font-semibold">Endereço:</span>
                <span>{companyData.address}</span>
              </div>
              <div className="flex items-center space-x-2 justify-center md:justify-end">
                <span className="font-semibold">CNPJ:</span>
                <span>{companyData.cnpj}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
    </section>
  );
};

export default ProposalCoverPage;