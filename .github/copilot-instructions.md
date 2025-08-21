## Padrão de logo no ProposalPreview


### Padrão para LogoBranca.png 
Sempre que for usada a imagem `LogoBranca.png` no componente `ProposalPreview` (exemplo: página "SEU INVESTIMENTO"), utilize o seguinte padrão de posicionamento e tamanho:

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

Esse padrão garante destaque visual, alinhamento à direita e proporção adequada para a logo branca. Use este padrão sempre que a logo branca for solicitada explicitamente.

Para as demais páginas, utilize o padrão anterior com `olimpoLogo` azul, salvo exceções explicitamente solicitadas.
# Instruções para Assistente (GitHub Copilot)

Este documento orienta como o assistente deve operar neste repositório para agilizar entregas com segurança e padrão.

## Visão rápida do projeto
- Stack: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Estado/Fetch: TanStack Query (react-query)
- PDF: `src/lib/pdf-generator.ts` + `html2canvas` + `jspdf`
- Backend: Supabase (`src/integrations/supabase`)
- Lint: ESLint 9 (flat config em `eslint.config.js`)
- Build: Vite
- Manager: bun.lockb presente (preferir Bun), mas `npm` também pode ser usado
- SO/Terminal: Windows + PowerShell (use `;` para encadear comandos)

## Organização de código
- Componentes: `src/components/**`
- Hooks: `src/hooks/**`
- Páginas/Rotas: `src/pages/**` (usa `react-router-dom`)
- Tipos: `src/types/**` (ex.: `proposal.ts`)
- Utilitários: `src/utils/**`, `src/lib/**`
- Constantes/dados: `src/constants/**`

## Padrões de código
- TypeScript estrito onde possível; preferir tipos e `zod` para validação de dados.
- Seguir regras do ESLint em `eslint.config.js` (React Hooks, React Refresh). Não introduzir regras novas sem motivo claro.
- Formatação: se necessário, alinhar-se ao padrão atual do repositório (não há Prettier configurado; evite grandes reformatções).
- Nomes de arquivos em `camelCase`/`PascalCase` conforme contexto (componentes em `PascalCase`).
- Evitar side-effects em módulos; preferir funções puras em `utils`.

## Execução de tarefas (PowerShell)
- Dev: `bun dev` ou `npm run dev`
- Build: `bun run build` ou `npm run build`
- Preview: `bun run preview` ou `npm run preview`
- Lint (sem instalar globalmente):
  - Bun: `bunx eslint@9 .`
  - npm: `npx eslint@9 .`
- Encadear no PowerShell: `comando1 ; comando2`

Observação: se ocorrer conflito de dependências ao instalar com npm, preferir `bun install` ou rodar ferramentas via `bunx`/`npx` sem instalar tudo.

## Convenções ao implementar mudanças
1. Explique rapidamente o que será feito e execute (evitar perguntas desnecessárias).
2. Edite o menor número de arquivos possível; evite reformatar blocos não relacionados.
3. Após mudanças relevantes, valide:
   - Build do Vite
   - Lint (ESLint)
4. Não faça chamadas externas com segredos. Use variáveis `.env` do Vite (`import.meta.env`) quando necessário.
5. Não introduza dependências pesadas sem motivo; prefira utilitários já existentes.
6. Mensagens curtas, objetivas e em português. Nome do assistente quando solicitado: "GitHub Copilot".

## Integrações e dados
- Supabase: conferir chaves/URLs via variáveis de ambiente; não commitar segredos.
- Query: use React Query para dados remotos; cache, estados de loading/erro.
- PDF: centralizar lógica em `src/lib/pdf-generator.ts` e componentes de prévia.

## UI/UX
- Seguir padrões do shadcn/ui e Tailwind presentes no projeto.
- Componentes devem ser acessíveis e responsivos (mobile-first).

## Erros, logs e métricas
- Preferir utilitários existentes (`src/utils/errorLogger.ts`, `src/utils/logger.ts`, `src/utils/sentry.ts`).
- Sentry está presente; não enviar dados sensíveis.

## Testes
- Não há stack de testes configurada. Se necessário, sugerir `vitest + testing-library` em PR separado.

## Commits e PRs
- Mensagens claras (p.ex., Conventional Commits: feat, fix, chore, docs...).
- Descrever impacto, breaking changes e passos de validação.

## Do / Don’t
- Do:
  - Manter ESLint verde e build passando
  - Pequenas melhorias colaterais de baixo risco (tipos, comentários, docs)
- Don’t:
  - Reescrever estrutura inteira sem razão
  - Alterar versões de libs críticas sem validação
  - Introduzir code style novo que conflite com o existente

## Dicas práticas
- Para rodar lint rápido sem instalar deps: `bunx eslint@9 .` ou `npx eslint@9 .`
- Em caso de conflitos do npm, prefira Bun (`bun install`, `bunx ...`).
- Em PowerShell, use `;` para executar vários comandos em sequência.

---
Se algo aqui conflitar com decisões futuras do time, atualizar este arquivo para manter o assistente alinhado.
