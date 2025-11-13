// Small API client shim to replace previous Supabase client usage.
// Exposes `auth` methods used across the app and basic helpers.

const API_URL = (import.meta.env.VITE_API_URL || '') as string;

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

// Small typed helpers to avoid `any` in adapters
export type ApiResponse<T = unknown> = { data?: T; error?: unknown };

export type FromQuery = {
  select: (cols?: string) => Promise<ApiResponse<unknown>>;
  insert: (payload: unknown) => Promise<ApiResponse<unknown>>;
  update: (payload: unknown) => Promise<ApiResponse<unknown>>;
  delete: () => Promise<ApiResponse<unknown>>;
  eq: (...args: unknown[]) => FromQuery;
  gte: (...args: unknown[]) => FromQuery;
  lte: (...args: unknown[]) => FromQuery;
  order: (...args: unknown[]) => FromQuery;
  single: () => FromQuery;
  maybeSingle: () => FromQuery;
  limit: (...args: unknown[]) => FromQuery;
};

type AuthPayload = { user?: { id?: string; email?: string; user_metadata?: Record<string, unknown> }; token?: string } | null;

export const apiClient = {
  auth: {
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });
        const payload = (await parseJsonSafe(res)) as AuthPayload;
        if (!res.ok) return { data: null, error: payload || { message: 'Erro ao autenticar' } };
        return { data: { user: payload?.user ?? null, session: { access_token: payload?.token ?? null } }, error: null };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { data: null, error: { message } };
      }
    },

  async signUp({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, unknown>; emailRedirectTo?: string } } ) {
      try {
        const body: { email: string; password: string; data?: Record<string, unknown> } = { email, password };
        if (options?.data) body.data = options.data;
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        });
        const payload = await parseJsonSafe(res);
        if (!res.ok) return { data: null, error: payload || { message: 'Erro ao registrar' } };
        return { data: payload, error: null };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { data: null, error: { message } };
      }
    },

    async getSession() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        const payload = await parseJsonSafe(res);
        if (!res.ok) return { data: { session: null }, error: payload || { message: 'No session' } };
        return { data: { session: payload as Record<string, unknown> }, error: null };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { data: { session: null }, error: { message } };
      }
    },

    async signOut() {
      try {
        const res = await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        if (!res.ok) return { error: { message: 'Erro ao deslogar' } };
        return { error: null };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { error: { message } };
      }
    },

    // Allow optional args for compatibility with previous client signatures
    async signOutWithOptions(_opts?: unknown) {
      void _opts;
      return await this.signOut();
    },

    // Minimal OAuth helper: redirect to backend OAuth endpoint
    async signInWithOAuth({ provider, options }: { provider: string; options?: { redirectTo?: string; queryParams?: Record<string, unknown> } | undefined }) {
      const redirectTo = options?.redirectTo || window.location.origin;
      const params = new URLSearchParams();
      if (options?.queryParams) {
        Object.entries(options.queryParams as Record<string, unknown>).forEach(([k, v]) => params.append(k, String(v)));
      }
      const url = `${API_URL}/auth/oauth/${provider}?redirectTo=${encodeURIComponent(redirectTo)}&${params.toString()}`;
      // perform a redirect
      window.location.href = url;
      return { data: null, error: null };
    },

    async verifyOtp({ email, token, type }: { email: string; token: string; type: string }) {
      try {
        const res = await fetch(`${API_URL}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token, type }),
          credentials: 'include',
        });
        const payload = await parseJsonSafe(res);
        if (!res.ok) return { data: null, error: payload || { message: 'Erro ao verificar token' } };
        return { data: payload, error: null };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return { data: null, error: { message } };
      }
    },

    onAuthStateChange(_handler?: (event: string, session: unknown) => void) {
      // Accept an optional handler for compatibility with code that expects
      // `onAuthStateChange((event, session) => ...)`. This shim cannot
      // emit real-time auth events, so we simply return a no-op subscription.
      // The handler (if provided) is intentionally not called here.
      // Mark the handler as used to satisfy the linter.
      void _handler;
      const subscription = { unsubscribe: () => {} };
      return { data: { subscription } };
    }
  },

  // Minimal from(...) helper for compatibility. It delegates to REST endpoints
  // expecting routes under /api/{table}. This is a very small compatibility layer
  // and may need to be expanded to match the backend API shape.
  from(table: string): FromQuery {
    const tableUrl = (path = '') => `${API_URL}/${table}${path}`;

    return {
        async select(_cols = '*') {
          void _cols;
          const res = await fetch(tableUrl(''), { credentials: 'include' });
          const data = await parseJsonSafe(res);
          return { data, error: res.ok ? null : data };
      },
        async insert(payload: unknown) {
        const res = await fetch(tableUrl(''), {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include'
        });
          const data = await parseJsonSafe(res);
          return { data, error: res.ok ? null : data };
      },
        async update(payload: unknown) {
        const res = await fetch(tableUrl(''), {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), credentials: 'include'
        });
          const data = await parseJsonSafe(res);
          return { data, error: res.ok ? null : data };
      },
      async delete() {
        const res = await fetch(tableUrl(''), { method: 'DELETE', credentials: 'include' });
          const data = await parseJsonSafe(res);
          return { data, error: res.ok ? null : data };
      },
      // chain helpers used in code (eq, order, single, maybeSingle, limit)
    eq(..._args: unknown[]) { void _args; return this; },
  gte(..._args: unknown[]) { void _args; return this; },
  lte(..._args: unknown[]) { void _args; return this; },
    order(..._args: unknown[]) { void _args; return this; },
    single() { return this; },
    maybeSingle() { return this; },
    limit(..._args: unknown[]) { void _args; return this; }
    } as unknown as FromQuery;
  }
};

export default apiClient;
