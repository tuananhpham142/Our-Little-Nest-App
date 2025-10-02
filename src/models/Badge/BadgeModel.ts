// src/models/Badge/BadgeModel.ts

import { BadgeCategory, BadgeDifficulty } from './BadgeEnum';

// Main Badge interface
export interface Badge {
  id: string;
  title: string;
  description: string;
  instruction: string;
  category: BadgeCategory;
  iconUrl?: string;
  isActive: boolean;
  isCustom: boolean;
  difficulty: BadgeDifficulty;
  minAge?: number; // in months
  maxAge?: number; // in months
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Pagination interface
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

// Simplified state for Redux
export interface BadgeState {
  badges: Badge[];
  currentBadge: Badge | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: BadgeFilters;
}

// Filter interface for search
export interface BadgeFilters {
  category?: BadgeCategory;
  difficulty?: BadgeDifficulty;
  minAge?: number;
  maxAge?: number;
  isActive?: boolean;
  isCustom?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
