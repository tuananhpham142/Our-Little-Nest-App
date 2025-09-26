// src/models/PregnancyJournal/PregnancyJournalEnum.ts

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum PregnancyJournalStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum SharePermission {
  VIEW_ONLY = 'view_only',
  VIEW_AND_EMOTION = 'view_and_emotion',
}

export enum MoodType {
  HAPPY = 'happy',
  EXCITED = 'excited',
  WORRIED = 'worried',
  TIRED = 'tired',
  EMOTIONAL = 'emotional',
  NEUTRAL = 'neutral',
}

export enum SortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  PREGNANCY_START_DATE = 'pregnancyStartDate',
  CURRENT_WEEK = 'babyInfo.currentWeek',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum AgeUnit {
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
  YEARS = 'years',
}
