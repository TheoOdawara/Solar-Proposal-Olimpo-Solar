// Re-export the new admin API client to avoid any 'supabase' identifier in source.
export { apiAdmin } from '../api/admin';

// Default export for backward compatibility
import { apiAdmin as _apiAdmin } from '../api/admin';
export default _apiAdmin;
