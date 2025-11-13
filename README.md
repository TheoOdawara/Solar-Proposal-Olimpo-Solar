# 🏗️ Arquitetura Solar Proposal - Olimpo Solar

# Solar Proposal Olimpo

## 📋 Visão Geral

## Project Overview

Sistema de propostas solares com arquitetura em **3 containers Docker**:

- **Frontend**: React 18 + Vite + TailwindCSS (Porta 8080)This repository showcases my work on the Solar Proposal Olimpo project. Originally developed by a client using Lovable, the project began to present numerous bugs and issues. I was hired to fix, refactor, and improve the application, ensuring stability, better user experience, and maintainability.

- **Backend**: Node.js + Express + TypeScript (Porta 3001)

- **Database**: PostgreSQL 15 (Porta 5432)**My Role:**

- Diagnosed and fixed critical bugs left by the previous team (Was using Lovable)

---- Refactored code for reliability and scalability

- Improved UI/UX and responsiveness

## 🚀 INÍCIO RÁPIDO - Legacy Supabase (migrated) and PDF generation

- Ensured code quality with strict TypeScript and ESLint rules

```bash- Provided technical documentation and support for future maintenance

# 1. Subir todos os containers

docker-compose up -d --build## Technologies Used



# 2. Acessar a aplicação- React 18

# Frontend: http://localhost:8080- TypeScript

# Backend: http://localhost:3001/health- Vite

```- Tailwind CSS

- shadcn/ui

**Login Padrão (admin)**:

- Email: `theoodawara@gmail.com`
- Senha: `Admin@123`

Nota: o projeto foi originalmente integrado com Supabase (self-hosted). Essa integração foi migrada para uma API REST própria; referências a Supabase no histórico do projeto foram mantidas apenas em artefatos de infraestrutura e documentação técnica quando necessário.



---## Key Improvements



## 📁 Estrutura- Fixed major bugs affecting proposal creation and preview

- Improved PDF export and chart rendering

```- Enhanced mobile and desktop responsiveness

├── frontend/          # React + Vite (Container 1)- Refactored state management and API integration

├── backend/           # Node + Express (Container 2)- Applied best practices for code quality and maintainability

├── database/          # Migrations/Seeds

└── docker-compose.yml # Orquestração---

```

---

## 🛠️ Comandos Docker

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Resetar tudo
docker-compose down -v && docker-compose up -d --build
```

---

## 🔌 API Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login | ❌ |
| POST | `/api/auth/register` | Registro | ❌ |
| GET | `/api/auth/me` | Usuário atual | ✅ |
| GET | `/api/users` | Listar usuários | ✅ Admin |
| POST | `/api/users` | Criar usuário | ✅ Admin |
| PUT | `/api/users/:id` | Atualizar usuário | ✅ Admin |
| DELETE | `/api/users/:id` | Deletar usuário | ✅ Admin |

---

## 🔧 Desenvolvimento Local (sem Docker)

### Backend
```bash
cd backend
npm install
npm run dev  # http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:8080
```

### Database
```bash
# PostgreSQL deve estar rodando na porta 5432
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=olimpo_solar \
  postgres:15-alpine
```

---

## 📊 Schema do Banco

- **users** (id, email, password_hash, created_at, updated_at)
- **profiles** (id→users, full_name, email, created_at)
- **user_roles** (id, user_id→users, role, created_at)

**Roles**: `administrador`, `vendedor`, `cliente`

---

## 🐛 Troubleshooting

### "Porta já em uso"
```bash
# Windows
netstat -ano | findstr ":8080"
taskkill /PID <pid> /F
```

### "Container não inicia"
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### "Banco não conecta"
```bash
# Verificar se PostgreSQL está rodando
docker ps | grep olimpo-db

# Conectar manualmente
docker exec -it olimpo-db psql -U postgres -d olimpo_solar
```

---

## 📝 Variáveis de Ambiente

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (`.env`)
```env
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=olimpo_solar
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=olimpo_solar_secret_key_change_in_production_2024
```

---

## ✅ Checklist de Migração

- [x] Estrutura de pastas criada
- [x] Docker Compose configurado
- [x] Backend com JWT e bcrypt
- [x] Migrations do banco
- [x] Seed de usuário admin
- [ ] Frontend integrado com API
- [ ] CRUD de propostas
- [ ] Geração de PDF

---

**Versão**: 2.0.0  
**Stack**: React + Node.js + PostgreSQL  
**Data**: 05/11/2025
