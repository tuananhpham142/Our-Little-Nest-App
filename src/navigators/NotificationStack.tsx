// src/navigation/AuthNavigator.tsx
import NotificationScreen from '@/screens/Notification/NotificationScreen';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../types/navigation';

// Import your auth screens here

const Stack = createStackNavigator<RootStackParamList>();

export const NotificationStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName='Notifications'
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
      <Stack.Screen name='Notifications' component={NotificationScreen} />
    </Stack.Navigator>
  );
};
