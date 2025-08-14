// src/screens/settings/SettingsScreen.tsx
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { SupportedLanguage } from '@/types/language';
import { ThemeMode } from '@/types/theme';
import React from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen: React.FC = () => {
  const { colors, mode, isDark, setMode, toggle } = useTheme();
  const { t, currentLanguage, setLanguage, getLanguageName } = useLanguage();
  const { logout, user } = useAuth();

  const handleThemeChange = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    setLanguage(language);
  };

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), 'Are you sure you want to logout?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const SettingItem: React.FC<{
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }> = ({ title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity
      className='px-4 py-4 border-b'
      style={{ borderBottomColor: colors.border }}
      onPress={onPress}
      disabled={!onPress}
    >
      <View className='flex-row justify-between items-center'>
        <View className='flex-1'>
          <Text className='text-base font-medium' style={{ color: colors.text }}>
            {title}
          </Text>
          {subtitle && (
            <Text className='text-sm mt-1' style={{ color: colors.textSecondary }}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightElement}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className='flex-1' style={{ backgroundColor: colors.background }}>
      <ScrollView className='flex-1'>
        {/* User Info */}
        <View className='px-4 py-6 border-b' style={{ borderBottomColor: colors.border }}>
          <Text className='text-xl font-bold' style={{ color: colors.text }}>
            {user?.name || 'User'}
          </Text>
          <Text style={{ color: colors.textSecondary }}>{user?.email}</Text>
        </View>

        {/* Appearance Section */}
        <View className='mt-6'>
          <Text
            className='px-4 py-2 text-sm font-medium uppercase tracking-wide'
            style={{ color: colors.textSecondary }}
          >
            {t('settings.appearance')}
          </Text>

          <SettingItem
            title={t('settings.theme')}
            subtitle={`Current: ${mode}`}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? colors.surface : colors.background}
              />
            }
          />
        </View>

        {/* Language Section */}
        <View className='mt-6'>
          <Text
            className='px-4 py-2 text-sm font-medium uppercase tracking-wide'
            style={{ color: colors.textSecondary }}
          >
            {t('settings.language')}
          </Text>

          <SettingItem
            title={t('settings.language')}
            subtitle={getLanguageName(currentLanguage)}
            onPress={() => {
              Alert.alert('Select Language', '', [
                { text: 'English', onPress: () => handleLanguageChange('en') },
                { text: 'Tiếng Việt', onPress: () => handleLanguageChange('vi') },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}
          />
        </View>

        {/* General Section */}
        <View className='mt-6'>
          <Text
            className='px-4 py-2 text-sm font-medium uppercase tracking-wide'
            style={{ color: colors.textSecondary }}
          >
            General
          </Text>

          <SettingItem
            title={t('settings.notifications')}
            onPress={() => {
              // Navigate to notifications settings
            }}
          />

          <SettingItem
            title={t('settings.privacy')}
            onPress={() => {
              // Navigate to privacy settings
            }}
          />

          <SettingItem
            title={t('settings.terms')}
            onPress={() => {
              // Navigate to terms
            }}
          />

          <SettingItem
            title={t('settings.support')}
            onPress={() => {
              // Navigate to support
            }}
          />
        </View>

        {/* Account Section */}
        <View className='mt-6 mb-6'>
          <TouchableOpacity
            className='mx-6 py-4 rounded-lg'
            style={{ backgroundColor: colors.error }}
            onPress={handleLogout}
          >
            <Text className='text-white text-center font-semibold'>{t('auth.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
