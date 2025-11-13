#!/usr/bin/env python3
"""
Script para converter todos os PDFs da pasta pdf/ para PNGs na pasta png/ usando PyMuPDF.
Requisitos: pip install PyMuPDF pillow
"""

import os
from pathlib import Path
import fitz  # PyMuPDF

# Caminhos relativos ao projeto
PDF_DIR = Path("public/novaApresentacaoPorPag/pdf")
OUTPUT_DIR = Path("public/novaApresentacaoPorPag/png")

# Garante que a pasta de saída existe
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print(f"🔄 Procurando PDFs em: {PDF_DIR.resolve()}")

pdf_files = list(PDF_DIR.glob("*.pdf"))
if not pdf_files:
    print("⚠️  Nenhum PDF encontrado na pasta.")
    exit(1)

for pdf_path in pdf_files:
    try:
        print(f"📄 Convertendo: {pdf_path.name}")
        pdf_document = fitz.open(str(pdf_path))
        for page_number in range(len(pdf_document)):
            page = pdf_document[page_number]
            zoom = 300 / 72  # 300 DPI
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat)
            output_name = f"{pdf_path.stem}_page_{page_number+1}.png"
            output_path = OUTPUT_DIR / output_name
            pix.save(str(output_path))
            size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"   ✅ Página {page_number+1} salva: {output_name} ({size_mb:.2f} MB)")
        pdf_document.close()
    except Exception as e:
        print(f"   ❌ Erro ao converter {pdf_path.name}: {e}")

print("\n✨ Conversão concluída!")
print(f"📁 Imagens salvas em: {OUTPUT_DIR.resolve()}")