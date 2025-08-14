import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

interface UseAppIntroReturn {
  isFirstLaunch: boolean | null;
  isLoading: boolean;
  markIntroAsShown: () => Promise<void>;
  resetIntro: () => Promise<void>;
}

const INTRO_STORAGE_KEY = '@app_intro_shown';

export const useAppIntro = (): UseAppIntroReturn => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkIfFirstLaunch();
  }, []);

  const checkIfFirstLaunch = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const introShown = await AsyncStorage.getItem(INTRO_STORAGE_KEY);
      
      if (introShown === null) {
        // First time user
        setIsFirstLaunch(true);
      } else {
        // User has seen intro before
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch status:', error);
      // Default to showing intro on error
      setIsFirstLaunch(true);
    } finally {
      setIsLoading(false);
    }
  };

  const markIntroAsShown = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(INTRO_STORAGE_KEY, 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error marking intro as shown:', error);
      throw error;
    }
  };

  const resetIntro = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(INTRO_STORAGE_KEY);
      setIsFirstLaunch(true);
    } catch (error) {
      console.error('Error resetting intro:', error);
      throw error;
    }
  };

  return {
    isFirstLaunch,
    isLoading,
    markIntroAsShown,
    resetIntro,
  };
};