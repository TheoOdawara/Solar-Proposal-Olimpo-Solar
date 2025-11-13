-- Seed: Criar usuário administrador padrão
-- Senha padrão: Admin@123
-- Hash gerado com bcrypt (10 rounds): $2b$10$ijkGdlV4oTaJt2bOAv/Ux.F4Hk1kABLQiTLmCYLsNkG4XarFcd8Vq

INSERT INTO users (email, password_hash)
VALUES ('theoodawara@gmail.com', '$2b$10$ijkGdlV4oTaJt2bOAv/Ux.F4Hk1kABLQiTLmCYLsNkG4XarFcd8Vq')
ON CONFLICT (email) DO NOTHING;

-- Pegar o ID do usuário criado
DO $$
DECLARE
  user_id_var UUID;
BEGIN
  SELECT id INTO user_id_var FROM users WHERE email = 'theoodawara@gmail.com';
  
  -- Atualizar profile
  UPDATE profiles 
  SET full_name = 'Theo Christiano da Silva Odawara'
  WHERE id = user_id_var;
  
  -- Atualizar role para administrador
  UPDATE user_roles 
  SET role = 'administrador'
  WHERE user_id = user_id_var;
END $$;

-- Verificar
SELECT 
  u.id,
  u.email,
  p.full_name,
  ur.role,
  u.created_at
FROM users u
JOIN profiles p ON p.id = u.id
JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'theoodawara@gmail.com';
