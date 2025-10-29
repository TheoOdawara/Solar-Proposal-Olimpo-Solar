import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';


export const useAdminAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (user?.email) {
        // Busca role do usuário no banco via API Supabase
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          if (!error && data?.role === 'administrador') {
            setHasAdminAccess(true);
            setRole('administrador');
          } else {
            setHasAdminAccess(false);
            setRole(data?.role || null);
          }
        } catch {
          setHasAdminAccess(false);
          setRole(null);
        }
      } else {
        setHasAdminAccess(false);
        setRole(null);
      }
    };
    checkAccess();
  }, [user]);

  return {
    hasAdminAccess,
    loading: authLoading,
    role
  };
};