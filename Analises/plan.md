# Plano Mestre de Migração e Homologação

Visão geral
- Objetivo: migrar o projeto para usar backend Node.js + PostgreSQL (self-hosted), garantir que o frontend use o `apiClient` REST e remover qualquer referência ao identificador `supabase` do código fonte.

Entregáveis
1. `./Analises/analise*.md` por área (criado)
2. Correções no frontend para usar `apiClient` (já iniciado)
3. Confirmação de migrations + seeds aplicadas e documentação
4. Atualização de `copilot-instructions.md` e `docs/*`
5. Homologação: build, lint, login e CRUD propostas funcionando

Fases e tarefas (ordem executável)

Fase 0 — Preparação
- Criar `./Analises` (feito) e templates (feito)
- Rodar validações rápidas: `npx tsc --noEmit`, `npx eslint@9 .`, `npm run build` (onde aplicável)

Fase 1 — Backend
- Inspecionar `backend/` e gerar `Analises/analiseBackend.md` (feito template)
- Ajustar endpoints / CORS / env se necessário
- Testar auth endpoints com seed

Fase 2 — Database
- Aplicar migrations/seeds (já executado em ambiente dev)
- Documentar procedimento em `database/README.md`

Fase 3 — Frontend
- Remover referências a `supabase` no `frontend/src` (várias já editadas)
- Garantir `apiClient` compatível com respostas do backend
- Rodar `npx tsc --noEmit` e `npx eslint@9 .` e corrigir erros
- Build e validar UI e flows (login, propostas CRUD)

Fase 4 — Docker & Docs
- Validar `docker-compose.yml` e ajustar `.env` / volumes
- Atualizar docs (`QUICKSTART.md`, `copilot-instructions.md`)

Fase 5 — Homologação
- Checklist (build, lint, auth, CRUD)
- Gerar relatório final em `Analises/homologacao.md`

Critérios de aceitação (resumido)
- `npx tsc --noEmit` passa para backend e frontend
- `npx eslint@9 .` passa (sem erros críticos)
- Login com credenciais seed funciona (200 + token/session)
- Não existem identificadores `supabase` no `frontend/src`
- Migrations + seeds aplicam sem erros críticos

Prioridade inicial
1. Remover `supabase` do source (alto impacto)
2. Garantir auth endpoints e mapping do `apiClient` (alto)
3. Build e lint fixes (médio)
4. Docs e cleanups (baixo)

Observações operacionais
- Para cada modificação significativa, gerar um arquivo `Analises/pending-patch-<area>.md` com o diff esperado e comando de validação.
- Trabalhar em branches curtas e abrir PRs com mudanças agrupadas por área.

Próximos passos (curto prazo — eu posso executar agora)
1. Rodar busca por "supabase" no repositório e gerar `Analises/supabaseReferences.md` com hits e prioridade de correção. (eu posso fazer agora)
2. Inspecionar `backend/package.json` e `frontend/package.json` e rodar `npx tsc --noEmit` para identificar erros iniciais. (opcional, eu posso fazer)

Se você concordar, eu começo pelo passo 1 (varredura por "supabase").
