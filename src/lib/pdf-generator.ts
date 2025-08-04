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
  const footerHeight = 25;
  const usableHeight = pageHeight - margin - footerHeight;

  // Consistent spacing system
  const SPACING = {
    TINY: 3,
    SMALL: 5,
    MEDIUM: 8,
    LARGE: 12,
    SECTION: 18,
    PAGE_TITLE: 20
  };

  // Font sizes
  const FONT_SIZES = {
    TITLE: 20,
    SUBTITLE: 16,
    SECTION_HEADER: 14,
    BODY: 12,
    FOOTER: 10
  };

  let currentY = margin;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Intelligent page break control
  const checkPageBreak = (requiredHeight: number): boolean => {
    if (currentY + requiredHeight > usableHeight) {
      addFooter();
      pdf.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // Add text with automatic page break and spacing optimization
  const addText = (
    text: string, 
    fontSize: number = FONT_SIZES.BODY, 
    fontStyle: string = 'normal', 
    align: 'left' | 'center' | 'right' = 'left',
    spacing: keyof typeof SPACING = 'SMALL'
  ) => {
    const lineHeight = fontSize * 1.15; // Optimized line height
    checkPageBreak(lineHeight + SPACING[spacing]);
    
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    
    if (align === 'center') {
      pdf.text(text, pageWidth / 2, currentY, { align: 'center' });
    } else if (align === 'right') {
      pdf.text(text, pageWidth - margin, currentY, { align: 'right' });
    } else {
      pdf.text(text, margin, currentY);
    }
    
    currentY += lineHeight + SPACING[spacing];
  };

  // Add multiline text with intelligent wrapping and page breaks
  const addMultilineText = (
    text: string, 
    fontSize: number = FONT_SIZES.BODY,
    spacing: keyof typeof SPACING = 'SMALL'
  ) => {
    if (!text || !text.trim()) return;
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 1.15;
    
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');
    
    lines.forEach((line: string, index: number) => {
      checkPageBreak(lineHeight + (index === lines.length - 1 ? SPACING[spacing] : 0));
      pdf.text(line, margin, currentY);
      currentY += lineHeight;
    });
    
    currentY += SPACING[spacing];
  };

  // Add section with optimized spacing
  const addSection = (title: string, spacing: keyof typeof SPACING = 'SECTION') => {
    currentY += SPACING[spacing];
    addText(title, FONT_SIZES.SECTION_HEADER, 'bold', 'left', 'MEDIUM');
  };

  // Add list items with consistent formatting
  const addListItem = (text: string, spacing: keyof typeof SPACING = 'TINY') => {
    addText(text, FONT_SIZES.BODY, 'normal', 'left', spacing);
  };

  // Dynamic footer
  const addFooter = () => {
    const footerY = pageHeight - 15;
    pdf.setFontSize(FONT_SIZES.FOOTER);
    pdf.setFont('helvetica', 'bold');
    pdf.text("OLIMPO SOLAR", pageWidth / 2, footerY, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.text("Energia Solar Fotovoltaica", pageWidth / 2, footerY + 5, { align: 'center' });
  };

  // Page 1 - Cover Page (Optimized Layout)
  currentY = margin + SPACING.PAGE_TITLE;
  
  addText("PROPOSTA COMERCIAL", FONT_SIZES.TITLE, 'bold', 'center', 'MEDIUM');
  addText("SISTEMA SOLAR FOTOVOLTAICO", FONT_SIZES.SUBTITLE, 'normal', 'center', 'SECTION');
  
  // Client Information
  addText(`Cliente: ${formData.clientName}`, FONT_SIZES.SUBTITLE, 'normal', 'left', 'MEDIUM');
  addText(`${formData.address}, ${formData.number}`, FONT_SIZES.BODY, 'normal', 'left', 'TINY');
  addText(`${formData.neighborhood} - ${formData.city}`, FONT_SIZES.BODY, 'normal', 'left', 'TINY');
  addText(`Telefone: ${formData.phone}`, FONT_SIZES.BODY, 'normal', 'left', 'MEDIUM');
  
  // System Specifications
  addSection("ESPECIFICAÇÕES DO SISTEMA");
  
  const specifications = [
    `Potência do Sistema: ${formData.systemPower} kWp`,
    `Quantidade de Módulos: ${formData.moduleQuantity} unidades`,
    `Potência dos Módulos: ${formData.modulePower} W`,
    `Marca dos Módulos: ${formData.moduleBrand}`,
    `Marca do Inversor: ${formData.inverterBrand}`,
    `Potência do Inversor: ${formData.inverterPower} W`
  ];
  
  specifications.forEach(spec => addListItem(spec));

  addFooter();

  // Page 2 - Financial Analysis (Optimized Layout)
  pdf.addPage();
  currentY = margin + SPACING.PAGE_TITLE;
  
  addText("ANÁLISE FINANCEIRA", FONT_SIZES.TITLE, 'bold', 'center', 'SECTION');
  
  // Generation and Savings
  addSection("GERAÇÃO E ECONOMIA", 'MEDIUM');
  
  const financialData = [
    `Geração Mensal Estimada: ${calculations.monthlyGeneration.toFixed(0)} kWh`,
    `Economia Mensal: ${formatCurrency(calculations.monthlySavings)}`,
    `Economia Anual: ${formatCurrency(calculations.monthlySavings * 12)}`
  ];
  
  financialData.forEach(data => addListItem(data));
  
  // Investment
  addSection("INVESTIMENTO", 'MEDIUM');
  
  const investmentData = [
    `Valor Total do Sistema: ${formatCurrency(calculations.totalValue)}`,
    `Forma de Pagamento: ${formData.paymentMethod}`,
    `Área Necessária: ${calculations.requiredArea.toFixed(0)} m²`
  ];
  
  investmentData.forEach(data => addListItem(data));

  addFooter();

  // Page 3 - Benefits and Observations (Optimized Layout)
  pdf.addPage();
  currentY = margin + SPACING.PAGE_TITLE;
  
  addText("BENEFÍCIOS DO SISTEMA SOLAR", FONT_SIZES.TITLE, 'bold', 'center', 'SECTION');
  
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
  
  benefits.forEach(benefit => addListItem(benefit));
  
  // Observations (with intelligent text handling)
  if (formData.observations && formData.observations.trim()) {
    addSection("OBSERVAÇÕES:", 'MEDIUM');
    addMultilineText(formData.observations, FONT_SIZES.BODY, 'SMALL');
  }

  addFooter();
  
  // Page 4 - Terms and Conditions (Optimized Layout)
  pdf.addPage();
  currentY = margin + SPACING.PAGE_TITLE;
  
  addText("TERMOS E CONDIÇÕES", FONT_SIZES.TITLE, 'bold', 'center', 'SECTION');
  
  const terms = [
    "• Proposta válida por 30 dias",
    "• Valores sujeitos a alteração sem aviso prévio",
    "• Instalação conforme normas técnicas vigentes",
    "• Garantia de funcionamento conforme especificações",
    "• Suporte técnico especializado",
    "• Acompanhamento do processo de homologação junto à concessionária"
  ];
  
  terms.forEach(term => addListItem(term));

  addFooter();
  
  // Save the PDF
  pdf.save("proposta-olimpo-solar.pdf");
};