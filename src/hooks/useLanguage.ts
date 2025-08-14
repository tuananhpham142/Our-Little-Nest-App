// src/utils/hooks/useLanguage.ts
import { changeLanguage } from '@/store/slices/languageSlice';
import { RootState } from '@/store/store';
import { SupportedLanguage } from '@/types/language';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

export const useLanguage = () => {
  const dispatch = useDispatch();
  const { currentLanguage, isLoading } = useSelector((state: RootState) => state.language);
  const { t } = useTranslation();

  const setLanguage = async (language: SupportedLanguage) => {
    try {
      //@ts-ignore
      await dispatch(changeLanguage(language)).unwrap();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getLanguageName = (code: SupportedLanguage) => {
    switch (code) {
      case 'en':
        return 'English';
      case 'vi':
        return 'Tiếng Việt';
      default:
        return 'English';
    }
  };

  const isRTL = () => {
    // Add RTL language codes here if needed
    return false;
  };

  return {
    currentLanguage,
    isLoading,
    setLanguage,
    getLanguageName,
    isRTL,
    t,
  };
};
