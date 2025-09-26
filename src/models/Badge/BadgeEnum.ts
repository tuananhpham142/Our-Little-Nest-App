// src/models/Badge/BadgeEnum.ts

export enum BadgeCategory {
  MILESTONE = 'milestone',
  DAILY_LIFE = 'daily_life',
  SOCIAL = 'social',
  PHYSICAL = 'physical',
  COGNITIVE = 'cognitive',
  CUSTOM = 'custom',
}

export enum BadgeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum BadgeSortBy {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DIFFICULTY = 'difficulty',
  CATEGORY = 'category',
  MIN_AGE = 'minAge',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  AUTO_APPROVED = 'auto_approved',
}

export enum BadgeAgeGroup {
  NEWBORN = 'newborn', // 0-3 months
  INFANT = 'infant', // 3-12 months
  TODDLER = 'toddler', // 1-3 years
  PRESCHOOLER = 'preschooler', // 3-5 years
  ALL = 'all',
}
