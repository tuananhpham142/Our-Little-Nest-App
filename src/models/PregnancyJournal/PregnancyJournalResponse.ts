// src/models/PregnancyJournal/PregnancyJournalResponse.ts

import { PregnancyJournal, PregnancyJournalStatistics } from './PregnancyJournalModel';

// List Response
export interface PregnancyJournalListResponse {
  data: PregnancyJournal[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  totalPages?: number;
}

// Detail Response
export interface PregnancyJournalDetailResponse {
  data: PregnancyJournal;
}

// Statistics Response
export interface PregnancyJournalStatisticsResponse {
  data: PregnancyJournalStatistics;
}

// API Error Response
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}

// Success Response
export interface SuccessResponse {
  success: boolean;
  message?: string;
}

// Share Response
export interface ShareJournalResponse {
  data: PregnancyJournal;
  sharedCount: number;
  message: string;
}

// Update Week Response
export interface UpdateWeekResponse {
  data: PregnancyJournal;
  weekChanged: boolean;
  newLetterGenerated: boolean;
  message?: string;
}

// Emotion Entry Response
export interface AddEmotionEntryResponse {
  data: PregnancyJournal;
  emotionEntry: {
    id: string;
    date: string;
    content: string;
    mood?: string;
  };
  message: string;
}
