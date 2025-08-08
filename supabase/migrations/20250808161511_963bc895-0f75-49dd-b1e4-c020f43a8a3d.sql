-- Fase 1: Roles seguros com RLS e funções utilitárias

-- 1) Enum app_role (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END
$$;

-- 2) Tabela user_roles (idempotente)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  CONSTRAINT user_roles_user_unique UNIQUE (user_id)
);

-- 3) RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4) Função has_role (SECURITY DEFINER) para evitar recursão em policies
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  );
$$;

-- 5) Função ensure_first_admin: promove o primeiro usuário autenticado a admin
CREATE OR REPLACE FUNCTION public.ensure_first_admin(p_user_id uuid)
RETURNS public.app_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing public.app_role;
  admin_exists boolean;
  assigned_role public.app_role;
BEGIN
  -- Se já tiver role, retorna a existente
  SELECT role INTO existing FROM public.user_roles WHERE user_id = p_user_id;
  IF existing IS NOT NULL THEN
    RETURN existing;
  END IF;

  -- Verifica se já existe algum admin
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO admin_exists;

  IF admin_exists THEN
    assigned_role := 'user';
  ELSE
    assigned_role := 'admin';
  END IF;

  -- Insere/atualiza ignorando RLS (via SECURITY DEFINER)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, assigned_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

  RETURN assigned_role;
END;
$$;

-- 6) Policies (idempotentes)
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7) Permissões de execução das funções
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_first_admin(uuid) TO anon, authenticated;