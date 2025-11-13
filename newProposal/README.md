
# Proposta de Desenvolvimento – Sistema de Propostas Comerciais Olimpo Solar

## Objetivo
Modernizar o sistema de geração e gestão de propostas comerciais, com nova identidade visual, funcionalidades aprimoradas e infraestrutura robusta baseada em container e VPS.

## O que será feito
- Migração do sistema para uma VPS dedicada, com todo o projeto rodando em container (incluindo Supabase — legacy). O projeto agora pode ser executado usando PostgreSQL e a API REST desenvolvida no backend.
- Adaptação do visual para a nova identidade da marca (novas cores, logo, ajustes visuais sutis).
- Reestruturação completa da página de proposta, tornando-a mais profissional e funcional.
- Inclusão de botão para marcar proposta como "aceita".
- Gerenciamento de logins e perfis de usuário (admin/dono e vendedor).
- Métricas: dashboard de propostas enviadas/aceitas.
- Responsividade e acessibilidade garantidas.

## Infraestrutura
- VPS dedicada para hospedagem do sistema.
- Containerização de toda a stack (aplicação + Supabase — legacy). Atualmente a autenticação e persistência estão suportadas pela API REST e PostgreSQL.
- Supabase rodando dentro do container para autenticação, banco de dados e storage.

## Escopo Técnico
- Front-end: React 18, TypeScript, Vite, Tailwind, shadcn/ui
- Back-end: API REST + PostgreSQL (substitui a integração legacy com Supabase para autenticação e banco de dados)
- PDF: Geração e pré-visualização de propostas
- Usuários: Níveis de permissão (admin, vendedor)

## Estimativa de Horas
- Levantamento e Planejamento: 8h
- Setup Inicial e Containerização: 8h
- Design System e Identidade Visual: 12h
- Front-End: 24h
- Funcionalidades de Proposta: 16h
- Gerenciamento de Usuários: 10h
- Métricas e Relatórios: 8h
- Testes e Validação: 6h
- Deploy e Documentação: 6h

**Total:** 98 horas

## Valor Sugerido
- Valor hora: R$ 50,00
- Valor total fechado: **R$ 2.000,00** (em 3x sem juros)

## Condições
- Valor fechado para o cliente: R$ 2.000,00, podendo ser pago em 3 parcelas iguais, sem juros.
- O valor pode ser ajustado conforme escopo final e entrega do design.
- Prazo estimado: 5 a 6 semanas (dependendo da entrega do design e definições de infraestrutura).

## Entregáveis
- Sistema web responsivo e funcional, rodando em VPS/container
- Documentação técnica e de uso
- Suporte para deploy inicial

---

Para dúvidas ou ajustes, entre em contato.
