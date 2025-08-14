import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";
import { setupFirstAdmin } from '@/utils/adminSetup';
import { errorLogger } from '@/utils/errorLogger';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔵 [Auth State] Configurando listener de mudanças de estado...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔵 [Auth State] Mudança detectada:', { event, userId: session?.user?.id });
        console.log('🔵 [Auth State] Detalhes da sessão:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          provider: session?.user?.app_metadata?.provider
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('🟢 [Auth State] Login bem-sucedido para:', session.user.email);
          console.log('🔵 [Auth State] Configurando primeiro admin...');
          
          // Set up roles for users
          setTimeout(async () => {
            try {
              await setupFirstAdmin(session.user.id);
              console.log('🟢 [Auth State] Primeiro admin configurado com sucesso');
            } catch (error) {
              console.error('🔴 [Auth State] Erro ao configurar primeiro admin:', error);
            }
          }, 0);
          setTimeout(() => {
            setLoading(false);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('🟡 [Auth State] Usuário deslogado');
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔵 [Auth State] Token renovado');
        } else {
          console.log('🔵 [Auth State] Evento não tratado:', event);
        }
      }
    );

    // THEN check for existing session
    console.log('🔵 [Auth State] Verificando sessão existente...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('🔴 [Auth State] Erro ao obter sessão:', error);
      } else {
        console.log('🔵 [Auth State] Sessão existente:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email
        });
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('🔵 [Auth State] Removendo listener de autenticação');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean existing auth state before signup
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
        // Continue even if this fails
        errorLogger.logAuthError(err, { context: 'signup_cleanup' });
      }
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        errorLogger.logAuthError(error, { context: 'signup', email });
        throw error;
      }
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Você foi logado automaticamente.",
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
      
      // Clean existing auth state before signin
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
        // Continue even if this fails
        errorLogger.logAuthError(err, { context: 'signin_cleanup' });
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        errorLogger.logAuthError(error, { context: 'signin', email });
        throw error;
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
      
      // Force page reload for clean state
      window.location.href = '/';
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
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };
};