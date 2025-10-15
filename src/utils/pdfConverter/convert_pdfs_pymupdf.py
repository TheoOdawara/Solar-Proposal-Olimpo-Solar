#!/usr/bin/env python3
"""
Script para converter PDFs para PNG usando PyMuPDF (não precisa de Poppler)
Requisitos: pip install PyMuPDF pillow
"""

import os
from pathlib import Path
import fitz  # PyMuPDF
from PIL import Image

# Mudar para a raiz do projeto
script_dir = Path(__file__).parent
project_root = script_dir.parent.parent.parent
os.chdir(project_root)

print(f"📁 Diretório de trabalho: {os.getcwd()}\n")

# Diretórios
PDF_DIR = Path("newProposal/novaApresentacaoPorPag")
OUTPUT_DIR = Path("public/lovable-uploads")

# Criar diretório de saída se não existir
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Lista de PDFs para converter
pdfs_to_convert = [
    "Pagina1.pdf",
    "Pagina2.pdf",
    "Pagina3.pdf",
    "Pagina4.pdf",
    "Pagina5.pdf",
    "Pagina6.pdf",
    "Pagina7.pdf",
]

print("🔄 Iniciando conversão de PDFs para PNG (PyMuPDF)...\n")

for pdf_name in pdfs_to_convert:
    pdf_path = PDF_DIR / pdf_name
    
    if not pdf_path.exists():
        print(f"⚠️  Arquivo não encontrado: {pdf_path}")
        continue
    
    try:
        print(f"📄 Convertendo {pdf_name}...")
        
        # Abrir PDF
        pdf_document = fitz.open(str(pdf_path))
        
        # Pegar primeira página
        page = pdf_document[0]
        
        # Renderizar em alta resolução (300 DPI = zoom de 4.17)
        # 72 DPI é padrão, então 300/72 = 4.17
        zoom = 300 / 72
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)
        
        # Salvar como PNG
        output_name = pdf_name.replace('.pdf', '.png')
        output_path = OUTPUT_DIR / output_name
        
        pix.save(str(output_path))
        
        # Fechar PDF
        pdf_document.close()
        
        # Mostrar tamanho do arquivo
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"   ✅ Salvo: {output_path} ({size_mb:.2f} MB)")
        
    except Exception as e:
        print(f"   ❌ Erro ao converter {pdf_name}: {e}")

print("\n✨ Conversão concluída!")
print(f"📁 Imagens salvas em: {OUTPUT_DIR.absolute()}")
