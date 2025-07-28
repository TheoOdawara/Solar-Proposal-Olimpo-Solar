
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export const generateProposalPDF = async (formData: FormData, calculations: Calculations) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;

  const darkColor: [number, number, number]   = [  2,  33,  54];
  const accentColor:[number, number, number] = [255, 191,   6];
  const whiteColor:[number, number, number]  = [255, 255, 255];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = () =>
    new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  let y = 30;

  pdf.setFillColor(...accentColor);
  pdf.rect(pageWidth/2 - 20, y, 40, 20, 'F');
  pdf.setTextColor(...whiteColor);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OLIMPO', pageWidth/2, y + 10, { align: 'center' });
  pdf.text('SOLAR', pageWidth/2, y + 16, { align: 'center' });

  y += 40;
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Proposta Comercial', pageWidth/2, y, { align: 'center' });

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

  y += 30;
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dados do Sistema Solar', 20, y);

  y += 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');

  const systemData = [
    ['Potência do Sistema', `${formData.systemPower} kWp`],
    ['Qtd. Módulos', `${formData.moduleQuantity} x ${formData.modulePower}W`],
    ['Marca dos Módulos', formData.moduleBrand],
    ['Marca do Inversor', formData.inverterBrand],
    ['Potência do Inversor', `${formData.inverterPower} W`],
    ['Método de Pagamento', formData.paymentMethod],
    ['Observações', formData.observations || 'Nenhuma']
  ];

  systemData.forEach(([label, value]) => {
    y += 10;
    pdf.text(`${label}: ${value}`, 20, y);
  });

  // === IMAGENS EXPLICATIVAS NAS PÁGINAS 2 a 6 ===
  const imagePaths = [
    "/public/2.jpg",
    "/public/3.jpg",
    "/public/4.jpg",
    "/public/5.jpg",
    "/public/6.jpg"
  ];

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const addImagePages = async () => {
    for (const path of imagePaths) {
      const img = await loadImage(path);
      pdf.addPage();
      pdf.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);
    }
  };

  
  // IMAGEM 1
  const img1 = await loadImage("/public/2.jpg");
  pdf.addPage();
  pdf.addImage(img1, "JPEG", 0, 0, pageWidth, pageHeight);

  // IMAGEM 2
  const img2 = await loadImage("/public/3.jpg");
  pdf.addPage();
  pdf.addImage(img2, "JPEG", 0, 0, pageWidth, pageHeight);

  // CONTEÚDO PERSONALIZADO NA PÁGINA 4
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.setTextColor(...darkColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text("Resumo da Economia Estimada", pageWidth / 2, 30, { align: "center" });

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  const economiaMensal = formatCurrency(calculations.monthlySavings);
  const economiaAnual = formatCurrency(calculations.monthlySavings * 12);
  const economia25anos = formatCurrency(calculations.monthlySavings * 12 * 25);

  pdf.text(`Economia Mensal Estimada: ${economiaMensal}`, 20, 60);
  pdf.text(`Economia Anual Estimada: ${economiaAnual}`, 20, 75);
  pdf.text(`Economia em 25 anos: ${economia25anos}`, 20, 90);

  // IMAGEM 3
  const img3 = await loadImage("/public/4.jpg");
  pdf.addPage();
  pdf.addImage(img3, "JPEG", 0, 0, pageWidth, pageHeight);

  // IMAGEM 4
  const img4 = await loadImage("/public/5.jpg");
  pdf.addPage();
  pdf.addImage(img4, "JPEG", 0, 0, pageWidth, pageHeight);

  // IMAGEM 5
  const img5 = await loadImage("/public/6.jpg");
  pdf.addPage();
  pdf.addImage(img5, "JPEG", 0, 0, pageWidth, pageHeight);

  // PÁGINA FINAL COM QR CODE
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text("Fale agora com um consultor Olimpo", pageWidth / 2, 40, { align: "center" });

  const qrImage = await loadImage("/public/qr-whatsapp.png");
  pdf.addImage(qrImage, "PNG", pageWidth / 2 - 40, 60, 80, 80);
  pdf.setFontSize(12);
  pdf.text("Escaneie o QR Code acima ou acesse:", pageWidth / 2, 150, { align: "center" });
  pdf.setTextColor(0, 102, 204);
  pdf.textWithLink("https://wa.me/seunumerowhatsapp", pageWidth / 2, 165, {
    align: "center",
    url: "https://wa.me/seunumerowhatsapp"
  });
    
};
