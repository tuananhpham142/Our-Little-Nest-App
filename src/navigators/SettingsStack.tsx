// src/navigation/AuthNavigator.tsx
import SettingsScreen from '@/screens/SettingScreen';
import LanguageSettingsScreen from '@/screens/SettingScreen/LanguageSetting';
import NotificationsSettingsScreen from '@/screens/SettingScreen/NotificationSetting';
import PrivacySecuritySettingsScreen from '@/screens/SettingScreen/PrivacySetting';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../types/navigation';

// Import your auth screens here

const Stack = createStackNavigator<RootStackParamList>();

export const SettingsStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName='Settings'
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='LanguageSettings' component={LanguageSettingsScreen} />
      <Stack.Screen name='NotificationsSettings' component={NotificationsSettingsScreen} />
      <Stack.Screen name='PrivacySecuritySettings' component={PrivacySecuritySettingsScreen} />
    </Stack.Navigator>
  );
};
