# Correção da Função is_admin() e Políticas RLS

**Data:** 2025-01-XX  
**Problema:** Criação de usuários falhando com 403/400 devido a função `is_admin()` verificando role 'admin' em vez de 'administrador'

## Mudanças Aplicadas

### 1. Funções de Banco Corrigidas

#### `public.is_admin()` - sem parâmetro
Verifica se o usuário autenticado (auth.uid()) possui role 'administrador':
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'administrador'
  );
$$;
```

#### `public.is_admin(uuid)` - com parâmetro
Verifica se um usuário específico possui role 'administrador':
```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = user_uuid
        AND role = 'administrador'
    );
END;
$$;
```

### 2. Políticas RLS Recriadas

#### `user_roles`
- **Users can view roles**: SELECT permitido para próprio user_id OU se is_admin()
- **Admins can create roles**: INSERT permitido apenas se is_admin()
- **Admins can update roles**: UPDATE permitido apenas se is_admin()
- **Admins can delete roles**: DELETE permitido apenas se is_admin()

#### `profiles`
- **Users can view own profile**: SELECT permitido para auth.uid() = id
- **Users can update own profile**: UPDATE permitido para auth.uid() = id
- **Service role can insert profiles**: INSERT sempre permitido (para service_role criar perfis via admin.createUser)

### 3. Validação

✅ Funções is_admin() retornam `true` para usuários com role 'administrador'  
✅ Políticas RLS aplicadas corretamente  
✅ Build TypeScript passou sem erros  

## Fluxo de Criação de Usuário

1. Frontend usa `supabaseAdmin` (SERVICE_ROLE_KEY)
2. Chama `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })`
3. Insere em `profiles` com `id` do usuário criado
4. Insere em `user_roles` com `user_id` e `role` (administrador/vendedor/cliente)
5. Política "Service role can insert profiles" permite INSERT via SERVICE_ROLE_KEY
6. Política "Admins can create roles" permite INSERT se is_admin() retorna true

## Roles Válidos

- `administrador`: acesso completo, pode criar/editar/deletar usuários
- `vendedor`: acesso intermediário (futuro)
- `cliente`: acesso básico (futuro)

## Comandos Executados

```powershell
# Copiar SQL para container
docker cp fix_admin_function.sql supabase-db:/tmp/fix_admin_function.sql

# Executar no banco
docker exec supabase-db psql -U supabase_admin -d postgres -f /tmp/fix_admin_function.sql

# Validar funções
docker exec supabase-db psql -U supabase_admin -d postgres -c "SELECT public.is_admin(...);"

# Listar políticas
docker exec supabase-db psql -U supabase_admin -d postgres -c "SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename IN ('user_roles', 'profiles');"
```

## Próximos Passos

- [ ] Testar criação de usuário via interface em http://localhost:8080/gerenciar-perfis
- [ ] Validar que admin consegue criar vendedor/cliente
- [ ] Verificar que vendedor/cliente NÃO conseguem criar usuários
- [ ] Testar edição e deleção de perfis
