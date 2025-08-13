# Guia de Setup Local - Olimpo Solar

Este guia explica como configurar e executar o projeto Olimpo Solar em um ambiente de desenvolvimento local após clonar o repositório.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm**, **yarn** ou **bun** (gerenciador de pacotes)
- **Git** (para clonar o repositório)

## 🚀 Passo a Passo

### 1. Clonar o Repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd olimpo-solar
```

### 2. Instalar Dependências

Escolha um dos comandos abaixo baseado no seu gerenciador de pacotes:

```bash
# Usando npm
npm install

# Usando yarn
yarn install

# Usando bun
bun install
```

### 3. Configuração do Supabase

O projeto utiliza Supabase como backend. Você precisa configurar as variáveis de ambiente:

#### 3.1. Arquivo de Configuração
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://nqdvtnvvvgnnbfaydmmn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZHZ0bnZ2dmdubmJmYXlkbW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTQzMjAsImV4cCI6MjA2ODY5MDMyMH0.KenSn7usOKnnJkd2BDOE-H1_GAyANeAvfP5Gf4H2kjg
```

> **⚠️ Nota de Segurança:** Essas são chaves públicas de desenvolvimento. Em produção, use suas próprias chaves do Supabase.

#### 3.2. Verificar Configuração
A configuração do Supabase já está no arquivo `src/integrations/supabase/client.ts`.

### 4. Executar o Projeto

```bash
# Usando npm
npm run dev

# Usando yarn
yarn dev

# Usando bun
bun dev
```

O projeto estará disponível em: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
olimpo-solar/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes UI reutilizáveis
│   │   ├── ProposalForm.tsx # Formulário de proposta
│   │   ├── ProposalPreview.tsx # Preview da proposta
│   │   └── ProposalCoverPage.tsx # Capa da proposta
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilitários e helpers
│   │   └── pdf-generator.ts # Gerador de PDF
│   ├── integrations/       # Integrações (Supabase)
│   └── utils/              # Funções utilitárias
├── public/                 # Arquivos públicos
│   └── lovable-uploads/    # Imagens e assets
├── docs/                   # Documentação
└── tests/                  # Testes e guias (este arquivo)
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run preview      # Preview do build

# Linting e Formatação
npm run lint         # Executa ESLint
npm run type-check   # Verifica tipos TypeScript
```

## 🛠️ Funcionalidades Principais

1. **Formulário de Proposta** - Coleta dados do cliente e sistema solar
2. **Preview da Proposta** - Visualização completa da proposta comercial
3. **Geração de PDF** - Exporta proposta em formato PDF profissional
4. **Integração Supabase** - Backend para persistência de dados
5. **Interface Responsiva** - Otimizada para desktop e mobile

## 🔍 Troubleshooting

### Erro: "Module not found"
```bash
# Limpar cache e reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro de TypeScript
```bash
# Verificar tipos
npm run type-check
```

### Problemas com Supabase
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o projeto Supabase está ativo
3. Verifique a conexão de internet

### Erro ao gerar PDF
1. Verifique se todas as imagens estão carregando
2. Teste com dados completos no formulário
3. Abra o console do navegador para verificar erros

## 📝 Desenvolvimento

### Adicionando Novas Funcionalidades

1. **Componentes**: Adicione em `src/components/`
2. **Páginas**: Adicione em `src/pages/`
3. **Hooks**: Adicione em `src/hooks/`
4. **Utilitários**: Adicione em `src/lib/` ou `src/utils/`

### Convenções de Código

- Use TypeScript para tipagem forte
- Siga os padrões do ESLint configurado
- Componentes em PascalCase
- Arquivos utilitários em camelCase
- Use Tailwind CSS para estilização

## 📱 Testando a Aplicação

1. **Acesse a página inicial** (`/`)
2. **Preencha o formulário** com dados de teste
3. **Visualize o preview** da proposta
4. **Teste a geração de PDF**
5. **Verifique responsividade** em diferentes tamanhos de tela

## 🆘 Suporte

Se encontrar problemas:

1. Verifique este guia novamente
2. Consulte a documentação no diretório `docs/`
3. Verifique os logs do console do navegador
4. Consulte a documentação do [Vite](https://vitejs.dev/) e [React](https://react.dev/)

## 📞 Contato

Para dúvidas específicas do projeto:
- Email: adm.olimposolar@gmail.com
- Telefone: (67) 99668-0242

---

*Última atualização: Dezembro 2024*