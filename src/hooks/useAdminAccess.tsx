import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_EMAILS = [
  'marketing.olimposolar@gmail.com',
  'theoodawara@gmail.com'
];

export const useAdminAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (user?.email) {
        // Permite se email autorizado
        if (ADMIN_EMAILS.includes(user.email)) {
          setHasAdminAccess(true);
          setRole('admin');
          return;
        }
        // Busca role do usuário no banco via API Supabase
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();
          if (!error && data?.role === 'admin') {
            setHasAdminAccess(true);
            setRole('admin');
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
    adminEmail: ADMIN_EMAILS.join(', '),
    role
  };
};