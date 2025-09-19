-- Deletar dados das tabelas relacionadas primeiro (para evitar constraint errors)
DELETE FROM public.user_roles;
DELETE FROM public.proposals;
DELETE FROM public.customers;

-- Deletar usuários da auth usando uma função específica para isso
DO $$
DECLARE
  user_rec record;
BEGIN
  FOR user_rec IN SELECT id FROM auth.users LOOP
    DELETE FROM auth.users WHERE id = user_rec.id;
  END LOOP;
END $$;