// src/utils/hooks/useTheme.ts
import { setThemeMode, toggleTheme, updateSystemTheme } from '@/store/slices/themeSlice';
import { RootState } from '@/store/store';
import { ThemeColors, ThemeMode } from '@/types/theme';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const lightColors: ThemeColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
};

const darkColors: ThemeColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
};

export const useTheme = () => {
  const dispatch = useDispatch();
  const { mode, isDark } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') {
        dispatch(updateSystemTheme());
      }
    });

    return () => subscription?.remove();
  }, [mode, dispatch]);

  const setMode = (newMode: ThemeMode) => {
    dispatch(setThemeMode(newMode));
  };

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const colors = isDark ? darkColors : lightColors;

  return {
    mode,
    isDark,
    colors,
    setMode,
    toggle,
  };
};
