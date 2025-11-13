import * as XLSX from "xlsx";

/**
 * Converte um CSV (string) em XLSX e faz o download.
 * @param csvContent O conteúdo do CSV como string.
 * @param fileName Nome do arquivo para download (sem extensão).
 */
export function downloadCsvAsXlsx(csvContent: string, fileName: string = "MetricasPropostas") {
  console.log('[downloadCsvAsXlsx] chamada', { csvContent, fileName });
  if (!csvContent || typeof csvContent !== 'string' || csvContent.trim() === '') {
    alert('Erro: O conteúdo CSV está vazio ou inválido.');
    return;
  }
  try {
    // Lê o CSV como um workbook temporário
    const tempWb = XLSX.read(csvContent, { type: 'string', raw: false, codepage: 65001, WTF: false });
    const firstSheetName = tempWb.SheetNames[0];
    const tempSheet = tempWb.Sheets[firstSheetName];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, tempSheet, 'Planilha');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    alert('Download XLSX disparado! Se não baixou, verifique pop-up ou permissões do navegador.');
  } catch (e) {
    alert('Erro ao converter CSV para XLSX: ' + e);
    return;
  }
}
