// src/models/BadgeCollection/BadgeCollectionResponse.ts

import {
    BabyBadgeProgress,
    BabyBadgeStatistics,
    BadgeCollection,
    BadgeCollectionStatistics,
} from './BadgeCollectionModel';

// List Response
export interface BadgeCollectionListResponse {
  data: BadgeCollection[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  totalPages?: number;
}

// Detail Response
export interface BadgeCollectionDetailResponse {
  data: BadgeCollection;
}

// Create Response
export interface CreateBadgeCollectionResponse {
  data: BadgeCollection;
  message: string;
  autoApproved: boolean;
}

// Update Response
export interface UpdateBadgeCollectionResponse {
  data: BadgeCollection;
  message: string;
}

// Verification Response
export interface VerifyBadgeCollectionResponse {
  data: BadgeCollection;
  action: 'approved' | 'rejected';
  message: string;
}

// Batch Verification Response
export interface BatchVerifyResponse {
  successful: BadgeCollection[];
  failed: Array<{
    collectionId: string;
    error: string;
  }>;
  totalProcessed: number;
  totalSuccessful: number;
  totalFailed: number;
}

// Baby Badges Response
export interface BabyBadgesResponse {
  babyId: string;
  badges: BadgeCollection[];
  total: number;
  statistics: {
    approved: number;
    pending: number;
    rejected: number;
  };
}

// Baby Stats Response
export interface BabyStatsResponse {
  data: BabyBadgeStatistics;
}

// Baby Progress Response
export interface BabyProgressResponse {
  data: BabyBadgeProgress;
}

// Statistics Response
export interface BadgeCollectionStatisticsResponse {
  data: BadgeCollectionStatistics;
}

// Pending Verifications Response
export interface PendingVerificationsResponse {
  data: BadgeCollection[];
  total: number;
  oldestPending?: string; // Date of oldest pending verification
  averageWaitTime?: number; // in hours
}

// My Submissions Response
export interface MySubmissionsResponse {
  data: BadgeCollection[];
  total: number;
  statistics: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

// Media Upload Response
export interface MediaUploadResponse {
  urls: string[];
  message: string;
}

// Timeline Response
export interface BadgeTimelineResponse {
  babyId: string;
  timeline: Array<{
    date: string;
    badges: BadgeCollection[];
    count: number;
  }>;
  totalBadges: number;
  dateRange: {
    start: string;
    end: string;
  };
}

// Recommendations Response
export interface BadgeRecommendationsResponse {
  babyId: string;
  babyAge: number;
  recommendations: Array<{
    badge: any; // Badge type
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  total: number;
}

// Success Response
export interface SuccessResponse {
  success: boolean;
  message?: string;
}

// Error Response
export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}
