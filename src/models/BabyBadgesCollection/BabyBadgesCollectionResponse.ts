// src/models/BabyBadgesCollection/BabyBadgesCollectionResponse.ts

import { BabyBadgesCollection } from './BabyBadgesCollectionModel';

// Based on actual API controller responses

// Award badge response - returns BabyBadgesCollection directly
export type BabyBadgesCollectionMutationResponse = BabyBadgesCollection;

// Get collection by ID - returns BabyBadgesCollection directly
export type BabyBadgesCollectionDetailResponse = BabyBadgesCollection;

// Get badges for baby - returns BabyBadgesCollection[] directly
export type BabyBadgesCollectionsByBabyResponse = BabyBadgesCollection[];

// Get pending verifications - returns BabyBadgesCollection[] directly
export type PendingVerificationsResponse = BabyBadgesCollection[];

// Delete response - returns void (204 No Content)
export type DeleteBadgeCollectionResponse = void;

// API Error Response
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
  details?: {
    field?: string;
    code?: string;
    validation?: Record<string, string[]>;
  };
}

// Success Response
export interface SuccessResponse {
  success: boolean;
  message?: string;
  data?: any;
}
