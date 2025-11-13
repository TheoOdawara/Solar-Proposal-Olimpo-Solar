import React from 'react';
import { MapPin, Home, Phone } from 'lucide-react';

// Importar tipos e utilitários centralizados
import type { ProposalCoverPageProps } from '@/types/proposal';
import { COMPANY_DATA } from '@/constants/solarData';
import { LogoOlimpo } from './LogoOlimpo';

const ProposalCoverPage: React.FC<ProposalCoverPageProps> = ({
  formData,
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
        
        {/* Header with logo - NOVO PADRÃO */}
        <div className="flex justify-center mb-6">
          <LogoOlimpo className="h-32 w-auto" variant="1" />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-between max-w-full mx-auto w-full">
          
          {/* Title section */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight leading-tight">
              Proposta Comercial
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-[#ffbf06] mb-3 tracking-tight leading-tight">
              Personalizada
            </h2>
            <p className="text-lg text-white/80 font-light">
              Projeto de Energia Solar
            </p>
          </div>

          {/* Client Info Block - NOVO LAYOUT */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-4 border border-white/20">
            <h3 className="text-[#ffbf06] text-lg font-bold mb-4 uppercase tracking-wide">Dados do Cliente</h3>
            <div className="space-y-3">
              {/* Nome Cliente */}
              <div className="flex items-start space-x-3">
                <Home className="h-5 w-5 text-[#ffbf06] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Cliente</p>
                  <p className="text-white text-base font-semibold leading-tight">{formData.clientName}</p>
                </div>
              </div>

              {/* Endereço Completo */}
              {(formData.address || formData.number) && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-[#ffbf06] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Endereço</p>
                    <p className="text-white text-base font-semibold leading-tight">
                      {[formData.address, formData.number].filter(Boolean).join(', ')}
                    </p>
                    {(formData.neighborhood || formData.city) && (
                      <p className="text-white/80 text-sm leading-tight mt-0.5">
                        {[formData.neighborhood, formData.city].filter(Boolean).join(' - ')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Telefone */}
              {formData.phone && (
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-[#ffbf06] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Telefone</p>
                    <p className="text-white text-base font-semibold leading-tight">{formData.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications Block - NOVO LAYOUT */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-4 border border-white/20">
            <h3 className="text-[#ffbf06] text-lg font-bold mb-4 uppercase tracking-wide">Especificações Técnicas</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {/* Potência do Sistema */}
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Potência do Sistema</p>
                <p className="text-white text-base font-semibold">{formData.systemPower} kWp</p>
              </div>

              {/* Quantidade de Módulos */}
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Qtd. Módulos</p>
                <p className="text-white text-base font-semibold">{formData.moduleQuantity} un</p>
              </div>

              {/* Potência dos Módulos */}
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Potência Módulos</p>
                <p className="text-white text-base font-semibold">{formData.modulePower} W</p>
              </div>

              {/* Marca dos Módulos */}
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Marca Módulos</p>
                <p className="text-white text-base font-semibold">{formData.moduleBrand}</p>
              </div>

              {/* Marca do Inversor */}
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Marca Inversor</p>
                <p className="text-white text-base font-semibold">{formData.inverterBrand}</p>
              </div>

              {/* Potência do Inversor */}
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Potência Inversor</p>
                <p className="text-white text-base font-semibold">{formData.inverterPower} kW</p>
              </div>
            </div>
          </div>

          {/* Hero image with overlay text */}
          <div className="relative rounded-xl overflow-hidden mb-4">
            <div 
              className="h-40 bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?q=80&w=2670&auto=format&fit=crop')"
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#022136]/90 to-[#022136]/60"></div>
              
              {/* Overlay text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
                    Transforme sol em economia
                  </h3>
                  <p className="text-base md:text-lg text-[#ffbf06] font-semibold">
                    com a líder em energia solar do Centro-Oeste
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#ffbf06] py-3 px-6 rounded-t-xl mt-auto">
          <div className="flex flex-col space-y-3">
            
            {/* Guarantee seal */}
            <div className="flex justify-center">
              <div className="bg-[#022136] text-[#ffbf06] px-5 py-2 rounded-xl shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wide">
                  GARANTIA DE ATÉ 25 ANOS
                </p>
              </div>
            </div>

            {/* Company info */}
            <div className="text-[#022136] text-[10px] space-y-0.5 text-center leading-tight">
              <div className="flex items-center justify-center space-x-1.5">
                <span className="font-semibold">Telefone:</span>
                <span>{companyData.phone}</span>
              </div>
              <div className="flex items-center justify-center space-x-1.5">
                <span className="font-semibold">Endereço:</span>
                <span>{companyData.address}</span>
              </div>
              <div className="flex items-center justify-center space-x-1.5">
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