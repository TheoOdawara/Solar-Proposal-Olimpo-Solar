import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { apiClient, ApiResponse } from '@/integrations/api/client';
import { useToast } from './use-toast';

type AppRole = 'administrador' | 'vendedor' | 'cliente';

export const useRoles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserRole = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    if (!userId) return;

    try {
      // Call eq before select because the shim executes fetch inside select()
      const resp = await apiClient
        .from('user_roles')
        .eq('user_id', userId)
        .select('role') as ApiResponse<Array<{ role?: string }>>;

      if (resp.error) {
        // If it's a PostgREST 'no rows' style error, treat as missing role
        console.error('Error loading user role:', resp.error);
      }

      const row = Array.isArray(resp.data) ? resp.data[0] : resp.data ?? null;
      setUserRole(row?.role as AppRole || 'cliente');
    } catch (error) {
      console.error('Error loading user role:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserRole();
    } else {
      setUserRole(null);
      setLoading(false);
    }
  }, [user, loadUserRole]);

  const assignRole = async (userId: string, role: AppRole) => {
    try {
      // Try update first
      const updateResp = await apiClient
        .from('user_roles')
        .eq('user_id', userId)
        .update({ role }) as ApiResponse<Array<{ id?: string }>>;

      if (updateResp.error) {
        // If update failed because no row exists, try insert. Otherwise throw.
        console.warn('Update role response error (will attempt insert):', updateResp.error);
        const insertResp = await apiClient
          .from('user_roles')
          .insert({ user_id: userId, role }) as ApiResponse<Array<{ id?: string }>>;

        if (insertResp.error) throw insertResp.error;
      }

      toast({
        title: "Role atribuída com sucesso!",
        description: `Role ${role} atribuída ao usuário.`,
      });

      return true;
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Erro ao atribuir role",
        description: "Ocorreu um erro ao atribuir a role.",
        variant: "destructive"
      });
      return false;
    }
  };

  const isAdmin = userRole === 'administrador';
  const isVendedor = userRole === 'vendedor';
  const isCliente = userRole === 'cliente';

  return {
    userRole,
    loading,
    isAdmin,
    isVendedor,
    isCliente,
    assignRole,
    refresh: loadUserRole
  };
};