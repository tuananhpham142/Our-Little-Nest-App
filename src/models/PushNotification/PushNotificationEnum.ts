// src/models/PushNotification/PushNotificationEnum.ts

import { AndroidImportance } from '@notifee/react-native';

export enum PushNotificationEventType {
  RECEIVED = 'push:received',
  OPENED = 'push:opened',
  DISMISSED = 'push:dismissed',
  ACTION_PRESSED = 'push:action_pressed',
  DELIVERED = 'push:delivered',
  FAILED = 'push:failed',
  TOKEN_REFRESHED = 'push:token_refreshed',
  PERMISSION_CHANGED = 'push:permission_changed',
}

export enum PushNotificationPriority {
  MIN = 'min',
  LOW = 'low',
  DEFAULT = 'default',
  HIGH = 'high',
  MAX = 'max',
}

export enum PushNotificationVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public',
  SECRET = 'secret',
}

export enum PushNotificationImportance {
  NONE = AndroidImportance.NONE,
  MIN = AndroidImportance.MIN,
  LOW = AndroidImportance.LOW,
  DEFAULT = AndroidImportance.DEFAULT,
  HIGH = AndroidImportance.HIGH,
  MAX = 5,
}

export enum PushNotificationActionType {
  DEFAULT = 'default',
  TEXT_INPUT = 'textInput',
  DESTRUCTIVE = 'destructive',
}

export enum PushNotificationCategory {
  DEFAULT = 'default',
  MESSAGE = 'message',
  REMINDER = 'reminder',
  INVITATION = 'invitation',
  HEALTH = 'health',
  MILESTONE = 'milestone',
  ALERT = 'alert',
  PROMOTION = 'promotion',
}

export enum PushNotificationChannelId {
  DEFAULT = 'default',
  URGENT = 'urgent',
  REMINDER = 'reminder',
  HEALTH = 'health',
  MILESTONE = 'milestone',
  FAMILY = 'family',
  COMMUNITY = 'community',
  PROMOTION = 'promotion',
  SILENT = 'silent',
}

export enum PushNotificationSound {
  DEFAULT = 'default',
  URGENT = 'urgent_notification',
  REMINDER = 'reminder',
  HEALTH = 'health_alert',
  MILESTONE = 'milestone_achieved',
  SILENT = null as any,
}

export enum PushNotificationBadgeIconType {
  NONE = 'none',
  SMALL = 'small',
  LARGE = 'large',
}

export enum PushNotificationGroupType {
  SUMMARY = 'summary',
  CHILDREN = 'children',
}

export enum PushNotificationStyle {
  BIG_TEXT = 'bigText',
  BIG_PICTURE = 'bigPicture',
  INBOX = 'inbox',
  MESSAGING = 'messaging',
}

export enum IOSAuthorizationStatus {
  NOT_DETERMINED = -1,
  DENIED = 0,
  AUTHORIZED = 1,
  PROVISIONAL = 2,
  EPHEMERAL = 3,
}

export enum IOSShowPreviewsSetting {
  ALWAYS = 0,
  WHEN_AUTHENTICATED = 1,
  NEVER = 2,
}

export enum IOSNotificationSetting {
  NOT_SUPPORTED = -1,
  DISABLED = 0,
  ENABLED = 1,
}

export enum AndroidNotificationPermission {
  GRANTED = 'granted',
  DENIED = 'denied',
  NEVER_ASK_AGAIN = 'never_ask_again',
}

export enum NotificationPermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  NOT_DETERMINED = 'not_determined',
  PROVISIONAL = 'provisional',
}

export enum PushNotificationErrorCode {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  TOKEN_REGISTRATION_FAILED = 'TOKEN_REGISTRATION_FAILED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SERVICE_NOT_AVAILABLE = 'SERVICE_NOT_AVAILABLE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  PLATFORM_NOT_SUPPORTED = 'PLATFORM_NOT_SUPPORTED',
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
}
