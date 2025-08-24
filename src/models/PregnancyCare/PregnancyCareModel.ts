// src/models/PregnancyCare/PregnancyCareModel.ts

// Enums
export enum PregnancyCareCategory {
  NUTRITION = 'nutrition',
  EXERCISE = 'exercise',
  HEALTH = 'health',
  MENTAL_HEALTH = 'mental_health',
  PREPARATION = 'preparation',
  SYMPTOMS = 'symptoms',
  DEVELOPMENT = 'development',
  SAFETY = 'safety',
  LIFESTYLE = 'lifestyle',
  MEDICAL = 'medical',
}

export enum PregnancyCareImportance {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum PregnancyTrimester {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
  ALL = 'all',
}

// Main PregnancyCare interface
export interface PregnancyCare {
  id: string;
  _id?: string; // MongoDB ID
  title: string;
  description: string;
  content: string;
  category: PregnancyCareCategory;
  importance: PregnancyCareImportance;
  weekStart: number;
  weekEnd: number;
  trimester: PregnancyTrimester;
  tags: string[];
  tips: string[];
  warnings?: string[];
  recommendations?: string[];
  imageUrl?: string;
  videoUrl?: string;
  externalLinks?: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  isActive: boolean;
  viewCount: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// Filter interface
export interface PregnancyCareFilters {
  search?: string;
  category?: PregnancyCareCategory;
  trimester?: PregnancyTrimester;
  importance?: PregnancyCareImportance;
  weekStart?: number;
  weekEnd?: number;
  currentWeek?: number; // To get care for specific week
  tags?: string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'importance' | 'viewCount' | 'helpfulCount';
  sortOrder?: 'asc' | 'desc';
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

// State interface for Redux
export interface PregnancyCareState {
  cares: PregnancyCare[];
  currentCare: PregnancyCare | null;
  recommendedCares: PregnancyCare[];
  searchResults: PregnancyCare[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: PregnancyCareFilters;
  cache: {
    [key: string]: {
      data: PregnancyCare[];
      timestamp: number;
      expiresIn: number;
    };
  };
}

// Request interfaces
export interface GetPregnancyCaresRequest {
  search?: string;
  category?: PregnancyCareCategory;
  trimester?: PregnancyTrimester;
  importance?: PregnancyCareImportance;
  weekStart?: number;
  weekEnd?: number;
  currentWeek?: number;
  tags?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchPregnancyCareRequest {
  query: string;
  category?: PregnancyCareCategory;
  trimester?: PregnancyTrimester;
  importance?: PregnancyCareImportance;
  page?: number;
  limit?: number;
}

// Response interfaces
export interface PregnancyCareListResponse {
  data: PregnancyCare[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  totalPages?: number;
}

export interface PregnancyCareDetailResponse {
  data: PregnancyCare;
}

// Default parameters
export const DEFAULT_PREGNANCY_CARE_PARAMS: GetPregnancyCaresRequest = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isActive: true,
};
