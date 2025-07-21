import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
  moduleModel: string;
  inverterBrand: string;
  inverterModel: string;
  paymentMethod: string;
  observations: string;
}

interface Calculations {
  monthlyGeneration: number;
  monthlySavings: number;
  requiredArea: number;
  totalValue: number;
}

export const generateProposalPDF = (formData: FormData, calculations: Calculations) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  
  // Cores da Olimpo Solar
  const primaryColor: [number, number, number] = [255, 140, 0]; // Laranja
  const secondaryColor: [number, number, number] = [46, 125, 50]; // Verde
  const darkColor: [number, number, number] = [33, 33, 33]; // Cinza escuro
  
  // Helper functions
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

  const addNewPageIfNeeded = (currentY: number, contentHeight: number) => {
    if (currentY + contentHeight > pageHeight - 30) {
      pdf.addPage();
      return 30;
    }
    return currentY;
  };

  // PÁGINA 1: CAPA
  let yPosition = 40;

  // Logo placeholder
  pdf.setFillColor(...primaryColor);
  pdf.rect(pageWidth/2 - 20, yPosition, 40, 20, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OLIMPO', pageWidth/2, yPosition + 10, { align: 'center' });
  pdf.text('SOLAR', pageWidth/2, yPosition + 16, { align: 'center' });

  yPosition += 40;

  // Título
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Proposta Comercial', pageWidth/2, yPosition, { align: 'center' });
  
  yPosition += 15;
  pdf.setFontSize(18);
  pdf.setTextColor(...primaryColor);
  pdf.text('Sistema Fotovoltaico', pageWidth/2, yPosition, { align: 'center' });

  yPosition += 40;

  // Dados do cliente
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CLIENTE:', 30, yPosition);
  
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(formData.clientName, 30, yPosition);
  
  yPosition += 20;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('ENDEREÇO:', 30, yPosition);
  
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(`${formData.address}, ${formData.number}`, 30, yPosition);
  yPosition += 8;
  pdf.text(`${formData.neighborhood} - ${formData.city}`, 30, yPosition);

  yPosition += 30;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('DATA:', 30, yPosition);
  
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(formatDate(), 30, yPosition);

  // PÁGINA 2: MENSAGEM INSTITUCIONAL
  pdf.addPage();
  yPosition = 40;

  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Mensagem Institucional', pageWidth/2, yPosition, { align: 'center' });

  yPosition += 30;

  // Box da mensagem
  pdf.setFillColor(248, 249, 250);
  pdf.rect(20, yPosition - 10, pageWidth - 40, 60, 'F');
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(2);
  pdf.rect(20, yPosition - 10, pageWidth - 40, 60);

  pdf.setTextColor(...darkColor);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  
  const institutionalMessage = [
    'Nosso compromisso é com seu bolso e com o planeta.',
    '',
    'Escolher a Olimpo Solar é optar por economia e',
    'sustentabilidade com atendimento humanizado,',
    'produtos premium e instalação rápida.'
  ];

  institutionalMessage.forEach((line, index) => {
    pdf.text(line, pageWidth/2, yPosition + (index * 8), { align: 'center' });
  });

  yPosition += 100;

  // RESUMO DO PROJETO
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Resumo do Projeto', pageWidth/2, yPosition, { align: 'center' });

  yPosition += 20;

  const tableData = [
    ['Potência do Sistema', `${formData.systemPower} kWp`],
    ['Módulos', `${formData.moduleQuantity} módulos de ${formData.modulePower}W`],
    ['Marca dos Módulos', `${formData.moduleBrand} ${formData.moduleModel}`],
    ['Inversor', `${formData.inverterBrand} ${formData.inverterModel}`],
    ['Geração Mensal Estimada', `${calculations.monthlyGeneration} kWh/mês`],
    ['Economia Mensal Estimada', formatCurrency(calculations.monthlySavings)],
    ['Área Mínima Necessária', `${calculations.requiredArea} m²`],
    ['Valor Total do Projeto', formatCurrency(calculations.totalValue)],
    ['Forma de Pagamento', formData.paymentMethod.toUpperCase()],
  ];

  if (formData.observations) {
    tableData.push(['Observações', formData.observations]);
  }

  pdf.autoTable({
    startY: yPosition,
    head: [['Item', 'Descrição']],
    body: tableData,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 12,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 11,
      cellPadding: 5
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    margin: { left: 20, right: 20 },
    tableWidth: pageWidth - 40
  });

  // PÁGINA 3: BENEFÍCIOS
  pdf.addPage();
  yPosition = 40;

  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Benefícios da Energia Solar', pageWidth/2, yPosition, { align: 'center' });

  yPosition += 30;

  const benefits = [
    '✓ Garantia de até 25 anos',
    '✓ Valorização do imóvel',
    '✓ Baixo custo de manutenção',
    '✓ Isenção de impostos e tarifas',
    '✓ Sustentabilidade ambiental',
    '✓ Monitoramento online'
  ];

  pdf.setTextColor(...darkColor);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');

  benefits.forEach((benefit, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = col === 0 ? 30 : pageWidth/2 + 20;
    const y = yPosition + (row * 20);
    
    pdf.setTextColor(...secondaryColor);
    pdf.text('✓', x, y);
    pdf.setTextColor(...darkColor);
    pdf.text(benefit.substring(2), x + 10, y);
  });

  yPosition += 80;

  // ETAPAS DO PROJETO
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Etapas do Projeto', pageWidth/2, yPosition, { align: 'center' });

  yPosition += 20;

  const steps = [
    '1. Apresentação da proposta',
    '2. Visita técnica',
    '3. Assinatura de contrato',
    '4. Instalação',
    '5. Ativação da usina',
    '6. Monitoramento'
  ];

  pdf.setTextColor(...darkColor);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  steps.forEach((step, index) => {
    const y = yPosition + 15 + (index * 15);
    
    // Círculo com número
    pdf.setFillColor(...primaryColor);
    pdf.circle(35, y - 3, 5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text((index + 1).toString(), 35, y, { align: 'center' });
    
    // Texto da etapa
    pdf.setTextColor(...darkColor);
    pdf.setFont('helvetica', 'normal');
    pdf.text(step.substring(3), 50, y);
    
    // Linha conectora (exceto último)
    if (index < steps.length - 1) {
      pdf.setDrawColor(...primaryColor);
      pdf.setLineWidth(2);
      pdf.line(35, y + 3, 35, y + 12);
    }
  });

  // PÁGINA 4: COMPARATIVO E RODAPÉ
  pdf.addPage();
  yPosition = 40;

  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Comparativo de Investimento', pageWidth/2, yPosition, { align: 'center' });

  yPosition += 30;

  // Comparativo simples com barras
  const investments: Array<{ name: string; value: number; color: [number, number, number] }> = [
    { name: 'Energia Solar', value: 12, color: primaryColor },
    { name: 'Poupança', value: 6, color: [100, 100, 100] },
    { name: 'CDI', value: 8, color: [150, 150, 150] }
  ];

  const barWidth = 100;
  const barHeight = 20;
  const maxValue = Math.max(...investments.map(inv => inv.value));

  investments.forEach((investment, index) => {
    const y = yPosition + (index * 35);
    const barLength = (investment.value / maxValue) * barWidth;
    
    // Nome do investimento
    pdf.setTextColor(...darkColor);
    pdf.setFontSize(12);
    pdf.text(investment.name, 40, y + 5);
    
    // Barra
    pdf.setFillColor(...investment.color);
    pdf.rect(40, y + 8, barLength, barHeight, 'F');
    
    // Valor
    pdf.setTextColor(...investment.color);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${investment.value}% a.a.`, 40 + barLength + 10, y + 18);
  });

  // RODAPÉ
  yPosition = pageHeight - 80;

  pdf.setFillColor(...primaryColor);
  pdf.rect(0, yPosition, pageWidth, 80, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OLIMPO SOLAR', pageWidth/2, yPosition + 15, { align: 'center' });

  yPosition += 25;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const contactInfo = [
    'R. Eduardo Santos Pereira, 1831 – Centro, Campo Grande – MS',
    'WhatsApp: (67) 99668-0242',
    'Instagram: @olimpo.energiasolar',
    'E-mail: adm.olimposolar@gmail.com'
  ];

  contactInfo.forEach((info, index) => {
    pdf.text(info, pageWidth/2, yPosition + (index * 8), { align: 'center' });
  });

  // Salvar o PDF
  const fileName = `Proposta_${formData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};