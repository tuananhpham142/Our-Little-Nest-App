// src/navigation/BadgeNavigator.tsx
import BadgeCollectionScreen from '@/screens/Badge/BadgeCollectionScreen';
import BadgesScreen from '@/screens/Badge/BadgesScreen';
import AwardBadgeScreen from '@/screens/Badge/components/AwardBadgeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../types/navigation';

// Import your auth screens here

const Stack = createStackNavigator<RootStackParamList>();

export const BadgeStack: React.FC = () => {
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
      <Stack.Screen
        name='BadgeList'
        component={BadgesScreen}
        options={{
          title: 'Badges',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='BadgeCollection'
        component={BadgeCollectionScreen}
        options={{
          title: 'Badge Collection',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='AwardBadge'
        component={AwardBadgeScreen}
        options={{
          title: 'Award Badge',
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      {/* <Stack.Screen
          name='CreateBadge'
          component={CreateBadgeScreen}
          options={{
            title: 'Create Badge',
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name='EditBadgeCollection'
          component={EditBadgeCollectionScreen}
          options={{
            title: 'Edit Achievement',
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        /> */}
    </Stack.Navigator>
  );
};
