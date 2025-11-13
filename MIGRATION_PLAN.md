# Plano de Migração: Supabase → API REST + PostgreSQL

## Objetivo
Migrar de Supabase (self-hosted) para arquitetura separada:
- **Frontend**: React + Vite (isolado)
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: PostgreSQL standalone

---

## Nova Estrutura de Pastas

```
Solar-Proposal-Olimpo-Solar/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── api/                # Nova pasta para chamadas HTTP
│   │   ├── assets/
│   │   └── constants/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.ts
│
├── backend/                     # Node.js + Express
│   ├── src/
│   │   ├── config/             # DB config, env vars
│   │   ├── controllers/        # Auth, Users, Proposals
│   │   ├── middlewares/        # Auth JWT, error handler
│   │   ├── models/             # DB models/queries
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Helpers
│   │   └── server.ts           # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── database/                    # PostgreSQL scripts
│   ├── migrations/             # Schema versioning
│   │   ├── 001_init.sql
│   │   ├── 002_users_roles.sql
│   │   └── 003_proposals.sql
│   ├── seeds/                  # Dados iniciais
│   │   └── admin_user.sql
│   └── schema.sql              # Schema completo atual
│
├── docker/                      # Mantido para PostgreSQL
│   └── docker-compose.yml      # Apenas PostgreSQL
│
└── docs/                        # Documentação
```

---

## Etapas da Migração

### 1. Setup Backend (Node.js + Express)
- [x] Criar estrutura de pastas
- [ ] Configurar TypeScript
- [ ] Setup Express
- [ ] Configurar pg (node-postgres)
- [ ] Implementar autenticação JWT
- [ ] Criar endpoints:
  - POST /api/auth/login
  - POST /api/auth/register
  - GET /api/auth/me
  - GET /api/users (admin)
  - POST /api/users (admin)
  - PUT /api/users/:id (admin)
  - DELETE /api/users/:id (admin)
  - GET /api/proposals
  - POST /api/proposals
  - PUT /api/proposals/:id
  - DELETE /api/proposals/:id

### 2. Migração do Database
- [ ] Exportar schema atual do Supabase
- [ ] Criar migrations para PostgreSQL standalone
- [ ] Migrar dados existentes
- [ ] Configurar Docker Compose apenas com PostgreSQL

### 3. Reestruturação Frontend
- [ ] Mover todos arquivos para `/frontend`
- [ ] Remover dependências do Supabase
- [ ] Criar camada de API (`src/api/`)
- [ ] Reescrever hooks:
  - useAuth → fetch /api/auth/*
  - useProposals → fetch /api/proposals/*
  - useAdminAccess → baseado em token JWT
- [ ] Atualizar vite.config.ts com proxy para backend
- [ ] Atualizar variáveis de ambiente

### 4. Integração e Testes
- [ ] Testar autenticação
- [ ] Testar CRUD de usuários (admin)
- [ ] Testar CRUD de propostas
- [ ] Testar geração de PDF
- [ ] Validar responsividade
- [ ] Build de produção

---

## Schema PostgreSQL (do Supabase atual)

### Tabelas principais:

```sql
-- users (auth.users → public.users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_roles
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('administrador', 'vendedor', 'cliente')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- proposals (estrutura atual)
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  -- ... demais campos da proposta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Stack Tecnológica

### Frontend (mantido)
- React 18
- TypeScript
- Vite
- TailwindCSS + shadcn/ui
- React Query (para cache)
- React Router
- Axios/Fetch

### Backend (novo)
- Node.js 20+
- Express
- TypeScript
- pg (node-postgres)
- bcrypt (hash de senhas)
- jsonwebtoken (JWT)
- dotenv
- cors
- helmet (segurança)

### Database
- PostgreSQL 15+
- Docker (desenvolvimento)

---

## Variáveis de Ambiente

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/olimpo_solar
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
```

---

## Próximos Passos

1. ✅ Criar este documento de planejamento
2. Implementar backend básico com autenticação
3. Migrar schema do banco
4. Mover frontend para pasta dedicada
5. Substituir chamadas Supabase por API REST
6. Testar integração completa
7. Remover código/dependências do Supabase
8. Atualizar documentação

---

## Benefícios da Migração

✅ **Controle total** sobre API e autenticação
✅ **Simplicidade** - sem abstrações do Supabase
✅ **Performance** - comunicação direta com PostgreSQL
✅ **Flexibilidade** - custom business logic
✅ **Debugging** mais fácil
✅ **Deploy** mais simples (frontend estático + backend Node)
✅ **Custos** menores em produção

---

## Riscos e Mitigações

⚠️ **Risco**: Perder dados durante migração
✅ **Mitigação**: Backup completo antes de iniciar

⚠️ **Risco**: Downtime durante transição
✅ **Mitigação**: Desenvolver em paralelo, migrar apenas quando 100% funcional

⚠️ **Risco**: Bugs em autenticação custom
✅ **Mitigação**: Testes extensivos, seguir best practices (bcrypt, JWT)

---

**Criado em**: 05/11/2025  
**Status**: Planejamento concluído, aguardando execução
