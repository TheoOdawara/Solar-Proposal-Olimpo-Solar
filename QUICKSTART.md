# 🚀 Guia Rápido - Olimpo Solar v2.0

## ✅ Configuração Concluída

- ✅ Backend configurado com ES Modules (type: "module")
- ✅ Frontend movido para /frontend
- ✅ Docker Compose com 3 containers
- ✅ PostgreSQL standalone
- ✅ Migrations e Seeds prontos

---

## 📦 Próximos Passos

### 1. Subir os containers

```bash
docker-compose up -d --build
```

- Isso vai iniciar:
- **PostgreSQL** na porta 5432 (banco limpo, sem componentes do Supabase)
- **Backend** na porta 3001 (Node.js + Express)
- **Frontend** na porta 8080 (React + Vite)

### 2. Acessar a aplicação

- Frontend: http://localhost:8080
- Backend API: http://localhost:3001/health
- PostgreSQL: localhost:5432

### 3. Verificar logs

```bash
# Ver todos os logs
docker-compose logs -f

# Ver apenas backend
docker-compose logs -f backend

# Ver apenas frontend  
docker-compose logs -f frontend

# Ver apenas banco
docker-compose logs -f db
```

---

## 🔧 Desenvolvimento

### Rodar localmente (sem Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**PostgreSQL:**
```bash
# Usar container standalone
docker run -d \
  --name postgres-local \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=olimpo_solar \
  postgres:15-alpine
```

---

## 🗄️ Database

O PostgreSQL vai iniciar automaticamente com:
- Database: `olimpo_solar`
- User: `postgres`
- Password: `postgres`
- Port: `5432`

### Conectar ao banco

```bash
docker exec -it olimpo-db psql -U postgres -d olimpo_solar
```

### Executar migration manualmente

```bash
docker exec -i olimpo-db psql -U postgres -d olimpo_solar < database/migrations/001_init.sql
```

### Criar usuário admin

```bash
docker exec -i olimpo-db psql -U postgres -d olimpo_solar < database/seeds/admin_user.sql
```

**Credenciais:**
- Email: theoodawara@gmail.com
- Senha: Admin@123

---

## 🌐 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registrar |
| GET | `/api/auth/me` | Usuário atual |
| GET | `/api/users` | Listar (admin) |
| POST | `/api/users` | Criar (admin) |
| PUT | `/api/users/:id` | Atualizar (admin) |
| DELETE | `/api/users/:id` | Deletar (admin) |

---

## ⚙️ Comandos Úteis

```bash
# Parar tudo
docker-compose down

# Resetar tudo (apaga volumes)
docker-compose down -v

# Rebuild completo
docker-compose down -v && docker-compose up -d --build

# Ver containers rodando
docker ps

# Entrar no container
docker exec -it olimpo-backend sh
docker exec -it olimpo-frontend sh
docker exec -it olimpo-db sh
```

---

## 📝 Próximas Tarefas

- [ ] Integrar frontend com API REST
- [ ] Criar camada `src/api` no frontend
- [ ] Reescrever hooks (useAuth, useProposals)
- [ ] Remover dependências legadas do Supabase
- [ ] Implementar CRUD de propostas
- [ ] Migrar geração de PDF

---

**Status**: Arquitetura pronta, falta integração frontend-backend  
**Data**: 05/11/2025
