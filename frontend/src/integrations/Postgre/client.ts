// Re-export the API client (no references to Supabase)
export { apiClient } from '../api/client';

// Also provide a default export for backward compatibility
import { apiClient as _apiClient } from '../api/client';
export default _apiClient;
