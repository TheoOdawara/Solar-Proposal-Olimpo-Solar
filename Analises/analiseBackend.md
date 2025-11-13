# Análise da pasta `backend`

Visão geral
- Objetivo: avaliar o backend Node.js (endpoints, build, tipos, dependências) e garantir que atende ao novo contrato REST usado pelo frontend.

Arquivos críticos
- `backend/package.json`
- `backend/src/server.ts`
- `backend/src/controllers/*`
- `backend/src/config/*`
- `backend/tsconfig.json`

O que funciona / não funciona (evidência)
- Build: (rodar `npx tsc --noEmit -p backend/tsconfig.json` e colar saída)
- Lint: (rodar ESLint)
- Endpoints essenciais: /api/auth/login, /api/auth/register, /api/auth/me, /api/proposals (GET/POST/PUT/DELETE)

Referências a `supabase`
- (Listar ocorrências encontradas com path/linha)

Ações recomendadas
- Confirmar shapes de resposta do auth (login/register/me) e ajustar `frontend/src/integrations/api/client.ts` para mapear corretamente.
- Implementar/ajustar CORS para aceitar `http://localhost:5173` (ou porta do frontend).
- Garantir variáveis de ambiente em `.env.example`.

Riscos / dependências
- Dependência de DB rodando e migrations aplicadas.
- Possível diferença de shape entre supabase e backend — requer adaptação no shim.

Critério de aceitação
- `npx tsc --noEmit` passa
- `npm run start` inicia sem erros e endpoints respondem com JSON conforme contrato
- Teste: POST `/api/auth/login` com credenciais seed retorna 200 + token/session

Estimativa
- (preencher depois de inspecionar os arquivos) 2-6h dependendo de correções.

Anexos / evidências
- Inclusão dos outputs de tsc/eslint e exemplos de requisições/respostas.
