// src/models/BadgeCollection/BadgeCollectionRequest.ts

import { VerificationStatus } from '../Badge/BadgeEnum';

// Create Badge Collection (Award Badge) Request
export interface BadgeAwardRequest {
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
export interface GetBabyBadgeCollectionsRequest {
  babyId: string;
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

// Upload Media Request
export interface UploadBadgeMediaRequest {
  collectionId: string;
  files: FormData;
}

// Validation helpers
export const BADGE_COLLECTION_VALIDATION = {
  NOTE_MAX_LENGTH: 500,
  MAX_MEDIA_FILES: 5,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
  MAX_BADGES_PER_DAY: 20, // Rate limit
};
