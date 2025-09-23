import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = AuthStackParamList & {
  Auth: undefined;
  Main: undefined;
  Loading: undefined;
  Home: undefined;
  // Articles
  Articles: undefined;
  ArticleDetail: { id: string };
  ArticleSearch: { initialTag?: string };
  ArticleChannel: {
    channelName: string;
    channelLogo?: string;
  };
  // Babies
  Babies: undefined;
  BabyList: undefined;
  BabyTabs: { babyId: string; initialTab?: string };
  CreateBaby: undefined;
  EditBaby: { babyId: string };
  InviteFamilyMember: { babyId: string };
  ManageFamilyMember: { babyId: string };
  FamilyMemberDetail: { babyId: string; userId: string };
  BabyProfile: { babyId: string };
  BabyInfo: { babyId: string };
  BabyFamily: { babyId: string };
  BabyHealth: { babyId: string };
  // Pregnancy Journal
  PregnancyJournalList: undefined;
  PregnancyJournal: undefined;
  CreateJournal: {
    onSuccess?: () => void;
  };
  EditJournal: {
    journal: PregnancyJournal;
    onSuccess?: () => void;
  };
  EmotionEntry: {
    journal: PregnancyJournal;
    onSuccess?: () => void;
  };
  PregnancyCare: {
    week?: number;
  };
  // Badge
  BadgeList: undefined;
  BadgeCollection: {
    babyId: string;
    babyName?: string;
  };
  AwardBadge: {
    babyId?: string;
    badgeId?: string;
  };
  CreateBadge: undefined;
  EditBadgeCollection: {
    collectionId: string;
  };
  BadgeDetail: {
    badgeId: string;
  };
  // Notifications
  Notifications: undefined;
  // Settings
  Settings: undefined;
  LanguageSettings: undefined;
  NotificationsSettings: undefined;
  PrivacySecuritySettings: undefined;
};

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  S
>;
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ThankyouRegister: undefined;
  OTPVerification: undefined;
  CompleteProfile: undefined;
  SocialAuth: { provider: 'facebook' | 'google' | 'apple' };
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Articles: undefined;
  Notifications: undefined;
  Babies: undefined;
  PregnancyJournal: undefined;
  PregnancyJournalList: undefined;
  Auth: undefined;
  Settings: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
// export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export type AuthScreenNavigationProp = CompositeNavigationProp<AuthStackNavigationProp, RootStackNavigationProp>;

// export type MainScreenNavigationProp = CompositeNavigationProp<MainTabNavigationProp, RootStackNavigationProp>;

export type NavigationParamList = AuthStackParamList & RootStackParamList & MainTabParamList;
