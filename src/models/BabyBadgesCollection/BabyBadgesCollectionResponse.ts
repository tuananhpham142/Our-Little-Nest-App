// src/models/BabyBadgesCollection/BabyBadgesCollectionResponse.ts

import { BabyBadgesCollection } from './BabyBadgesCollectionModel';

// List Response
export interface BabyBadgesCollectionListResponse {
  data: BabyBadgesCollection[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  totalPages?: number;
}

// Detail Response
export interface BabyBadgesCollectionDetailResponse {
  data: BabyBadgesCollection;
}

// Create Response
export interface CreateBabyBadgesCollectionResponse {
  data: BabyBadgesCollection;
  message: string;
  autoApproved: boolean;
}

// Update Response
export interface UpdateBabyBadgesCollectionResponse {
  data: BabyBadgesCollection;
  message: string;
}

// Verification Response
export interface VerifyBabyBadgesCollectionResponse {
  data: BabyBadgesCollection;
  action: 'approved' | 'rejected';
  message: string;
}

// Baby Badges Response
export interface BabyBadgesCollectionResponse {
  babyId: string;
  badges: BabyBadgesCollection[];
  total: number;
  statistics: {
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
    badges: BabyBadgesCollection[];
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
