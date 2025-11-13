# Análise da pasta `frontend`

Visão geral
- Objetivo: validar que o frontend React+Vite usa o `apiClient` para autenticação e acesso ao banco via API REST e que não há identificadores `supabase` no código fonte.

Arquivos críticos
- `frontend/src/integrations/api/*`
- `frontend/src/hooks/*` (useAuth, useProposals, etc.)
- `frontend/.env` e `vite.config.ts`
- `frontend/package.json`

O que funciona / não funciona (evidência)
- Lint e TypeScript: (rodar `npx tsc --noEmit` e `npx eslint@9 .`)
- Build: `npm run build` (rodar e colar saída)

Referências a `supabase`
- (Listar ocorrência encontradas com path/linha)

Ações recomendadas
- Remover/renomear qualquer export chamado `supabase` (já comecei a re-exportar `apiClient` de arquivos antigos de integração).
- Corrigir chamadas que esperam a forma do `supabase-js` (ex.: `.from(...).select().single()` — adaptar usando `ApiResult<T>` defensivo).
- Rodar `npm run build` e verificar que `dist` não contém referências inválidas (reconstruir para limpar artefatos antigos).

Riscos / dependências
- Dependência do shape das respostas do backend; se diferentes, ajustar `src/integrations/api/client.ts`.

Critério de aceitação
- Não existe o identificador `supabase` no `frontend/src`.
- `npx tsc --noEmit` e `npx eslint@9 .` passam sem erros críticos.
- Login + CRUD de propostas funcionam em dev.

Estimativa
- 2–6h para remover referências e ajustar hooks; mais para typing completo.

Anexos / evidências
- Lista de arquivos modificados e outputs de lint/build.
