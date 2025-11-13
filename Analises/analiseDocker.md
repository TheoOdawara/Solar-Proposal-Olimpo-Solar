# Análise da pasta `docker`

Visão geral
- Avaliar `docker-compose.yml` e sub-pastas (dev/docker) para garantir que containers backend, db e frontend estejam separados e orquestráveis.

Arquivos críticos
- `docker-compose.yml`
- `dev/docker-compose.dev.yml`
- `docker/README.md`

O que funciona / não funciona (evidência)
- Testar `docker compose up -d` e validar healthchecks.

Referências a `supabase`
- (listar ocorrências no `docker` se houver)

Ações recomendadas
- Garantir que variáveis de ambiente estejam documentadas e mapeadas em `docker-compose.yml`.
- Incluir volumes para dados e instruções de reset.

Critério de aceitação
- `docker compose up -d` levanta backend, frontend e db com healthchecks OK.

Estimativa
- 1–3h para validar e ajustar.

Anexos / evidências
- Logs e outputs.
