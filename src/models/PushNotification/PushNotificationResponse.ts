// src/models/PushNotification/PushNotificationResponse.ts

import {
    LocalNotification,
    PushNotification,
    PushNotificationChannel,
    PushNotificationError,
    PushNotificationPermissions,
    PushNotificationSettings,
    PushNotificationStatistics,
} from './PushNotificationModel';

export interface InitializeResponse {
  success: boolean;
  isInitialized: boolean;
  hasPermission: boolean;
  fcmToken?: string;
  apnsToken?: string;
  error?: string;
}

export interface RequestPermissionResponse {
  granted: boolean;
  permissions: PushNotificationPermissions;
  error?: string;
}

export interface GetPermissionsResponse {
  permissions: PushNotificationPermissions;
}

export interface GetTokenResponse {
  token: string;
  platform: 'fcm' | 'apns';
  timestamp: string;
}

export interface DisplayNotificationResponse {
  success: boolean;
  notificationId: string;
  error?: string;
}

export interface ScheduleNotificationResponse {
  success: boolean;
  identifier: string;
  scheduledAt: string;
  error?: string;
}

export interface UpdateScheduledNotificationResponse {
  success: boolean;
  identifier: string;
  updatedAt: string;
  error?: string;
}

export interface CancelNotificationResponse {
  success: boolean;
  cancelledCount: number;
  error?: string;
}

export interface GetScheduledNotificationsResponse {
  notifications: LocalNotification[];
  count: number;
}

export interface GetDeliveredNotificationsResponse {
  notifications: PushNotification[];
  count: number;
}

export interface RemoveDeliveredNotificationsResponse {
  success: boolean;
  removedCount: number;
}

export interface GetBadgeCountResponse {
  count: number;
}

export interface SetBadgeCountResponse {
  success: boolean;
  count: number;
}

export interface CreateChannelResponse {
  success: boolean;
  channel: PushNotificationChannel;
  error?: string;
}

export interface UpdateChannelResponse {
  success: boolean;
  channel: PushNotificationChannel;
  error?: string;
}

export interface DeleteChannelResponse {
  success: boolean;
  error?: string;
}

export interface GetChannelResponse {
  channel: PushNotificationChannel | null;
}

export interface GetChannelsResponse {
  channels: PushNotificationChannel[];
  count: number;
}

export interface ChannelExistsResponse {
  exists: boolean;
}

export interface CreateChannelGroupResponse {
  success: boolean;
  groupId: string;
  error?: string;
}

export interface DeleteChannelGroupResponse {
  success: boolean;
  error?: string;
}

export interface GetChannelGroupsResponse {
  groups: Array<{
    id: string;
    name: string;
    description?: string;
    channels: string[];
  }>;
  count: number;
}

export interface IsChannelBlockedResponse {
  blocked: boolean;
  channelId: string;
}

export interface GetInitialNotificationResponse {
  notification: PushNotification | null;
  opened: boolean;
}

export interface OnNotificationOpenedResponse {
  notification: PushNotification;
  action?: {
    id: string;
    userText?: string;
  };
}

export interface TestNotificationResponse {
  success: boolean;
  notificationId?: string;
  deliveredAt?: string;
  error?: string;
}

export interface RegisterTopicResponse {
  success: boolean;
  topic: string;
  error?: string;
}

export interface UnregisterTopicResponse {
  success: boolean;
  topic: string;
  error?: string;
}

export interface GetSettingsResponse {
  settings: PushNotificationSettings;
}

export interface UpdateSettingsResponse {
  success: boolean;
  settings: PushNotificationSettings;
}

export interface GetStatisticsResponse {
  statistics: PushNotificationStatistics;
}

export interface ClearStatisticsResponse {
  success: boolean;
  clearedCount: number;
}

export interface CheckNotificationStatusResponse {
  enabled: boolean;
  hasPermission: boolean;
  isTokenRegistered: boolean;
  channelsCreated: boolean;
  error?: PushNotificationError;
}

export interface NotificationEventResponse {
  type: 'received' | 'opened' | 'dismissed' | 'action_pressed';
  notification: PushNotification;
  action?: {
    id: string;
    title: string;
    userText?: string;
  };
  timestamp: string;
}

export interface GetNotificationHistoryResponse {
  notifications: PushNotification[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ExportNotificationDataResponse {
  success: boolean;
  data: {
    settings: PushNotificationSettings;
    statistics: PushNotificationStatistics;
    channels: PushNotificationChannel[];
    history: PushNotification[];
  };
  exportedAt: string;
}

export interface ImportNotificationDataResponse {
  success: boolean;
  imported: {
    settings: boolean;
    channels: number;
    statistics: boolean;
  };
  error?: string;
}

export interface NotificationHealthCheckResponse {
  isHealthy: boolean;
  services: {
    firebase: {
      connected: boolean;
      token: boolean;
      error?: string;
    };
    notifee: {
      initialized: boolean;
      error?: string;
    };
    permissions: {
      granted: boolean;
      status: string;
    };
    channels: {
      count: number;
      defaultCreated: boolean;
    };
    device: {
      registered: boolean;
      platform: string;
    };
  };
  timestamp: string;
}

export interface PushNotificationErrorResponse {
  success: false;
  error: PushNotificationError;
}
