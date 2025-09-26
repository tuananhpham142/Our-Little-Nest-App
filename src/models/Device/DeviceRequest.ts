// src/models/Device/DeviceRequest.ts

import { DeviceFilterType, DevicePlatformEnum, DeviceSortBy, DeviceStatusEnum, SortOrder } from './DeviceEnum';

export interface GetDevicesRequest {
  // Pagination
  page?: number;
  limit?: number;

  // Filtering
  platforms?: DevicePlatformEnum[];
  statuses?: DeviceStatusEnum[];
  languages?: string[];
  timezones?: string[];
  activeOnly?: boolean;
  inactiveOnly?: boolean;
  withFailedAttempts?: boolean;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  filterType?: DeviceFilterType;

  // Sorting
  sortBy?: DeviceSortBy;
  sortOrder?: SortOrder;

  // Other options
  includeMetadata?: boolean;
  includeInactive?: boolean;
}

export const DEFAULT_DEVICE_PARAMS: GetDevicesRequest = {
  page: 1,
  limit: 20,
  sortBy: DeviceSortBy.LAST_ACTIVE_AT,
  sortOrder: SortOrder.DESC,
  includeMetadata: true,
  includeInactive: false,
};

export interface RegisterDeviceRequest {
  fcmToken: string;
  platform: DevicePlatformEnum;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  language?: string;
  timezone?: string;
  metadata?: {
    brand?: string;
    deviceId?: string;
    isTablet?: boolean;
    hasNotch?: boolean;
    screenWidth?: number;
    screenHeight?: number;
    carrier?: string;
    manufacturer?: string;
    buildNumber?: string;
  };
}

export interface UpdateDeviceRequest {
  fcmToken?: string;
  status?: DeviceStatusEnum;
  language?: string;
  timezone?: string;
  appVersion?: string;
  osVersion?: string;
  metadata?: Record<string, any>;
  lastActiveAt?: string;
}

export interface UnregisterDeviceRequest {
  fcmToken?: string;
  deviceId?: string;
  reason?: string;
}

export interface UnregisterAllDevicesRequest {
  userId?: string;
  exceptCurrentDevice?: boolean;
  reason?: string;
}

export interface RefreshTokenRequest {
  oldToken: string;
  newToken: string;
  deviceId?: string;
}

export interface VerifyTokenRequest {
  token: string;
  platform?: DevicePlatformEnum;
}

export interface VerifyTokensRequest {
  tokens: string[];
  markInvalidTokens?: boolean;
}

export interface UpdateDeviceStatusRequest {
  deviceId: string;
  status: DeviceStatusEnum;
  reason?: string;
}

export interface UpdateLastActiveRequest {
  deviceId: string;
  timestamp?: string;
}

export interface GetDeviceStatisticsRequest {
  userId?: string;
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
  platforms?: DevicePlatformEnum[];
}

export interface CleanupDevicesRequest {
  olderThan?: string;
  inactiveDays?: number;
  onlyInvalidTokens?: boolean;
  dryRun?: boolean;
}

export interface BulkUpdateDevicesRequest {
  deviceIds: string[];
  update: {
    status?: DeviceStatusEnum;
    language?: string;
    timezone?: string;
    metadata?: Record<string, any>;
  };
}

export interface SubscribeToTopicRequest {
  deviceId: string;
  topic: string;
  fcmToken?: string;
}

export interface UnsubscribeFromTopicRequest {
  deviceId: string;
  topic: string;
  fcmToken?: string;
}

export interface SendTestNotificationRequest {
  deviceId?: string;
  fcmToken?: string;
  title?: string;
  message?: string;
  data?: Record<string, any>;
}

export interface DeviceHealthCheckRequest {
  deviceId: string;
  checkConnectivity?: boolean;
  checkPermissions?: boolean;
  checkToken?: boolean;
  checkStorage?: boolean;
}

export interface UpdateNotificationSettingsRequest {
  deviceId: string;
  settings: {
    pushEnabled?: boolean;
    soundEnabled?: boolean;
    vibrationEnabled?: boolean;
    badgeEnabled?: boolean;
    alertEnabled?: boolean;
  };
}

export interface ReportDeviceIssueRequest {
  deviceId: string;
  issueType: 'token_invalid' | 'connectivity' | 'permission' | 'crash' | 'other';
  description: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface GetDeviceSessionsRequest {
  deviceId: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  includeActive?: boolean;
}

export interface UpdateDeviceLocationRequest {
  deviceId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface ExportDevicesRequest {
  userId?: string;
  format: 'csv' | 'json' | 'excel';
  platforms?: DevicePlatformEnum[];
  statuses?: DeviceStatusEnum[];
  includeMetadata?: boolean;
}

export interface MigrateDeviceRequest {
  oldDeviceId: string;
  newDeviceId: string;
  newFcmToken: string;
  transferSettings?: boolean;
  transferSessions?: boolean;
}
