// src/lib/pdfWorker.ts
// Web Worker para geração de PDF sem travar a UI

import { generateProposalPDF, ProposalPDFImages } from './pdf-generator';

// Mensagem recebida do main thread
import type { FormData, Calculations } from './pdf-generator';

type WorkerRequest = {
  formData: FormData;
  calculations: Calculations;
  images: {
    logoImgDataUrl: string | null;
    coverBgImgDataUrl: string | null;
    sectionBgImgDataUrl: string | null;
  };
};

// Utilitário para converter dataURL em HTMLImageElement
function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

self.onmessage = async (e: MessageEvent) => {
  const { formData, calculations, images } = e.data as WorkerRequest;
  // Reconstrói imagens
  const logoImg = images.logoImgDataUrl ? await dataUrlToImage(images.logoImgDataUrl) : null;
  const coverBgImg = images.coverBgImgDataUrl ? await dataUrlToImage(images.coverBgImgDataUrl) : null;
  const sectionBgImg = images.sectionBgImgDataUrl ? await dataUrlToImage(images.sectionBgImgDataUrl) : null;

  // Gera o PDF (salva automaticamente, mas pode ser adaptado para retornar blob)
  await generateProposalPDF(formData, calculations, { logoImg, coverBgImg, sectionBgImg });
  // Opcional: pode enviar mensagem de sucesso
  self.postMessage({ status: 'done' });
};
