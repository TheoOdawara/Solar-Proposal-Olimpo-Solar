import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

const ADMIN_EMAIL = 'marketing.olimposolar@gmail.com';

export const useAdminAccess = () => {
  const { user, loading: authLoading } = useAuth();
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setHasAdminAccess(user.email === ADMIN_EMAIL);
    } else {
      setHasAdminAccess(false);
    }
  }, [user]);

  return {
    hasAdminAccess,
    loading: authLoading,
    adminEmail: ADMIN_EMAIL
  };
};