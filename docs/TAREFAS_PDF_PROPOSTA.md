# Lista de Tarefas - Melhorias PDF Proposta

## ✅ CONCLUÍDO

### 1. Layout Seção "Seu Projeto" (Primeira Solicitação)
- ✅ Imagem principal centralizada no topo
- ✅ Grid 2x3 com ícones em cards cinza claro (#F2F2F2)
- ✅ Informações dinâmicas do formulário:
  - Quantidade de painéis
  - Modelo e marca do inversor  
  - Tipo de estrutura
  - Monitoramento (sim/não)
  - Economia estimada
  - Potência total (kWp)
- ✅ Placeholder "—" para campos vazios
- ✅ Novos campos adicionados à interface `FormData`

### 2. Seção "Garantias" (Primeira Solicitação)
- ✅ Faixa azul escura (#022136) com título "GARANTIAS"
- ✅ Lista de garantias com dados do formulário:
  - Módulos solares (25 anos padrão)
  - Inversores
  - Micro Inversores
  - Estrutura
  - Instalação
- ✅ Separadores brancos entre linhas
- ✅ Rodapé integrado na faixa com ícones amarelos (#ffbf06)
- ✅ QR Code redimensionado no canto inferior direito

### 3. Estrutura A4 e Layout (Segunda Solicitação)
- ✅ Classes CSS `.a4-page`, `.page-header`, `.page-body`, `.page-footer`
- ✅ Media queries para impressão (`@page size:A4; margin:0`)
- ✅ Estrutura header/body/footer em todas as páginas
- ✅ Footer com grid 4 colunas
- ✅ Remoção de espaços em branco excessivos

### 4. Gráficos e Dados
- ✅ Escala automática do eixo Y (dinâmica baseada nos dados)
- ✅ Placeholder "Dados não disponíveis" para datasets vazios
- ✅ Container com altura fixa (120mm) para gráficos
- ✅ Função `drawBarChart` melhorada com cálculo dinâmico de `maxVal`
- ✅ Grid lines automáticas (7-8 linhas)

### 5. Página "SUA ECONOMIA"
- ✅ Grid 3 colunas alinhado ao rodapé
- ✅ Classe `mt-auto` para grudar no fim
- ✅ Cards: Sem/Com/Economia

## ⚠️ PROBLEMAS REPORTADOS (A VERIFICAR)

### Persistência de Erros
- ❌ "o mesmo erro persiste" (último feedback do usuário)
- 🔍 **Necessário**: Debugar logs/console para identificar problemas específicos
- 🔍 **Necessário**: Testar geração do PDF com dados reais

## 🔄 TAREFAS PENDENTES/VALIDAÇÃO

### 1. Teste e Validação
- [ ] Gerar PDF de teste com todos os campos preenchidos
- [ ] Gerar PDF de teste com campos vazios
- [ ] Verificar se layout se mantém em ambos casos
- [ ] Validar que páginas ocupam 100% da altura
- [ ] Verificar qualidade/nitidez do PDF final

### 2. Debugging Necessário
- [ ] Ler console logs para identificar erros atuais
- [ ] Verificar se gráficos renderizam corretamente
- [ ] Validar se dados chegam corretamente aos componentes
- [ ] Testar responsividade em diferentes dispositivos

### 3. Ajustes Finos
- [ ] Verificar se cores seguem identidade visual:
  - Azul escuro: #022136
  - Amarelo: #ffbf06  
  - Branco: #ffffff
- [ ] Validar tipografia consistente
- [ ] Verificar se QR Code não distorce
- [ ] Confirmar que rodapé sempre fica no final

### 4. Performance e Qualidade
- [ ] Verificar se `page-break-inside: avoid` funciona
- [ ] Validar que imagens não cortam
- [ ] Confirmar que `ResponsiveContainer` funciona em print
- [ ] Testar se gráficos Recharts renderizam no PDF

## 📋 CRITÉRIOS DE ACEITE FINAIS

1. **Página 8 (SUA ECONOMIA)**: Sem área vazia, três cards visíveis e alinhados
2. **Página 9 (SUA RENTABILIDADE)**: Gráfico sempre renderiza ou mostra estado vazio
3. **Página 10 (Geração x Consumo)**: Eixo Y auto-ajustado, sem legenda duplicada
4. **Todas as páginas**: 100% altura útil, rodapé no fim
5. **PDF**: Nítido, sem cortes, profissional

## 🔧 ARQUIVOS MODIFICADOS

- `src/lib/pdf-generator.ts` - Lógica principal do PDF
- `src/components/ProposalPreview.tsx` - Preview no navegador  
- `src/components/Footer.tsx` - Rodapé 4 colunas
- `src/index.css` - Classes A4 e layout
- `README.md` - Notas técnicas

## 🚨 PRÓXIMOS PASSOS CRÍTICOS

1. **DEBUGAR**: Usar ferramentas de debug para identificar erro atual
2. **TESTAR**: Gerar PDFs de teste e validar resultado
3. **CORRIGIR**: Ajustar problemas identificados
4. **VALIDAR**: Confirmar que todos os critérios de aceite foram atendidos