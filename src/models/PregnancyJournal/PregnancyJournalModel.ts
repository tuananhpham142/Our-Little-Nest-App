// src/models/PregnancyJournal/PregnancyJournalModel.ts

import {
    GenderType,
    MoodType,
    PregnancyJournalStatus,
    SharePermission,
    SortBy,
    SortOrder,
} from './PregnancyJournalEnum';

// Base interfaces
export interface BabyInfo {
  nickname?: string;
  gender?: GenderType;
  expectedDueDate: string;
  currentWeek: number;
  estimatedWeight?: number;
  estimatedLength?: number;
}

export interface EmotionEntry {
  id: string;
  date: string;
  content: string;
  mood?: MoodType;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
}

export interface BabyLetter {
  id: string;
  week: number;
  title: string;
  content: string;
  templateId?: string;
  generatedAt: string;
  isCustom: boolean;
}

export interface SharedUser {
  userId: string;
  permission: SharePermission;
  sharedAt: string;
}

export interface ShareSettings {
  isPublic: boolean;
  permission: SharePermission;
  sharedWith: SharedUser[];
}

// Main PregnancyJournal interface
export interface PregnancyJournal {
  id: string;
  _id?: string; // MongoDB ID
  title: string;
  description?: string;
  babyInfo: BabyInfo;
  status: PregnancyJournalStatus;
  pregnancyStartDate: string;
  emotionEntries: EmotionEntry[];
  babyLetters: BabyLetter[];
  shareSettings: ShareSettings;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Statistics interface
export interface PregnancyJournalStatistics {
  totalJournals: number;
  activeJournals: number;
  completedJournals: number;
  archivedJournals: number;
  averageWeek: number;
  statusDistribution: {
    active: number;
    completed: number;
    archived: number;
  };
  weekDistribution?: Record<number, number>;
  genderDistribution?: {
    male: number;
    female: number;
    unknown: number;
  };
}

// Filter interface
export interface PregnancyJournalFilters {
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

// Pagination interface
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  totalPages?: number;
}

// State interface for Redux
export interface PregnancyJournalState {
  journals: PregnancyJournal[];
  currentJournal: PregnancyJournal | null;
  myJournals: PregnancyJournal[];
  sharedWithMe: PregnancyJournal[];
  publicJournals: PregnancyJournal[];
  statistics: PregnancyJournalStatistics | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isSubmitting: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: PregnancyJournalFilters;
}
