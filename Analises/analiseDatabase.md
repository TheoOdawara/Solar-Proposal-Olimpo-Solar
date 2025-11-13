# Análise da pasta `database`

Visão geral
- Objetivo: garantir que migrations e seeds estão corretos e aplicáveis ao PostgreSQL standalone, e documentar passos para aplicar em dev/CI.

Arquivos críticos
- `database/migrations/*.sql` (ex.: `001_init.sql`)
- `database/seeds/*.sql` (ex.: `admin_user.sql`)

O que funciona / não funciona (evidência)
- Rodar migrations localmente no container `olimpo-db` com `psql` e validar criação de tabelas e triggers.
- Confirmar INSERT do admin e data nas tabelas `users` e `profiles`.

Referências a `supabase`
- (geralmente não aplicável ao SQL; listar se houver funções dependentes do supabase)

Ações recomendadas
- Documentar passo-a-passo para aplicar migrations via Docker Compose (comando `docker exec` usado anteriormente).
- Criar `database/README.md` com as instruções e credenciais de desenvolvimento.

Riscos / dependências
- Versão do Postgres e extensions (uuid-ossp, pgcrypto) — garantir compatibilidade.

Critério de aceitação
- Migrations aplicam sem erros críticos e seed cria admin (testado por `SELECT id,email FROM users;`).

Estimativa
- 30min–2h (documentação e verificação)

Anexos / evidências
- Comandos usados e outputs de execução.
