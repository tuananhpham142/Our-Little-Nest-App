// types/layout.types.ts
import { ReactNode } from 'react';
import { ScrollViewProps, ViewStyle } from 'react-native';
import { HeaderProps } from './header.types';

export type AppLayoutProps = {
  children: ReactNode;
  useSafeArea?: boolean;
  // Header configuration - either use AppHeader with props or custom header component
  header?: HeaderProps | null; // null to hide header
  customHeader?: () => ReactNode; // Custom header render function

  // Layout options
  scrollable?: boolean;
  showsVerticalScrollIndicator?: boolean;

  // Background
  backgroundColor?: string;
  backgroundImage?: string;

  // Padding and margins
  padding?: boolean;
  paddingHorizontal?: boolean;
  paddingVertical?: boolean;

  // Custom styles
  className?: string;
  contentClassName?: string;
  style?: ViewStyle;

  // ScrollView props passthrough
  scrollViewProps?: Omit<ScrollViewProps, 'horizontal'>;

  // Loading and error states
  loading?: boolean;
  error?: string | null;

  // Refresh control
  refreshing?: boolean;
  onRefresh?: () => void;
};
