import { AxiosResponse } from 'axios';
// src/models/Badge/BadgeResponse.ts

import { ApiGetByPageResponse, ApiResponse } from '@/types/api';
import { Badge, BadgeProgress, BadgeRecommendation, BadgeStatistics } from './BadgeModel';

// List Response
export interface BadgeListResponse extends ApiGetByPageResponse<Badge> {}

// Detail Response
export interface BadgeDetailResponse extends ApiResponse<Badge> {}

// Statistics Response
export interface BadgeStatisticsResponse {
  data: BadgeStatistics;
}

// Recommendations Response
export interface BadgeRecommendationsResponse {
  data: BadgeRecommendation[];
  total: number;
}

// Progress Response
export interface BadgeProgressResponse {
  data: BadgeProgress;
}

// Create/Update Response
export interface BadgeMutationResponse extends ApiResponse<Badge> {}

// Activation Response
export interface BadgeActivationResponse extends ApiResponse<Badge> {}

// Custom Badges Response
export interface CustomBadgesResponse extends ApiResponse<Badge[]> {}

// Category Badges Response
export interface CategoryBadgesResponse extends ApiResponse<Badge[]> {}

// Age-based Badges Response
export interface AgeBadgesResponse extends AxiosResponse<Badge[]> {}

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

// Batch Response (for bulk operations)
export interface BatchBadgeResponse {
  successful: Badge[];
  failed: Array<{
    badge: Partial<Badge>;
    error: string;
  }>;
  totalProcessed: number;
  totalSuccessful: number;
  totalFailed: number;
}
