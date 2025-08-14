// src/navigation/MainNavigator.tsx
import { useTheme } from '@/hooks/useTheme';
import HomeScreen from '@/screens/HomeScreen';
import SettingsScreen from '@/screens/SettingScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Simple text-based icons for now
          let iconText = '';

          if (route.name === 'Home') {
            iconText = '🏠';
          } else if (route.name === 'Profile') {
            iconText = '👤';
          } else if (route.name === 'Settings') {
            iconText = '⚙️';
          } else if (route.name === 'Notifications') {
            iconText = '🔔';
          }

          return <Text style={{ fontSize: size, opacity: focused ? 1 : 0.6 }}>{iconText}</Text>;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      {/* <Tab.Screen name='Notifications' component={NotificationsScreen} /> */}
      {/* <Tab.Screen name='Profile' component={ProfileScreen} /> */}
      <Tab.Screen name='Settings' component={SettingsScreen} />
    </Tab.Navigator>
  );
};
