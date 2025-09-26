// src/models/PushNotification/PushNotificationModel.ts

import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import {
    AndroidNotificationPermission,
    IOSAuthorizationStatus,
    IOSNotificationSetting,
    IOSShowPreviewsSetting,
    NotificationPermissionStatus,
    PushNotificationActionType,
    PushNotificationCategory,
    PushNotificationChannelId,
    PushNotificationImportance,
    PushNotificationPriority,
    PushNotificationSound,
    PushNotificationStyle,
    PushNotificationVisibility
} from './PushNotificationEnum';

export interface PushNotification {
  id: string;
  messageId?: string;
  title?: string;
  body?: string;
  subtitle?: string;
  data?: Record<string, any>;
  badge?: number;
  sound?: PushNotificationSound | string;
  category?: PushNotificationCategory;
  threadId?: string;
  attachments?: PushNotificationAttachment[];
  launchImage?: string;
  contentAvailable?: boolean;
  mutableContent?: boolean;
  criticalAlert?: boolean;
  interruptionLevel?: 'passive' | 'active' | 'time-sensitive' | 'critical';
  relevanceScore?: number;
  targetContentId?: string;

  // Android specific
  android?: AndroidNotificationConfig;

  // iOS specific
  ios?: IOSNotificationConfig;

  // Web specific
  web?: WebNotificationConfig;

  // Tracking
  sentAt?: string;
  receivedAt?: string;
  openedAt?: string;
  dismissedAt?: string;
  expiresAt?: string;
}

export interface AndroidNotificationConfig {
  channelId: PushNotificationChannelId | string;
  importance?: PushNotificationImportance;
  priority?: PushNotificationPriority;
  visibility?: PushNotificationVisibility;
  smallIcon?: string;
  largeIcon?: string;
  color?: string;
  vibrationPattern?: number[];
  lightColor?: string;
  showWhen?: boolean;
  when?: number;
  usesChronometer?: boolean;
  timeoutAfter?: number;
  onlyAlertOnce?: boolean;
  localOnly?: boolean;
  ongoing?: boolean;
  autoCancel?: boolean;
  style?: AndroidNotificationStyle;
  actions?: PushNotificationAction[];
  tag?: string;
  groupKey?: string;
  groupSummary?: boolean;
  groupAlertBehavior?: 'all' | 'summary' | 'children';
  sortKey?: string;
  number?: number;
  ticker?: string;
  clickAction?: string;
  category?: string;
  progressBar?: {
    max: number;
    current: number;
    indeterminate: boolean;
  };
  fullScreenIntent?: {
    mainComponent?: string;
    extraData?: Record<string, any>;
  };
}

export interface AndroidNotificationStyle {
  type: PushNotificationStyle;
  text?: string;
  title?: string;
  summary?: string;
  picture?: string;
  lines?: string[];
  contentTitle?: string;
  htmlFormatContent?: boolean;
  htmlFormatTitle?: boolean;
}

export interface IOSNotificationConfig {
  badge?: number;
  sound?: PushNotificationSound | string;
  critical?: boolean;
  criticalVolume?: number;
  launchImageName?: string;
  attachments?: PushNotificationAttachment[];
  category?: string;
  threadId?: string;
  subtitle?: string;
  summaryArgument?: string;
  summaryArgumentCount?: number;
  targetContentId?: string;
  interruptionLevel?: 'passive' | 'active' | 'time-sensitive' | 'critical';
  relevanceScore?: number;
  filterCriteria?: string;
  actions?: PushNotificationAction[];
  contentAvailable?: boolean;
  mutableContent?: boolean;
}

export interface WebNotificationConfig {
  icon?: string;
  image?: string;
  badge?: string;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
  actions?: PushNotificationAction[];
}

export interface PushNotificationAttachment {
  id: string;
  url: string;
  type?: string;
  thumbnailClippingRect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  thumbnailHidden?: boolean;
  thumbnailTime?: number;
}

export interface PushNotificationAction {
  id: string;
  title: string;
  type?: PushNotificationActionType;
  icon?: string;
  textInput?: {
    buttonTitle: string;
    placeholder?: string;
  };
  foreground?: boolean;
  destructive?: boolean;
  authenticationRequired?: boolean;
}

export interface PushNotificationChannel {
  id: PushNotificationChannelId | string;
  name: string;
  description?: string;
  importance: PushNotificationImportance;
  sound?: PushNotificationSound | string;
  vibration?: boolean;
  vibrationPattern?: number[];
  lights?: boolean;
  lightColor?: string;
  showBadge?: boolean;
  bypassDnd?: boolean;
  lockscreenVisibility?: PushNotificationVisibility;
  group?: string;
}

export interface PushNotificationPermissions {
  status: NotificationPermissionStatus;
  ios?: {
    authorizationStatus: IOSAuthorizationStatus;
    settings: {
      alert: IOSNotificationSetting;
      badge: IOSNotificationSetting;
      sound: IOSNotificationSetting;
      carPlay: IOSNotificationSetting;
      criticalAlert: IOSNotificationSetting;
      provisional: IOSNotificationSetting;
      providesAppSettings: IOSNotificationSetting;
      announcement: IOSNotificationSetting;
      timeSensitive: IOSNotificationSetting;
      scheduledSummary: IOSNotificationSetting;
    };
    showPreviews: IOSShowPreviewsSetting;
  };
  android?: {
    permission: AndroidNotificationPermission;
    exactAlarmPermission?: boolean;
    scheduleExactAlarmPermission?: boolean;
    postNotificationsPermission?: boolean;
  };
}

export interface PushNotificationState {
  // Initialization
  isInitialized: boolean;
  isInitializing: boolean;
  initializationError: string | null;

  // Permissions
  permissions: PushNotificationPermissions | null;
  hasPermission: boolean;
  permissionRequested: boolean;

  // Token
  fcmToken: string | null;
  apnsToken: string | null;
  isTokenRegistered: boolean;

  // Channels (Android)
  channels: PushNotificationChannel[];
  defaultChannelId: string;

  // Notifications
  currentNotification: PushNotification | null;
  notificationHistory: PushNotification[];

  // Badge
  badgeCount: number;

  // Settings
  settings: PushNotificationSettings;

  // Navigation
  navigationRef: any;
  initialNotification: PushNotification | null;

  // Statistics
  statistics: PushNotificationStatistics | null;

  // Error handling
  error: string | null;
  lastError: PushNotificationError | null;
}

export interface PushNotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
  alertEnabled: boolean;
  previewEnabled: boolean;

  // Channel settings
  channelSettings: Record<
    string,
    {
      enabled: boolean;
      sound?: boolean;
      vibration?: boolean;
      importance?: PushNotificationImportance;
    }
  >;

  // Category settings
  categorySettings: Record<
    PushNotificationCategory,
    {
      enabled: boolean;
      priority?: PushNotificationPriority;
      autoOpen?: boolean;
      actions?: string[];
    }
  >;

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:mm
  quietHoursEnd?: string; // HH:mm

  // Other
  groupNotifications: boolean;
  maxNotificationsInGroup: number;
  autoClearAfterOpen: boolean;
  persistNotifications: boolean;
  showNotificationInForeground: boolean;
}

export interface PushNotificationStatistics {
  totalReceived: number;
  totalOpened: number;
  totalDismissed: number;
  totalActionPressed: number;

  byCategory: Record<
    PushNotificationCategory,
    {
      received: number;
      opened: number;
      dismissed: number;
      actionPressed: number;
      avgOpenTime?: number; // seconds
    }
  >;

  byChannel: Record<
    string,
    {
      received: number;
      opened: number;
    }
  >;

  lastReceivedAt?: string;
  lastOpenedAt?: string;

  openRate: number; // percentage
  dismissRate: number; // percentage
  actionRate: number; // percentage
}

export interface PushNotificationError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  recoverable: boolean;
}

export interface NotificationTrigger {
  type: 'timestamp' | 'interval' | 'calendar';
  timestamp?: number;
  interval?: {
    value: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days';
  };
  calendar?: {
    hour?: number;
    minute?: number;
    second?: number;
    weekday?: number;
    day?: number;
    month?: number;
    year?: number;
  };
  repeats?: boolean;
}

export interface LocalNotification extends PushNotification {
  trigger?: NotificationTrigger;
  identifier?: string;
}

export interface RemoteMessage extends FirebaseMessagingTypes.RemoteMessage {
  processed?: boolean;
  localNotificationId?: string;
}
