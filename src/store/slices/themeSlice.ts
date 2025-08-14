import { ThemeMode, ThemeState } from '@/types/theme';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

const getSystemTheme = (): boolean => {
  return Appearance.getColorScheme() === 'dark';
};

const initialState: ThemeState = {
  mode: 'system',
  isDark: getSystemTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;

      if (action.payload === 'system') {
        state.isDark = getSystemTheme();
      } else {
        state.isDark = action.payload === 'dark';
      }
    },
    updateSystemTheme: (state) => {
      if (state.mode === 'system') {
        state.isDark = getSystemTheme();
      }
    },
    toggleTheme: (state) => {
      if (state.mode === 'system') {
        state.mode = state.isDark ? 'light' : 'dark';
        state.isDark = !state.isDark;
      } else {
        state.mode = state.isDark ? 'light' : 'dark';
        state.isDark = !state.isDark;
      }
    },
  },
});

export const { setThemeMode, updateSystemTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
