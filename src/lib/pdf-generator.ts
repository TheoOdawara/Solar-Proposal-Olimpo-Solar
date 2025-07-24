import html2pdf from 'html2pdf.js';

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
  // Configurar opções para alta qualidade e fidelidade visual
  const options = {
    margin: 0,              // Sem margens para capturar o layout completo
    filename: `Proposta_${formData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { 
      type: 'jpeg', 
      quality: 1.0          // Máxima qualidade de imagem
    },
    html2canvas: { 
      scale: 2,             // Escala 2x para maior resolução
      useCORS: true,        // Permitir imagens externas
      letterRendering: true, // Melhor renderização de texto
      allowTaint: false,    // Evitar problemas de segurança
      backgroundColor: '#ffffff',
      logging: false,
      width: 1200,          // Largura fixa para consistência
      height: null,         // Altura automática
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc: Document) => {
        // Ajustar estilos específicos para PDF no documento clonado
        const clonedElement = clonedDoc.getElementById('proposal-content');
        if (clonedElement) {
          // Remover transições e animações que podem afetar a captura
          clonedElement.style.transition = 'none';
          clonedElement.style.animation = 'none';
          clonedElement.style.transform = 'none';
          
          // Garantir que todas as imagens sejam carregadas
          const images = clonedElement.getElementsByTagName('img');
          Array.from(images).forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
          });

          // Ajustar gráficos para melhor renderização
          const charts = clonedElement.querySelectorAll('.recharts-wrapper');
          Array.from(charts).forEach(chart => {
            (chart as HTMLElement).style.backgroundColor = 'transparent';
          });
        }
      }
    },
    jsPDF: { 
      unit: 'mm',
      format: 'a4',         // Formato A4 padrão
      orientation: 'portrait',
      precision: 16,        // Alta precisão
      putOnlyUsedFonts: true,
      floatPrecision: 16
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'], // Respeitar quebras de página CSS
      before: '.min-h-screen',              // Quebrar antes de cada seção
      after: '',
      avoid: 'img'          // Evitar quebrar imagens
    }
  };

  // Capturar o elemento com o conteúdo da proposta
  const element = document.getElementById('proposal-content');
  
  if (!element) {
    console.error('Elemento proposal-content não encontrado');
    return;
  }

  // Aplicar estilos temporários para otimização da captura
  const originalStyles = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    zIndex: element.style.zIndex,
    transform: element.style.transform
  };

  // Temporariamente posicionar o elemento para captura
  element.style.position = 'relative';
  element.style.left = '0';
  element.style.top = '0';
  element.style.zIndex = '9999';
  element.style.transform = 'none';

  // Garantir que todas as imagens estejam carregadas antes da captura
  const images = element.getElementsByTagName('img');
  const imagePromises = Array.from(images).map((img) => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve(img);
      } else {
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img); // Continuar mesmo se uma imagem falhar
      }
    });
  });

  Promise.all(imagePromises).then(() => {
    // Pequeno delay para garantir que tudo foi renderizado
    setTimeout(() => {
      html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
          // Restaurar estilos originais
          Object.keys(originalStyles).forEach(key => {
            element.style[key as any] = originalStyles[key as keyof typeof originalStyles];
          });
          console.log('PDF gerado com sucesso!');
        })
        .catch((error: any) => {
          console.error('Erro ao gerar PDF:', error);
          // Restaurar estilos originais mesmo em caso de erro
          Object.keys(originalStyles).forEach(key => {
            element.style[key as any] = originalStyles[key as keyof typeof originalStyles];
          });
        });
    }, 500);
  });
};