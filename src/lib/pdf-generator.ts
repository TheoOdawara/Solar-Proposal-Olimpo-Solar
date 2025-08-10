import jsPDF from 'jspdf';
import logoUrl from '@/assets/olimpo-solar-logo.png';
import bgCover from '@/assets/bg-cover.jpg';
import bgSection from '@/assets/bg-section.jpg';

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

// Brand colors
const BRAND = {
  primary: { r: 2, g: 33, b: 54 }, // #022136
  accent: { r: 255, g: 191, b: 6 }, // #ffbf06
  text: { r: 2, g: 33, b: 54 },
  white: { r: 255, g: 255, b: 255 },
};

// Helpers to load images
const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });

export const generateProposalPDF = async (formData: FormData, calculations: Calculations) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 18;
  const footerHeight = 28;
  const usableHeight = pageHeight - margin - footerHeight;

  // Spacing scale
  const SPACING = {
    TINY: 3,
    SMALL: 5,
    MEDIUM: 8,
    LARGE: 12,
    SECTION: 16,
    PAGE_TITLE: 20,
  } as const;

  const FONT_SIZES = {
    TITLE: 20,
    SUBTITLE: 15,
    SECTION_HEADER: 13,
    BODY: 11,
    FOOTER: 9,
  } as const;

  let currentY = margin;

  const setColor = (c: { r: number; g: number; b: number }) => {
    pdf.setTextColor(c.r, c.g, c.b);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const isPresent = (v: unknown) => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    if (typeof v === 'number') return !isNaN(v) && v > 0;
    return true;
  };

  // Backgrounds and footer
  const drawFullBackground = (img: HTMLImageElement) => {
    pdf.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);
  };

  const addFooter = (logo?: HTMLImageElement) => {
    const footerY = pageHeight - 12;
    if (logo) {
      const logoW = 20;
      const logoH = (logo.height / logo.width) * logoW;
      pdf.addImage(logo, 'PNG', margin, footerY - logoH + 2, logoW, logoH);
    }

    setColor(BRAND.text);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(FONT_SIZES.FOOTER);

    const rightX = pageWidth - margin;
    const line1 = 'OLIMPO SOLAR';
    const line2 = 'Telefone: (67) 99668-0242  •  www.olimposolar.com.br';
    pdf.text(line1, rightX, footerY - 6, { align: 'right' });
    pdf.setFont('helvetica', 'normal');
    pdf.text(line2, rightX, footerY, { align: 'right' });
  };

  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > usableHeight) {
      // draw footer for the page before adding new one
      addFooter(logoImg || undefined);
      pdf.addPage();
      if (sectionBgImg) drawFullBackground(sectionBgImg);
      currentY = margin;
    }
  };

  const addText = (
    text: string,
    fontSize: number = FONT_SIZES.BODY,
    fontStyle: 'normal' | 'bold' = 'normal',
    align: 'left' | 'center' | 'right' = 'left',
    spacing: keyof typeof SPACING = 'SMALL',
    color: keyof typeof BRAND = 'text'
  ) => {
    if (!isPresent(text)) return;
    const lineHeight = fontSize * 1.15;
    checkPageBreak(lineHeight + SPACING[spacing]);

    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    setColor(BRAND[color]);

    if (align === 'center') pdf.text(text, pageWidth / 2, currentY, { align });
    else if (align === 'right') pdf.text(text, pageWidth - margin, currentY, { align });
    else pdf.text(text, margin, currentY);

    currentY += lineHeight + SPACING[spacing];
  };

  const addMultilineText = (
    text: string,
    fontSize: number = FONT_SIZES.BODY,
    spacing: keyof typeof SPACING = 'SMALL'
  ) => {
    if (!isPresent(text)) return;
    const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);
    const lineHeight = fontSize * 1.15;
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'normal');
    setColor(BRAND.text);

    lines.forEach((line, idx) => {
      checkPageBreak(lineHeight + (idx === lines.length - 1 ? SPACING[spacing] : 0));
      pdf.text(line, margin, currentY);
      currentY += lineHeight;
    });
    currentY += SPACING[spacing];
  };

  const addSection = (title: string) => {
    addText(title, FONT_SIZES.SECTION_HEADER, 'bold', 'left', 'MEDIUM', 'accent');
  };

  const addField = (label: string, value: string | number | undefined | null) => {
    if (!isPresent(value)) return false;
    const v = typeof value === 'number' ? String(value) : String(value);
    addText(`${label}: ${v}`, FONT_SIZES.BODY, 'normal', 'left', 'TINY', 'text');
    return true;
  };

  // Simple bar chart with placeholder when data is unavailable
  const drawBarChart = (
    data: { label: string; value: number; color?: { r: number; g: number; b: number } }[],
    opts?: { title?: string }
  ) => {
    const chartTop = currentY;
    const chartHeight = 60;
    const chartWidth = pageWidth - margin * 2;
    const barWidth = Math.max(20, (chartWidth - 40) / (data.length * 2));
    const baseY = chartTop + chartHeight;

    const allZero = data.every((d) => !isPresent(d.value));
    if (opts?.title) addText(opts.title, FONT_SIZES.SUBTITLE, 'bold', 'left', 'SMALL', 'accent');

    if (allZero) {
      // Placeholder box with message
      pdf.setDrawColor(BRAND.text.r, BRAND.text.g, BRAND.text.b);
      pdf.rect(margin, chartTop + 10, chartWidth, chartHeight, 'S');
      setColor(BRAND.text);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(FONT_SIZES.BODY);
      pdf.text('Dados não disponíveis', margin + chartWidth / 2, chartTop + 10 + chartHeight / 2, {
        align: 'center',
      });
      currentY = baseY + SPACING.MEDIUM;
      return;
    }

    const maxVal = Math.max(...data.map((d) => d.value || 0)) || 1;

    // Axes
    pdf.setDrawColor(BRAND.text.r, BRAND.text.g, BRAND.text.b);
    pdf.line(margin, baseY, margin + chartWidth, baseY);

    // Bars
    let x = margin + 20;
    data.forEach((d) => {
      const h = (d.value / maxVal) * (chartHeight - 10);
      const y = baseY - h;
      const color = d.color || BRAND.accent;
      pdf.setFillColor(color.r, color.g, color.b);
      pdf.rect(x, y, barWidth, h, 'F');
      // Label
      pdf.setFontSize(FONT_SIZES.FOOTER);
      setColor(BRAND.text);
      pdf.text(d.label, x + barWidth / 2, baseY + 5, { align: 'center' });
      x += barWidth * 2;
    });

    currentY = baseY + SPACING.SECTION;
  };

  // Preload images
  const [logoImg, coverBgImg, sectionBgImg] = await Promise.all([
    loadImage(logoUrl).catch(() => null),
    loadImage(bgCover).catch(() => null),
    loadImage(bgSection).catch(() => null),
  ]);

  // PAGE 1 - COVER
  if (coverBgImg) drawFullBackground(coverBgImg);
  currentY = margin + SPACING.PAGE_TITLE;
  addText('PROPOSTA COMERCIAL', FONT_SIZES.TITLE, 'bold', 'center', 'SMALL', 'accent');
  addText('SISTEMA SOLAR FOTOVOLTAICO', FONT_SIZES.SUBTITLE, 'normal', 'center', 'SECTION', 'text');

  // Cliente
  addField('Cliente', formData.clientName);
  const addressLine = [formData.address, formData.number].filter(isPresent).join(', ');
  addField('Endereço', addressLine);
  const cityLine = [formData.neighborhood, formData.city].filter(isPresent).join(' - ');
  addField('Cidade', cityLine);
  addField('Telefone', formData.phone);

  // Especificações
  addSection('ESPECIFICAÇÕES DO SISTEMA');
  const specItems: string[] = [];
  if (isPresent(formData.systemPower)) specItems.push(`Potência do Sistema: ${formData.systemPower} kWp`);
  if (isPresent(formData.moduleQuantity)) specItems.push(`Quantidade de Módulos: ${formData.moduleQuantity} unidades`);
  if (isPresent(formData.modulePower)) specItems.push(`Potência dos Módulos: ${formData.modulePower} W`);
  if (isPresent(formData.moduleBrand)) specItems.push(`Marca dos Módulos: ${formData.moduleBrand}`);
  if (isPresent(formData.inverterBrand)) specItems.push(`Marca do Inversor: ${formData.inverterBrand}`);
  if (isPresent(formData.inverterPower)) specItems.push(`Potência do Inversor: ${formData.inverterPower} W`);
  specItems.forEach((spec) => addText(spec));

  addFooter(logoImg || undefined);

  // PAGE 2 - ANÁLISE FINANCEIRA
  pdf.addPage();
  if (sectionBgImg) drawFullBackground(sectionBgImg);
  currentY = margin + SPACING.PAGE_TITLE;
  addText('ANÁLISE FINANCEIRA', FONT_SIZES.TITLE, 'bold', 'center', 'SECTION', 'accent');

  addSection('GERAÇÃO E ECONOMIA');
  const financialItems: string[] = [];
  if (isPresent(calculations.monthlyGeneration)) financialItems.push(`Geração Mensal Estimada: ${calculations.monthlyGeneration.toFixed(0)} kWh`);
  if (isPresent(calculations.monthlySavings)) financialItems.push(`Economia Mensal: ${formatCurrency(calculations.monthlySavings)}`);
  if (isPresent(calculations.monthlySavings)) financialItems.push(`Economia Anual: ${formatCurrency((calculations.monthlySavings || 0) * 12)}`);
  financialItems.forEach((item) => addText(item));

  // Gráfico simples
  drawBarChart(
    [
      { label: 'Geração', value: calculations.monthlyGeneration || 0, color: BRAND.accent },
      { label: 'Economia', value: calculations.monthlySavings || 0, color: BRAND.accent },
    ],
    { title: 'Resumo Gráfico' }
  );

  addSection('INVESTIMENTO');
  const investItems: string[] = [];
  if (isPresent(calculations.totalValue)) investItems.push(`Valor Total do Sistema: ${formatCurrency(calculations.totalValue)}`);
  if (isPresent(formData.paymentMethod)) investItems.push(`Forma de Pagamento: ${formData.paymentMethod}`);
  if (isPresent(calculations.requiredArea)) investItems.push(`Área Necessária: ${calculations.requiredArea.toFixed(0)} m²`);
  investItems.forEach((item) => addText(item));

  addFooter(logoImg || undefined);

  // PAGE 3 - BENEFÍCIOS E OBSERVAÇÕES
  pdf.addPage();
  if (sectionBgImg) drawFullBackground(sectionBgImg);
  currentY = margin + SPACING.PAGE_TITLE;
  addText('BENEFÍCIOS DO SISTEMA SOLAR', FONT_SIZES.TITLE, 'bold', 'center', 'SECTION', 'accent');

  const benefits = [
    '• Redução significativa na conta de energia elétrica',
    '• Retorno do investimento em médio prazo',
    '• Valorização do imóvel',
    '• Contribuição para o meio ambiente',
    '• Energia limpa e renovável',
    '• Sistema de compensação de energia elétrica',
    '• Garantia de 25 anos nos módulos fotovoltaicos',
    '• Baixa manutenção',
  ];
  benefits.forEach((b) => addText(b));

  if (isPresent(formData.observations)) {
    addSection('OBSERVAÇÕES');
    addMultilineText(formData.observations);
  }

  addFooter(logoImg || undefined);

  // PAGE 4 - TERMOS E CONDIÇÕES
  pdf.addPage();
  if (sectionBgImg) drawFullBackground(sectionBgImg);
  currentY = margin + SPACING.PAGE_TITLE;
  addText('TERMOS E CONDIÇÕES', FONT_SIZES.TITLE, 'bold', 'center', 'SECTION', 'accent');

  const terms = [
    '• Proposta válida por 30 dias',
    '• Valores sujeitos a alteração sem aviso prévio',
    '• Instalação conforme normas técnicas vigentes',
    '• Garantia de funcionamento conforme especificações',
    '• Suporte técnico especializado',
    '• Acompanhamento do processo de homologação junto à concessionária',
  ];
  terms.forEach((t) => addText(t));

  addFooter(logoImg || undefined);

  // Save
  pdf.save('proposta-olimpo-solar.pdf');
};
