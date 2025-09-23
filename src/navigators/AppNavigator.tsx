// src/navigation/AppNavigator.tsx
import { LoadingScreen } from '@/components/LoadingScreen';
import ArticleDetailScreen from '@/screens/Article/ArticleDetailScreen';
import ArticlesScreen from '@/screens/Article/ArticlesScreen';
import ChannelScreen from '@/screens/Article/ChannelScreen';
import SearchScreen from '@/screens/Article/SearchScreen';
import CompleteProfileScreen from '@/screens/Auth/CompleteProfileScreen';
import LoginScreen from '@/screens/Auth/LoginScreen';
import OTPVerificationScreen from '@/screens/Auth/OTPVerificationScreen';
import RegisterScreen from '@/screens/Auth/RegisterScreen';
import ThankYouScreen from '@/screens/Auth/ThankyouScreen';
import BabyMainScreen from '@/screens/Baby/BabyMainScreen';
import BadgeCollectionScreen from '@/screens/Badge/BadgeCollectionScreen';
import BadgesScreen from '@/screens/Badge/BadgesScreen';
import AwardBadgeScreen from '@/screens/Badge/components/AwardBadgeScreen';
import NotificationScreen from '@/screens/Notification/NotificationScreen';
import { EmotionEntryScreen } from '@/screens/PregnancyJournal/CreateEmotionEntryScreen';
import { CreateJournalScreen } from '@/screens/PregnancyJournal/CreatePregnancyJournalScreen';
import { EditJournalScreen } from '@/screens/PregnancyJournal/EditPregnancyJournalScreen';
import { PregnancyCareScreen } from '@/screens/PregnancyJournal/PregnancyCareScreen';
import { PregnancyJournalListScreen } from '@/screens/PregnancyJournal/PregnancyJournalListScreen';
import { PregnancyJournalScreen } from '@/screens/PregnancyJournal/PregnancyJournalScreen';
import SettingsScreen from '@/screens/SettingScreen';
import LanguageSettingsScreen from '@/screens/SettingScreen/LanguageSetting';
import NotificationsSettingsScreen from '@/screens/SettingScreen/NotificationSetting';
import PrivacySecuritySettingsScreen from '@/screens/SettingScreen/PrivacySetting';
import WelcomeScreen from '@/screens/WelcomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../types/navigation';
import { TabbarNavigator } from './TabbarNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const isAuthenticated = true;
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
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
        <Stack.Screen name='Welcome' component={WelcomeScreen} />

        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name='Home' component={TabbarNavigator} />
            {/* Babies */}
            <Stack.Screen name='BabyList' component={BabyMainScreen} />
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
            {/* Badges */}
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
            {/* Notifications */}
            <Stack.Screen name='Notifications' component={NotificationScreen} />
            {/* Articles */}
            <Stack.Screen name='Articles' component={ArticlesScreen} />
            <Stack.Screen name='ArticleDetail' component={ArticleDetailScreen} />
            <Stack.Screen name='ArticleSearch' component={SearchScreen} />
            <Stack.Screen name='ArticleChannel' component={ChannelScreen} />
            {/* Pregnancy */}
            <Stack.Screen name='PregnancyJournalList' component={PregnancyJournalListScreen} />
            <Stack.Screen name='PregnancyJournal' component={PregnancyJournalScreen} />
            <Stack.Screen name='CreateJournal' component={CreateJournalScreen} />
            <Stack.Screen name='EditJournal' component={EditJournalScreen} />
            <Stack.Screen name='EmotionEntry' component={EmotionEntryScreen} />
            <Stack.Screen name='PregnancyCare' component={PregnancyCareScreen} />
            {/* Settings */}
            <Stack.Screen name='Settings' component={SettingsScreen} />
            <Stack.Screen name='LanguageSettings' component={LanguageSettingsScreen} />
            <Stack.Screen name='NotificationsSettings' component={NotificationsSettingsScreen} />
            <Stack.Screen name='PrivacySecuritySettings' component={PrivacySecuritySettingsScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='ThankyouRegister' component={ThankYouScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='OTPVerification' component={OTPVerificationScreen} />
            <Stack.Screen name='CompleteProfile' component={CompleteProfileScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
