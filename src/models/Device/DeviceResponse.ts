// src/models/Device/DeviceResponse.ts

import {
    Device,
    DeviceHealth,
    DeviceNotificationSettings,
    DeviceSession,
    DeviceStatistics
} from './DeviceModel';

export interface DeviceListResponse {
  data: Device[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface DeviceDetailResponse {
  data: Device;
}

export interface DeviceMutationResponse {
  success: boolean;
  data: Device;
  message?: string;
}

export interface RegisterDeviceResponse {
  success: boolean;
  data: Device;
  isNewDevice: boolean;
  message?: string;
}

export interface UnregisterDeviceResponse {
  success: boolean;
  message: string;
  removedCount?: number;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: Device;
  oldToken: string;
  newToken: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  token: string;
  platform?: string;
  error?: string;
}

export interface VerifyTokensResponse {
  valid: string[];
  invalid: string[];
  total: number;
  validCount: number;
  invalidCount: number;
}

export interface DeviceStatisticsResponse {
  data: DeviceStatistics;
}

export interface DeviceHealthCheckResponse {
  deviceId: string;
  health: DeviceHealth;
  timestamp: string;
}

export interface CleanupDevicesResponse {
  success: boolean;
  cleanedCount: number;
  deviceIds: string[];
  message?: string;
}

export interface BulkUpdateDevicesResponse {
  success: boolean;
  updatedCount: number;
  failedCount: number;
  devices: Device[];
  errors?: Array<{
    deviceId: string;
    error: string;
  }>;
}

export interface DeviceGroupedResponse {
  ios: Device[];
  android: Device[];
  web: Device[];
  counts: {
    ios: number;
    android: number;
    web: number;
    total: number;
  };
}

export interface DeviceTopicSubscriptionResponse {
  success: boolean;
  topic: string;
  subscribed: boolean;
  deviceId: string;
  message?: string;
}

export interface TestNotificationResponse {
  success: boolean;
  messageId?: string;
  deviceId?: string;
  error?: string;
  deliveredAt?: string;
}

export interface DeviceNotificationSettingsResponse {
  data: DeviceNotificationSettings;
}

export interface DeviceSessionsResponse {
  data: DeviceSession[];
  total: number;
  activeSessionsCount: number;
}

export interface DevicePermissionsResponse {
  push: {
    status: 'granted' | 'denied' | 'not_determined' | 'provisional';
    enabled: boolean;
  };
  location: {
    status: 'granted' | 'denied' | 'restricted' | 'not_determined';
    enabled: boolean;
  };
  camera: {
    status: 'granted' | 'denied' | 'restricted' | 'not_determined';
    enabled: boolean;
  };
  microphone: {
    status: 'granted' | 'denied' | 'restricted' | 'not_determined';
    enabled: boolean;
  };
  contacts: {
    status: 'granted' | 'denied' | 'not_determined';
    enabled: boolean;
  };
  calendar: {
    status: 'granted' | 'denied' | 'not_determined';
    enabled: boolean;
  };
  photos: {
    status: 'granted' | 'denied' | 'limited' | 'not_determined';
    enabled: boolean;
  };
}

export interface DeviceSyncResponse {
  success: boolean;
  syncedDevices: Device[];
  newDevices: Device[];
  updatedDevices: Device[];
  removedDeviceIds: string[];
  lastSyncTime: string;
}

export interface DeviceQuotaResponse {
  used: number;
  limit: number;
  remaining: number;
  deviceIds: string[];
  canAddMore: boolean;
}

export interface ExportDevicesResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  exportedCount: number;
  format: string;
}

export interface MigrateDeviceResponse {
  success: boolean;
  oldDevice: Device;
  newDevice: Device;
  migratedSettings: boolean;
  migratedSessions: boolean;
  message?: string;
}

export interface DeviceIssueReportResponse {
  success: boolean;
  reportId: string;
  status: 'submitted' | 'in_progress' | 'resolved';
  message?: string;
}

export interface DeviceCapabilitiesResponse {
  hasCamera: boolean;
  hasMicrophone: boolean;
  hasBluetooth: boolean;
  hasNFC: boolean;
  hasFaceID: boolean;
  hasTouchID: boolean;
  hasBiometrics: boolean;
  hasGyroscope: boolean;
  hasAccelerometer: boolean;
  hasMagnetometer: boolean;
  hasProximity: boolean;
  hasAmbientLight: boolean;
  supportedBiometryType?: 'FaceID' | 'TouchID' | 'Biometrics' | 'None';
}

export interface DeviceErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}
