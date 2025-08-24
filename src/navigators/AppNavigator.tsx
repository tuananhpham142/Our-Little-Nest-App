// src/navigation/AppNavigator.tsx
import { LoadingScreen } from '@/components/LoadingScreen';
import ArticleDetailScreen from '@/screens/Article/ArticleDetailScreen';
import ArticlesScreen from '@/screens/Article/ArticlesScreen';
import ChannelScreen from '@/screens/Article/ChannelScreen';
import SearchScreen from '@/screens/Article/SearchScreen';
import HomeScreen from '@/screens/HomeScreen';
import { PregnancyJournalScreen } from '@/screens/PregnancyJournal/PregnancyJournalScreen';
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
        {/* Articles */}
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

        {/* Babies */}
        {/* <Stack.Screen
          name='Profile'
          component={BabyMainScreen}
          initialParams={{ babyId }}
          options={{
            tabBarLabel: '👶 Profile',
            tabBarIcon: ({ focused }) => null, // Icons are in label
          }}
        />
        <Stack.Screen
          name='Info'
          component={BabyInfoScreen}
          initialParams={{ babyId }}
          options={{
            tabBarLabel: 'ℹ️ Info',
          }}
        />
        <Stack.Screen
          name='Family'
          component={ManageFamilyMemberScreen}
          initialParams={{ babyId }}
          options={{
            tabBarLabel: '👨‍👩‍👧‍👦 Family',
          }}
        />
        <Stack.Screen
          name='Health'
          component={BabyHealthScreen}
          initialParams={{ babyId }}
          options={{
            tabBarLabel: '🏥 Health',
          }}
        />

        <Stack.Screen
          name='BabyList'
          component={BabyMainScreen}
          options={{
            title: 'My Babies',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
          }}
        />

        <Stack.Screen
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
        {/* Pregnancy Journal */}

        <Stack.Screen name='PregnancyJournal' component={PregnancyJournalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
