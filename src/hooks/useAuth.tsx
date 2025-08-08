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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Set up roles for users
          setTimeout(async () => {
            await setupFirstAdmin(session.user.id);
          }, 0);
          setTimeout(() => {
            setLoading(false);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
    } catch (error: any) {
      errorLogger.logAuthError(error, { context: 'signup', email });
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro desconhecido no cadastro",
        variant: "destructive"
      });
      throw error;
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
    } catch (error: any) {
      errorLogger.logAuthError(error, { context: 'signin', email });
      toast({
        title: "Erro no login",
        description: error.message || "Erro desconhecido no login",
        variant: "destructive"
      });
      throw error;
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
    } catch (error: any) {
      errorLogger.logAuthError(error, { context: 'signout' });
      toast({
        title: "Erro no logout",
        description: error.message || "Erro desconhecido no logout",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        errorLogger.logAuthError(error, { context: 'google_signin' });
        throw error;
      }
    } catch (error: any) {
      errorLogger.logAuthError(error, { context: 'google_signin' });
      toast({
        title: "Erro no login com Google",
        description: error.message || "Erro desconhecido no login",
        variant: "destructive"
      });
      throw error;
    } finally {
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