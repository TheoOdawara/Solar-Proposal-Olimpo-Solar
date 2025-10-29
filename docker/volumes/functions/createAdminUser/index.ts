// Supabase Edge Function (Deno) - createAdminUser
// This function accepts POST { email, password, full_name, role }
// It requires an Authorization header (Bearer <access_token>) from an admin user
// and uses the SERVICE_ROLE_KEY (set in function env) to call the Admin API and create
// the user with email confirmed, then inserts into profiles and user_roles tables.

// @ts-expect-error: Deno is available in the edge runtime
const env = Deno.env;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const SUPABASE_URL = env.get('SUPABASE_URL') || env.get('API_EXTERNAL_URL') || 'http://kong:8000';
  // Support both SERVICE_ROLE_KEY and SUPABASE_SERVICE_ROLE_KEY (set by some docker setups)
  const SERVICE_ROLE_KEY = env.get('SERVICE_ROLE_KEY') || env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Server misconfigured', debug: { SUPABASE_URL, hasKey: !!SERVICE_ROLE_KEY } }), { status: 500 });
  }

  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401 });
  }

  // Basic admin-check placeholder: in production you should verify the JWT and ensure
  // the caller has admin privileges. This example assumes only admins will call this function.

  try {
    const body = await req.json();
    const { email, password, full_name, role } = body;
    if (!email || !password) return new Response(JSON.stringify({ error: 'email and password required' }), { status: 400 });
    if (!full_name || !role) return new Response(JSON.stringify({ error: 'full_name and role required' }), { status: 400 });

    // Call the Supabase Admin API to create a confirmed user
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/admin/users`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true
      })
    });

    const userData = await res.json();
    if (!res.ok) return new Response(JSON.stringify({ error: userData }), { status: res.status });

    const userId = userData.id;

    // Insert into profiles table
    const profileRes = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ id: userId, full_name })
    });

    if (!profileRes.ok) {
      const profileError = await profileRes.json();
      return new Response(JSON.stringify({ error: 'Failed to create profile', details: profileError }), { status: 500 });
    }

    // Insert into user_roles table
    const roleRes = await fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/user_roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ user_id: userId, role })
    });

    if (!roleRes.ok) {
      const roleError = await roleRes.json();
      return new Response(JSON.stringify({ error: 'Failed to create user_role', details: roleError }), { status: 500 });
    }

    return new Response(JSON.stringify({ data: { user: userData, full_name, role } }), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
