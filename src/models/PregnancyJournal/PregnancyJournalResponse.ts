// src/models/PregnancyJournal/PregnancyJournalResponse.ts

import { ApiGetByPageResponse, ApiResponse } from '@/types/api';
import { PregnancyJournal, PregnancyJournalStatistics } from './PregnancyJournalModel';

// List Response
export interface PregnancyJournalListResponse extends ApiResponse<PregnancyJournal[]> {}
export interface PregnancyJournalGetByPageResponse extends ApiGetByPageResponse<PregnancyJournal> {}

// Detail Response
export interface PregnancyJournalDetailResponse extends PregnancyJournal {}

// Statistics Response
export interface PregnancyJournalStatisticsResponse extends ApiResponse<PregnancyJournalStatistics> {}

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
export interface ShareJournalResponse extends ApiResponse<PregnancyJournal> {}

// Update Week Response
export interface UpdateWeekResponse extends ApiResponse<PregnancyJournal> {}

// Emotion Entry Response
export interface AddEmotionEntryResponse extends ApiResponse<PregnancyJournal> {}
