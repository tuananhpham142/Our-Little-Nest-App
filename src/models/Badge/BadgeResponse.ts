// src/models/Badge/BadgeResponse.ts

import { Badge, BadgeProgress, BadgeRecommendation, BadgeStatistics } from './BadgeModel';

// List Response
export interface BadgeListResponse {
  data: Badge[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  totalPages?: number;
}

// Detail Response
export interface BadgeDetailResponse {
  data: Badge;
}

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
export interface BadgeMutationResponse {
  data: Badge;
  message: string;
}

// Activation Response
export interface BadgeActivationResponse {
  data: Badge;
  isActive: boolean;
  message: string;
}

// Custom Badges Response
export interface CustomBadgesResponse {
  data: Badge[];
  total: number;
  remaining: number; // How many more custom badges user can create
}

// Category Badges Response
export interface CategoryBadgesResponse {
  category: string;
  badges: Badge[];
  total: number;
}

// Age-based Badges Response
export interface AgeBadgesResponse {
  ageInMonths: number;
  badges: Badge[];
  total: number;
  ageGroup: string;
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
