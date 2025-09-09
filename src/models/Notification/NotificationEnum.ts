// src/models/Notification/NotificationEnum.ts

export enum NotificationTypeEnum {
  // Baby-related
  BABY_CREATED = 'baby_created',
  BABY_UPDATED = 'baby_updated',
  BABY_DELETED = 'baby_deleted',
  BABY_AVATAR_UPDATED = 'baby_avatar_updated',

  // Family-related
  FAMILY_MEMBER_ADDED = 'family_member_added',
  FAMILY_MEMBER_REMOVED = 'family_member_removed',
  FAMILY_MEMBER_UPDATED = 'family_member_updated',
  FAMILY_INVITATION_SENT = 'family_invitation_sent',
  FAMILY_INVITATION_ACCEPTED = 'family_invitation_accepted',
  FAMILY_INVITATION_DECLINED = 'family_invitation_declined',

  // Medical & Health
  MEDICAL_INFO_UPDATED = 'medical_info_updated',
  MEDICATION_REMINDER = 'medication_reminder',
  DOCTOR_APPOINTMENT = 'doctor_appointment',
  VACCINATION_DUE = 'vaccination_due',
  VACCINATION_RECORDED = 'vaccination_recorded',
  VACCINATION_REMINDER = 'vaccination_reminder',
  MEDICAL_VISIT_RECORDED = 'medical_visit_recorded',
  PRESCRIPTION_REMINDER = 'prescription_reminder',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  HEALTH_RECORD_UPDATED = 'health_record_updated',
  HEALTH_RECORD_CREATED = 'health_record_created',
  FOLLOW_UP_REMINDER = 'follow_up_reminder',

  // Milestones & Growth
  MILESTONE_ACHIEVED = 'milestone_achieved',
  GROWTH_UPDATE = 'growth_update',
  GROWTH_RECORDED = 'growth_recorded',
  BIRTHDAY_REMINDER = 'birthday_reminder',

  // Kindness Closet
  KINDNESS_CLOSET_CREATED = 'kindness_closet_created',
  APPLICATION_RECEIVED = 'application_received',
  APPLICATION_UPDATED = 'application_updated',
  APPLICATION_APPROVED = 'application_approved',
  APPLICATION_REJECTED = 'application_rejected',
  APPLICATION_NOT_SELECTED = 'application_not_selected',
  APPLICATION_CANCELLED = 'application_cancelled',
  SHARING_COMPLETED = 'sharing_completed',
  PICKUP_READY = 'pickup_ready',
  POST_DELETED = 'post_deleted',
  POST_EXPIRED = 'post_expired',
  POST_SHARED = 'post_shared',
  POST_FAVORITED = 'post_favorited',
  POST_REPORTED = 'post_reported',

  // Community
  NEARBY_POST_AVAILABLE = 'nearby_post_available',
  SIMILAR_ITEM_AVAILABLE = 'similar_item_available',
  KINDNESS_MILESTONE = 'kindness_milestone',
  COMMUNITY_ACHIEVEMENT = 'community_achievement',

  // General
  GENERAL_REMINDER = 'general_reminder',
  PREGNANCY_JOURNAL = 'pregnancy_journal',
  CELEBRATION = 'celebration',
  RECOMMENDATION = 'recommendation',

  // System
  SYSTEM_MAINTENANCE = 'system_maintenance',
  SECURITY_ALERT = 'security_alert',
  ACCOUNT_UPDATE = 'account_update',
  CUSTOM = 'custom',
  URGENT = 'urgent',
}

export enum NotificationStatusEnum {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export enum NotificationPriorityEnum {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationChannelEnum {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WEBHOOK = 'webhook',
}

export enum NotificationSortBy {
  CREATED_AT = 'createdAt',
  SCHEDULED_FOR = 'scheduledFor',
  PRIORITY = 'priority',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum NotificationFilterType {
  ALL = 'all',
  UNREAD = 'unread',
  READ = 'read',
  PRIORITY_HIGH = 'priority_high',
  TODAY = 'today',
  THIS_WEEK = 'this_week',
}
