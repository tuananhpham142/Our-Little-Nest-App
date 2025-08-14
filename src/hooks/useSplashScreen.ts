import { useCallback, useEffect, useState } from 'react';
import BootSplash from 'react-native-bootsplash';

interface UseSplashScreenReturn {
  isSplashVisible: boolean;
  hideSplash: () => Promise<void>;
  isReady: boolean;
}

export const useSplashScreen = (): UseSplashScreenReturn => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const hideSplash = useCallback(async () => {
    try {
      await BootSplash.hide({ fade: true });
      setIsSplashVisible(false);
      setIsReady(true);
    } catch (error) {
      console.warn('Error hiding splash screen:', error);
      setIsSplashVisible(false);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const checkSplashVisibility = async () => {
      try {
        const isVisible = await BootSplash.isVisible();
        setIsSplashVisible(isVisible);
        if (!isVisible) {
          setIsReady(true);
        }
      } catch (error) {
        console.warn('Error checking splash visibility:', error);
        setIsSplashVisible(false);
        setIsReady(true);
      }
    };

    checkSplashVisibility();
  }, []);

  return {
    isSplashVisible,
    hideSplash,
    isReady,
  };
};
