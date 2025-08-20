import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileDown, MapPin, Calendar, Zap, CheckCircle, Star, Globe, Shield, Wrench, Clock, Battery, BarChart3, TrendingUp, Lightbulb, DollarSign, Home, Leaf, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import olimpoLogo from "/lovable-uploads/568489ba-4d5c-47e2-a032-5a3030b5507b.png";
import ProposalCoverPage from "./ProposalCoverPage";
import Footer from "./Footer";

// Importar tipos e utilitários centralizados
import type { FormData, Calculations, ProposalPreviewProps } from '@/types/proposal';
import { formatCurrency, formatDateShort } from '@/utils/formatters';
import { calculateEconomyData, calculateRealMetrics, calculateSolarROI } from '@/utils/calculations';
import { CONNECTION_TYPES, COMPANY_DATA } from '@/constants/solarData';

const ProposalPreview: React.FC<ProposalPreviewProps> = ({
  formData,
  calculations,
  onEdit,
  onGeneratePDF
}) => {
  const calculateYearlySavings = () => calculations.monthlySavings * 12;
  const calculateCurrentBill = () => calculations.monthlySavings;

  // Usar utilitários centralizados para cálculos
  const economyData = calculateEconomyData({
    averageBill: formData.averageBill || 500,
    connectionType: (formData.connectionType as keyof typeof CONNECTION_TYPES) || 'bifasico'
  });

  const metricas = calculateRealMetrics(formData);
  const solarROI = calculateSolarROI(calculations.monthlySavings, calculations.totalValue);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navegação */}
      <div data-hide-in-pdf className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-white/20 shadow-lg z-10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button onClick={onEdit} variant="outline" className="gap-2 border-[#022136]/20 text-[#022136] hover:bg-[#022136] hover:text-white transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
            Editar Dados
          </Button>
          <Button onClick={onGeneratePDF} className="gap-2 bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 text-[#022136] hover:from-[#ffbf06]/90 hover:to-[#ffbf06]/70 shadow-lg transition-all duration-300">
            <FileDown className="h-4 w-4" />
            Gerar PDF
          </Button>
        </div>
      </div>

      {/* Conteúdo da Proposta */}
      <div id="pdf-content" className="w-full bg-gradient-to-b from-white to-slate-50 print-optimized shadow-inner">
        
        {/* PÁGINA 1: NOVA CAPA PERSONALIZADA */}
        <ProposalCoverPage formData={formData} calculations={calculations} />
        
        {/* PÁGINA 2: QUEM SOMOS */}
        <section className="a4-page page-break overflow-hidden h-full flex flex-col" style={{ padding: 0, margin: '20px auto' }}>
          <div className="flex-1 w-full">
            <img src="/lovable-uploads/cf2959e7-1b60-4018-ade3-b147470bd528.png" alt="Quem Somos - Olimpo Solar" className="w-full h-full object-fill block" loading="lazy" />
          </div>
          {/* Barra da Empresa - Nova imagem no final da página */}
          <div className="w-full flex-shrink-0">
            <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
          </div>
        </section>

        {/* PÁGINA 3: COMO FUNCIONA */}
        <section className="a4-page page-break overflow-hidden h-full flex flex-col" style={{ padding: 0, margin: '20px auto' }}>
          <div className="flex-1 w-full">
            <img src="/lovable-uploads/5933017d-541e-420f-81e2-4b202e099c8a.png" alt="Como Funciona a Energia Solar" className="w-full h-full object-fill block" loading="lazy" />
          </div>
          {/* Barra da Empresa - Nova imagem no final da página */}
          <div className="w-full flex-shrink-0">
            <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
          </div>
        </section>

        {/* PÁGINA 4: BENEFÍCIOS */}
        <section className="a4-page page-break overflow-hidden h-full flex flex-col" style={{ padding: 0, margin: '20px auto' }}>
          <div className="flex-1 w-full">
            <img src="/lovable-uploads/ceca57ec-051c-443f-b209-5313002bb56c.png" alt="Benefícios da Energia Solar" className="w-full h-full object-fill block" loading="lazy" />
          </div>
          {/* Barra da Empresa - Nova imagem no final da página */}
          <div className="w-full flex-shrink-0">
            <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
          </div>
        </section>

        {/* PÁGINA 5: NOSSOS PROJETOS */}
        <section className="a4-page page-break overflow-hidden h-full flex flex-col" style={{ padding: 0, margin: '20px auto' }}>
          <div className="flex-1 w-full flex flex-col">
            {/* Logo no canto superior direito - igual à Página 2 */}
            <div className="absolute top-6 right-6 z-10">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-16 w-auto" />
            </div>

            {/* Título - com mais espaçamento para ficar harmonioso */}
            <div className="pt-12 pb-6 px-8">
              <h2 className="text-4xl font-bold text-slate-800 text-center">
                Nossos Projetos:
              </h2>
            </div>

            {/* Projects Grid - Expandido até as margens laterais */}
            <div className="flex-1 pb-6">
              <img src="/lovable-uploads/5839951b-6ca3-4221-b6f5-945748cf80a3.png" alt="Grid de projetos da Olimpo Solar" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
          {/* Barra da Empresa - Nova imagem no final da página */}
          <div className="w-full flex-shrink-0">
            <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
          </div>
        </section>

         {/* PÁGINA 6: SUA ECONOMIA */}
         {economyData && <section className="a4-page page-break flex flex-col" style={{

        backgroundColor: '#022136',
        padding: 0,
        margin: '20px auto'
      }}>
        <div className="relative flex-1 w-full flex flex-col px-6 py-10">

          {/* Logo no canto superior direito */}
          <div className="w-full flex justify-end pt-10 pb-8">
            <img src={olimpoLogo} alt="Olimpo Solar" className="h-[120px] w-auto" />
          </div>

          {/* Conteúdo centralizado e espaçado */}
          <div className="flex-1 flex flex-col justify-start items-center">
            {/* Título */}
            <h2 className="text-4xl font-bold text-center mb-10 tracking-tight" style={{ color: '#fff' }}>
              SUA <span style={{ color: '#ffbf06' }}>ECONOMIA</span>
            </h2>

            {/* Blocos lado a lado */}
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 w-full max-w-3xl mb-10">
              {/* Sem energia solar */}
              <div className="flex-1 bg-[#01182b]/80 rounded-xl p-6 flex flex-col items-center shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-white">Sem energia solar</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-3xl font-bold" style={{ color: '#ffbf06' }}>{formatCurrency(economyData.currentBillPerYear)}</div>
                    <div className="text-lg text-white">/ ano</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: '#ffbf06' }}>{formatCurrency(economyData.currentBillPerMonth)}</div>
                    <div className="text-base text-white">/ mês</div>
                  </div>
                </div>
              </div>

              {/* Com energia solar */}
              <div className="flex-1 bg-[#01182b]/80 rounded-xl p-6 flex flex-col items-center shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-white">Com energia solar</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-3xl font-bold" style={{ color: '#ffbf06' }}>{formatCurrency(economyData.billWithSolarPerYear)}</div>
                    <div className="text-lg text-white">/ ano</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: '#ffbf06' }}>{formatCurrency(economyData.billWithSolarPerMonth)}</div>
                    <div className="text-base text-white">/ mês</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Economia destacada */}
            <div className="w-full max-w-2xl bg-gradient-to-r from-[#ffbf06]/90 to-[#ffbf06]/70 rounded-xl p-8 flex flex-col items-center shadow-xl border border-[#ffbf06]/30 mb-8">
              <h3 className="text-xl font-bold mb-4 text-[#022136]">Sua economia será de:</h3>
              <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-[#022136]">{formatCurrency(economyData.savingsPerYear)}</div>
                  <div className="text-lg text-[#022136]">/ ano</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-[#022136]">{formatCurrency(economyData.savingsPerMonth)}</div>
                  <div className="text-base text-[#022136]">/ mês</div>
                </div>
              </div>
            </div>
          </div>
        </div>

            {/* Barra da Empresa - Nova imagem no final da página */}
            <div className="w-full flex-shrink-0">
              <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
            </div>
          </section>}

         {/* PÁGINA 7: SEU RETORNO */}
         <section className="a4-page page-break flex flex-col" style={{
          background: '#022136', // Cor correta do fundo
          minHeight: '297mm',
          width: '210mm',
          padding: 0
        }}>
            <div className="flex-1 flex flex-col" style={{ padding: '8mm 15mm 15mm 15mm' }}>
              {/* Logo igual à página 6 */}
              <div className="w-full flex justify-end pt-2 pb-8">
                <img src={olimpoLogo} alt="Olimpo Solar" className="h-[120px] w-auto" />
              </div>

              {/* Conteúdo movido para cima */}
              <div className="flex-1 flex flex-col justify-center" style={{ marginTop: '-40px' }}>
               {/* GRÁFICO 1: SEU RETORNO - OTIMIZADO PARA A4 */}
               <div className="mb-4">
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
                      <h2 className="text-3xl font-bold text-center mb-3" style={{
                  color: '#ffffff'
                }}>
                        SEU <span style={{
                    color: '#ffbf06'
                  }}>RETORNO</span>
                      </h2>
                       <h3 className="text-lg text-center mb-4" style={{
                  color: '#ffffff'
                }}>
                         Retorno de investimento em {paybackYears} anos
                       </h3>
                      
                      <div className="bg-white rounded-lg p-4 mx-auto max-w-5xl">
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={returnData.filter((_, index) => index % 2 === 0 || index <= 10)} margin={{
                        top: 15,
                        right: 20,
                        left: 15,
                        bottom: 15
                      }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="year" axisLine={{
                          stroke: '#374151',
                          strokeWidth: 1
                        }} tickLine={{
                          stroke: '#374151'
                        }} tick={{
                          fill: '#374151',
                          fontSize: 9
                        }} angle={-45} textAnchor="end" height={40} />
                              <YAxis axisLine={{
                          stroke: '#374151',
                          strokeWidth: 1
                        }} tickLine={{
                          stroke: '#374151'
                        }} tick={{
                          fill: '#374151',
                          fontSize: 9
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

                        {/* Valores e informações compactas */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            <div className="text-center">
                              <div className="w-3 h-3 bg-red-500 rounded mx-auto mb-1"></div>
                              <p className="text-xs font-bold text-gray-800">Investimento</p>
                              <p className="text-sm font-bold text-red-600">{formatCurrency(investmentValue)}</p>
                              <p className="text-xs text-gray-500">Ano 0</p>
                            </div>
                            <div className="text-center">
                              <div className="w-3 h-3 bg-green-500 rounded mx-auto mb-1"></div>
                              <p className="text-xs font-bold text-gray-800">Payback</p>
                              <p className="text-sm font-bold text-blue-600">{paybackYears} anos</p>
                              <p className="text-xs text-gray-500">Retorno total</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-bold text-gray-800">Economia/Ano</p>
                              <p className="text-sm font-bold text-green-600">{formatCurrency(annualSavings)}</p>
                              <p className="text-xs text-gray-500">Anualmente</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-bold text-gray-800">Retorno 25 anos</p>
                              <p className="text-sm font-bold text-green-600">{formatCurrency(returnData[25]?.accumulated || 0)}</p>
                              <p className="text-xs font-semibold text-blue-600">{Math.round((returnData[25]?.accumulated || 0) / investmentValue * 100)}% retorno</p>
                            </div>
                          </div>
                          
                          {/* Resumo compacto */}
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-2 rounded-lg border-l-4 border-green-400">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-semibold text-gray-700">
                                  💡 Investimento se paga em {paybackYears} anos
                                </p>
                                <p className="text-xs text-gray-600">
                                  Após esse período, toda economia é lucro puro
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">Economia Total (25 anos)</p>
                                <p className="text-base font-bold text-green-600">
                                  {formatCurrency((returnData[25]?.accumulated || 0) + investmentValue)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>;
            })()}
              </div>
            </div>
          </div>

          {/* Barra da Empresa no rodapé */}
          <div className="w-full flex-shrink-0">
            <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
          </div>
        </section>

        {/* PÁGINA 8: SUA RENTABILIDADE */}
        <section className="a4-page page-break flex flex-col" style={{
          background: '#022136', // Cor correta do fundo
          minHeight: '297mm',
          width: '210mm',
          padding: 0
        }}>
          <div className="flex-1 flex flex-col" style={{ padding: '15mm' }}>
            {/* Logo igual à página 6 */}
            <div className="w-full flex justify-end pt-2 pb-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-20 w-auto" />
            </div>

            {/* Conteúdo centralizado */}
            <div className="flex-1 flex flex-col justify-center">
              {/* GRÁFICO 2: SUA RENTABILIDADE - OTIMIZADO PARA A4 */}
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-center mb-3" style={{
                  color: '#ffffff'
                }}>
                  SUA <span style={{
                    color: '#ffbf06'
                  }}>RENTABILIDADE</span>
                </h2>
                <h3 className="text-lg text-center mb-4" style={{
                  color: '#ffffff'
                }}>
                  Comparação de investimentos em 5 anos
                </h3>
                
                <div className="bg-white rounded-lg p-4 mx-auto max-w-5xl">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={(() => {
                          // Valores base seguros
                          const investmentBase = calculations.totalValue && calculations.totalValue > 0 ? calculations.totalValue : 50000;
                          const monthlyEconomy = calculations.monthlySavings && calculations.monthlySavings > 0 ? calculations.monthlySavings : Math.round(investmentBase * 0.015);
                          const annualSavings = monthlyEconomy * 12;
                          const fiveYearsSavings = annualSavings * 5;
                          
                          const poupancaValue = Math.round(investmentBase * 1.27);
                          const cdbValue = Math.round(investmentBase * 1.45);
                          const solarValue = Math.round(Math.max(investmentBase + fiveYearsSavings, investmentBase * 2));
                          
                          return [
                            { 
                              name: 'Poupança', 
                              value: poupancaValue,
                              percentage: '27%',
                              displayValue: `R$ ${(poupancaValue / 1000).toFixed(0)}k`
                            },
                            { 
                              name: 'CDB', 
                              value: cdbValue,
                              percentage: '45%',
                              displayValue: `R$ ${(cdbValue / 1000).toFixed(0)}k`
                            },
                            { 
                              name: 'Energia Solar', 
                              value: solarValue,
                              percentage: Math.round((solarValue / investmentBase - 1) * 100) + '%',
                              displayValue: `R$ ${(solarValue / 1000).toFixed(0)}k`
                            }
                          ];
                        })()}
                        margin={{ top: 15, right: 20, left: 15, bottom: 15 }}
                        barGap={30}
                      >
                        <defs>
                          <linearGradient id="poupancaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94a3b8" stopOpacity={1} />
                            <stop offset="100%" stopColor="#475569" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="cdbGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fb7185" stopOpacity={1} />
                            <stop offset="100%" stopColor="#e11d48" stopOpacity={1} />
                          </linearGradient>
                          <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                            <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        
                        <XAxis 
                          dataKey="name" 
                          axisLine={{ stroke: '#374151', strokeWidth: 1 }}
                          tickLine={{ stroke: '#374151' }}
                          tick={{ fill: '#374151', fontSize: 9 }}
                        />
                        
                        <YAxis 
                          axisLine={{ stroke: '#374151', strokeWidth: 1 }}
                          tickLine={{ stroke: '#374151' }}
                          tick={{ fill: '#374151', fontSize: 9 }}
                          tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                        />
                        
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #374151', 
                            borderRadius: '8px',
                            color: '#374151'
                          }}
                          formatter={(value, name, props) => [
                            formatCurrency(Number(value)), 
                            `Retorno: ${props.payload.percentage}`
                          ]}
                        />
                        
                        <Bar 
                          dataKey="value" 
                          radius={[2, 2, 0, 0]}
                        >
                          {(() => {
                            const colors = ['url(#poupancaGradient)', 'url(#cdbGradient)', 'url(#solarGradient)'];
                            return colors.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ));
                          })()}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Valores e porcentagens compactas */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200">
                    {(() => {
                      const investmentBase = calculations.totalValue && calculations.totalValue > 0 ? calculations.totalValue : 50000;
                      const monthlyEconomy = calculations.monthlySavings && calculations.monthlySavings > 0 ? calculations.monthlySavings : Math.round(investmentBase * 0.015);
                      const annualSavings = monthlyEconomy * 12;
                      const fiveYearsSavings = annualSavings * 5;
                      
                      const poupancaValue = Math.round(investmentBase * 1.27);
                      const cdbValue = Math.round(investmentBase * 1.45);
                      const solarValue = Math.round(Math.max(investmentBase + fiveYearsSavings, investmentBase * 2));
                      
                      const data = [
                        { 
                          name: 'Poupança', 
                          value: poupancaValue, 
                          percentage: '27%', 
                          color: 'from-slate-400 to-slate-600' 
                        },
                        { 
                          name: 'CDB', 
                          value: cdbValue, 
                          percentage: '45%', 
                          color: 'from-rose-400 to-rose-600' 
                        },
                        { 
                          name: 'Energia Solar', 
                          value: solarValue, 
                          percentage: Math.round((solarValue / investmentBase - 1) * 100) + '%', 
                          color: 'from-yellow-400 to-yellow-600' 
                        }
                      ];
                      
                      return data.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className={`w-3 h-3 bg-gradient-to-b ${item.color} rounded mx-auto mb-1`}></div>
                          <p className="text-xs font-bold text-gray-800">{item.name}</p>
                          <p className="text-sm font-bold text-green-600">{formatCurrency(item.value)}</p>
                          <p className="text-xs font-semibold text-blue-600">{item.percentage} retorno</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra da Empresa no rodapé */}
          <div className="w-full flex-shrink-0">
            <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
          </div>
        </section>

        {/* PÁGINA 9: RENTABILIDADE */}
        <section className="a4-page page-break flex flex-col" style={{
          backgroundColor: '#022136',
          minHeight: '297mm',
          width: '210mm',
          padding: 0
        }}>
          <div className="flex-1 flex flex-col" style={{ padding: '15mm' }}>
            {/* Logo igual às outras páginas */}
            <div className="w-full flex justify-end pt-2 pb-8">
              <img src={olimpoLogo} alt="Olimpo Solar" className="h-20 w-auto" />
            </div>

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
                <YAxis domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]} tickCount={8} axisLine={{
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
              </div>

            {/* Métricas no final da página */}
            <div className="mt-auto grid grid-cols-3 gap-6 text-center bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-[#022136]/10 shadow-xl">
              <div>
                <div className="font-bold text-3xl bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 bg-clip-text text-transparent">
                  {metricas.geracaoMedia.toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-[#022136]">
                  Geração média (kWh)
                </div>
              </div>
              <div>
                <div className="font-bold text-3xl text-slate-600">
                  {metricas.consumoMedio.toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-[#022136]">
                  Consumo médio (kWh)
                </div>
              </div>
              <div>
                <div className="font-bold text-3xl text-green-600">
                  {metricas.economia}%
                </div>
                <div className="text-sm font-semibold text-[#022136]">
                  Economia mensal estimada
                </div>
              </div>
            </div>
          </div>
          

          {/* Barra da Empresa no rodapé */}
          <div className="w-full flex-shrink-0">
            <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
          </div>
        </section>

        {/* PÁGINA 9: SEU INVESTIMENTO - Baseado na imagem 9 */}
        <section className="a4-page bg-gradient-to-br from-[#ffbf06]/10 via-white to-slate-50 p-8 page-break">
          <div className="max-w-4xl mx-auto py-8 relative flex flex-col min-h-[297mm]">
            {/* Logo padronizado igual ao print fornecido (logo azul com fundo branco) */}
            <div className="w-full flex justify-end pt-2 pb-8">
              <img src="/lovable-uploads/LogoBranca.png" alt="Olimpo Solar" className="h-20 w-auto" />
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#022136] to-slate-700 bg-clip-text text-transparent mb-8 text-center">
              Seu investimento:
            </h2>

            {/* Investment Value - Valor em destaque amarelo */}
            <div className="bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/90 py-6 px-12 rounded-xl mb-8 text-center shadow-xl border border-[#ffbf06]/30">
              <div className="text-4xl font-bold text-[#022136]">
                {formatCurrency(calculations.totalValue)}
              </div>
            </div>

            {/* Financing Table - Exatamente como na imagem */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden mb-8 border border-[#022136]/10">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#022136] to-slate-700 text-white">
                    <th className="py-4 px-6 text-left font-bold">Descrição</th>
                    <th className="py-4 px-6 text-center font-bold">Qtd Meses</th>
                    <th className="py-4 px-6 text-center font-bold">Parcela</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 border-b border-[#ffbf06]/30">
                    <td className="py-3 px-6 font-bold text-[#022136]">Cartão de crédito</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">18 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">{formatCurrency(calculations.totalValue / 18)}</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 border-b border-[#ffbf06]/30">
                    <td className="py-3 px-6 font-bold text-[#022136]">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">24 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">{formatCurrency(calculations.totalValue / 24)}</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 border-b border-[#ffbf06]/30">
                    <td className="py-3 px-6 font-bold text-[#022136]">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">36 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">{formatCurrency(calculations.totalValue / 36)}</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 border-b border-[#ffbf06]/30">
                    <td className="py-3 px-6 font-bold text-[#022136]">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">48 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">{formatCurrency(calculations.totalValue / 48)}</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 border-b border-[#ffbf06]/30">
                    <td className="py-3 px-6 font-bold text-[#022136]">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">64 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">{formatCurrency(calculations.totalValue / 64)}</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 border-b border-[#ffbf06]/30">
                    <td className="py-3 px-6 font-bold text-[#022136]">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">72 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">{formatCurrency(calculations.totalValue / 72)}</td>
                  </tr>
                  <tr className="bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80">
                    <td className="py-3 px-6 font-bold text-[#022136]">Sol agora</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">84 meses</td>
                    <td className="py-3 px-6 text-center font-bold text-[#022136]">{formatCurrency(calculations.totalValue / 84)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Texto explicativo */}
            <div className="text-center text-sm text-slate-600 mb-8">
              <p className="font-medium">Simulação sujeita a análise de crédito de acordo com a instituição financeira selecionada.</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-[#022136]/10 p-6 rounded-xl mb-8 text-sm text-slate-700 leading-relaxed shadow-lg">
              <p>
                Para dimensionar e precificar adequadamente o seu projeto, nossa visita técnica é essencial. A inclinação e a 
                face do telhado podem impactar a geração de energia do sistema fotovoltaico. Durante a visita, também 
                iremos analisar as condições da estrutura física e elétrica. Pode ser necessário realizar ajustes para garantir sua 
                segurança e a correta homologação do sistema com a Concessionária de Energia.
              </p>
            </div>

            {/* Barra da Empresa padronizada no rodapé */}
            <div className="w-full flex-shrink-0">
              <img src="/lovable-uploads/BarraEmpresa.png" alt="Barra Empresa" className="w-full h-auto object-contain block" loading="lazy" />
            </div>
          </div>
        </section>

        {/* PÁGINA 10: TERMO DE COMPROMISSO - Baseado na imagem 10 */}
        <section className="a4-page bg-gradient-to-br from-[#ffbf06]/20 via-white to-slate-50 p-8 page-break">
          <div className="max-w-4xl mx-auto py-8">
            
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#022136] to-slate-700 bg-clip-text text-transparent mb-12 leading-tight">
              Termo de<br />
              compromisso:
            </h2>

            <div className="space-y-6 text-base text-slate-800 leading-relaxed mb-12">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="text-center">
                <div className="border-b-4 border-slate-800 pb-4 mb-6 min-h-[80px]">
                  {/* Espaço para assinatura */}
                </div>
                <p className="font-bold italic text-xl text-slate-800">Contratante</p>
                <div className="mt-4">
                  <p className="font-semibold text-slate-800">{formData.clientName}</p>
                  <p className="text-slate-700 text-sm">{formData.address}, {formData.number}</p>
                  <p className="text-slate-700 text-sm">{formData.neighborhood} - {formData.city}</p>
                  <p className="text-slate-700 text-sm">Data: {formatDateShort()}</p>
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

            {/* Separador de Card - Footer padrão da marca */}
            <div className="bg-[#2c3e50] rounded-xl py-4 px-6 w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-6 text-white text-sm">
                  <span className="flex items-center whitespace-nowrap">
                    <span className="w-5 h-5 bg-[#ffbf06] rounded-full flex items-center justify-center mr-2 text-xs">📞</span>
                    <span>(67) 99668-0242</span>
                  </span>
                  <span className="flex items-center whitespace-nowrap">
                    <span className="w-5 h-5 bg-[#ffbf06] rounded-full flex items-center justify-center mr-2 text-xs">@</span>
                    <span>olimpo.energiasolar</span>
                  </span>
                  <span className="flex items-center whitespace-nowrap">
                    <span className="w-5 h-5 bg-[#ffbf06] rounded-full flex items-center justify-center mr-2 text-xs">✉</span>
                    <span>adm.olimposolar@gmail.com</span>
                  </span>
                  <span className="flex items-center whitespace-nowrap">
                    <span className="w-5 h-5 bg-[#ffbf06] rounded-full flex items-center justify-center mr-2 text-xs">📍</span>
                    <span>R. Eduardo Santos Pereira, 1831 - Centro, Campo Grande</span>
                  </span>
                </div>
                <div className="w-20 h-16 bg-white rounded-lg flex items-center justify-center p-1 ml-6 flex-shrink-0">
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    QR Code
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Botões Fixos no Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-white/20 md:hidden shadow-lg">
        <div className="flex gap-2">
          <Button onClick={onEdit} variant="outline" className="flex-1 gap-2 border-[#022136]/20 text-[#022136] hover:bg-[#022136] hover:text-white transition-all duration-300">
            <ArrowLeft className="h-4 w-4" />
            Editar
          </Button>
          <Button onClick={onGeneratePDF} className="flex-1 gap-2 bg-gradient-to-r from-[#ffbf06] to-[#ffbf06]/80 text-[#022136] hover:from-[#ffbf06]/90 hover:to-[#ffbf06]/70 shadow-lg transition-all duration-300">
            <FileDown className="h-4 w-4" />
            Gerar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProposalPreview;