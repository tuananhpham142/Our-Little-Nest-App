import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
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
  Settings: undefined;
  Notifications: undefined;
};

export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList>;
// export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export type AuthScreenNavigationProp = CompositeNavigationProp<AuthStackNavigationProp, RootStackNavigationProp>;

// export type MainScreenNavigationProp = CompositeNavigationProp<MainTabNavigationProp, RootStackNavigationProp>;

export type NavigationParamList = AuthStackParamList & RootStackParamList & MainTabParamList;
