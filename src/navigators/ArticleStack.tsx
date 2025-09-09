// src/navigation/BadgeNavigator.tsx
import ArticleDetailScreen from '@/screens/Article/ArticleDetailScreen';
import ArticlesScreen from '@/screens/Article/ArticlesScreen';
import ChannelScreen from '@/screens/Article/ChannelScreen';
import SearchScreen from '@/screens/Article/SearchScreen';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../types/navigation';

// Import your auth screens here

const Stack = createStackNavigator<RootStackParamList>();

export const ArticleStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName='Articles'
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
      <Stack.Screen name='Articles' component={ArticlesScreen} />
      <Stack.Screen name='ArticleDetail' component={ArticleDetailScreen} />
      <Stack.Screen name='ArticleSearch' component={SearchScreen} />
      <Stack.Screen name='ArticleChannel' component={ChannelScreen} />
    </Stack.Navigator>
  );
};
