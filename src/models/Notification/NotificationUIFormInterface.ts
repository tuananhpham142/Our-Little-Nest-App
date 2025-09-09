// src/models/Notification/NotificationUIFormInterface.ts

import { NotificationChannelEnum, NotificationPriorityEnum, NotificationTypeEnum } from './NotificationEnum';

export interface NotificationFormData {
  type: NotificationTypeEnum | '';
  title: string;
  message: string;
  priority: NotificationPriorityEnum;
  channels: NotificationChannelEnum[];
  scheduledFor?: string;
  expiresAt?: string;
  data?: Record<string, any>;
}

export interface NotificationFormErrors {
  type?: string;
  title?: string;
  message?: string;
  priority?: string;
  channels?: string;
  scheduledFor?: string;
  expiresAt?: string;
  general?: string;
}

export interface NotificationFilterFormData {
  types: NotificationTypeEnum[];
  priorities: NotificationPriorityEnum[];
  channels: NotificationChannelEnum[];
  isRead: boolean | null;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  searchQuery: string;
}

export interface NotificationPreferencesFormData {
  // Channel preferences
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;

  // Notification settings
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  groupNotifications: boolean;
  showPreview: boolean;
  autoMarkAsRead: boolean;

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;

  // Auto-delete
  autoDeleteEnabled: boolean;
  autoDeleteAfterDays: number;

  // Type-specific preferences
  typePreferences: Array<{
    type: NotificationTypeEnum;
    enabled: boolean;
    channels: NotificationChannelEnum[];
    priority?: NotificationPriorityEnum;
  }>;
}

export interface NotificationUIConfig {
  // Display options
  showAvatar: boolean;
  showTimestamp: boolean;
  showChannel: boolean;
  showPriority: boolean;
  showActions: boolean;

  // Grouping
  enableGrouping: boolean;
  groupBy: 'date' | 'type' | 'priority' | 'none';

  // Animations
  enableAnimations: boolean;
  animationType: 'slide' | 'fade' | 'scale' | 'none';

  // Layout
  layout: 'list' | 'card' | 'compact';
  density: 'comfortable' | 'compact' | 'spacious';

  // Colors
  priorityColors: {
    [NotificationPriorityEnum.LOW]: string;
    [NotificationPriorityEnum.NORMAL]: string;
    [NotificationPriorityEnum.HIGH]: string;
    [NotificationPriorityEnum.URGENT]: string;
  };

  // Actions
  swipeActions: {
    left?: 'markAsRead' | 'delete' | 'archive' | 'none';
    right?: 'markAsRead' | 'delete' | 'archive' | 'none';
  };

  // Sounds
  notificationSounds: {
    default: string;
    priority: string;
    reminder: string;
  };
}

export interface NotificationActionButton {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  action: 'view' | 'markAsRead' | 'delete' | 'archive' | 'share' | 'custom';
  customAction?: () => void;
}

export interface NotificationListItemProps {
  notification: any;
  isSelected: boolean;
  isHighlighted: boolean;
  showAvatar: boolean;
  showActions: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  actions?: NotificationActionButton[];
}

export interface NotificationPanelProps {
  isOpen: boolean;
  notifications: any[];
  unreadCount: number;
  isLoading: boolean;
  onClose: () => void;
  onNotificationPress: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onRefresh: () => void;
  onLoadMore: () => void;
}

export interface NotificationBadgeProps {
  count: number;
  showZero?: boolean;
  maxCount?: number;
  color?: string;
  textColor?: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  animate?: boolean;
}

export interface NotificationToastProps {
  notification: any;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  onPress?: () => void;
  onDismiss?: () => void;
  showActions?: boolean;
  actions?: NotificationActionButton[];
}

export interface NotificationPermissionModalProps {
  isVisible: boolean;
  onAllow: () => void;
  onDeny: () => void;
  onLater: () => void;
  title?: string;
  message?: string;
  benefits?: string[];
}

export interface NotificationEmptyStateProps {
  type: 'all' | 'unread' | 'filtered' | 'error';
  onAction?: () => void;
  actionLabel?: string;
  title?: string;
  message?: string;
  icon?: string;
}

export interface NotificationHeaderProps {
  title: string;
  unreadCount: number;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  showFilterButton?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
  onFilter?: () => void;
}

export const NotificationFormValidation = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  scheduledFor: {
    required: false,
    minDate: new Date(),
  },
  expiresAt: {
    required: false,
    minDate: new Date(),
  },
};
