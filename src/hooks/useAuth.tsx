import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";
import { setupFirstAdmin } from '@/utils/adminSetup';
import { errorLogger } from '@/utils/errorLogger';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    timeoutId = setTimeout(() => {
      setError('Não foi possível conectar ao servidor. Verifique a conexão com o Supabase.');
      setLoading(false);
    }, 10000); // 10 segundos

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        clearTimeout(timeoutId);
        setSession(session);
        setUser(session?.user ?? null);
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const userId = session.user.id;
            const email = session.user.email;
            const fullName = session.user.user_metadata?.full_name || '';
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', userId)
              .single();
            if (!profile && fullName) {
              await supabase.from('profiles').insert({ id: userId, full_name: fullName });
            }
            const adminEmails = [
              'theoodawara@gmail.com',
              'marketing.olimposolar@gmail.com'
            ];
            if (adminEmails.includes(email)) {
              // Avoid PostgREST 409 conflict by checking existing row first.
              const { data: existingRole } = await supabase
                .from('user_roles')
                .select('id, role')
                .eq('user_id', userId)
                .maybeSingle();

              if (existingRole && existingRole.id) {
                // update role if needed
                await supabase
                  .from('user_roles')
                  .update({ role: 'administrador' })
                  .eq('user_id', userId);
              } else {
                // insert new role
                await supabase.from('user_roles').insert({ user_id: userId, role: 'administrador' });
              }
            } else {
              await setupFirstAdmin(userId);
            }
            setTimeout(() => {
              setLoading(false);
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            setLoading(false);
          }
        } catch (err) {
          const e = err instanceof Error ? err : new Error(String(err));
          errorLogger.logAuthError(e, { context: 'auth_onChange' });
          setError('Erro ao conectar ao Supabase.');
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (sessionError) {
        setError('Erro ao obter sessão do Supabase.');
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      
      // Clean existing auth state before signup (não loga senha)
      const cleanupAuthState = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };

      cleanupAuthState();

      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails, mas nunca logar senha
        errorLogger.logAuthError(err, { context: 'signup_cleanup' });
      }

      const redirectUrl = `${window.location.origin}/email-confirmation`;

      // Nunca logar senha em nenhum momento
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: fullName ? { full_name: fullName } : undefined
        }
      });

      if (error) {
        errorLogger.logAuthError(error, { context: 'signup', email });
        throw error;
      }

      // Cria perfil na tabela profiles se cadastro OK e user.id disponível
      const userId = data?.user?.id;
      if (userId && fullName) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: userId, full_name: fullName });
        if (profileError) {
          errorLogger.logAuthError(profileError, { context: 'profile_insert', userId, fullName });
        }
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Confirme o cadastro no email.",
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.logAuthError(err, { context: 'signup', email });
      toast({
        title: "Erro no cadastro",
        description: err.message || "Erro desconhecido no cadastro",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean existing auth state before signin (não loga senha)
      const cleanupAuthState = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };

      cleanupAuthState();

      // Attempt to sign out any existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even se falhar, mas nunca logar senha
        errorLogger.logAuthError(err, { context: 'signin_cleanup' });
      }

      // Nunca logar senha
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Nunca logar senha
        errorLogger.logAuthError(error, { context: 'signin', email });
        throw error;
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.logAuthError(err, { context: 'signin', email });
      toast({
        title: "Erro no login",
        description: err.message || "Erro desconhecido no login",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state
      const cleanupAuthState = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };
      
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        errorLogger.logAuthError(err, { context: 'signout' });
      }
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorLogger.logAuthError(err, { context: 'signout' });
      toast({
        title: "Erro no logout",
        description: err.message || "Erro desconhecido no logout",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🔵 [Google Auth] Iniciando login com Google...');
      console.log('🔵 [Google Auth] URL atual:', window.location.href);
      console.log('🔵 [Google Auth] Origin:', window.location.origin);
      
      setLoading(true);
      
      const redirectTo = `${window.location.origin}/`;
      console.log('🔵 [Google Auth] Redirect URL configurado:', redirectTo);
      
      // Verificar configuração do cliente Supabase
      console.log('🔵 [Google Auth] Cliente Supabase inicializado');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      console.log('🔵 [Google Auth] Resposta do signInWithOAuth:', { data, error });
      
      if (error) {
        console.error('🔴 [Google Auth] Erro no signInWithOAuth:', error);
        console.error('🔴 [Google Auth] Código do erro:', error.message);
        console.error('🔴 [Google Auth] Stack trace:', error.stack);
        
        errorLogger.logAuthError(error, { 
          context: 'google_signin',
          redirectTo,
          currentUrl: window.location.href,
          userAgent: navigator.userAgent
        });
        throw error;
      }
      
      console.log('🟢 [Google Auth] Redirecionamento iniciado com sucesso');
      
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error('🔴 [Google Auth] Erro geral no login:', err);
      console.error('🔴 [Google Auth] Tipo do erro:', typeof err);
      console.error('🔴 [Google Auth] Propriedades do erro:', Object.keys(err as object));
      
      errorLogger.logAuthError(err, { 
        context: 'google_signin_catch',
        currentUrl: window.location.href,
        userAgent: navigator.userAgent,
        errorType: typeof err,
        errorKeys: Object.keys(err as object)
      });
      
      toast({
        title: "Erro no login com Google",
        description: err.message || "Erro desconhecido no login",
        variant: "destructive"
      });
      throw err;
    } finally {
      console.log('🔵 [Google Auth] Finalizando processo de login');
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };
};