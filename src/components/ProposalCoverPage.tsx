import React from 'react';
import { MapPin, Zap, Calendar, Home } from 'lucide-react';

// Importar tipos e utilitários centralizados
import type { FormData, Calculations, ProposalCoverPageProps } from '@/types/proposal';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { COMPANY_DATA } from '@/constants/solarData';

const ProposalCoverPage: React.FC<ProposalCoverPageProps> = ({
  formData,
  calculations,
  companyData = COMPANY_DATA
}) => {

  return (
    <section className="a4-page page-break print-optimized relative overflow-hidden z-0">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022136] via-[#022136] to-[#033249]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-16 right-16 w-24 h-24 bg-[#ffbf06] rounded-full opacity-10"></div>
      <div className="absolute bottom-32 left-16 w-20 h-20 bg-[#ffbf06] rounded-full opacity-15"></div>
      <div className="absolute top-1/2 right-8 w-12 h-12 bg-white rounded-full opacity-5"></div>

      {/* Content container */}
      <div className="relative z-0 h-full flex flex-col px-6 py-6">
        
        {/* Header with logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/568489ba-4d5c-47e2-a032-5a3030b5507b.png" 
            alt="Olimpo Solar" 
            className="h-32 w-auto drop-shadow-lg" 
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-between max-w-full mx-auto w-full">
          
          {/* Title section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-tight">
              Proposta Comercial
            </h1>
            <h2 className="text-4xl md:text-4xl font-bold text-[#ffbf06] mb-4 tracking-tight leading-tight">
              Personalizada
            </h2>
            <p className="text-xl text-white/80 font-light">
              Projeto de Energia Solar
            </p>
          </div>

          {/* Client data block */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Cliente */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#ffbf06] rounded-full flex items-center justify-center flex-shrink-0">
                  <Home className="h-6 w-6 text-[#022136]" />
                </div>
                <div className="flex-1">
                  <p className="text-white/70 text-sm uppercase tracking-wider font-medium mb-1">Cliente</p>
                  <p className="text-white text-lg font-bold leading-tight">{formData.clientName}</p>
                </div>
              </div>

              {/* Potência */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#ffbf06] rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-[#022136]" />
                </div>
                <div className="flex-1">
                  <p className="text-white/70 text-sm uppercase tracking-wider font-medium mb-1">Potência</p>
                  <p className="text-white text-lg font-bold leading-tight">{formData.systemPower} kWp</p>
                </div>
              </div>

              {/* Local */}
              {(formData.city || formData.state) && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#ffbf06] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-[#022136]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/70 text-sm uppercase tracking-wider font-medium mb-1">Local</p>
                    <p className="text-white text-lg font-bold leading-tight">
                      {[formData.city, formData.state].filter(Boolean).join(', ') || 'Local não informado'}
                    </p>
                  </div>
                </div>
              )}

              {/* Geração Estimada */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#ffbf06] rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-[#022136]" />
                </div>
                <div className="flex-1">
                  <p className="text-white/70 text-sm uppercase tracking-wider font-medium mb-1">Geração Estimada</p>
                  <p className="text-white text-lg font-bold leading-tight">{calculations.monthlyGeneration} kWh/mês</p>
                </div>
              </div>

            </div>
          </div>

          {/* Hero image with overlay text */}
          <div className="relative rounded-xl overflow-hidden mb-6">
            <div 
              className="h-44 bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?q=80&w=2670&auto=format&fit=crop')"
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#022136]/90 to-[#022136]/60"></div>
              
              {/* Overlay text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <h3 className="text-2xl md:text-2xl font-bold text-white mb-2 leading-tight">
                    Transforme sol em economia
                  </h3>
                  <p className="text-lg md:text-lg text-[#ffbf06] font-semibold">
                    com a líder em energia solar do Centro-Oeste
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#ffbf06] py-4 px-6 rounded-t-xl mt-auto">
          <div className="flex flex-col space-y-4">
            
            {/* Guarantee seal */}
            <div className="flex justify-center">
              <div className="bg-[#022136] text-[#ffbf06] px-6 py-3 rounded-xl shadow-lg">
                <p className="text-sm font-bold uppercase tracking-wide">
                  GARANTIA DE ATÉ 25 ANOS
                </p>
              </div>
            </div>

            {/* Company info */}
            <div className="text-[#022136] text-xs space-y-1 text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="font-semibold">Telefone:</span>
                <span>{companyData.phone}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-semibold">Endereço:</span>
                <span>{companyData.address}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
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