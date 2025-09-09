// src/models/PushNotification/PushNotificationUIFormInterface.ts

import {
    IOSAuthorizationStatus,
    PushNotificationCategory,
    PushNotificationChannelId,
    PushNotificationImportance,
    PushNotificationPriority,
    PushNotificationSound,
} from './PushNotificationEnum';

export interface PushNotificationPermissionFormData {
  alert: boolean;
  badge: boolean;
  sound: boolean;
  provisional: boolean;
  criticalAlert: boolean;
  announcement: boolean;
  carPlay: boolean;
}

export interface PushNotificationChannelFormData {
  id: string;
  name: string;
  description: string;
  importance: PushNotificationImportance;
  sound: PushNotificationSound | string;
  vibration: boolean;
  lights: boolean;
  lightColor: string;
  showBadge: boolean;
  bypassDnd: boolean;
  group: string;
}

export interface PushNotificationTestFormData {
  title: string;
  body: string;
  subtitle: string;
  channelId: PushNotificationChannelId;
  priority: PushNotificationPriority;
  category: PushNotificationCategory;
  badge: number;
  sound: PushNotificationSound | string;
  data: Record<string, any>;
  delay: number;
}

export interface PushNotificationSettingsFormData {
  // Global settings
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
  alertEnabled: boolean;
  previewEnabled: boolean;

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm

  // Grouping
  groupNotifications: boolean;
  maxNotificationsInGroup: number;

  // Behavior
  autoClearAfterOpen: boolean;
  persistNotifications: boolean;
  showInForeground: boolean;

  // Per-category settings
  categorySettings: Array<{
    category: PushNotificationCategory;
    enabled: boolean;
    priority: PushNotificationPriority;
    autoOpen: boolean;
    sound: boolean;
    vibration: boolean;
  }>;
}

export interface PushNotificationFormErrors {
  title?: string;
  body?: string;
  channelId?: string;
  sound?: string;
  general?: string;
}

export interface PushNotificationPermissionModalProps {
  isVisible: boolean;
  currentStatus: IOSAuthorizationStatus;
  onAllow: () => void;
  onDeny: () => void;
  onLater: () => void;
  onOpenSettings: () => void;
  title?: string;
  message?: string;
  benefits?: string[];
  showSettingsButton?: boolean;
  showProvisionalOption?: boolean;
}

export interface PushNotificationBannerProps {
  notification: any;
  onPress?: () => void;
  onDismiss?: () => void;
  onAction?: (actionId: string) => void;
  duration?: number;
  position?: 'top' | 'bottom';
  showActions?: boolean;
  autoHide?: boolean;
}

export interface PushNotificationActionSheetProps {
  notification: any;
  isVisible: boolean;
  actions: Array<{
    id: string;
    title: string;
    icon?: string;
    destructive?: boolean;
  }>;
  onAction: (actionId: string) => void;
  onCancel: () => void;
}

export interface PushNotificationCategoryIconProps {
  category: PushNotificationCategory;
  size?: number;
  color?: string;
}

export interface PushNotificationSoundPickerProps {
  selectedSound: PushNotificationSound | string;
  onSelect: (sound: PushNotificationSound | string) => void;
  showPreview?: boolean;
  customSounds?: Array<{ id: string; name: string; file: string }>;
}

export interface PushNotificationChannelListProps {
  channels: any[];
  selectedChannelId?: string;
  onChannelPress: (channelId: string) => void;
  onChannelLongPress?: (channelId: string) => void;
  onCreateChannel: () => void;
  showActions?: boolean;
  editable?: boolean;
}

export interface PushNotificationHistoryListProps {
  notifications: any[];
  onNotificationPress: (notification: any) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  groupByDate?: boolean;
  showCategoryIcon?: boolean;
  showTimestamp?: boolean;
}

export interface PushNotificationStatisticsCardProps {
  statistics: any;
  period?: 'day' | 'week' | 'month' | 'all';
  showChart?: boolean;
  onPeriodChange?: (period: string) => void;
}

export interface PushNotificationDebugPanelProps {
  isVisible: boolean;
  onClose: () => void;
  showToken?: boolean;
  showPermissions?: boolean;
  showChannels?: boolean;
  showSettings?: boolean;
  showStatistics?: boolean;
}

export interface PushNotificationStatusIndicatorProps {
  isEnabled: boolean;
  hasPermission: boolean;
  isConnected: boolean;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface PushNotificationQuickActionsProps {
  onTestNotification: () => void;
  onOpenSettings: () => void;
  onRefreshToken: () => void;
  onClearBadge: () => void;
  onExportData: () => void;
  showLabels?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export interface PushNotificationOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
  steps?: Array<{
    title: string;
    description: string;
    image?: string;
    action?: () => void;
  }>;
}

export interface PushNotificationTroubleshootingProps {
  issues: Array<{
    type: 'permission' | 'token' | 'delivery' | 'sound' | 'badge';
    status: 'ok' | 'warning' | 'error';
    message: string;
    action?: () => void;
  }>;
  onRefresh: () => void;
  onContactSupport: () => void;
}

export const PushNotificationFormValidation = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  body: {
    required: true,
    minLength: 1,
    maxLength: 500,
  },
  channelName: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  channelDescription: {
    required: false,
    maxLength: 200,
  },
  badge: {
    min: 0,
    max: 9999,
  },
  delay: {
    min: 0,
    max: 86400000, // 24 hours in milliseconds
  },
};

export const PushNotificationUIMessages = {
  permission: {
    title: 'Enable Push Notifications',
    message: "Stay updated with important alerts about your baby's health, milestones, and family activities.",
    benefits: ['Real-time health reminders', 'Milestone achievements', 'Family activity updates', 'Important alerts'],
    denied: 'Push notifications are disabled. Enable them in Settings to receive important updates.',
    provisional: 'You have provisional permission. Grant full access for the best experience.',
    notDetermined: "Allow notifications to stay connected with your baby's journey.",
  },
  errors: {
    initializationFailed: 'Failed to initialize push notifications',
    permissionDenied: 'Notification permission was denied',
    tokenRegistrationFailed: 'Failed to register for push notifications',
    channelCreationFailed: 'Failed to create notification channel',
    deliveryFailed: 'Failed to deliver notification',
    unknown: 'An unknown error occurred',
  },
  success: {
    initialized: 'Push notifications initialized successfully',
    permissionGranted: 'Notification permission granted',
    tokenRegistered: 'Device registered for notifications',
    channelCreated: 'Notification channel created',
    notificationSent: 'Test notification sent',
    settingsUpdated: 'Notification settings updated',
    badgeCleared: 'Badge count cleared',
  },
  status: {
    enabled: 'Notifications Enabled',
    disabled: 'Notifications Disabled',
    permissionRequired: 'Permission Required',
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
  },
  actions: {
    allow: 'Allow Notifications',
    deny: 'Not Now',
    later: 'Ask Me Later',
    settings: 'Open Settings',
    test: 'Send Test',
    clear: 'Clear Badge',
    refresh: 'Refresh Token',
    export: 'Export Data',
  },
  categories: {
    [PushNotificationCategory.DEFAULT]: 'General',
    [PushNotificationCategory.MESSAGE]: 'Messages',
    [PushNotificationCategory.REMINDER]: 'Reminders',
    [PushNotificationCategory.INVITATION]: 'Invitations',
    [PushNotificationCategory.HEALTH]: 'Health',
    [PushNotificationCategory.MILESTONE]: 'Milestones',
    [PushNotificationCategory.ALERT]: 'Alerts',
    [PushNotificationCategory.PROMOTION]: 'Promotions',
  },
  channels: {
    [PushNotificationChannelId.DEFAULT]: 'Default',
    [PushNotificationChannelId.URGENT]: 'Urgent',
    [PushNotificationChannelId.REMINDER]: 'Reminders',
    [PushNotificationChannelId.HEALTH]: 'Health',
    [PushNotificationChannelId.MILESTONE]: 'Milestones',
    [PushNotificationChannelId.FAMILY]: 'Family',
    [PushNotificationChannelId.COMMUNITY]: 'Community',
    [PushNotificationChannelId.PROMOTION]: 'Promotions',
    [PushNotificationChannelId.SILENT]: 'Silent',
  },
};
