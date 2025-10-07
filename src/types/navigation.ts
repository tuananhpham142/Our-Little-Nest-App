import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

// import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

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
  BabyFamilyMember: { babyId: string };
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
  // Badge// Main Badge Screens
  Badges: { babyId?: string };
  BabyBadges: {
    babyId: string;
    babyName?: string;
    babyAvatar?: string;
  };
  BadgeDetail: {
    badgeId: string;
    babyId?: string;
  };
  BabyBadgeDetail: {
    collectionId: string;
    babyId: string;
  };

  // Badge Collection Screens
  BadgeCollection: {
    babyId: string;
    babyName?: string;
  };
  CollectionDetail: {
    collectionId: string;
  };
  AwardBadge: {
    babyId?: string;
    badgeId?: string;
  };
  EditBadgeCollection: {
    collectionId: string;
  };

  // Utility Screens
  ImageViewer: {
    images: string[];
    initialIndex?: number;
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

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
// export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export type AuthScreenNavigationProp = CompositeNavigationProp<AuthStackNavigationProp, RootStackNavigationProp>;

// export type MainScreenNavigationProp = CompositeNavigationProp<MainTabNavigationProp, RootStackNavigationProp>;

export type NavigationParamList = AuthStackParamList & RootStackParamList & MainTabParamList;
