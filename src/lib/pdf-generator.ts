import jsPDF from 'jspdf';

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

export const generateProposalPDF = async (formData: FormData, calculations: Calculations) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Page 1 - Cover
  let y = 40;
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text("PROPOSTA COMERCIAL", pageWidth / 2, y, { align: 'center' });
  
  y += 20;
  pdf.setFontSize(20);
  pdf.text("SISTEMA SOLAR FOTOVOLTAICO", pageWidth / 2, y, { align: 'center' });
  
  y += 40;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Cliente: ${formData.clientName}`, margin, y);
  
  y += 20;
  pdf.text(`Endereço: ${formData.address}, ${formData.number}`, margin, y);
  
  y += 10;
  pdf.text(`${formData.neighborhood} - ${formData.city}`, margin, y);
  
  y += 10;
  pdf.text(`Telefone: ${formData.phone}`, margin, y);
  
  y += 40;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text("ESPECIFICAÇÕES DO SISTEMA", margin, y);
  
  y += 20;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Potência do Sistema: ${formData.systemPower} kWp`, margin, y);
  
  y += 10;
  pdf.text(`Quantidade de Módulos: ${formData.moduleQuantity} unidades`, margin, y);
  
  y += 10;
  pdf.text(`Potência dos Módulos: ${formData.modulePower} W`, margin, y);
  
  y += 10;
  pdf.text(`Marca dos Módulos: ${formData.moduleBrand}`, margin, y);
  
  y += 10;
  pdf.text(`Marca do Inversor: ${formData.inverterBrand}`, margin, y);
  
  y += 10;
  pdf.text(`Potência do Inversor: ${formData.inverterPower} W`, margin, y);

  // Page 2 - Financial Details
  pdf.addPage();
  y = 40;
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text("ANÁLISE FINANCEIRA", pageWidth / 2, y, { align: 'center' });
  
  y += 30;
  pdf.setFontSize(14);
  pdf.text("GERAÇÃO E ECONOMIA", margin, y);
  
  y += 20;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Geração Mensal Estimada: ${calculations.monthlyGeneration.toFixed(0)} kWh`, margin, y);
  
  y += 10;
  pdf.text(`Economia Mensal: ${formatCurrency(calculations.monthlySavings)}`, margin, y);
  
  y += 10;
  pdf.text(`Economia Anual: ${formatCurrency(calculations.monthlySavings * 12)}`, margin, y);
  
  y += 30;
  pdf.setFont('helvetica', 'bold');
  pdf.text("INVESTIMENTO", margin, y);
  
  y += 20;
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Valor Total do Sistema: ${formatCurrency(calculations.totalValue)}`, margin, y);
  
  y += 10;
  pdf.text(`Forma de Pagamento: ${formData.paymentMethod}`, margin, y);
  
  y += 20;
  pdf.text(`Área Necessária: ${calculations.requiredArea.toFixed(0)} m²`, margin, y);

  // Page 3 - Benefits and Observations
  pdf.addPage();
  y = 40;
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text("BENEFÍCIOS DO SISTEMA SOLAR", pageWidth / 2, y, { align: 'center' });
  
  y += 30;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const benefits = [
    "• Redução significativa na conta de energia elétrica",
    "• Retorno do investimento em médio prazo",
    "• Valorização do imóvel",
    "• Contribuição para o meio ambiente",
    "• Energia limpa e renovável",
    "• Sistema de compensação de energia elétrica",
    "• Garantia de 25 anos nos módulos fotovoltaicos",
    "• Baixa manutenção"
  ];
  
  benefits.forEach(benefit => {
    pdf.text(benefit, margin, y);
    y += 8;
  });
  
  if (formData.observations && formData.observations.trim()) {
    y += 20;
    pdf.setFont('helvetica', 'bold');
    pdf.text("OBSERVAÇÕES:", margin, y);
    
    y += 15;
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(formData.observations, maxWidth);
    pdf.text(lines, margin, y);
  }
  
  // Page 4 - Terms and Conditions
  pdf.addPage();
  y = 40;
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text("TERMOS E CONDIÇÕES", pageWidth / 2, y, { align: 'center' });
  
  y += 30;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  const terms = [
    "• Proposta válida por 30 dias",
    "• Valores sujeitos a alteração sem aviso prévio",
    "• Instalação conforme normas técnicas vigentes",
    "• Garantia de funcionamento conforme especificações",
    "• Suporte técnico especializado",
    "• Acompanhamento do processo de homologação junto à concessionária"
  ];
  
  terms.forEach(term => {
    pdf.text(term, margin, y);
    y += 8;
  });
  
  // Footer with company info
  y = pageHeight - 40;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text("OLIMPO SOLAR", pageWidth / 2, y, { align: 'center' });
  
  y += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text("Energia Solar Fotovoltaica", pageWidth / 2, y, { align: 'center' });
  
  // Save the PDF
  pdf.save("proposta-olimpo-solar.pdf");
};