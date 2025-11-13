# 🚀 Migração (Supabase legacy) → API REST

## Status Atual da Migração

### ✅ Concluído
- [x] Planejamento da arquitetura (ver `MIGRATION_PLAN.md`)
- [x] Estrutura de pastas criada
- [x] Backend: package.json e tsconfig.json
- [x] Backend: Configuração de ambiente (.env)
- [x] Backend: Database connection pool (PostgreSQL)
- [x] Backend: JWT utilities
- [x] Backend: Auth middlewares
- [x] Backend: Server básico (Express)
- [x] Database: Migration 001 (users, profiles, user_roles)
- [x] Database: Seed de usuário admin

### ⏳ Próximos Passos

1. **Instalar dependências do backend**
   ```bash
   cd backend
   npm install
   ```

2. **Rodar migration no banco de dados**
   ```bash
   # Se você estiver usando o container local deste repositório, o nome do container do DB padrão é `olimpo-db`.
   docker exec olimpo-db psql -U postgres -d postgres -f /migrations/001_init.sql
   
   # Ou se preferir rodar direto:
   psql -U postgres -h localhost -p 5432 -d postgres -f database/migrations/001_init.sql
   ```

3. **Criar seed do admin**
   ```bash
   psql -U postgres -h localhost -p 5432 -d postgres -f database/seeds/admin_user.sql
   ```

4. **Testar backend**
   ```bash
   cd backend
   npm run dev
   # Acessar: http://localhost:3001/health
   ```

5. **Implementar controllers e routes**
   - `src/controllers/authController.ts`
   - `src/controllers/usersController.ts`
   - `src/routes/auth.ts`
   - `src/routes/users.ts`

6. **Mover frontend para pasta dedicada**
   ```bash
   # Criar pasta frontend e mover arquivos
   mkdir frontend
   mv src frontend/
   mv public frontend/
   mv index.html frontend/
   mv vite.config.ts frontend/
   mv tsconfig.json frontend/
   mv tsconfig.app.json frontend/
   mv tsconfig.node.json frontend/
   mv tailwind.config.ts frontend/
   mv postcss.config.js frontend/
   mv components.json frontend/
   mv package.json frontend/
   mv package-lock.json frontend/
   ```

7. **Atualizar frontend para usar API REST**
   - Remover `@supabase/supabase-js`
   - Criar `frontend/src/api/client.ts`
   - Reescrever hooks (useAuth, useProposals, etc.)

---

## Estrutura Criada

```
Solar-Proposal-Olimpo-Solar/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.ts          # Configurações gerais
│   │   │   └── database.ts       # Pool de conexões PostgreSQL
│   │   ├── middlewares/
│   │   │   └── auth.ts           # Auth e admin middlewares
│   │   ├── utils/
│   │   │   └── jwt.ts            # Generate/verify JWT tokens
│   │   └── server.ts             # Entry point
│   ├── .env                      # Variáveis de ambiente
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── migrations/
│   │   └── 001_init.sql          # Criar users, profiles, user_roles
│   └── seeds/
│       └── admin_user.sql        # Usuário admin padrão
│
└── MIGRATION_PLAN.md             # Plano completo da migração
```

---

## Variáveis de Ambiente

### Backend (`.env`)
```env
PORT=3001
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# JWT
JWT_SECRET=olimpo_solar_secret_key_change_in_production_2024
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:8080
```

### Frontend (criar `frontend/.env`)
```env
VITE_API_URL=http://localhost:3001/api
```

---

## Usuário Admin Padrão

Após rodar o seed:
- **Email**: theoodawara@gmail.com
- **Senha**: Admin@123
- **Role**: administrador

---

## Comandos Úteis

### Backend
```bash
cd backend
npm install          # Instalar dependências
npm run dev          # Rodar em desenvolvimento (tsx watch)
npm run build        # Compilar TypeScript
npm start            # Rodar em produção
```

### Database
```bash
# Executar migrations (substitua `supabase-db` pelo nome do seu container, ex: `olimpo-db`)
docker exec olimpo-db psql -U postgres -d postgres -f /path/to/001_init.sql

# Executar seeds
docker exec olimpo-db psql -U postgres -d postgres -f /path/to/admin_user.sql

# Conectar ao PostgreSQL
docker exec -it olimpo-db psql -U postgres -d postgres
```

### Frontend (após mover)
```bash
cd frontend
npm install
npm run dev
```

---

## Endpoints da API (a implementar)

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuário atual
- `POST /api/auth/logout` - Logout

### Users (Admin)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Proposals
- `GET /api/proposals` - Listar propostas
- `POST /api/proposals` - Criar proposta
- `GET /api/proposals/:id` - Buscar proposta
- `PUT /api/proposals/:id` - Atualizar proposta
- `DELETE /api/proposals/:id` - Deletar proposta

---

## Checklist de Implementação

### Backend
- [ ] Instalar dependências
- [ ] Rodar migrations
- [ ] Rodar seeds
- [ ] Implementar authController
- [ ] Implementar usersController
- [ ] Implementar proposalsController
- [ ] Criar routes
- [ ] Testar endpoints

### Frontend
- [ ] Mover arquivos para /frontend
- [ ] Remover Supabase
- [ ] Criar camada de API
- [ ] Reescrever useAuth
- [ ] Reescrever useProposals
- [ ] Reescrever useAdminAccess
- [ ] Testar integração
- [ ] Build de produção

### Database
- [x] Migration 001 criada
- [x] Seed admin criado
- [ ] Migration para proposals
- [ ] Migrar dados existentes (se houver)

---

## Próxima Ação Imediata

**VOCÊ DEVE**:
1. Revisar este README e o MIGRATION_PLAN.md
2. Decidir se quer continuar com a migração OU voltar atrás
3. Se continuar: rodar `cd backend && npm install`
4. Depois: rodar as migrations do banco de dados

**IMPORTANTE**: Faça backup do banco de dados atual antes de rodar as migrations!

```bash
docker exec supabase-db pg_dump -U postgres postgres > backup_antes_migracao.sql
```

---

**Criado em**: 05/11/2025  
**Última atualização**: 05/11/2025
