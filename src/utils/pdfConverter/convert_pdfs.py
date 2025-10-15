#!/usr/bin/env python3
"""
Script para converter PDFs da proposta para PNG em alta resolução
Requisitos: pip install pdf2image pillow
"""

import os
from pathlib import Path
from pdf2image import convert_from_path

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
    "Pagina8.pdf",
    "Pagina9.pdf",
    "Pagina10.pdf",
    "Pagina11.pdf"
]

print("🔄 Iniciando conversão de PDFs para PNG...\n")

for pdf_name in pdfs_to_convert:
    pdf_path = PDF_DIR / pdf_name
    
    if not pdf_path.exists():
        print(f"⚠️  Arquivo não encontrado: {pdf_path}")
        continue
    
    try:
        print(f"📄 Convertendo {pdf_name}...")
        
        # Converter PDF para imagem em alta resolução (300 DPI)
        images = convert_from_path(
            str(pdf_path),
            dpi=300,
            fmt='png'
        )
        
        # Salvar primeira página (PDFs têm apenas 1 página cada)
        output_name = pdf_name.replace('.pdf', '.png')
        output_path = OUTPUT_DIR / output_name
        
        images[0].save(str(output_path), 'PNG', optimize=True, quality=95)
        
        # Mostrar tamanho do arquivo
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"   ✅ Salvo: {output_path} ({size_mb:.2f} MB)")
        
    except Exception as e:
        print(f"   ❌ Erro ao converter {pdf_name}: {e}")

print("\n✨ Conversão concluída!")
print(f"📁 Imagens salvas em: {OUTPUT_DIR.absolute()}")
