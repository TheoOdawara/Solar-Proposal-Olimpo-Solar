import { supabaseAdmin } from './admin';

// Schema: profiles (id, full_name, created_at) + user_roles (id, user_id, role, created_at)
// Valid roles: administrador, vendedor, cliente
export type UserWithRole = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

export type CreateUserData = {
  email: string;
  password: string;
  full_name: string;
  role: 'administrador' | 'vendedor' | 'cliente';
};

export type UpdateUserData = {
  full_name?: string;
  role?: 'administrador' | 'vendedor' | 'cliente';
};

/**
 * Lista todos os usuários com seus perfis e roles
 */
export async function listProfiles(): Promise<UserWithRole[]> {
  // Buscar user_roles com profiles
  const { data, error } = await supabaseAdmin
    .from('user_roles')
    .select('user_id, role, created_at, profiles!inner(full_name, created_at)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  if (!data) return [];
  
  // Buscar emails do auth.users
  const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
  const authUsers = authData?.users || [];
  
  return data.map((row) => {
    const user = authUsers.find((u) => u.id === row.user_id);
    const profileData = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.user_id,
      email: user?.email || '',
      full_name: profileData?.full_name || '',
      role: row.role,
      created_at: profileData?.created_at || row.created_at || ''
    };
  });
}

/**
 * Cria novo usuário (auth + profile + role)
 * Email de confirmação será enviado automaticamente
 */
export async function createUser(userData: CreateUserData): Promise<UserWithRole> {
  const { email, password, full_name, role } = userData;

  // 1. Criar usuário no auth (email_confirm: false para enviar email)
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false // Usuário precisa confirmar email
  });

  if (authError) throw authError;
  if (!authUser.user) throw new Error('Falha ao criar usuário');

  const userId = authUser.user.id;

  try {
    // 2. Inserir em profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({ id: userId, full_name });

    if (profileError) throw profileError;

    // 3. Inserir em user_roles
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role });

    if (roleError) throw roleError;

    return {
      id: userId,
      email,
      full_name,
      role,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    // Rollback: deletar usuário do auth se falhar
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw error;
  }
}

/**
 * Atualiza dados do usuário (nome e/ou role)
 */
export async function updateProfile(id: string, updates: UpdateUserData): Promise<UserWithRole> {
  // Atualizar full_name em profiles
  if (updates.full_name) {
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ full_name: updates.full_name })
      .eq('id', id);
    
    if (profileError) throw profileError;
  }

  // Atualizar role em user_roles
  if (updates.role) {
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .update({ role: updates.role })
      .eq('user_id', id);
    
    if (roleError) throw roleError;
  }

  // Retornar usuário atualizado
  const users = await listProfiles();
  const updated = users.find(u => u.id === id);
  if (!updated) throw new Error('Usuário não encontrado após atualização');
  return updated;
}

/**
 * Remove usuário completamente (auth + profile + role)
 */
export async function deleteUser(id: string): Promise<void> {
  // 1. Deletar de user_roles (FK constraint)
  const { error: roleError } = await supabaseAdmin
    .from('user_roles')
    .delete()
    .eq('user_id', id);
  
  if (roleError) throw roleError;

  // 2. Deletar de profiles
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', id);
  
  if (profileError) throw profileError;

  // 3. Deletar de auth.users
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (authError) throw authError;
}

/**
 * Valida formato de email
 */
export async function validateEmail(email: string): Promise<boolean> {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}
