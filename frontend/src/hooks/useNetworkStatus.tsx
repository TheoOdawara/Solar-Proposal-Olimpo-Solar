import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast({
          title: "Conexão restaurada",
          description: "Você está online novamente.",
          duration: 3000,
        });
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast({
        title: "Conexão perdida",
        description: "Você está offline. Algumas funcionalidades podem não funcionar.",
        variant: "destructive",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also check periodically by trying to fetch a small resource
    const checkConnection = async () => {
      try {
        const response = await fetch('/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        const isConnected = response.ok;
        
        if (isConnected !== isOnline) {
          if (isConnected) {
            handleOnline();
          } else {
            handleOffline();
          }
        }
      } catch {
        if (isOnline) {
          handleOffline();
        }
      }
    };

    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isOnline, wasOffline, toast]);

  return {
    isOnline,
    isOffline: !isOnline,
  };
};