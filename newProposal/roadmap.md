# Roadmap do Projeto: Sistema de Propostas Comerciais Olimpo Solar

> **Última atualização:** 14/10/2025  
> **Branch atual:** `SupabaseSelfHosted`  
> **Status:** Refatoração estrutural concluída, iniciando implementação do novo modelo de proposta

---

## ✅ Fase 1: Levantamento e Infraestrutura (CONCLUÍDO)
- ✅ Alinhamento de requisitos e escopo
- ✅ Definição da infraestrutura (Supabase self-hosted via Docker) — *legacy*
- ✅ Mapeamento completo dos campos e regras de negócio
- ✅ Migration SQL para novos campos de garantias

**Tempo gasto:** ~8h

---

## ✅ Fase 2: Setup e Configuração (CONCLUÍDO)
- ✅ Repositório configurado e ambiente de desenvolvimento pronto
- ✅ Stack: Vite + React 18 + TypeScript + Tailwind + shadcn/ui
- ✅ Integração com Supabase (PostgreSQL, Auth, RLS, Policies, Triggers) — *legacy*
- ✅ Docker Compose para desenvolvimento local

**Tempo gasto:** ~6h

---

## ✅ Fase 3: Refatoração Estrutural (CONCLUÍDO)

### 3.1 Modelo de Dados
- ✅ Migration SQL com 7 novos campos (`structure_type`, `monitoring`, 5 warranties)
- ✅ Tipos TypeScript atualizados (`ProposalData`, `FormData`)
- ✅ Utilitários de mapeamento centralizados (`proposalMapping.ts`)

### 3.2 Componentização
- ✅ ProposalForm.tsx modularizado (-220 linhas):
  - `ClientDataSection.tsx`
  - `ProjectDataSection.tsx`
  - `WarrantiesSection.tsx` (NOVO)
- ✅ Funções de salvamento refatoradas (-130 linhas duplicadas)
- ✅ `pdf-generator.ts` otimizado (tipos e formatadores consolidados)

### 3.3 Qualidade e Validação
- ✅ TypeScript: 0 erros
- ✅ ESLint: 0 problemas
- ✅ Build: ~10.6s (4521 módulos)
- ✅ Redução total: ~387 linhas de código

**Tempo gasto:** ~16h  
**Economia:** 387 linhas de código duplicado eliminadas

---


## ✅ Tela de Login (CONCLUÍDO)
- Implementação completa da tela de login responsiva
- Integração com Supabase Auth (login, cadastro, Google) — *legacy* (agora migrado para API REST)
- Validação visual, acessibilidade e responsividade
- Padrão de logo e paleta aplicados conforme instruções

## 🔄 Fase 4: Novo Modelo de Proposta (EM PROGRESSO - 30%)

### 4.1 Análise do Novo Layout ✅
- ✅ PDF dividido por páginas em `newProposal/novaApresentacaoPorPag/`
- ✅ Mapeamento de campos dinâmicos documentado
- ✅ Padrão de logo definido em `copilot-instructions.md`

### 4.2 Implementação do Preview 🔄
**Próximas ações:**
- [ ] Refatorar `ProposalPreview.tsx` com novo layout:
  - [ ] Página 1: Capa (especificações do projeto)
  - [ ] Página 2: Quem Somos (conteúdo estático)
  - [ ] Página 3: Como Funciona (diagrama)
  - [ ] Página 4: Benefícios (lista)
  - [ ] Página 5: Nossos Projetos (grid de imagens)
  - [ ] Página 6: Sua Economia (comparativo antes/depois)
  - [ ] Página 7: Seu Retorno (gráfico payback)
  - [ ] Página 8: Rentabilidade (comparativo investimentos)
  - [ ] Página 9: Capacidade de Geração (gráfico sazonal)
  - [ ] Página 10: Seu Investimento (tabela financiamento)
  - [ ] Página 11: Termo de Compromisso (assinaturas)
- [ ] Integrar novos campos de garantias no preview
- [ ] Aplicar novo padrão de logo branca

### 4.3 Atualização da Logo 🔄
- [ ] Substituir logo antiga por `LogoBranca.png`
- [ ] Aplicar padrão de posicionamento definido
- [ ] Validar em todas as páginas

**Estimativa restante:** ~20h

---

## 📋 Fase 5: Geração de PDF (PENDENTE)

### 5.1 Adaptação do Gerador
- [ ] Atualizar `pdf-generator.ts` para capturar novo layout
- [ ] Garantir fidelidade visual PDF vs. Preview
- [ ] Otimizar performance de geração

### 5.2 Testes
- [ ] Testar com dados reais
- [ ] Testar com dados mockados
- [ ] Validar em múltiplos navegadores

**Estimativa:** ~12h

---

## 📋 Fase 6: Testes e Validação (PENDENTE)

### 6.1 Testes Funcionais
- [ ] Criar proposta completa (todos os campos)
- [ ] Salvar no banco (validar integração com backend/API — anteriormente Supabase)
- [ ] Carregar proposta salva
- [ ] Gerar PDF e validar conteúdo
- [ ] Testar fluxo de aprovação

### 6.2 Testes de Qualidade
- [ ] Responsividade (mobile/desktop/tablet)
- [ ] Acessibilidade (WCAG)
- [ ] Performance (Lighthouse)
- [ ] Cross-browser (Chrome, Firefox, Edge, Safari)

**Estimativa:** ~8h

---

## 📋 Fase 7: Funcionalidades Avançadas (FUTURO)

### 7.1 Gerenciamento de Usuários
- [ ] Dashboard de admin
- [ ] Controle de permissões refinado
- [ ] Histórico de atividades

### 7.2 Métricas e Relatórios
- [ ] Dashboard de métricas de vendas
- [ ] Relatórios exportáveis
- [ ] Análise de conversão

### 7.3 Dinamização de Conteúdo
- [ ] Tabela `projects` para "Nossos Projetos"
- [ ] Configuração de taxas de referência
- [ ] Templates de proposta customizáveis

**Estimativa:** ~40h (planejamento futuro)

---

## 📋 Fase 8: Deploy e Documentação (PENDENTE)

### 8.1 Preparação
- [ ] Revisar variáveis de ambiente
- [ ] Configurar CI/CD
- [ ] Otimizar build de produção

### 8.2 Deploy
- [ ] Configurar servidor de produção
- [ ] Migrar banco de dados
- [ ] Configurar monitoramento (Sentry)

### 8.3 Documentação
- [ ] Atualizar README.md
- [ ] Documentar APIs e hooks
- [ ] Criar guia de uso para vendedores

**Estimativa:** ~8h

---

## 📊 Resumo de Progresso

| Fase | Status | Tempo Estimado | Tempo Real | Progresso |
|------|--------|----------------|------------|-----------|
| 1. Levantamento | ✅ Concluído | 8h | 8h | 100% |
| 2. Setup | ✅ Concluído | 6h | 6h | 100% |
| 3. Refatoração | ✅ Concluído | 16h | 16h | 100% |
| 4. Novo Modelo | 🔄 Em Progresso | 20h | 6h | 30% |
| 5. Geração PDF | 📋 Pendente | 12h | 0h | 0% |
| 6. Testes | 📋 Pendente | 8h | 0h | 0% |
| 7. Avançado | 📋 Futuro | 40h | 0h | 0% |
| 8. Deploy | 📋 Pendente | 8h | 0h | 0% |
| **TOTAL MVP** | **43%** | **70h** | **36h** | **43%** |

---

## 🎯 Próximo Milestone

**Objetivo:** Implementar novo layout do PDF e validar preview completo  
**Prazo sugerido:** 2-3 dias  
**Responsável:** Equipe de desenvolvimento  

**Critérios de aceitação:**
- ✅ Todas as 11 páginas implementadas
- ✅ Novos campos de garantias integrados
- ✅ Logo atualizada seguindo padrão
- ✅ Preview fiel ao PDF de referência
- ✅ Build e lint passando
- ✅ Responsivo em mobile e desktop

---

## 📝 Notas Importantes

1. **Padrão de desenvolvimento:** Seguir `copilot-instructions.md`
2. **Gerenciador de pacotes:** Usar **apenas npm** (não bun)
3. **Shell:** PowerShell (Windows) - usar `;` para encadear comandos
4. **Validação:** Sempre rodar `npm run build` e `npx eslint@9 .` após mudanças
5. **DRY Principle:** Evitar duplicação; centralizar lógica em utils
6. **Responsividade:** Mobile-first, testar em diferentes dispositivos

