// src/models/BadgeCollection/BadgeCollectionRequest.ts

import { VerificationStatus } from '../Badge/BadgeEnum';

// Create Badge Collection (Award Badge) Request
export interface CreateBadgeCollectionRequest {
  babyId: string;
  badgeId: string;
  completedAt: string;
  submissionNote?: string;
  submissionMedia?: string[];
}

// Update Badge Collection Request
export interface UpdateBadgeCollectionRequest {
  completedAt?: string;
  submissionNote?: string;
  submissionMedia?: string[];
}

// Query/Filter Request
export interface GetBadgeCollectionsRequest {
  babyId?: string;
  badgeId?: string;
  parentId?: string;
  verificationStatus?: VerificationStatus;
  completedAfter?: string;
  completedBefore?: string;
  page?: number;
  limit?: number;
  sortBy?: 'completedAt' | 'createdAt' | 'verifiedAt';
  sortOrder?: 'asc' | 'desc';
}

// Get Baby Badges Request
export interface GetBabyBadgesRequest {
  babyId: string;
  verificationStatus?: VerificationStatus;
  category?: string;
  page?: number;
  limit?: number;
}

// Get Baby Stats Request
export interface GetBabyStatsRequest {
  babyId: string;
  includeRecentBadges?: boolean;
  includeTimeline?: boolean;
}

// Get Baby Progress Request
export interface GetBabyProgressRequest {
  babyId: string;
  includeRecommendations?: boolean;
  recommendationLimit?: number;
}

// Approve/Reject Badge Request
export interface VerifyBadgeCollectionRequest {
  collectionId: string;
  action: 'approve' | 'reject';
  verificationNote?: string;
}

// Batch Verification Request
export interface BatchVerifyRequest {
  collectionIds: string[];
  action: 'approve' | 'reject';
  verificationNote?: string;
}

// Get Pending Verifications Request
export interface GetPendingVerificationsRequest {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'completedAt';
  sortOrder?: 'asc' | 'desc';
}

// Get My Submissions Request
export interface GetMySubmissionsRequest {
  verificationStatus?: VerificationStatus;
  babyId?: string;
  page?: number;
  limit?: number;
}

// Upload Media Request
export interface UploadBadgeMediaRequest {
  collectionId: string;
  files: FormData;
}

// Default parameters
export const DEFAULT_BADGE_COLLECTION_PARAMS: GetBadgeCollectionsRequest = {
  page: 1,
  limit: 10,
  sortBy: 'completedAt',
  sortOrder: 'desc',
};

// Validation helpers
export const BADGE_COLLECTION_VALIDATION = {
  NOTE_MAX_LENGTH: 500,
  MAX_MEDIA_FILES: 5,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
  MAX_BADGES_PER_DAY: 20, // Rate limit
};
