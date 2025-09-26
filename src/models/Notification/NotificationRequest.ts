// src/models/Notification/NotificationRequest.ts

import {
    NotificationChannelEnum,
    NotificationFilterType,
    NotificationPriorityEnum,
    NotificationSortBy,
    NotificationStatusEnum,
    NotificationTypeEnum,
    SortOrder,
} from './NotificationEnum';

export interface GetNotificationsRequest {
  // Pagination
  page?: number;
  limit?: number;

  // Filtering
  types?: NotificationTypeEnum[];
  statuses?: NotificationStatusEnum[];
  priorities?: NotificationPriorityEnum[];
  channels?: NotificationChannelEnum[];
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  filterType?: NotificationFilterType;

  // Sorting
  sortBy?: NotificationSortBy;
  sortOrder?: SortOrder;

  // Other options
  includeExpired?: boolean;
  includeFailed?: boolean;
}

export const DEFAULT_NOTIFICATION_PARAMS: GetNotificationsRequest = {
  page: 1,
  limit: 20,
  sortBy: NotificationSortBy.CREATED_AT,
  sortOrder: SortOrder.DESC,
  includeExpired: false,
  includeFailed: false,
};

export interface CreateNotificationRequest {
  userId: string;
  type: NotificationTypeEnum;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: NotificationPriorityEnum;
  channels?: NotificationChannelEnum[];
  scheduledFor?: string;
  expiresAt?: string;
  triggeredBy?: string;
}

export interface UpdateNotificationRequest {
  status?: NotificationStatusEnum;
  readAt?: string;
  data?: Record<string, any>;
  errorMessage?: string;
}

export interface MarkAsReadRequest {
  notificationId: string;
}

export interface MarkAllAsReadRequest {
  userId?: string;
  types?: NotificationTypeEnum[];
  beforeDate?: string;
}

export interface SendBulkNotificationRequest {
  userIds: string[];
  notification: Omit<CreateNotificationRequest, 'userId'>;
  schedule?: {
    sendAt?: string;
    timezone?: string;
    recurring?: {
      type: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: string;
    };
  };
}

export interface ScheduleNotificationRequest {
  notification: CreateNotificationRequest;
  scheduledFor: string;
  timezone?: string;
}

export interface DeleteNotificationRequest {
  notificationId: string;
  permanently?: boolean;
}

export interface DeleteBulkNotificationsRequest {
  notificationIds: string[];
  permanently?: boolean;
}

export interface UpdatePreferencesRequest {
  pushEnabled?: boolean;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  inAppEnabled?: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  groupNotifications?: boolean;
  showPreview?: boolean;
  autoMarkAsRead?: boolean;
  autoDeleteAfterDays?: number;
  typePreferences?: Record<
    NotificationTypeEnum,
    {
      enabled: boolean;
      channels: NotificationChannelEnum[];
      priority?: NotificationPriorityEnum;
    }
  >;
}

export interface SubscribeToTopicRequest {
  topic: string;
  userId: string;
}

export interface UnsubscribeFromTopicRequest {
  topic: string;
  userId: string;
}

export interface TestNotificationRequest {
  channel: NotificationChannelEnum;
  userId?: string;
  title?: string;
  message?: string;
}

export interface ExportNotificationsRequest {
  userId: string;
  startDate?: string;
  endDate?: string;
  format: 'csv' | 'json' | 'pdf';
  types?: NotificationTypeEnum[];
}

export interface ArchiveNotificationsRequest {
  notificationIds: string[];
  archiveUntil?: string;
}

export interface RestoreNotificationsRequest {
  notificationIds: string[];
}

export interface ClearNotificationsRequest {
  userId: string;
  types?: NotificationTypeEnum[];
  olderThan?: string;
  keepUnread?: boolean;
}

export interface GetNotificationStatsRequest {
  userId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}
