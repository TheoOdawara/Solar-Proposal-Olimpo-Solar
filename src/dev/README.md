# 🧪 Pasta de Desenvolvimento e Testes

Esta pasta contém componentes e páginas para **desenvolvimento**, **testes** e **demonstração**.

## 📁 Estrutura

```
src/dev/
├── TestPage.tsx              # Página principal de testes
├── components/              # Componentes de demonstração
│   └── ProposalCoverPageDemo.tsx
└── README.md               # Este arquivo
```

## 🎯 Propósito

- **Desenvolvimento**: Testar componentes isoladamente
- **Debug**: Validar funcionalidades com dados mockados
- **Demonstração**: Showcases para stakeholders
- **QA**: Testes visuais e funcionais

## 🚀 Como usar

### Acessar a página de testes

Em **modo de desenvolvimento**, acesse: `http://localhost:8080/testes`

### Adicionar novos testes

1. Crie o componente de teste em `components/`
2. Adicione-o ao array `tests` em `TestPage.tsx`
3. Configure os dados mockados necessários

### Exemplo de novo componente de teste

```tsx
// components/MinhaFuncionalidadeDemo.tsx
import React from 'react';
import MinhaFuncionalidade from '../../components/MinhaFuncionalidade';

const MinhaFuncionalidadeDemo = () => {
  const mockData = {
    // seus dados de teste aqui
  };

  return <MinhaFuncionalidade data={mockData} />;
};

export default MinhaFuncionalidadeDemo;
```

## ⚠️ Importante

- **Disponível apenas em desenvolvimento** (`import.meta.env.DEV`)
- **Não será incluído no build de produção**
- **Use dados mockados, nunca dados reais de clientes**
- **Mantenha o código de teste simples e focado**

## 📋 Testes disponíveis

- ✅ **Capa da Proposta**: Teste da capa com dados completos mockados

## 🔄 Próximos passos

- [ ] Adicionar teste do formulário completo
- [ ] Teste de geração de PDF
- [ ] Teste de componentes de UI isolados
- [ ] Mock de dados de diferentes cenários

---

**💡 Dica**: Use esta estrutura para validar mudanças antes de implementar em produção!
