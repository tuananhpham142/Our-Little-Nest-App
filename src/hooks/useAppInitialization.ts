// src/utils/hooks/useAppInitialization.ts
import { initializeApp } from '@/store/slices/appSlice';
import { AppDispatch } from '@/store/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export const useAppInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);

        // Initialize app
        await dispatch(initializeApp()).unwrap();

        // Add any other initialization logic here
        // - Check for app updates
        // - Sync offline data
        // - Validate authentication

        setIsReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        // Handle initialization error
        setIsReady(true); // Still allow app to load
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [dispatch]);

  return {
    isLoading,
    isReady,
  };
};
