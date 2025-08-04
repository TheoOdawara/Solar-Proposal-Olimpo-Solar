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
  const footerHeight = 30;
  const usableHeight = pageHeight - margin - footerHeight;

  // Spacing constants for consistency
  const SPACING = {
    SMALL: 6,
    MEDIUM: 10,
    LARGE: 15,
    SECTION: 25,
    TITLE: 30
  };

  let currentY = margin;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Check if content fits on current page, add new page if needed
  const checkPageBreak = (requiredHeight: number): number => {
    if (currentY + requiredHeight > usableHeight) {
      pdf.addPage();
      currentY = margin;
    }
    return currentY;
  };

  // Add text with automatic page break checking
  const addText = (text: string, x: number, fontSize: number = 12, fontStyle: string = 'normal', align: 'left' | 'center' | 'right' = 'left') => {
    const lineHeight = fontSize * 1.2;
    currentY = checkPageBreak(lineHeight);
    
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    
    if (align === 'center') {
      pdf.text(text, pageWidth / 2, currentY, { align: 'center' });
    } else if (align === 'right') {
      pdf.text(text, pageWidth - margin, currentY, { align: 'right' });
    } else {
      pdf.text(text, x, currentY);
    }
    
    currentY += lineHeight;
  };

  // Add multiline text with page break handling
  const addMultilineText = (text: string, x: number, fontSize: number = 12) => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    
    currentY = checkPageBreak(totalHeight);
    
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');
    pdf.text(lines, x, currentY);
    
    currentY += totalHeight;
  };

  // Add spacing
  const addSpacing = (type: keyof typeof SPACING) => {
    currentY += SPACING[type];
  };

  // Add footer to current page
  const addFooter = () => {
    const footerY = pageHeight - 20;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text("OLIMPO SOLAR", pageWidth / 2, footerY, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.text("Energia Solar Fotovoltaica", pageWidth / 2, footerY + 6, { align: 'center' });
  };

  // Page 1 - Cover
  currentY = margin + SPACING.LARGE;
  addText("PROPOSTA COMERCIAL", 0, 24, 'bold', 'center');
  addSpacing('MEDIUM');
  addText("SISTEMA SOLAR FOTOVOLTAICO", 0, 20, 'normal', 'center');
  
  addSpacing('SECTION');
  addText(`Cliente: ${formData.clientName}`, margin, 16);
  addSpacing('MEDIUM');
  addText(`Endereço: ${formData.address}, ${formData.number}`, margin, 12);
  addSpacing('SMALL');
  addText(`${formData.neighborhood} - ${formData.city}`, margin, 12);
  addSpacing('SMALL');
  addText(`Telefone: ${formData.phone}`, margin, 12);
  
  addSpacing('SECTION');
  addText("ESPECIFICAÇÕES DO SISTEMA", margin, 14, 'bold');
  addSpacing('LARGE');
  
  addText(`Potência do Sistema: ${formData.systemPower} kWp`, margin, 12);
  addSpacing('SMALL');
  addText(`Quantidade de Módulos: ${formData.moduleQuantity} unidades`, margin, 12);
  addSpacing('SMALL');
  addText(`Potência dos Módulos: ${formData.modulePower} W`, margin, 12);
  addSpacing('SMALL');
  addText(`Marca dos Módulos: ${formData.moduleBrand}`, margin, 12);
  addSpacing('SMALL');
  addText(`Marca do Inversor: ${formData.inverterBrand}`, margin, 12);
  addSpacing('SMALL');
  addText(`Potência do Inversor: ${formData.inverterPower} W`, margin, 12);

  addFooter();

  // Page 2 - Financial Details
  pdf.addPage();
  currentY = margin + SPACING.LARGE;
  
  addText("ANÁLISE FINANCEIRA", 0, 18, 'bold', 'center');
  addSpacing('TITLE');
  
  addText("GERAÇÃO E ECONOMIA", margin, 14, 'bold');
  addSpacing('LARGE');
  
  addText(`Geração Mensal Estimada: ${calculations.monthlyGeneration.toFixed(0)} kWh`, margin, 12);
  addSpacing('SMALL');
  addText(`Economia Mensal: ${formatCurrency(calculations.monthlySavings)}`, margin, 12);
  addSpacing('SMALL');
  addText(`Economia Anual: ${formatCurrency(calculations.monthlySavings * 12)}`, margin, 12);
  
  addSpacing('SECTION');
  addText("INVESTIMENTO", margin, 14, 'bold');
  addSpacing('LARGE');
  
  addText(`Valor Total do Sistema: ${formatCurrency(calculations.totalValue)}`, margin, 12);
  addSpacing('SMALL');
  addText(`Forma de Pagamento: ${formData.paymentMethod}`, margin, 12);
  addSpacing('MEDIUM');
  addText(`Área Necessária: ${calculations.requiredArea.toFixed(0)} m²`, margin, 12);

  addFooter();

  // Page 3 - Benefits and Observations
  pdf.addPage();
  currentY = margin + SPACING.LARGE;
  
  addText("BENEFÍCIOS DO SISTEMA SOLAR", 0, 18, 'bold', 'center');
  addSpacing('TITLE');
  
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
    addText(benefit, margin, 12);
  });
  
  if (formData.observations && formData.observations.trim()) {
    addSpacing('SECTION');
    addText("OBSERVAÇÕES:", margin, 12, 'bold');
    addSpacing('MEDIUM');
    addMultilineText(formData.observations, margin, 12);
  }

  addFooter();
  
  // Page 4 - Terms and Conditions
  pdf.addPage();
  currentY = margin + SPACING.LARGE;
  
  addText("TERMOS E CONDIÇÕES", 0, 18, 'bold', 'center');
  addSpacing('TITLE');
  
  const terms = [
    "• Proposta válida por 30 dias",
    "• Valores sujeitos a alteração sem aviso prévio",
    "• Instalação conforme normas técnicas vigentes",
    "• Garantia de funcionamento conforme especificações",
    "• Suporte técnico especializado",
    "• Acompanhamento do processo de homologação junto à concessionária"
  ];
  
  terms.forEach(term => {
    addText(term, margin, 12);
  });

  addFooter();
  
  // Save the PDF
  pdf.save("proposta-olimpo-solar.pdf");
};