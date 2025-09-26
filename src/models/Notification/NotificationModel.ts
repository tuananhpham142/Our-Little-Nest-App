// src/models/Notification/NotificationModel.ts

import {
  NotificationChannelEnum,
  NotificationFilterType,
  NotificationPriorityEnum,
  NotificationSortBy,
  NotificationStatusEnum,
  NotificationTypeEnum,
  SortOrder,
} from './NotificationEnum';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationTypeEnum;
  title: string;
  message: string;
  data?: Record<string, any>;
  status: NotificationStatusEnum;
  priority: NotificationPriorityEnum;
  channels: NotificationChannelEnum[];
  scheduledFor?: string;
  sentAt?: string;
  readAt?: string;
  expiresAt?: string;
  errorMessage?: string;
  externalIds?: Record<string, string>;
  triggeredBy?: string;
  createdAt: string;
  updatedAt: string;

  // UI specific properties
  isSelected?: boolean;
  isHighlighted?: boolean;
}

export interface NotificationStatistics {
  total: number;
  unread: number;
  byType: Record<NotificationTypeEnum, number>;
  byPriority: Record<NotificationPriorityEnum, number>;
  byChannel: Record<NotificationChannelEnum, number>;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

export interface NotificationFilters {
  types?: NotificationTypeEnum[];
  statuses?: NotificationStatusEnum[];
  priorities?: NotificationPriorityEnum[];
  channels?: NotificationChannelEnum[];
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  sortBy: NotificationSortBy;
  sortOrder: SortOrder;
  filterType?: NotificationFilterType;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  totalPages: number;
}

export interface NotificationState {
  // Data
  notifications: Notification[];
  selectedNotification: Notification | null;
  unreadNotifications: Notification[];
  priorityNotifications: Notification[];

  // Statistics
  unreadCount: number;
  statistics: NotificationStatistics | null;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isSubmitting: boolean;
  isRefreshing: boolean;

  // Pagination
  pagination: NotificationPagination;

  // Filters and sorting
  filters: NotificationFilters;

  // UI States
  isNotificationPanelOpen: boolean;
  selectedNotificationIds: string[];

  // Cache
  cache: Record<
    string,
    {
      data: any;
      timestamp: number;
      expiresIn: number;
    }
  >;

  // Real-time
  isSocketConnected: boolean;
  lastSyncTime: string | null;
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
  unreadCount: number;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;

  // Type preferences
  typePreferences: Record<
    NotificationTypeEnum,
    {
      enabled: boolean;
      channels: NotificationChannelEnum[];
      priority: NotificationPriorityEnum;
    }
  >;

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // HH:mm format
  quietHoursEnd?: string; // HH:mm format

  // Other preferences
  groupNotifications: boolean;
  showPreview: boolean;
  autoMarkAsRead: boolean;
  autoDeleteAfterDays?: number;
}

export interface NotificationTemplate {
  id: string;
  code: string;
  type: NotificationTypeEnum;
  titleTemplate: string;
  messageTemplate: string;
  priority: NotificationPriorityEnum;
  channels: NotificationChannelEnum[];
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationBadge {
  count: number;
  hasNew: boolean;
  color?: string;
}
