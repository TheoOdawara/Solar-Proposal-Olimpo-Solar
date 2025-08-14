import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

type AppRole = 'admin' | 'user';

export const useRoles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserRole = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user role:', error);
        return;
      }

      setUserRole(data?.role || 'user');
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
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role });

      if (error) throw error;

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

  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';

  return {
    userRole,
    loading,
    isAdmin,
    isUser,
    assignRole,
    refresh: loadUserRole
  };
};