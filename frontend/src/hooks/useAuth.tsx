import { useState, useEffect } from 'react';
import { apiClient, ApiResponse } from '@/integrations/api/client';
import { useToast } from "@/hooks/use-toast";
import { setupFirstAdmin } from '@/utils/adminSetup';
import { errorLogger } from '@/utils/errorLogger';

export const useAuth = () => {
  /** Minimal local types to avoid using `any` and satisfy ESLint rules */
  type AuthUser = { id?: string; email?: string | null; user_metadata?: { full_name?: string } | null; [key: string]: unknown };
  type AuthSession = { user?: AuthUser | null; access_token?: string | null; [key: string]: unknown };
  type ApiResult<T> = ApiResponse<T>;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    timeoutId = setTimeout(() => {
      setError('Não foi possível conectar ao servidor. Verifique a conexão com a API.');
      setLoading(false);
    }, 10000); // 10 segundos

    const onAuthResult = apiClient.auth.onAuthStateChange(
      async (event: string, session: AuthSession | null) => {
        if (timeoutId) clearTimeout(timeoutId);
        setSession(session);
        setUser(session?.user ?? null);
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const userId = session.user.id;
            const email = session.user.email;
            // Guard userId: it may be optional on the auth shape. If missing,
            // abort this handler early to avoid sending invalid queries.
            if (!userId || typeof userId !== 'string') {
              errorLogger.logAuthError(new Error('Auth event: missing user id'), { context: 'auth_onChange' });
              setLoading(false);
              return;
            }
            const fullName = session.user.user_metadata?.full_name || '';
            // note: the shim performs the fetch in .select(), so call .eq() before .select()
            const profileResp = await apiClient
              .from('profiles')
              .eq('id', userId)
              .select('id') as ApiResponse<Array<{ id: string }>>;
            const profileRow = Array.isArray(profileResp?.data) ? profileResp.data[0] : profileResp?.data ?? null;
            const profile = profileRow ?? null;
            if (!profile && fullName) {
              const insertProfileResp = await apiClient.from('profiles').insert({ id: userId, full_name: fullName, email: email || '' }) as ApiResponse<unknown>;
              if (insertProfileResp?.error) {
                errorLogger.logAuthError(new Error('Failed to create profile'), { context: 'auth_onChange_profile_insert', details: insertProfileResp.error });
              }
            }
            const adminEmails = [
              'theoodawara@gmail.com',
              'marketing.olimposolar@gmail.com'
            ];
            // email can be null/undefined in the auth shape; guard it before calling includes()
            if (email && adminEmails.includes(email)) {
              // Avoid PostgREST 409 conflict by checking existing row first.
              const existingRoleResp = await apiClient
                .from('user_roles')
                .eq('user_id', userId)
                .select('id, role') as ApiResponse<Array<{ id?: string; role?: string }>>;
              const existingRoleRow = Array.isArray(existingRoleResp?.data) ? existingRoleResp.data[0] : existingRoleResp?.data ?? null;

              if (existingRoleRow && existingRoleRow.id) {
                // update role if needed (call eq before update)
                const updateRoleResp = await apiClient
                  .from('user_roles')
                  .eq('user_id', userId)
                  .update({ role: 'administrador' }) as ApiResponse<unknown>;
                if (updateRoleResp?.error) {
                  errorLogger.logAuthError(new Error('Failed to update user role'), { context: 'auth_onChange_role_update', details: updateRoleResp.error });
                }
              } else {
                // insert new role
                const insertRoleResp = await apiClient.from('user_roles').insert({ user_id: userId, role: 'administrador' }) as ApiResponse<unknown>;
                if (insertRoleResp?.error) {
                  errorLogger.logAuthError(new Error('Failed to insert user role'), { context: 'auth_onChange_role_insert', details: insertRoleResp.error });
                }
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
          setError('Erro ao conectar ao servidor de autenticação.');
          setLoading(false);
        }
      }
    );

    const subscription = onAuthResult?.data?.subscription ?? { unsubscribe: () => {} };

    apiClient.auth.getSession().then((resp: ApiResult<{ session: AuthSession }>) => {
      if (timeoutId) clearTimeout(timeoutId);
      const currentSession = resp?.data?.session ?? null;
      const sessionError = resp?.error ?? null;
      if (sessionError) {
        setError('Erro ao obter sessão da API.');
      }
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    }).catch((e) => {
      if (timeoutId) clearTimeout(timeoutId);
      setError('Erro ao obter sessão da API.');
      setLoading(false);
      errorLogger.logAuthError(e instanceof Error ? e : new Error(String(e)), { context: 'getSession' });
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      try {
        subscription?.unsubscribe?.();
      } catch {
        // ignore unsubscribe failures
      }
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      
      // Clean existing auth state before signup (não loga senha)
      const cleanupAuthState = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('apiClient.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };

      cleanupAuthState();

      // Attempt to sign out any existing session
      try {
        await apiClient.auth.signOut();
      } catch (err) {
        // Continue even if this fails, mas nunca logar senha
        errorLogger.logAuthError(err, { context: 'signup_cleanup' });
      }

      const redirectUrl = `${window.location.origin}/email-confirmation`;

      // Nunca logar senha em nenhum momento
      const { data, error } = await apiClient.auth.signUp({
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
        const { error: profileError } = await apiClient
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
          if (key.startsWith('apiClient.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };

      cleanupAuthState();

      // Attempt to sign out any existing session
      try {
        await apiClient.auth.signOut();
      } catch (err) {
        // Continue even se falhar, mas nunca logar senha
        errorLogger.logAuthError(err, { context: 'signin_cleanup' });
      }

      // Nunca logar senha
      const { error } = await apiClient.auth.signInWithPassword({
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
          if (key.startsWith('apiClient.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };
      
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await apiClient.auth.signOut();
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
      
  // Verificar configuração do cliente de autenticação
  console.log('🔵 [Google Auth] Cliente de autenticação inicializado');
      
      const oauthFn = apiClient.auth.signInWithOAuth;
      if (typeof oauthFn !== 'function') {
        throw new Error('Social login não está configurado no cliente de API.');
      }

      const { data, error } = await oauthFn({
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