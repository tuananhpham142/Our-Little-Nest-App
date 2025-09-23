// src/navigation/MainNavigator.tsx
import FloatingBottomNavigation from '@/components/template/Navigations/FloatingBottomNavigation';
import { useTheme } from '@/hooks/useTheme';
import ArticlesScreen from '@/screens/Article/ArticlesScreen';
import BabyMainScreen from '@/screens/Baby/BabyMainScreen';
import HomeScreen from '@/screens/HomeScreen';
import NotificationScreen from '@/screens/Notification/NotificationScreen';
import { PregnancyJournalListScreen } from '@/screens/PregnancyJournal/PregnancyJournalListScreen';
import SettingsScreen from '@/screens/SettingScreen';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { MainTabParamList } from '../types/navigation';

const appTabs = {
  Home: {
    icon: 'house',
    activeIcon: 'house',
    label: 'Home',
    tabId: 'Home',
  },
  Babies: {
    icon: 'baby-carriage',
    activeIcon: 'baby-carriage',
    label: 'Baby',
    tabId: 'Babies',
  },
  Articles: {
    icon: 'newspaper',
    activeIcon: 'newspaper',
    label: 'Articles',
    tabId: 'Articles',
  },

  Notifications: {
    icon: 'bell',
    activeIcon: 'bell',
    label: 'Notifications',
    tabId: 'Notifications',
  },
  PregnancyJournalList: {
    icon: 'person-pregnant',
    activeIcon: 'person-pregnant',
    label: 'Pregnancy',
    tabId: 'PregnancyJournalList',
  },
  Settings: {
    icon: 'gear',
    activeIcon: 'gear',
    label: 'Settings',
    tabId: 'Settings',
  },
};

const CustomTabBar = (props: BottomTabBarProps) => (
  <FloatingBottomNavigation
    navigation={props}
    tabConfig={appTabs}
    backgroundColor='#1F2937'
    activeColor='#10B981'
    inactiveColor='#9CA3AF'
    showLabels={false}
    animationDuration={300}
  />
);
const Tab = createBottomTabNavigator<MainTabParamList>();
export const TabbarNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName='Home'
      tabBar={CustomTabBar}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarPosition: 'bottom',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        // fullScreenGestureEnabled: true,
        // animation: Platform.select({
        //   ios: 'none',
        //   android: 'shift',
        // }),
        // animationDuration: 250,
        // gestureEnabled: true,
        // gestureDirection: 'horizontal',
      })}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Babies' component={BabyMainScreen} />
      <Tab.Screen name='Notifications' component={NotificationScreen} />
      <Tab.Screen name='Articles' component={ArticlesScreen} />
      <Tab.Screen name='PregnancyJournalList' component={PregnancyJournalListScreen} />
      <Tab.Screen name='Settings' component={SettingsScreen} />
    </Tab.Navigator>
  );
};
