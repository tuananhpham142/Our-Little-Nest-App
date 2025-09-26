// src/models/PushNotification/PushNotificationRequest.ts

import {
  PushNotificationCategory,
  PushNotificationChannelId,
  PushNotificationImportance,
  PushNotificationPriority,
  PushNotificationSound,
  PushNotificationVisibility,
} from './PushNotificationEnum';
import { NotificationTrigger, PushNotificationAction, PushNotificationChannel } from './PushNotificationModel';

export interface InitializePushNotificationRequest {
  requestPermissionOnInit?: boolean;
  registerDeviceOnInit?: boolean;
  showInForeground?: boolean;
  popInitialNotification?: boolean;
  requestPermissions?: {
    alert?: boolean;
    badge?: boolean;
    sound?: boolean;
    provisional?: boolean;
    providesAppSettings?: boolean;
    criticalAlert?: boolean;
    announcement?: boolean;
  };
}

export interface RequestPermissionRequest {
  provisional?: boolean;
  providesAppSettings?: boolean;
  alert?: boolean;
  badge?: boolean;
  sound?: boolean;
  criticalAlert?: boolean;
  announcement?: boolean;
  carPlay?: boolean;
}

export interface CreateChannelRequest {
  id: PushNotificationChannelId | string;
  name: string;
  description?: string;
  importance?: PushNotificationImportance;
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

export interface DisplayNotificationRequest {
  title: string;
  body: string;
  subtitle?: string;
  data?: Record<string, any>;
  badge?: number;
  sound?: PushNotificationSound | string;
  category?: PushNotificationCategory;
  threadId?: string;
  android?: {
    channelId?: PushNotificationChannelId | string;
    importance?: PushNotificationImportance;
    priority?: PushNotificationPriority;
    smallIcon?: string;
    largeIcon?: string;
    color?: string;
    vibrationPattern?: number[];
    onlyAlertOnce?: boolean;
    ongoing?: boolean;
    autoCancel?: boolean;
    groupKey?: string;
    groupSummary?: boolean;
    when?: number;
    showWhen?: boolean;
    actions?: PushNotificationAction[];
    style?: {
      type: 'bigText' | 'bigPicture' | 'inbox';
      text?: string;
      picture?: string;
      lines?: string[];
    };
    progressBar?: {
      max: number;
      current: number;
      indeterminate?: boolean;
    };
  };
  ios?: {
    critical?: boolean;
    criticalVolume?: number;
    launchImageName?: string;
    interruptionLevel?: 'passive' | 'active' | 'time-sensitive' | 'critical';
    relevanceScore?: number;
    threadId?: string;
    targetContentId?: string;
    attachments?: Array<{
      url: string;
      id?: string;
      type?: string;
    }>;
    actions?: PushNotificationAction[];
  };
}

export interface ScheduleNotificationRequest extends DisplayNotificationRequest {
  trigger: NotificationTrigger;
  identifier?: string;
  repeats?: boolean;
}

export interface UpdateScheduledNotificationRequest {
  identifier: string;
  notification: Partial<DisplayNotificationRequest>;
  trigger?: NotificationTrigger;
}

export interface CancelNotificationRequest {
  notificationId?: string;
  tag?: string;
  identifier?: string;
}

export interface CancelAllNotificationsRequest {
  clearBadge?: boolean;
}

export interface GetScheduledNotificationsRequest {
  identifiers?: string[];
}

export interface GetDeliveredNotificationsRequest {
  limit?: number;
}

export interface SetBadgeCountRequest {
  count: number;
}

export interface SetCategoriesRequest {
  categories: Array<{
    id: string;
    actions: PushNotificationAction[];
    hiddenPreviewsBodyPlaceholder?: string;
    customDismissAction?: boolean;
    allowInCarPlay?: boolean;
    hiddenPreviewsShowTitle?: boolean;
    hiddenPreviewsShowSubtitle?: boolean;
    allowAnnouncement?: boolean;
  }>;
}

export interface HandleNotificationActionRequest {
  actionId: string;
  notificationId: string;
  userText?: string;
  data?: Record<string, any>;
}

export interface UpdateChannelRequest {
  id: string;
  update: Partial<PushNotificationChannel>;
}

export interface DeleteChannelRequest {
  id: string;
}

export interface GetChannelRequest {
  id: string;
}

export interface CreateChannelGroupRequest {
  id: string;
  name: string;
  description?: string;
}

export interface DeleteChannelGroupRequest {
  id: string;
}

export interface TestNotificationRequest {
  type?: 'local' | 'remote';
  title?: string;
  body?: string;
  data?: Record<string, any>;
  channelId?: string;
  priority?: PushNotificationPriority;
  category?: PushNotificationCategory;
  delay?: number; // milliseconds
}

export interface RegisterTopicRequest {
  topic: string;
}

export interface UnregisterTopicRequest {
  topic: string;
}

export interface SendToTopicRequest {
  topic: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  priority?: PushNotificationPriority;
}

export interface UpdateSettingsRequest {
  enabled?: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  badgeEnabled?: boolean;
  alertEnabled?: boolean;
  previewEnabled?: boolean;
  channelSettings?: Record<
    string,
    {
      enabled: boolean;
      sound?: boolean;
      vibration?: boolean;
      importance?: PushNotificationImportance;
    }
  >;
  categorySettings?: Record<
    PushNotificationCategory,
    {
      enabled: boolean;
      priority?: PushNotificationPriority;
      autoOpen?: boolean;
    }
  >;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  groupNotifications?: boolean;
  autoClearAfterOpen?: boolean;
}
