// types/bottomNavigation.types.ts
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export interface TabItem {
  id: string;
  icon: string;
  label: string;
  activeIcon?: string;
  tabId?: string;
}

// Props for standalone usage (without React Navigation)
export interface FloatingBottomNavStandaloneProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs?: TabItem[];
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  showLabels?: boolean;
  animationDuration?: number;
  className?: string;
}

// Props for React Navigation usage
export interface FloatingBottomNavNavigationProps extends Partial<FloatingBottomNavStandaloneProps> {
  navigation: BottomTabBarProps;
  tabConfig: Record<string, Omit<TabItem, 'id'>>;
}

// Union type for component props
export type FloatingBottomNavProps = FloatingBottomNavStandaloneProps | FloatingBottomNavNavigationProps;

// Helper to check if props are for React Navigation
export const isNavigationProps = (props: FloatingBottomNavProps): props is FloatingBottomNavNavigationProps => {
  return 'navigation' in props;
};

// Default tabs configuration
// export const defaultTabs: TabItem[] = [
//   {
//     id: 'home',
//     icon: 'home',
//     activeIcon: 'home',
//     label: 'Home',
//     testID: 'home-tab',
//   },
//   {
//     id: 'shop',
//     icon: 'shopping-bag',
//     activeIcon: 'shopping-bag',
//     label: 'Shop',
//     testID: 'shop-tab',
//   },
//   {
//     id: 'favorite',
//     icon: 'favorite-border',
//     activeIcon: 'favorite',
//     label: 'Favorite',
//     testID: 'favorite-tab',
//   },
//   {
//     id: 'chat',
//     icon: 'chat-bubble-outline',
//     activeIcon: 'chat-bubble',
//     label: 'Chat',
//     testID: 'chat-tab',
//   },
//   {
//     id: 'profile',
//     icon: 'person-outline',
//     activeIcon: 'person',
//     label: 'Profile',
//     testID: 'profile-tab',
//   },
// ];

// Default tab configuration for React Navigation screens
// export const defaultTabConfig: Record<string, Omit<TabItem, 'id'>> = {
//   Home: {
//     icon: 'home',
//     activeIcon: 'home',
//     label: 'Home',
//     testID: 'home-tab',
//   },
//   Shop: {
//     icon: 'shopping-bag',
//     activeIcon: 'shopping-bag',
//     label: 'Shop',
//     testID: 'shop-tab',
//   },
//   Favorites: {
//     icon: 'favorite-border',
//     activeIcon: 'favorite',
//     label: 'Favorites',
//     testID: 'favorites-tab',
//   },
//   Chat: {
//     icon: 'chat-bubble-outline',
//     activeIcon: 'chat-bubble',
//     label: 'Chat',
//     testID: 'chat-tab',
//   },
//   Profile: {
//     icon: 'person-outline',
//     activeIcon: 'person',
//     label: 'Profile',
//     testID: 'profile-tab',
//   },
// };
