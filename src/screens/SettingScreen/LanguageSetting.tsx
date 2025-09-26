import AppLayout from '@/components/layout/AppLayout';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { InfoCard, SectionHeader, SettingItem } from './components/CommonComponents';

interface LanguageSettingsScreenProps {
  navigation?: any;
  onLanguageChange?: (language: string, code: string) => void;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL?: boolean;
}

const LanguageSettingsScreen: React.FC<LanguageSettingsScreenProps> = ({ navigation, onLanguageChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  // Available languages
  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRTL: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  ];

  // Filter languages based on search
  const filteredLanguages = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.nativeName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group languages by region/category
  const popularLanguages = filteredLanguages.filter((lang) =>
    ['en', 'vi', 'zh', 'ja', 'ko', 'th', 'id'].includes(lang.code),
  );

  const allLanguages = filteredLanguages.filter(
    (lang) => !['en', 'vi', 'zh', 'ja', 'ko', 'th', 'id'].includes(lang.code),
  );

  const handleLanguageSelect = useCallback(
    (language: Language) => {
      setSelectedLanguage(language.code);

      Alert.alert('Change Language', `Change language to ${language.name}? The app will restart to apply changes.`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => {
            onLanguageChange?.(language.name, language.code);
            navigation?.goBack();
            // Here you would typically:
            // 1. Save language preference to AsyncStorage
            // 2. Update i18n configuration
            // 3. Restart the app or reload the bundle
            Alert.alert('Success', `Language changed to ${language.name}`);
          },
        },
      ]);
    },
    [navigation, onLanguageChange],
  );

  const LanguageItem = ({ language }: { language: Language }) => (
    <TouchableOpacity
      className='flex-row items-center px-4 py-4 bg-white border-b border-gray-100'
      onPress={() => handleLanguageSelect(language)}
    >
      <Text className='text-2xl mr-4'>{language.flag}</Text>

      <View className='flex-1'>
        <Text className='text-base font-semibold text-gray-900'>{language.name}</Text>
        <Text className='text-sm text-gray-500 mt-1'>{language.nativeName}</Text>
      </View>

      {language.isRTL && (
        <View className='bg-blue-100 px-2 py-1 rounded mr-3'>
          <Text className='text-xs text-blue-600 font-medium'>RTL</Text>
        </View>
      )}

      {selectedLanguage === language.code && <Icon iconStyle='solid' name='check' size={20} color='#3B82F6' />}
    </TouchableOpacity>
  );

  return (
    <AppLayout
      header={{
        title: 'Notifications',
        variant: 'simple',
        onBack: () => navigation.goBack(),
      }}
    >
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Current Language */}
        <SectionHeader title='Current Language' />
        {languages
          .filter((lang) => lang.code === selectedLanguage)
          .map((language) => (
            <LanguageItem key={language.code} language={language} />
          ))}

        {/* Popular Languages */}
        {popularLanguages.length > 0 && (
          <>
            <SectionHeader title='Popular Languages' />
            {popularLanguages.map((language) => (
              <LanguageItem key={language.code} language={language} />
            ))}
          </>
        )}

        {/* All Languages */}
        {allLanguages.length > 0 && (
          <>
            <SectionHeader title='All Languages' />
            {allLanguages.map((language) => (
              <LanguageItem key={language.code} language={language} />
            ))}
          </>
        )}

        {/* No Results */}
        {filteredLanguages.length === 0 && (
          <View className='flex-1 items-center justify-center py-12'>
            {/* <Icon iconStyle='solid' name='search-off' size={48} color='#9CA3AF' /> */}
            <Text className='text-gray-500 text-lg mt-4'>No languages found</Text>
            <Text className='text-gray-400 text-sm mt-2'>Try searching with different keywords</Text>
          </View>
        )}

        {/* Language Info */}
        <InfoCard
          icon='info'
          title='Language Support'
          message='Changing the language will update all text in the app. Some features may require app restart to take effect.'
          type='info'
        />

        {/* Download Languages Section */}
        <SectionHeader title='Download Languages' />

        <SettingItem
          title='Download Offline Languages'
          subtitle='Use languages without internet connection'
          icon='download'
          iconColor='#10B981'
          iconBackgroundColor='#D1FAE5'
          showArrow
          onPress={() => Alert.alert('Download', 'Navigate to language download')}
        />

        <SettingItem
          title='Auto-detect Language'
          subtitle='Automatically detect content language'
          icon='auto-awesome'
          iconColor='#8B5CF6'
          iconBackgroundColor='#E9D5FF'
          showArrow
          onPress={() => Alert.alert('Auto-detect', 'Navigate to auto-detect settings')}
        />

        {/* Bottom Spacing */}
        <View className='h-6' />
      </ScrollView>
    </AppLayout>
  );
};

export default LanguageSettingsScreen;
