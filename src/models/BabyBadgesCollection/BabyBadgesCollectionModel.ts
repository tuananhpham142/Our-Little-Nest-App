// src/models/BabyBadgesCollection/BabyBadgesCollectionModel.ts

import { VerificationStatus } from './BabyBadgesCollectionEnum';

// Main BabyBadgesCollection interface
export interface BabyBadgesCollection {
  id: string;
  babyId: string;
  badgeId: string;
  parentId: string;
  completedAt: Date | string;
  submissionNote?: string;
  submissionMedia?: string[];
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string;
}

// Simplified state for Redux
export interface BabyBadgesCollectionState {
  babyBadges: BabyBadgesCollection[]; // Badges for current baby
  selectedBabyId: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}
