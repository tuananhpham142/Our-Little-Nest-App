// src/models/KindnessCloset/KindnessClosetEnum.ts

export enum KindnessClosetType {
  GIVING = 'giving',
  RECIPIENTS = 'recipients',
}

export enum KindnessClosetStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  BOTH = 'both',
}

export enum AgeUnit {
  WEEK = 'week',
  MONTH = 'month',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  VIEWS_COUNT = 'viewsCount',
  APPLICATIONS_COUNT = 'applicationsCount',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
