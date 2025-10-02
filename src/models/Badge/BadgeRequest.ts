// src/models/Badge/BadgeRequest.ts

import { BadgeCategory, BadgeDifficulty } from './BadgeEnum';

// Request for searching badges
export interface GetBadgesRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: BadgeCategory;
  difficulty?: BadgeDifficulty;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
  isCustom?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Default parameters for search
export const DEFAULT_BADGE_PARAMS: GetBadgesRequest = {
  page: 1,
  limit: 20,
  isActive: true,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};
