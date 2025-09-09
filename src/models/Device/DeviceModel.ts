// src/models/Device/DeviceModel.ts

import {
    DeviceFilterType,
    DeviceLanguage,
    DevicePlatformEnum,
    DeviceSortBy,
    DeviceStatusEnum,
    DeviceTimezone,
    NotificationPermissionStatus,
    SortOrder,
} from './DeviceEnum';

export interface Device {
  id: string;
  userId: string;
  fcmToken: string;
  platform: DevicePlatformEnum;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  status: DeviceStatusEnum;
  language?: DeviceLanguage | string;
  timezone?: DeviceTimezone | string;
  lastActiveAt: string;
  lastVerifiedAt?: string;
  failedAttempts: number;
  metadata?: DeviceMetadata;
  createdAt: string;
  updatedAt: string;

  // UI specific properties
  isCurrentDevice?: boolean;
  isSelected?: boolean;
}

export interface DeviceMetadata {
  brand?: string;
  deviceId?: string;
  isTablet?: boolean;
  hasNotch?: boolean;
  screenWidth?: number;
  screenHeight?: number;
  carrier?: string;
  ipAddress?: string;
  userAgent?: string;
  buildNumber?: string;
  manufacturer?: string;
}

export interface DeviceStatistics {
  total: number;
  byPlatform: Record<DevicePlatformEnum, number>;
  byStatus: Record<DeviceStatusEnum, number>;
  byLanguage: Record<string, number>;
  activeInLast24h: number;
  activeInLastWeek: number;
  activeInLastMonth: number;
  averageDevicesPerUser: number;
  newDevicesThisWeek: number;
  invalidTokenCount: number;
}

export interface DeviceFilters {
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
  sortBy: DeviceSortBy;
  sortOrder: SortOrder;
  filterType?: DeviceFilterType;
}

export interface DevicePagination {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  totalPages: number;
}

export interface DeviceState {
  // Data
  devices: Device[];
  currentDevice: Device | null;
  selectedDevice: Device | null;
  activeDevices: Device[];

  // FCM & Permissions
  fcmToken: string | null;
  permissionStatus: NotificationPermissionStatus;
  isRegistered: boolean;

  // Statistics
  statistics: DeviceStatistics | null;
  deviceCount: number;

  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isSubmitting: boolean;
  isRefreshing: boolean;
  isRegistering: boolean;
  isUnregistering: boolean;

  // Error handling
  error: string | null;
  registrationError: string | null;
  fieldErrors: Record<string, string>;

  // Pagination
  pagination: DevicePagination;

  // Filters and sorting
  filters: DeviceFilters;

  // UI States
  isDevicePanelOpen: boolean;
  selectedDeviceIds: string[];
  showPermissionModal: boolean;

  // Cache
  cache: Record<
    string,
    {
      data: any;
      timestamp: number;
      expiresIn: number;
    }
  >;

  // Sync
  lastSyncTime: string | null;
  isSyncing: boolean;
}

export interface DeviceGroup {
  platform: DevicePlatformEnum;
  devices: Device[];
  count: number;
}

export interface DeviceSession {
  deviceId: string;
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  eventsCount: number;
  isActive: boolean;
}

export interface DeviceHealth {
  deviceId: string;
  isHealthy: boolean;
  lastHealthCheck: string;
  issues: DeviceHealthIssue[];
  performance: DevicePerformance;
}

export interface DeviceHealthIssue {
  type: 'token_invalid' | 'connectivity' | 'permission' | 'storage' | 'battery';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface DevicePerformance {
  avgResponseTime: number;
  successRate: number;
  failureRate: number;
  lastFailure?: string;
  totalRequests: number;
  totalFailures: number;
}

export interface DeviceNotificationSettings {
  deviceId: string;
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
  alertEnabled: boolean;
  criticalAlertEnabled: boolean;
  provisionalEnabled: boolean;
  carPlayEnabled: boolean;
  lockScreenEnabled: boolean;
  notificationCenterEnabled: boolean;
  bannerEnabled: boolean;
}

export interface DeviceBattery {
  level: number;
  isCharging: boolean;
  chargingTime?: number;
  dischargingTime?: number;
}

export interface DeviceNetwork {
  type: 'wifi' | 'cellular' | 'ethernet' | 'none' | 'unknown';
  isConnected: boolean;
  isInternetReachable: boolean;
  details?: {
    isConnectionExpensive?: boolean;
    cellularGeneration?: '2g' | '3g' | '4g' | '5g';
    carrier?: string;
    ipAddress?: string;
    subnet?: string;
    frequency?: number;
    strength?: number;
    ssid?: string;
  };
}

export interface DeviceStorage {
  totalSpace: number;
  freeSpace: number;
  usedSpace: number;
  percentageUsed: number;
}

export interface DeviceLocation {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp?: string;
  permissionStatus: 'granted' | 'denied' | 'restricted' | 'undetermined';
}
