# Como Converter os PDFs para PNG

## Método Recomendado: Python (RÁPIDO - 3 minutos)

### 1. Instalar dependências (uma vez só):

```powershell
pip install pdf2image pillow
```

**Nota:** Se der erro de `poppler not found`, instale o Poppler:

```powershell
# Baixar Poppler para Windows:
# https://github.com/oschwartz10612/poppler-windows/releases/
# Extrair e adicionar ao PATH ou usar caminho completo
```

**OU use conda se tiver:**
```powershell
conda install -c conda-forge poppler
pip install pdf2image pillow
```

### 2. Executar o script de conversão:

```powershell
python convert_pdfs.py
```

Isso irá converter todos os PDFs de `newProposal/novaApresentacaoPorPag/` para PNG em alta resolução (300 DPI) e salvar em `public/lovable-uploads/`.

### 3. Verificar:

Após a conversão, execute:
```powershell
npm run dev
```

E acesse http://localhost:8080 para ver a proposta com as imagens.

---

## Alternativa: Sem instalar Poppler (se der erro)

### Método Online (2 minutos):

1. Acesse: https://pdf2png.com/
2. Faça upload de cada PDF de `newProposal/novaApresentacaoPorPag/`
3. Configure: **300 DPI**, formato **PNG**
4. Baixe e renomeie: `Pagina1.png`, `Pagina2.png`, etc.
5. Mova para: `public/lovable-uploads/`

---

## Troubleshooting

### Erro: "poppler not found"
- Baixe Poppler: https://github.com/oschwartz10612/poppler-windows/releases/
- Extraia para `C:\poppler`
- Adicione `C:\poppler\Library\bin` ao PATH do sistema

### Erro: "No module named 'PIL'"
```powershell
pip install pillow
```

### Erro: Permission denied
Execute o PowerShell como Administrador
