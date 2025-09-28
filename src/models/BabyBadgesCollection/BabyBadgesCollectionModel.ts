// src/models/BabyBadgesCollection/BabyBadgesCollectionModel.ts

import { Baby } from '../Baby/BabyModel';
import { VerificationStatus } from '../Badge/BadgeEnum';
import { Badge } from '../Badge/BadgeModel';

// Main BabyBadgesCollection interface
export interface BabyBadgesCollection {
  id: string;
  _id?: string; // MongoDB ID
  babyId: string;
  badgeId: string;
  parentId: string; // User ID who awarded the badge
  completedAt: string;
  submissionNote?: string;
  submissionMedia?: string[]; // Array of media URLs
  verificationStatus: VerificationStatus;
  verifiedBy?: string; // Admin user ID
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Populated references (if included)
  baby?: Baby;
  badge?: Badge;
  parent?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

// Badge Collection Statistics
export interface BabyBadgesCollectionStatistics {
  totalCollections: number;
  approvedCollections: number;
  pendingCollections: number;
  rejectedCollections: number;
  autoApprovedCollections: number;
  verificationRate: number;
  averageVerificationTime?: number; // in hours
  topAwardedBadges: Array<{
    badge: Badge;
    count: number;
  }>;
  recentActivity: BabyBadgesCollection[];
}

// Baby Badge Statistics
export interface BabyBadgeStatistics {
  babyId: string;
  totalBadges: number;
  approvedBadges: number;
  pendingBadges: number;
  rejectedBadges: number;
  categoryDistribution: Record<string, number>;
  difficultyDistribution: Record<string, number>;
  recentBadges: BabyBadgesCollection[];
  progressPercentage: number;
  nextMilestones: Badge[];
  completionTimeline: Array<{
    date: string;
    count: number;
  }>;
}

// Baby Badge Progress
export interface BabyBadgeProgress {
  babyId: string;
  babyAge: number; // in months
  recentBadges: BabyBadgesCollection[];
  statistics: {
    totalBadges: number;
    approvedBadges: number;
    pendingBadges: number;
    categoryBreakdown: Record<string, number>;
  };
  totalCollections: number;
  recommendedBadges: Badge[];
  upcomingMilestones: Badge[];
  completionRate: number;
}

// Filter interface
export interface BabyBadgesCollectionFilters {
  babyId?: string;
  badgeId?: string;
  parentId?: string;
  verificationStatus?: VerificationStatus;
  completedAfter?: string;
  completedBefore?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'completedAt' | 'createdAt' | 'verifiedAt';
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
export interface BabyBadgesCollectionState {
  collections: BabyBadgesCollection[];
  currentCollection: BabyBadgesCollection | null;
  babyCollections: Record<string, BabyBadgesCollection[]>; // Grouped by babyId
  mySubmissions: BabyBadgesCollection[];
  pendingVerifications: BabyBadgesCollection[];
  babyStatistics: Record<string, BabyBadgeStatistics>; // Cached stats by babyId
  babyProgress: Record<string, BabyBadgeProgress>; // Cached progress by babyId
  isLoading: boolean;
  isLoadingMore: boolean;
  isSubmitting: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: BabyBadgesCollectionFilters;
  // UI state
  selectedBabyId: string | null;
  activeTab: 'all' | 'pending' | 'approved' | 'rejected';
}

// Badge award submission
export interface BadgeAwardSubmission {
  babyId: string;
  badgeId: string;
  completedAt: Date;
  note?: string;
  mediaFiles?: File[];
}

// Verification action
export interface BadgeVerificationAction {
  collectionId: string;
  action: 'approve' | 'reject';
  verificationNote?: string;
  verifiedBy: string;
}

// Badge Collection with populated data
export interface BabyBadgesCollectionWithDetails extends BabyBadgesCollection {
  badge: Badge;
  baby: Baby;
  parent: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
  };
  verifier?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

// Timeline entry for baby's badge journey
export interface BadgeTimelineEntry {
  date: string;
  collections: BabyBadgesCollectionWithDetails[];
  totalForDay: number;
  milestoneAchieved?: boolean;
}

// Badge collection group (for display)
export interface BabyBadgesCollectionGroup {
  category: string;
  badges: BabyBadgesCollectionWithDetails[];
  total: number;
  completionRate: number;
}
