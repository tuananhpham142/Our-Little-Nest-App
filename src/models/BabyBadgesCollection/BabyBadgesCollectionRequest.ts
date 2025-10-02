// src/models/BabyBadgesCollection/BabyBadgesCollectionRequest.ts

// Request for awarding badge to baby
export interface CreateBabyBadgesCollectionRequest {
  babyId: string;
  badgeId: string;
  completedAt: Date | string;
  submissionNote?: string;
  submissionMedia?: string[]; // Array of media URLs/paths
}
