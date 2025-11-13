import { apiAdmin } from './admin';
import { apiClient, ApiResponse } from './client';

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

export async function listProfiles(): Promise<UserWithRole[]> {
  type Row = { user_id: string; role: string; created_at?: string };
  const rolesResp = await apiClient.from('all_user_roles_admin').select('user_id, role, created_at') as ApiResponse<Row[]>;
  const rolesData = rolesResp?.data ?? null;
  const rolesError = rolesResp?.error ?? null;

  if (rolesError) throw rolesError;
  if (!rolesData) return [];

  const profilesResp = await apiClient.from('profiles').select('id, full_name, email, created_at') as ApiResponse<Array<{ id: string; full_name?: string; email?: string; created_at?: string }>>;
  const profilesData = profilesResp?.data ?? null;
  const profilesError = profilesResp?.error ?? null;

  if (profilesError) throw profilesError;

  return rolesData.map((roleRow) => {
    const profile = (profilesData || []).find((p) => p.id === roleRow.user_id);
    return {
      id: roleRow.user_id,
      email: profile?.email || 'Email não disponível',
      full_name: profile?.full_name || '',
      role: roleRow.role,
      created_at: profile?.created_at || roleRow.created_at || ''
    };
  });
}

export async function createUser(userData: CreateUserData): Promise<UserWithRole> {
  const { email, password, full_name, role } = userData;

  const authResp = await apiClient.auth.signUp({ email, password, options: { data: { full_name } } });
  const authData = (authResp as unknown as { data?: { user?: { id?: string } } })?.data ?? null;
  const authError = (authResp as unknown as { error?: unknown })?.error ?? null;
  if (authError) throw authError;
  if (!authData?.user) throw new Error('Falha ao criar usuário');

  const userId = authData.user.id as string;
  try {
    const profileResp = await apiAdmin.from('profiles').insert({ id: userId, full_name, email }) as ApiResponse<unknown>;
    const profileError = profileResp?.error ?? null;
    if (profileError) throw profileError;

    if (role !== 'cliente') {
        // call eq before update to match the shim (select executes the fetch)
        const roleResp = await apiAdmin.from('user_roles').eq('user_id', userId).update({ role }) as ApiResponse<unknown>;
      const roleError = roleResp?.error ?? null;
      if (roleError) throw roleError;
    }

    return { id: userId, email, full_name, role, created_at: new Date().toISOString() };
  } catch (error) {
    console.error('Erro ao criar profile/role, usuário criado mas incompleto:', error);
    throw new Error('Falha ao criar perfil do usuário. Usuário foi criado mas está incompleto.');
  }
}

export async function updateProfile(id: string, updates: UpdateUserData): Promise<UserWithRole> {
  if (updates.full_name) {
    // ensure we update only the intended profile
    const profileResp = await apiAdmin.from('profiles').eq('id', id).update({ full_name: updates.full_name }) as ApiResponse<unknown>;
    const profileError = profileResp?.error ?? null;
    if (profileError) throw profileError;
  }

  if (updates.role) {
    const roleResp = await apiAdmin.from('user_roles').eq('user_id', id).update({ role: updates.role }) as ApiResponse<unknown>;
    const roleError = roleResp?.error ?? null;
    if (roleError) throw roleError;
  }

  const users = await listProfiles();
  const updated = users.find(u => u.id === id);
  if (!updated) throw new Error('Usuário não encontrado após atualização');
  return updated;
}

export async function deleteUser(id: string): Promise<void> {
  // apply filter before delete
  const roleResp = await apiAdmin.from('user_roles').eq('user_id', id).delete() as ApiResponse<unknown>;
  const roleError = roleResp?.error ?? null;
  if (roleError) throw roleError;

  const profileResp = await apiAdmin.from('profiles').eq('id', id).delete() as ApiResponse<unknown>;
  const profileError = profileResp?.error ?? null;
  if (profileError) throw profileError;

  console.warn('Usuário removido de profiles e user_roles, mas permanece em auth.users');
}

export async function validateEmail(email: string): Promise<boolean> {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}
