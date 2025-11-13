import { useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<unknown>;
  delay?: number;
  enabled?: boolean;
  onChange?: (data: T) => void;
}

export const useAutoSave = <T extends Record<string, unknown>>({
  data,
  onSave,
  delay = 30000, // 30 seconds default
  enabled = true,
  onChange
}: UseAutoSaveOptions<T>) => {
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current) return;
    
    const currentDataString = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentDataString === lastSavedDataRef.current) return;
    
    try {
      isSavingRef.current = true;
      await onSave(data);
      lastSavedDataRef.current = currentDataString;
      
      // Show subtle success indication
      toast({
        title: "Rascunho salvo automaticamente",
        description: new Date().toLocaleTimeString(),
        duration: 2000,
      });
      
    } catch (error: unknown) {
      console.error('Auto-save failed:', error);
      // Don't show error toast for auto-save to avoid annoying user
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, toast]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(save, delay);

    // Call onChange if provided
    if (onChange) {
      onChange(data);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save, onChange]);

  // Save immediately when component unmounts
  useEffect(() => {
    return () => {
      if (enabled && !isSavingRef.current) {
        save();
      }
    };
  }, [enabled, save]);

  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return save();
  }, [save]);

  return {
    saveNow,
    isSaving: isSavingRef.current
  };
};