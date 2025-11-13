import { apiClient, ApiResponse } from '@/integrations/api/client';

// Utility to set the first user as admin
export const setupFirstAdmin = async (userId: string) => {
  try {
    // Check if user already has a role. Call eq() before select() since the
    // shim executes the fetch in select().
    const existingRoleResp = await apiClient
      .from('user_roles')
      .eq('user_id', userId)
      .select('role') as ApiResponse<Array<{ role?: string }>>;
    const existingRoleRow = Array.isArray(existingRoleResp?.data) ? existingRoleResp.data[0] : existingRoleResp?.data ?? null;

    if (existingRoleRow && existingRoleRow.role) {
      return existingRoleRow.role;
    }

    // Check if there are any admins in the system
    const adminsResp = await apiClient
      .from('user_roles')
      .eq('role', 'administrador')
      .limit(1)
      .select('id') as ApiResponse<Array<{ id?: string }>>;

    const adminsData = adminsResp?.data ?? [];
    const adminsError = adminsResp?.error ?? null;
    if (adminsError) {
      console.error('Error checking for admins:', adminsError);
      return 'cliente';
    }

    // If no admins exist, make this user an admin
    const roleToAssign = (Array.isArray(adminsData) && adminsData.length === 0) ? 'administrador' : 'cliente';

    const insertResp = await apiClient
      .from('user_roles')
      .insert({ user_id: userId, role: roleToAssign }) as ApiResponse<unknown>;
    const insertError = insertResp?.error ?? null;
    if (insertError) {
      console.error('Error assigning role:', insertError);
      return 'cliente';
    }

    return roleToAssign;
  } catch (error) {
    console.error('Error in setupFirstAdmin:', error);
    return 'cliente';
  }
};