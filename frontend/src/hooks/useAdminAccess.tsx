import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { apiClient, ApiResponse } from '@/integrations/api/client';


export const useAdminAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user?.id) {
        setHasAdminAccess(false);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Call eq before select to match the apiClient chaining behavior
        const resp = await apiClient.from('user_roles').eq('user_id', user.id).select('user_id,role') as ApiResponse<Array<{ user_id: string; role: string }>>;
        const rows = resp?.data ?? [];
        const roleValue = Array.isArray(rows) && rows.length > 0 ? rows[0].role : undefined;

        console.log('📊 useAdminAccess - user:', user.email, 'role:', roleValue, 'hasAccess:', roleValue === 'administrador');

        if (resp?.error) {
          console.error('❌ Erro ao verificar role:', resp.error);
          setHasAdminAccess(false);
          setRole(null);
          setLoading(false);
          return;
        }

        if (roleValue === 'administrador') {
          setHasAdminAccess(true);
          setRole('administrador');
        } else {
          setHasAdminAccess(false);
          setRole(roleValue || null);
        }

        setLoading(false);
      } catch (err) {
        console.error('💥 Exceção ao verificar role:', err);
        setHasAdminAccess(false);
        setRole(null);
        setLoading(false);
      }
    };
    
    if (user && !authLoading) {
      checkAccess();
    } else if (authLoading) {
      setLoading(true);
    }
  }, [user, authLoading]);

  return {
    hasAdminAccess,
    loading,
    role
  };
};