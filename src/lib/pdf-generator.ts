import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
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

export const generateProposalPDF = (formData: FormData, calculations: Calculations) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;

  // Cores da Olimpo Solar
  const darkColor: [number, number, number]   = [  2,  33,  54]; // #022136
  const accentColor:[number, number, number] = [255, 191,   6]; // #ffbf06
  const whiteColor:[number, number, number]  = [255, 255, 255]; // #ffffff

  // Helper para formatação e data
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = () =>
    new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Quebra de página dinâmica
  const addNewPageIfNeeded = (currentY: number, contentHeight: number) => {
    if (currentY + contentHeight > pageHeight - 30) {
      pdf.addPage();
      return 30;
    }
    return currentY;
  };

  let y = 30;

  // === PÁGINA 1: CAPA ===
  y = addNewPageIfNeeded(y, 180);
  // Logo
  pdf.setFillColor(...accentColor);
  pdf.rect(pageWidth/2 - 20, y, 40, 20, 'F');
  pdf.setTextColor(...whiteColor);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OLIMPO', pageWidth/2, y + 10, { align: 'center' });
  pdf.text('SOLAR', pageWidth/2, y + 16, { align: 'center' });

  y += 40;
  // Título
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Proposta Comercial', pageWidth/2, y, { align: 'center' });

  // Dados do cliente
  y += 30;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Cliente: ${formData.clientName}`, 20, y);
  pdf.text(`Data: ${formatDate()}`, pageWidth - 20, y, { align: 'right' });

  y += 20;
  pdf.text(`Endereço: ${formData.address}, ${formData.number} - ${formData.neighborhood}`, 20, y);
  
  y += 10;
  pdf.text(`Cidade: ${formData.city}`, 20, y);
  
  y += 10;  
  pdf.text(`Telefone: ${formData.phone}`, 20, y);

  // Dados do sistema
  y += 30;
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados do Sistema Solar', 20, y);

  y += 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  
  const systemData = [
    ['Potência do Sistema', `${formData.systemPower} kWp`],
    ['Quantidade de Módulos', `${formData.moduleQuantity} unidades`],
    ['Marca dos Módulos', formData.moduleBrand],
    ['Potência dos Módulos', `${formData.modulePower} W`],
    ['Marca do Inversor', formData.inverterBrand],
    ['Potência do Inversor', `${formData.inverterPower} W`],
    ['Geração Mensal Estimada', `${calculations.monthlyGeneration} kWh`],
    ['Economia Mensal Estimada', formatCurrency(calculations.monthlySavings)],
    ['Área Necessária', `${calculations.requiredArea} m²`],
    ['Valor Total do Projeto', formatCurrency(calculations.totalValue)],
    ['Forma de Pagamento', formData.paymentMethod]
  ];

  autoTable(pdf, {
    startY: y,
    head: [['Item', 'Valor']],
    body: systemData,
    theme: 'grid',
    headStyles: { fillColor: accentColor, textColor: darkColor },
    bodyStyles: { textColor: darkColor },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Observações se houver
  if (formData.observations) {
    pdf.addPage();
    y = 30;
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Observações', 20, y);
    
    y += 20;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const splitText = pdf.splitTextToSize(formData.observations, pageWidth - 40);
    pdf.text(splitText, 20, y);
  }

  // Salvar PDF
  const fileName = `Proposta_${formData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
