// src/navigation/BadgeNavigator.tsx
import BabyMainScreen from '@/screens/Baby/BabyMainScreen';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { RootStackParamList } from '../types/navigation';
import { BadgeStack } from './BadgeStack';

// Import your auth screens here

const Stack = createStackNavigator<RootStackParamList>();

export const BabyStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName='BabyList'
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
      {/* Babies */}

      <Stack.Screen name='BabyList' component={BabyMainScreen} />
      <Stack.Screen name='BadgeList' component={BadgeStack} />

      {/* <Stack.Screen
        name='BabyTabs'
        component={BabyTabNavigator}
        options={({ route }: any) => ({
          title: 'Baby Profile',
          headerShown: true,
          ...slideFromRight,
        })}
      />

      <Stack.Screen
        name='CreateBaby'
        component={CreateBabyScreen}
        options={{
          title: 'Add New Baby',
          presentation: 'modal',
          ...slideFromBottom,
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
        }}
      />

      <Stack.Screen
        name='EditBaby'
        component={EditBabyScreen}
        options={{
          title: 'Edit Baby Info',
          ...slideFromRight,
          headerStyle: {
            backgroundColor: '#FF9800',
          },
        }}
      />

      <Stack.Screen
        name='InviteFamilyMember'
        component={InviteFamilyMemberScreen}
        options={{
          title: 'Invite Family Member',
          presentation: 'modal',
          ...slideFromBottom,
          headerStyle: {
            backgroundColor: '#9C27B0',
          },
        }}
      />

      <Stack.Screen
        name='FamilyMemberDetail'
        component={FamilyMemberDetailScreen}
        options={({ route }: any) => ({
          title: 'Family Member',
          ...slideFromRight,
        })}
      />

      <Stack.Screen
        name='BabyHealth'
        component={BabyHealthScreen}
        options={{
          title: 'Health Information',
          ...slideFromRight,
          headerStyle: {
            backgroundColor: '#F44336',
          },
        }}
      /> */}
    </Stack.Navigator>
  );
};
