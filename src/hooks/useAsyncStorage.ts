// src/utils/hooks/useAsyncStorage.ts
import { AsyncStorageService } from '@/services/storage/asyncStorageService';
import { useCallback, useEffect, useState } from 'react';

export const useAsyncStorage = <T>(key: string, initialValue?: T) => {
  const [value, setValue] = useState<T | null>(initialValue || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load value from storage on mount
  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        const storedValue = await AsyncStorageService.getItem<T>(key);
        setValue(storedValue || initialValue || null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key, initialValue]);

  // Update value and storage
  const updateValue = useCallback(
    async (newValue: T | null) => {
      try {
        setError(null);
        setValue(newValue);

        if (newValue === null) {
          await AsyncStorageService.removeItem(key);
        } else {
          await AsyncStorageService.setItem(key, newValue);
        }
      } catch (err) {
        setError(err as Error);
      }
    },
    [key],
  );

  // Remove value from storage
  const removeValue = useCallback(async () => {
    try {
      setError(null);
      setValue(null);
      await AsyncStorageService.removeItem(key);
    } catch (err) {
      setError(err as Error);
    }
  }, [key]);

  return {
    value,
    loading,
    error,
    setValue: updateValue,
    removeValue,
  };
};
