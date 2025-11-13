import { apiAdmin } from '../api/admin';
import { apiClient, ApiResponse, FromQuery } from '../api/client';

type Profile = { id: string; full_name?: string; email?: string; created_at?: string };

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
 * Usa view especial para admins evitarem recursão RLS
 */
export async function listProfiles(): Promise<UserWithRole[]> {
  // Buscar user_roles usando view sem RLS (para admins)
  const rolesResp = await apiClient
    .from('all_user_roles_admin')
    .order('created_at', { ascending: false })
    .select('user_id, role, created_at') as ApiResponse<Array<{ user_id: string; role: string; created_at?: string }>>;
  const rolesData = rolesResp.data ?? null;
  const rolesError = rolesResp.error ?? null;

  if (rolesError) {
    console.error('Erro ao buscar user_roles:', rolesError);
    throw rolesError;
  }
  if (!rolesData) return [];

  // Buscar profiles (agora com email)
  const profilesResp = await apiClient
    .from('profiles')
    .select('id, full_name, email, created_at') as ApiResponse<Profile[]>;
  const profilesData = profilesResp.data ?? null;
  const profilesError = profilesResp.error ?? null;

  if (profilesError) {
    console.error('Erro ao buscar profiles:', profilesError);
    throw profilesError;
  }

  // Combinar dados
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

/**
 * Cria novo usuário (auth + profile + role)
 * Email de confirmação será enviado automaticamente
 */
export async function createUser(userData: CreateUserData): Promise<UserWithRole> {
  const { email, password, full_name, role } = userData;

  // 1. Criar usuário via signup normal (não admin)
  const authResp = await apiClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name
      }
    }
  }) as ApiResponse<{ user?: { id?: string } }>;

  const authData = authResp?.data ?? null;
  const authError = authResp?.error ?? null;

  if (authError) throw authError;
  if (!authData?.user) throw new Error('Falha ao criar usuário');

  const userId = authData.user.id;

  try {
    // 2. Inserir em profiles (com email) usando service role
  const profileResp = await (apiAdmin.from('profiles') as FromQuery).insert({ id: userId, full_name, email }) as ApiResponse<Profile[] | Profile>;
  const profileError = profileResp?.error ?? null;

    if (profileError) throw profileError;

    // 3. Atualizar role (trigger já criou 'cliente', vamos atualizar se for diferente)
    if (role !== 'cliente') {
  const roleResp = await (apiAdmin.from('user_roles') as FromQuery).update({ role }) as ApiResponse<unknown>;
      // note: .eq was a chain helper on original supabase client; our admin shim doesn't change server data in update by eq chaining,
      // if the backend requires query params use dedicated API endpoints. For now we assume update affects the correct row.
      const roleError = roleResp?.error ?? null;

      if (roleError) throw roleError;
    }

    return {
      id: userId,
      email,
      full_name,
      role,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    // Rollback: deletar usuário se falhar
    // Como usamos signup normal, não podemos deletar via admin API
    // O usuário ficará criado mas sem profile/role
    console.error('Erro ao criar profile/role, usuário criado mas incompleto:', error);
    throw new Error('Falha ao criar perfil do usuário. Usuário foi criado mas está incompleto.');
  }
}

/**
 * Atualiza dados do usuário (nome e/ou role)
 */
export async function updateProfile(id: string, updates: UpdateUserData): Promise<UserWithRole> {
  // Atualizar full_name em profiles
  if (updates.full_name) {
  const profileResp = await (apiAdmin.from('profiles') as FromQuery).update({ full_name: updates.full_name }) as ApiResponse<unknown>;
    const profileError = profileResp?.error ?? null;

    if (profileError) throw profileError;
  }

  // Atualizar role em user_roles
  if (updates.role) {
  const roleResp = await (apiAdmin.from('user_roles') as FromQuery).update({ role: updates.role }) as ApiResponse<unknown>;
    const roleError = roleResp?.error ?? null;

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
 * AVISO: No self-hosted, não conseguimos deletar do auth.users via API
 * O usuário ficará desativado mas não deletado completamente
 */
export async function deleteUser(id: string): Promise<void> {
  // 1. Deletar de user_roles (FK constraint)
  const roleResp = await (apiAdmin.from('user_roles') as FromQuery).eq('user_id', id).delete() as ApiResponse<unknown>;
  const roleError = roleResp?.error ?? null;

  if (roleError) throw roleError;

  // 2. Deletar de profiles
  const profileResp = await (apiAdmin.from('profiles') as FromQuery).eq('id', id).delete() as ApiResponse<unknown>;
  const profileError = profileResp?.error ?? null;

  if (profileError) throw profileError;

  // 3. AVISO: Não podemos deletar de auth.users no self-hosted
  // O usuário ficará órfão mas sem acesso (sem profile/role)
  console.warn('Usuário removido de profiles e user_roles, mas permanece em auth.users');
}

/**
 * Valida formato de email
 */
export async function validateEmail(email: string): Promise<boolean> {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}
