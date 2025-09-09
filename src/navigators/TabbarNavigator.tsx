// src/navigation/MainNavigator.tsx
import BottomNavigation from '@/components/template/Navigations/BottomNavigation';
import { useTheme } from '@/hooks/useTheme';
import HomeScreen from '@/screens/HomeScreen';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { ReactNode } from 'react';
import { MainTabParamList } from '../types/navigation';
import { ArticleStack } from './ArticleStack';
import { BabyStack } from './BabyStack';
import { NotificationStack } from './NotificationStack';
import { PregnancyJournalStack } from './PregnancyJournalStack';

const Tab = createBottomTabNavigator<MainTabParamList>();
export const TabbarNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName='Home'
      tabBar={(props: BottomTabBarProps) => BottomNavigation({ ...props }) as ReactNode}
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
      <Tab.Screen name='Babies' component={BabyStack} />
      <Tab.Screen name='Notifications' component={NotificationStack} />
      <Tab.Screen name='Articles' component={ArticleStack} />
      <Tab.Screen name='PregnancyJournal' component={PregnancyJournalStack} />
    </Tab.Navigator>
  );
};
