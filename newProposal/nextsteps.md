# Next Steps – Substituição do Modelo de Proposta

> **Status Atual:** Refatoração estrutural concluída. Próximo: implementar novo layout do PDF.

---


## ✅ Tela de Login
- Implementação finalizada e validada
- Responsiva, acessível, com integração Supabase Auth
- Paleta e logo aplicadas conforme padrão

## ✅ Concluído

### 1. Análise e Mapeamento de Dados
...existing code...

---

## 🔄 Em Progresso

### 4. Implementação do Novo Layout PDF
**Status:** Pronto para iniciar

**Próximas ações:**
1. Analisar cada página do novo PDF (`newProposal/novaApresentacaoPorPag/`)
2. Refatorar `ProposalPreview.tsx` para seguir novo layout:
   - Página 1: Capa com especificações
   - Página 2: Quem Somos (estático)
   - Página 3: Como Funciona (estático)
   - Página 4: Benefícios (lista)
   - Página 5: Nossos Projetos (grid - futuro dinâmico)
   - Página 6: Sua Economia (comparativo)
   - Página 7: Seu Retorno (gráfico payback)
   - Página 8: Rentabilidade (comparativo investimentos)
   - Página 9: Capacidade de Geração (gráfico sazonal)
   - Página 10: Seu Investimento (tabela financiamento)
   - Página 11: Termo de Compromisso (assinaturas)
3. Integrar novos campos de garantias no preview
4. Aplicar novo padrão de logo (`.github/copilot-instructions.md`)

### 5. Atualização da Logo
**Status:** Arquivos disponíveis em `newProposal/Logo/`, aguardando integração

**Padrão definido:**
```jsx
<div className="w-full flex justify-end pt-2 pb-8">
  <div className="w-[400px] h-[160px] flex items-center justify-end">
    <img
      src="/lovable-uploads/LogoBranca.png"
      alt="Olimpo Solar"
      className="max-w-full max-h-full object-contain"
    />
  </div>
</div>
```

---

## 📋 Pendente

### 6. Integração Completa dos Novos Campos
- [ ] Testar salvamento com campos de garantias
- [ ] Testar carregamento de proposta salva
- [ ] Validar que todos os 7 campos aparecem no PDF gerado

### 7. Testes End-to-End
- [ ] Criar proposta nova com todos os campos preenchidos
- [ ] Salvar no banco (verificar dados no Supabase)
- [ ] Carregar proposta salva
- [ ] Gerar PDF e validar conteúdo completo
- [ ] Testar responsividade (mobile/desktop)

### 8. Ajustes Finais
- [ ] Revisar toda a jornada do usuário
- [ ] Validar textos e formatações
- [ ] Documentar mudanças no README
- [ ] Preparar para deploy

---

## 📊 Métricas de Progresso

| Etapa | Status | Linhas Economizadas |
|-------|--------|---------------------|
| Migration SQL | ✅ | — |
| Tipos atualizados | ✅ | — |
| Mapeamento centralizado | ✅ | ~130 linhas |
| Componentes modulares | ✅ | ~220 linhas |
| pdf-generator refatorado | ✅ | ~37 linhas |
| **Total** | **67% concluído** | **~387 linhas** |

---

## 🎯 Próximo Passo Imediato

**Implementar novo layout do PDF em `ProposalPreview.tsx`**
- Começar pela página 1 (Capa)
- Seguir estrutura do PDF em `newProposal/novaApresentacaoPorPag/`
- Aplicar padrão de logo definido em `copilot-instructions.md`
- Integrar novos campos de garantias e características


Legenda Origem:
- DB = campo já existente no banco (tabela `proposals` ou derivado de cálculos)
- CALC = derivado de cálculo em `useProposalCalculations` / `calculations.ts`
- UI = preenchido pelo usuário no formulário (ainda não persistido diretamente ou precisa ser acrescentado)
- STATIC = texto fixo (não precisa de campo)
- TODO = campo inexistente que precisa ser adicionado (banco e tipo)

| Página | Seção / Elemento | Label / Conteúdo Dinâmico | Campo / Fonte Proposta Atual | Origem | Status |
|-------|-------------------|---------------------------|------------------------------|--------|--------|
| 1 (Capa) | Cabeçalho | Cliente | `clientName` / `client_name` | UI/DB | OK |
| 1 (Capa) | Endereço | Rua + número | `address` + `number` / `address`? | UI/DB | VALIDAR concat |
| 1 (Capa) | Endereço | Bairro - Cidade | `neighborhood` + `city` | UI/DB | OK |
| 1 (Capa) | Contato | Telefone | `phone` | DB? (falta em form principal) | VALIDAR |
| 1 (Capa) | Especificações | Potência do Sistema | `systemPower` / `system_power` | UI/DB | OK |
| 1 (Capa) | Especificações | Quantidade de Módulos | `moduleQuantity` / `module_quantity` | UI/DB | OK |
| 1 (Capa) | Especificações | Potência dos Módulos | `modulePower` / `module_power` | UI/DB | OK |
| 1 (Capa) | Especificações | Marca dos Módulos | `moduleBrand` / `module_brand` | UI/DB | OK |
| 1 (Capa) | Especificações | Marca do Inversor | `inverterBrand` / `inverter_brand` | UI/DB | OK |
| 1 (Capa) | Especificações | Potência do Inversor | `inverterPower` / `inverter_power` | UI/DB | OK |
| 2 (Quem Somos) | Corpo | (Nenhum dinâmico) | — | STATIC | OK |
| 3 (Como Funciona) | Corpo | (Nenhum dinâmico) | — | STATIC | OK |
| 4 (Benefícios) | Lista | Itens benefícios | hardcoded `benefitsArr` | STATIC | OK |
| 5 (Nossos Projetos) | Grid | Imagens Projetos | (futuro: coleção `projects`?) | TODO | FUTURO |
| 6 (Sua Economia) | Comparativo | Conta atual mês | `economyData.currentBillPerMonth` | CALC | OK |
| 6 (Sua Economia) | Comparativo | Conta atual ano | `economyData.currentBillPerYear` | CALC | OK |
| 6 (Sua Economia) | Comparativo | Conta com solar mês | `economyData.billWithSolarPerMonth` | CALC | OK |
| 6 (Sua Economia) | Comparativo | Conta com solar ano | `economyData.billWithSolarPerYear` | CALC | OK |
| 6 (Sua Economia) | Economia Destaque | Economia mês | `economyData.savingsPerMonth` | CALC | OK |
| 6 (Sua Economia) | Economia Destaque | Economia ano | `economyData.savingsPerYear` | CALC | OK |
| 7 (Seu Retorno) | Gráfico Retorno | Payback anos | `totalValue / (savingsPerYear)` | CALC | OK |
| 7 (Seu Retorno) | Gráfico Retorno | Retorno acumulado por ano | loop calculado | CALC | OK |
| 7 (Seu Retorno) | Métricas | Investimento Inicial | `totalValue` | CALC/DB | OK |
| 7 (Seu Retorno) | Métricas | Economia / Ano | `savingsPerYear` | CALC | OK |
| 7 (Seu Retorno) | Métricas | Retorno 25 anos | acumulado (loop) | CALC | OK |
| 8 (Rentabilidade) | Gráfico Comparativo | Valores Poupança/CDB | fórmula mock | STATIC (pode virar config) | OK |
| 8 (Rentabilidade) | Gráfico Comparativo | Energia Solar Value | `totalValue + savings(5y)` | CALC | OK |
| 8 (Rentabilidade) | Métricas Blocos | Valor cada investimento | derivado | CALC/STATIC | OK |
| 9 (Capacidade Geração) | Gráfico sazonal | Geração mensal | `systemPower` * fator sazonal | CALC | OK |
| 9 (Capacidade Geração) | Gráfico sazonal | Consumo mensal | `monthlyGeneration` * fator | CALC | OK |
| 9 (Capacidade Geração) | Métricas | Geração média kWh | `metricas.geracaoMedia` | CALC | OK |
| 9 (Capacidade Geração) | Métricas | Consumo médio kWh | `metricas.consumoMedio` | CALC | OK |
| 9 (Capacidade Geração) | Métricas | Economia % | `metricas.economia` | CALC | OK |
| 10 (Seu Investimento) | Valor Total | Valor do Sistema | `totalValue` | DB/CALC | OK |
| 10 (Seu Investimento) | Tabela Financiamento | Parcelas 18..84 | `totalValue / meses` | CALC | OK |
| 10 (Seu Investimento) | Observação Crédito | Texto fixo | STATIC | OK |
| 10 (Seu Investimento) | Texto visita técnica | Bloco explicativo | STATIC | OK |
| 11 (Termo Compromisso) | Assinatura Contratante | Nome cliente | `clientName` | UI/DB | OK |
| 11 (Termo Compromisso) | Assinatura Contratante | Endereço linha | `address`, `number` | UI/DB | OK |
| 11 (Termo Compromisso) | Assinatura Contratante | Bairro - Cidade | `neighborhood` - `city` | UI/DB | OK |
| 11 (Termo Compromisso) | Assinatura Contratante | Data | `formatDateShort()` | CALC | OK |
| 11 (Termo Compromisso) | Assinatura Contratado | Empresa/CNPJ | STATIC (dados empresa) | STATIC | OK |
| Global | Garantias | Módulos, Inversores, etc. | `moduleWarranty`, `inverterWarranty`, etc. | UI (novos) | FALTANDO persistência |
| Global | Projeto (painéis, inversor, estrutura...) | structureType, monitoring | UI (novos) | FALTANDO persistência |

### 1.2 Lacunas Identificadas

- Garantias (`moduleWarranty`, `inverterWarranty`, `microInverterWarranty`, `structureWarranty`, `installationWarranty`) não existem no tipo `ProposalData` e nem obviamente na tabela (confirmar). Necessário: migrar para banco.
- Campos de estrutura e monitoramento (`structureType`, `monitoring`) idem acima.
- Possível necessidade de normalizar marcas/modelos: hoje `moduleBrand`, `module_model` (aparece `module_model` no tipo mas não usado no form). Validar se manter ambos ou consolidar.
- Página "Nossos Projetos": placeholder estático; se for dinamizar, criar tabela `projects` (id, title, image_url, capacity_kwp, city, created_at, order_index) e endpoint/listagem.
- Valores de referência Poupança/CDB estão hardcoded; poderiam vir de tabela `investment_reference_rates` ou constantes versionadas.

### 1.3 Ações Recomendadas (Dados)

1. Alterar schema da tabela `proposals` adicionando colunas (nullable inicialmente) para garantias e características adicionais:
   - `structure_type text`
   - `monitoring text`
   - `module_warranty text`
   - `inverter_warranty text`
   - `micro_inverter_warranty text`
   - `structure_warranty text`
   - `installation_warranty text`
2. Atualizar `ProposalData` com esses campos (snake_case) e adaptar form/hook.
3. Ajustar `FormData` (frontend) para manter paridade e mapear para `ProposalData` no save.
4. Centralizar form <-> DB mapping em um util (`mapFormToProposalPayload(formData)` e `mapProposalToForm(proposal)`).
5. (Opcional futuro) Criar tabela `projects` se for dinamizar página 5.
6. (Opcional futuro) Tabela `reference_investments` para valores comparativos configuráveis.

### 1.4 Próximos Passos Técnicos

- Após validar este mapeamento: aplicar migration SQL + atualizar tipos.
- Refatorar `pdf-generator.ts` para usar os mesmos cálculos utilitários já usados no preview evitando divergência (DRY).
- Isolar lógica de gráficos em funções puras reutilizáveis (ex: `buildReturnData(totalValue, annualSavings)` e `buildSeasonalData(systemPower, monthlyGeneration)`).
- Implementar persistência dos novos campos no formulário e salvar no Supabase.


## 2. Atualização da Logo
- [ ] Selecionar a logo correta da pasta `newProposal/Logo` (preferir SVG/PNG).
- [ ] Substituir a logo antiga nos componentes, seguindo o padrão de posicionamento/tamanho do repositório.
- [ ] Validar visualmente a aplicação da nova logo em todas as páginas relevantes.

## 3. Refatoração do Componente de Proposta
- [ ] Localizar o componente responsável pela visualização/geração da proposta (ex: `src/components/ProposalPreview.tsx`).
- [ ] Refatorar o layout para seguir fielmente o novo PDF:
   - Usar Tailwind + shadcn/ui.
   - Garantir responsividade e acessibilidade.
- [ ] Integrar todos os campos dinâmicos com os dados do backend.

## 4. Geração e Exportação de PDF
- [ ] Adaptar `src/lib/pdf-generator.ts` para capturar o novo layout.
- [ ] Testar a geração do PDF com dados reais e mockados.
- [ ] Garantir fidelidade visual entre o PDF gerado e o modelo enviado.

## 5. Testes e Validação
- [ ] Validar visualmente em diferentes tamanhos de tela (mobile/desktop).
- [ ] Conferir se todos os dados aparecem corretamente.
- [ ] Rodar lint e build para garantir qualidade do código.
- [ ] Testar a exportação do PDF em diferentes navegadores.

## 6. Ajustes Finais e Documentação
- [ ] Atualizar comentários e documentação do componente.
- [ ] Adicionar instruções de uso/atualização da logo se necessário.
# Next Steps – Sistema de Propostas Comerciais Olimpo Solar

1. **Receber Design Final**
   - Aguardar entrega do layout pelo designer
   - Validar identidade visual, cores, logos e ícones

2. **Definir Infraestrutura**
   - Escolher provedor de hospedagem (VPS recomendado)
   - Validar viabilidade do Supabase (plano gratuito ou pago)
   - Estruturar banco de dados inicial

3. **Mapear Regras de Negócio**
   - Listar todos os campos obrigatórios para cada tipo de proposta
   - Definir permissões e fluxos de cada tipo de usuário

4. **Setup Inicial**
   - Configurar repositório, ambiente e dependências
   - Iniciar implementação do design system

5. **Desenvolvimento Iterativo**
   - Implementar funcionalidades por etapas, priorizando MVP
   - Testar e validar com usuários-chave

6. **Deploy e Ajustes Finais**
   - Subir ambiente de produção
   - Ajustar conforme feedback

---

## Observações
- O cronograma pode ser ajustado conforme a entrega do design e definição da infraestrutura.
- Recomenda-se reuniões semanais para alinhamento e acompanhamento do progresso.
