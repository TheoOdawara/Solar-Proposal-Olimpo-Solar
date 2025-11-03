import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';


export const useAdminAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      console.log('🔍 useAdminAccess - Verificando acesso. user:', user?.id, 'email:', user?.email);
      
      if (!user?.id) {
        console.log('❌ useAdminAccess - Sem usuário');
        setHasAdminAccess(false);
        setRole(null);
        return;
      }

      try {
        console.log('📡 useAdminAccess - Consultando user_roles para:', user.id);
        
        // Verificar sessão JWT
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('🔑 Session JWT presente?', !!sessionData.session?.access_token);
        
        // Testar função uid() diretamente
        const { data: uidTest } = await supabase.rpc('uid');
        console.log('🆔 Teste uid():', uidTest);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        console.log('📊 useAdminAccess - Resposta:', { data, error });
        
        if (error) {
          console.error('❌ Erro ao verificar role:', error);
          setHasAdminAccess(false);
          setRole(null);
          return;
        }

        if (data?.role === 'administrador') {
          console.log('✅ useAdminAccess - Usuário É ADMINISTRADOR');
          setHasAdminAccess(true);
          setRole('administrador');
        } else {
          console.log('⚠️ useAdminAccess - Usuário NÃO é admin. Role:', data?.role);
          setHasAdminAccess(false);
          setRole(data?.role || null);
        }
      } catch (err) {
        console.error('💥 Exceção ao verificar role:', err);
        setHasAdminAccess(false);
        setRole(null);
      }
    };
    
    if (user && !authLoading) {
      console.log('🚀 useAdminAccess - Iniciando verificação');
      checkAccess();
    } else {
      console.log('⏳ useAdminAccess - Aguardando. user:', !!user, 'authLoading:', authLoading);
    }
  }, [user, authLoading]);

  return {
    hasAdminAccess,
    loading: authLoading,
    role
  };
};