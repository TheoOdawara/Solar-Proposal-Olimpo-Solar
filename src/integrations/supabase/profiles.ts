import { supabase } from './client';

// Real DB schema: profiles (id, full_name, created_at) + user_roles (id, user_id, role, created_at)
// Valid roles: administrador, vendedor, cliente
export type UserWithRole = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

export async function listProfiles(): Promise<UserWithRole[]> {
  // Get all user_roles with profiles
  const { data, error } = await supabase
    .from('user_roles')
    .select('user_id, role, created_at, profiles!inner(full_name, created_at)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  if (!data) return [];
  
  // Get emails from auth.users
  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUsers = authData?.users || [];
  
  const result: UserWithRole[] = data.map((row) => {
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
  
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function addProfile(_data: { full_name: string; email: string; role: string }): Promise<UserWithRole> {
  throw new Error('Use createAdminUser function to create users');
}

export async function updateProfile(id: string, updates: { full_name?: string; role?: string }): Promise<UserWithRole> {
  // Update full_name in profiles
  if (updates.full_name) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: updates.full_name })
      .eq('id', id);
    if (profileError) throw profileError;
  }
  
  // Update role in user_roles
  if (updates.role) {
    const { error: roleError } = await supabase
      .from('user_roles')
      .update({ role: updates.role })
      .eq('user_id', id);
    if (roleError) throw roleError;
  }
  
  // Return updated user
  const users = await listProfiles();
  const updated = users.find(u => u.id === id);
  if (!updated) throw new Error('User not found after update');
  return updated;
}

export async function removeProfile(id: string): Promise<void> {
  // Delete from user_roles first (FK constraint)
  const { error: roleError } = await supabase.from('user_roles').delete().eq('user_id', id);
  if (roleError) throw roleError;
  
  // Delete from profiles
  const { error: profileError } = await supabase.from('profiles').delete().eq('id', id);
  if (profileError) throw profileError;
  
  // Delete from auth.users (requires service role - must be done by admin function)
  // For now we just delete the profile and role records
}

export async function validateEmail(email: string): Promise<boolean> {
  // Validação simples de formato
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regex.test(email)) return false;
  
  // Nota: auth.users não é acessível via REST API com anon key
  // A validação real de duplicidade acontece no signUp (retorna erro se já existe)
  // Por enquanto, apenas valida o formato
  return true;
}
