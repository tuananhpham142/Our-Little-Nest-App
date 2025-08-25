// src/models/Badge/BadgeRequest.ts

import { BadgeCategory, BadgeDifficulty, BadgeSortBy, SortOrder } from './BadgeEnum';

// Query/Filter Request
export interface GetBadgesRequest {
  category?: BadgeCategory;
  difficulty?: BadgeDifficulty;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
  isCustom?: boolean;
  createdBy?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: BadgeSortBy;
  sortOrder?: SortOrder;
}

// Create Badge Request
export interface CreateBadgeRequest {
  title: string;
  description: string;
  instruction: string;
  category: BadgeCategory;
  iconUrl?: string;
  difficulty: BadgeDifficulty;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
  isCustom?: boolean;
}

// Update Badge Request
export interface UpdateBadgeRequest {
  title?: string;
  description?: string;
  instruction?: string;
  category?: BadgeCategory;
  iconUrl?: string;
  difficulty?: BadgeDifficulty;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
}

// Badge by Category Request
export interface GetBadgesByCategoryRequest {
  category: BadgeCategory;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Badge by Age Request
export interface GetBadgesByAgeRequest {
  ageInMonths: number;
  category?: BadgeCategory;
  difficulty?: BadgeDifficulty;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Badge Recommendation Request
export interface GetBadgeRecommendationsRequest {
  babyAgeInMonths: number;
  excludeBadgeIds?: string[];
  category?: BadgeCategory;
  limit?: number;
}

// Activate/Deactivate Request
export interface ChangeBadgeStatusRequest {
  badgeId: string;
  isActive: boolean;
}

// Default parameters
export const DEFAULT_BADGE_PARAMS: GetBadgesRequest = {
  page: 1,
  limit: 10,
  sortBy: BadgeSortBy.CREATED_AT,
  sortOrder: SortOrder.DESC,
  isActive: true,
};

// Validation helpers
export const BADGE_VALIDATION = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 500,
  INSTRUCTION_MIN_LENGTH: 10,
  INSTRUCTION_MAX_LENGTH: 1000,
  MIN_AGE: 0,
  MAX_AGE: 60, // 5 years
  MAX_CUSTOM_BADGES_PER_USER: 50,
};
