// types/header.types.ts
export interface HeaderAction {
  icon: string;
  onPress: () => void;
  badge?: number;
  testID?: string;
}

export interface UserInfo {
  name: string;
  date?: string;
  avatar?: string;
}

export type HeaderVariant = 'home' | 'profile' | 'list' | 'simple';

export interface HeaderProps {
  variant: HeaderVariant;
  useSafeArea?: boolean;
  // Common props
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';

  // Home variant props
  user?: UserInfo;
  onSearch?: () => void;
  onNotification?: () => void;
  notificationBadge?: number;

  // Profile/List variant props
  title?: string;
  onBack?: () => void;
  actions?: HeaderAction[];

  // Simple variant props
  greeting?: string;

  // Custom styles
  className?: string;
  titleClassName?: string;
}
