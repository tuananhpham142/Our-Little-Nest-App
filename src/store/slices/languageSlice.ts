import i18n from '@/translations';
import { LanguageState, SupportedLanguage } from '@/types/language';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLocales } from 'react-native-localize';
const getSystemLanguage = (): SupportedLanguage => {
  const locales = getLocales();
  const systemLanguage = locales[0]?.languageCode;

  if (systemLanguage === 'vi') return 'vi';
  return 'en'; // Default to English
};

const initialState: LanguageState = {
  currentLanguage: getSystemLanguage(),
  isLoading: false,
};

export const changeLanguage = createAsyncThunk('language/change', async (language: SupportedLanguage) => {
  try {
    await i18n.changeLanguage(language);
    return language;
  } catch (error) {
    console.error('Language change failed:', error);
    throw error;
  }
});

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.currentLanguage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeLanguage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeLanguage.fulfilled, (state, action) => {
        state.currentLanguage = action.payload;
        state.isLoading = false;
      })
      .addCase(changeLanguage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
