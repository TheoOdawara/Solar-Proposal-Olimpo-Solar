// Compatibility shim: project migrated away from Supabase to a custom
// Node API. Many frontend modules still import the `supabase` client.
// To avoid refactoring the whole frontend now, export a small shim
// that implements the minimal `supabase.auth` methods used by the app
// and forwards them to the backend REST API (VITE_API_URL).

// Re-export the `apiClient` to keep backward compatibility for imports that still
// reference this path. Do NOT expose any identifier named `supabase`.
export { apiClient } from '../api/client';

import { apiClient as _apiClient } from '../api/client';
export default _apiClient;
