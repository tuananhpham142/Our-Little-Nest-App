// src/navigation/AppNavigator.tsx
import { LoadingScreen } from '@/components/LoadingScreen';
import ArticleDetailScreen from '@/screens/Article/ArticleDetailScreen';
import ArticlesScreen from '@/screens/Article/ArticlesScreen';
import ChannelScreen from '@/screens/Article/ChannelScreen';
import SearchScreen from '@/screens/Article/SearchScreen';
import HomeScreen from '@/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: Platform.select({
            ios: 'default',
            android: 'slide_from_right',
          }),
          animationDuration: 250,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name='Main' component={MainNavigator} />
        ) : (
          <Stack.Screen name='Auth' component={AuthNavigator} />
        )}

        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Articles' component={ArticlesScreen} />
        <Stack.Screen
          name='ArticleDetail'
          component={ArticleDetailScreen}
          options={{
            animation: Platform.select({
              ios: 'slide_from_bottom',
              android: 'fade_from_bottom',
            }),
            presentation: 'card',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name='ArticleSearch'
          component={SearchScreen}
          options={{
            animation: 'fade',
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name='ArticleChannel'
          component={ChannelScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
