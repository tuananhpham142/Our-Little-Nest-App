// src/utils/hooks/useAppState.ts
import { setAppForegroundState } from '@/store/slices/appSlice';
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch } from 'react-redux';

export const useAppState = () => {
  const dispatch = useDispatch();
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
      dispatch(setAppForegroundState(nextAppState === 'active'));

      // Handle specific state changes
      if (nextAppState === 'active') {
        console.log('App has come to the foreground');
        // Trigger data refresh, check for updates, etc.
      } else if (nextAppState === 'background') {
        console.log('App has gone to the background');
        // Save state, pause timers, etc.
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription?.remove();
  }, [dispatch]);

  return {
    appState,
    isActive: appState === 'active',
    isBackground: appState === 'background',
    isInactive: appState === 'inactive',
  };
};
