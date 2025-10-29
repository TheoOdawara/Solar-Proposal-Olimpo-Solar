import { supabase } from './client';

export async function signUp(email: string, password: string, data?: Record<string, unknown>) {
  // Wrap signUp with timeout and basic retry to handle self-hosted flakiness
  const attempt = async () => {
    try {
      const res = await supabase.auth.signUp({ email, password, options: { data } });
      return res;
    } catch (err) {
      return { error: err as Error };
    }
  };

  const timeout = (ms: number) => new Promise<{ error: Error }>(resolve => setTimeout(() => resolve({ error: new Error('Auth request timed out') }), ms));

  // try once, but race against timeout
  const result = await Promise.race([attempt(), timeout(8000)]);

  // if timeout returned error, try one quick retry
  type SignUpResult = { data?: unknown; error?: Error | null };
  const typed = result as SignUpResult;
  if (typed.error && typed.error.message === 'Auth request timed out') {
    // quick retry
    const retry = await Promise.race([attempt(), timeout(5000)]) as SignUpResult;
    return retry;
  }

  return typed;
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}
