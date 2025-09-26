// src/models/Badge/BadgeModel.ts

import { BadgeCategory, BadgeDifficulty, BadgeSortBy, SortOrder } from './BadgeEnum';

// Main Badge interface
export interface Badge {
  id: string;
  _id?: string; // MongoDB ID
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
  createdBy?: string; // User ID for custom badges
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Statistics interface
export interface BadgeStatistics {
  totalBadges: number;
  activeBadges: number;
  customBadges: number;
  categoryDistribution: Record<BadgeCategory, number>;
  difficultyDistribution: Record<BadgeDifficulty, number>;
  ageGroupDistribution?: Record<string, number>;
  systemBadges: number;
  averageCompletionRate?: number;
}

// Filter interface
export interface BadgeFilters {
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

// Pagination interface
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  totalPages?: number;
}

// Badge recommendation interface
export interface BadgeRecommendation {
  badge: Badge;
  reason: string;
  matchScore: number; // 0-100
  isAgeAppropriate: boolean;
  estimatedCompletionTime?: string;
}

// Badge progress interface
export interface BadgeProgress {
  totalAvailable: number;
  totalAwarded: number;
  completionPercentage: number;
  categoryProgress: Record<
    BadgeCategory,
    {
      available: number;
      awarded: number;
      percentage: number;
    }
  >;
  recentAchievements: Badge[];
  nextRecommendations: BadgeRecommendation[];
}

// State interface for Redux
export interface BadgeState {
  badges: Badge[];
  currentBadge: Badge | null;
  myCustomBadges: Badge[];
  categoryBadges: Record<BadgeCategory, Badge[]>;
  suitableForAgeBadges: Badge[];
  recommendedBadges: BadgeRecommendation[];
  statistics: BadgeStatistics | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isSubmitting: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: BadgeFilters;
  cache: {
    [key: string]: {
      data: Badge[];
      timestamp: number;
      expiresIn: number;
    };
  };
}

// Badge with award count (for display purposes)
export interface BadgeWithStats extends Badge {
  totalAwarded: number;
  recentlyAwarded: number;
  popularityScore: number;
}

// Badge template for creating custom badges
export interface BadgeTemplate {
  title: string;
  description: string;
  instruction: string;
  category: BadgeCategory;
  difficulty: BadgeDifficulty;
  suggestedAgeRange?: {
    min: number;
    max: number;
  };
}

// Common badge templates
export const BADGE_TEMPLATES: Record<string, BadgeTemplate> = {
  firstSteps: {
    title: 'First Steps',
    description: 'Baby took their first independent steps',
    instruction: "Record and share your baby's first steps moment",
    category: BadgeCategory.MILESTONE,
    difficulty: BadgeDifficulty.MEDIUM,
    suggestedAgeRange: { min: 9, max: 18 },
  },
  firstWord: {
    title: 'First Word',
    description: 'Baby said their first clear word',
    instruction: 'Document what the first word was and when it happened',
    category: BadgeCategory.MILESTONE,
    difficulty: BadgeDifficulty.MEDIUM,
    suggestedAgeRange: { min: 10, max: 18 },
  },
  sleepThroughNight: {
    title: 'Sleep Champion',
    description: 'Baby slept through the night (6+ hours)',
    instruction: 'Track and celebrate when baby sleeps through the night',
    category: BadgeCategory.DAILY_LIFE,
    difficulty: BadgeDifficulty.HARD,
    suggestedAgeRange: { min: 3, max: 12 },
  },
  firstSmile: {
    title: 'First Smile',
    description: 'Baby gave their first social smile',
    instruction: "Capture baby's first intentional smile",
    category: BadgeCategory.SOCIAL,
    difficulty: BadgeDifficulty.EASY,
    suggestedAgeRange: { min: 1, max: 3 },
  },
};
