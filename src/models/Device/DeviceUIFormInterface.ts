// src/models/Device/DeviceUIFormInterface.ts

import { DevicePlatformEnum, DeviceStatusEnum, NotificationPermissionStatus } from './DeviceEnum';

export interface DeviceFormData {
  fcmToken: string;
  platform: DevicePlatformEnum | '';
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  language: string;
  timezone: string;
  metadata?: {
    brand?: string;
    deviceId?: string;
    isTablet?: boolean;
    hasNotch?: boolean;
  };
}

export interface DeviceFormErrors {
  fcmToken?: string;
  platform?: string;
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  language?: string;
  timezone?: string;
  general?: string;
}

export interface DeviceFilterFormData {
  platforms: DevicePlatformEnum[];
  statuses: DeviceStatusEnum[];
  languages: string[];
  timezones: string[];
  activeOnly: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  searchQuery: string;
}

export interface DeviceSettingsFormData {
  // Push notification settings
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
  alertEnabled: boolean;

  // Auto-sync settings
  autoSync: boolean;
  syncInterval: number; // in minutes
  syncOnWiFiOnly: boolean;

  // Device management
  autoUnregisterInactiveDays: number;
  keepDeviceHistory: boolean;
  maxDevicesPerUser: number;

  // Security
  requireTokenVerification: boolean;
  tokenRefreshInterval: number; // in days
  allowMultipleDevices: boolean;
}

export interface DeviceUIConfig {
  // Display options
  showDeviceIcon: boolean;
  showLastActive: boolean;
  showStatus: boolean;
  showPlatform: boolean;
  showActions: boolean;
  showMetadata: boolean;

  // Grouping
  enableGrouping: boolean;
  groupBy: 'platform' | 'status' | 'none';

  // Layout
  layout: 'list' | 'card' | 'grid';
  density: 'comfortable' | 'compact' | 'spacious';

  // Colors
  platformColors: {
    [DevicePlatformEnum.IOS]: string;
    [DevicePlatformEnum.ANDROID]: string;
    [DevicePlatformEnum.WEB]: string;
  };

  statusColors: {
    [DeviceStatusEnum.ACTIVE]: string;
    [DeviceStatusEnum.INACTIVE]: string;
    [DeviceStatusEnum.INVALID_TOKEN]: string;
    [DeviceStatusEnum.EXPIRED]: string;
    [DeviceStatusEnum.DISABLED]: string;
  };

  // Actions
  swipeActions: {
    left?: 'unregister' | 'disable' | 'refresh' | 'none';
    right?: 'unregister' | 'disable' | 'refresh' | 'none';
  };
}

export interface DeviceActionButton {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  action: 'view' | 'unregister' | 'refresh' | 'disable' | 'enable' | 'test' | 'custom';
  customAction?: () => void;
  requireConfirmation?: boolean;
}

export interface DeviceListItemProps {
  device: any;
  isSelected: boolean;
  isCurrentDevice: boolean;
  showActions: boolean;
  onPress: () => void;
  onLongPress?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  actions?: DeviceActionButton[];
}

export interface DevicePanelProps {
  isOpen: boolean;
  devices: any[];
  currentDevice: any | null;
  isLoading: boolean;
  onClose: () => void;
  onDevicePress: (id: string) => void;
  onUnregister: (id: string) => void;
  onRefreshToken: (id: string) => void;
  onRegisterNew: () => void;
}

export interface DevicePermissionModalProps {
  isVisible: boolean;
  currentStatus: NotificationPermissionStatus;
  onAllow: () => void;
  onDeny: () => void;
  onLater: () => void;
  onSettings: () => void;
  title?: string;
  message?: string;
  benefits?: string[];
  showSettingsOption?: boolean;
}

export interface DeviceStatusIndicatorProps {
  status: DeviceStatusEnum;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
}

export interface DeviceIconProps {
  platform: DevicePlatformEnum;
  size?: number;
  color?: string;
  style?: any;
}

export interface DeviceEmptyStateProps {
  type: 'no_devices' | 'no_active' | 'filtered' | 'error' | 'permission_denied';
  onAction?: () => void;
  actionLabel?: string;
  title?: string;
  message?: string;
  icon?: string;
}

export interface DeviceHeaderProps {
  title: string;
  deviceCount: number;
  activeCount: number;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  showAddButton?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
  onAdd?: () => void;
}

export interface DeviceDetailsModalProps {
  device: any;
  isVisible: boolean;
  onClose: () => void;
  onUnregister?: () => void;
  onRefresh?: () => void;
  onTest?: () => void;
  showActions?: boolean;
}

export interface DeviceQuickActionsProps {
  device: any;
  onUnregister: () => void;
  onRefresh: () => void;
  onTest: () => void;
  onDisable: () => void;
  onEnable: () => void;
  showLabels?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export interface DeviceRegistrationFormProps {
  onSubmit: (data: DeviceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
  initialData?: Partial<DeviceFormData>;
}

export interface DeviceHealthIndicatorProps {
  deviceId: string;
  health?: any;
  showDetails?: boolean;
  onRefresh?: () => void;
}

export interface DeviceBatteryIndicatorProps {
  level: number;
  isCharging: boolean;
  showPercentage?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface DeviceNetworkIndicatorProps {
  type: 'wifi' | 'cellular' | 'ethernet' | 'none' | 'unknown';
  isConnected: boolean;
  strength?: number;
  showLabel?: boolean;
}

export const DeviceFormValidation = {
  fcmToken: {
    required: true,
    minLength: 100,
    maxLength: 1000,
    pattern: /^[a-zA-Z0-9:_-]+$/,
  },
  platform: {
    required: true,
    enum: Object.values(DevicePlatformEnum),
  },
  deviceModel: {
    required: false,
    maxLength: 100,
  },
  osVersion: {
    required: false,
    maxLength: 20,
  },
  appVersion: {
    required: false,
    maxLength: 20,
    pattern: /^\d+\.\d+\.\d+$/,
  },
  language: {
    required: false,
    pattern: /^[a-z]{2}-[A-Z]{2}$/,
  },
  timezone: {
    required: false,
    pattern: /^[A-Za-z]+\/[A-Za-z_]+$/,
  },
};

export const DeviceUIMessages = {
  registration: {
    success: 'Device registered successfully',
    error: 'Failed to register device',
    alreadyRegistered: 'This device is already registered',
    tokenInvalid: 'Invalid FCM token',
    limitExceeded: 'Device limit exceeded',
  },
  unregistration: {
    confirm: 'Are you sure you want to unregister this device?',
    success: 'Device unregistered successfully',
    error: 'Failed to unregister device',
    lastDevice: 'This is your only device. You will stop receiving notifications.',
  },
  permission: {
    title: 'Enable Push Notifications',
    message: "Stay updated with important notifications about your baby's health and milestones.",
    denied: 'Push notifications are disabled. Enable them in settings to stay updated.',
    provisional: 'You have provisional notification permission. Full access recommended.',
  },
  errors: {
    network: 'Network error. Please check your connection.',
    server: 'Server error. Please try again later.',
    unknown: 'Something went wrong. Please try again.',
  },
  status: {
    active: 'Active',
    inactive: 'Inactive',
    invalidToken: 'Invalid Token',
    expired: 'Expired',
    disabled: 'Disabled',
  },
};
