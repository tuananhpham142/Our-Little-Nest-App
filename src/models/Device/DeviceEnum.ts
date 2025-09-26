// src/models/Device/DeviceEnum.ts

export enum DevicePlatformEnum {
  IOS = 'ios',
  ANDROID = 'android',
  WEB = 'web',
}

export enum DeviceStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  INVALID_TOKEN = 'invalid_token',
  EXPIRED = 'expired',
  DISABLED = 'disabled',
}

export enum DeviceSortBy {
  CREATED_AT = 'createdAt',
  LAST_ACTIVE_AT = 'lastActiveAt',
  PLATFORM = 'platform',
  STATUS = 'status',
  DEVICE_MODEL = 'deviceModel',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum DeviceFilterType {
  ALL = 'all',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MY_DEVICES = 'my_devices',
  CURRENT_DEVICE = 'current_device',
}

export enum NotificationPermissionStatus {
  NOT_DETERMINED = -1,
  DENIED = 0,
  AUTHORIZED = 1,
  PROVISIONAL = 2,
}

export enum DeviceLanguage {
  VI_VN = 'vi-VN',
  EN_US = 'en-US',
  EN_GB = 'en-GB',
  ZH_CN = 'zh-CN',
  JA_JP = 'ja-JP',
  KO_KR = 'ko-KR',
}

export enum DeviceTimezone {
  ASIA_HO_CHI_MINH = 'Asia/Ho_Chi_Minh',
  ASIA_BANGKOK = 'Asia/Bangkok',
  ASIA_SINGAPORE = 'Asia/Singapore',
  ASIA_TOKYO = 'Asia/Tokyo',
  ASIA_SEOUL = 'Asia/Seoul',
  ASIA_SHANGHAI = 'Asia/Shanghai',
  AMERICA_NEW_YORK = 'America/New_York',
  AMERICA_LOS_ANGELES = 'America/Los_Angeles',
  EUROPE_LONDON = 'Europe/London',
  EUROPE_PARIS = 'Europe/Paris',
}

export enum DeviceEventType {
  REGISTERED = 'device:registered',
  UPDATED = 'device:updated',
  UNREGISTERED = 'device:unregistered',
  TOKEN_REFRESHED = 'device:token_refreshed',
  STATUS_CHANGED = 'device:status_changed',
  PERMISSION_CHANGED = 'device:permission_changed',
  ACTIVE = 'device:active',
  INACTIVE = 'device:inactive',
}

export enum DeviceErrorCode {
  INVALID_TOKEN = 'INVALID_TOKEN',
  REGISTRATION_FAILED = 'REGISTRATION_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  TOKEN_REFRESH_FAILED = 'TOKEN_REFRESH_FAILED',
  DEVICE_LIMIT_EXCEEDED = 'DEVICE_LIMIT_EXCEEDED',
  DUPLICATE_DEVICE = 'DUPLICATE_DEVICE',
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
}
