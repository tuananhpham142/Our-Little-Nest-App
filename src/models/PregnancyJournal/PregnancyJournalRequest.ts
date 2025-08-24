// src/models/PregnancyJournal/PregnancyJournalRequest.ts

import {
    GenderType,
    MoodType,
    PregnancyJournalStatus,
    SharePermission,
    SortBy,
    SortOrder,
} from './PregnancyJournalEnum';

// Query/Filter Request
export interface GetPregnancyJournalsRequest {
  status?: PregnancyJournalStatus;
  currentWeek?: number;
  createdBy?: string;
  isActive?: boolean;
  isPublic?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

// Create Request DTOs
export interface CreateBabyInfoRequest {
  nickname?: string;
  gender?: GenderType;
  expectedDueDate: string;
  currentWeek: number;
  estimatedWeight?: number;
  estimatedLength?: number;
}

export interface CreateShareSettingsRequest {
  isPublic?: boolean;
  permission?: SharePermission;
}

export interface CreatePregnancyJournalRequest {
  title: string;
  description?: string;
  babyInfo: CreateBabyInfoRequest;
  status?: PregnancyJournalStatus;
  pregnancyStartDate: string;
  shareSettings?: CreateShareSettingsRequest;
  isActive?: boolean;
}

// Update Request DTO
export interface UpdatePregnancyJournalRequest {
  title?: string;
  description?: string;
  babyInfo?: Partial<CreateBabyInfoRequest>;
  status?: PregnancyJournalStatus;
  pregnancyStartDate?: string;
  shareSettings?: Partial<CreateShareSettingsRequest>;
  isActive?: boolean;
}

// Add Emotion Entry Request
export interface AddEmotionEntryRequest {
  date: string;
  content: string;
  mood?: MoodType;
  isPrivate?: boolean;
}

// Share Journal Request
export interface ShareJournalRequest {
  userIds: string[];
  permission: SharePermission;
  isPublic?: boolean;
}

// Update Share Settings Request
export interface UpdateShareSettingsRequest {
  isPublic?: boolean;
  permission?: SharePermission;
  addUsers?: Array<{
    userId: string;
    permission: SharePermission;
  }>;
  removeUsers?: string[];
}

// Default parameters
export const DEFAULT_PREGNANCY_JOURNAL_PARAMS: GetPregnancyJournalsRequest = {
  page: 1,
  limit: 10,
  sortBy: SortBy.CREATED_AT,
  sortOrder: SortOrder.DESC,
  isActive: true,
};
