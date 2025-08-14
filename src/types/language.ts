// src/types/language.ts
export type SupportedLanguage = 'en' | 'vi';

export interface LanguageState {
  currentLanguage: SupportedLanguage;
  isLoading: boolean;
}
