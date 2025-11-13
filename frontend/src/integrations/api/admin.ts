// Admin/service client wrapper. It should call privileged endpoints on the backend
// (protected by server-side checks). Exposes a `.from()` to keep compatibility
// with code that used `supabaseAdmin.from(...)`.

const API_URL = (import.meta.env.VITE_API_URL || '') as string;

import type { FromQuery } from './client';

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

export const apiAdmin = {
  from(table: string) {
    const tableUrl = (path = '') => `${API_URL}/${table}${path}`;

    return {
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
  eq(..._args: unknown[]) { void _args; return this; },
  select(_cols = '*') { void _cols; return this; },
  single() { return this; },
  maybeSingle() { return this; },
  limit(..._args: unknown[]) { void _args; return this; },
  order(..._args: unknown[]) { void _args; return this; }
    } as unknown as FromQuery;
  }
};

export default apiAdmin;
