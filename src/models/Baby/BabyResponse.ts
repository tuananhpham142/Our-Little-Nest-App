// src/models/Baby/BabyResponse.ts

import { Baby, BabyStatistics, FamilyMember } from './BabyModel';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetAllResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

export interface GetOneResponse<T> {
  data: T;
}

// Baby-specific responses
export interface BabyListResponse {
  data: Baby[];
  total: number;
  hasNextPage: boolean;
}

export interface BabyDetailResponse extends Baby {}

export interface CreateBabyResponse extends Baby {}

export interface UpdateBabyResponse extends Baby {}

export interface DeleteBabyResponse {
  message: string;
}

// Family member responses
export interface FamilyMemberListResponse {
  data: FamilyMember[];
  total: number;
}

export interface AddFamilyMemberResponse extends Baby {}

export interface UpdateFamilyMemberResponse extends Baby {}

export interface RemoveFamilyMemberResponse extends Baby {}

export interface InviteFamilyMemberResponse {
  invitationId: string;
  message: string;
}

// Media upload responses
export interface UploadAvatarResponse extends Baby {}

// Statistics responses
export interface BabyStatisticsResponse {
  data: BabyStatistics;
}

export interface RelationStatisticsResponse {
  data: Baby[];
}

// Special query responses
export interface PrimaryCaregiversResponse {
  data: FamilyMember[];
}

export interface BabiesByRelationResponse {
  data: Baby[];
  total: number;
  hasNextPage: boolean;
}

// Search responses
export interface SearchBabiesResponse {
  data: Baby[];
  total: number;
  hasNextPage: boolean;
  filters?: {
    appliedFilters: Record<string, any>;
    availableFilters: {
      genders: string[];
      ageRanges: Array<{ min: number; max: number; label: string }>;
      relationTypes: string[];
    };
  };
}

// Error response interface
export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
  details?: {
    field?: string;
    code?: string;
    validation?: Record<string, string[]>;
  };
}

// Health check response
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  service: string;
}

// Invitation-related responses
export interface InvitationStatusResponse {
  invitationId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  invitedEmail: string;
  invitedBy: string;
  babyId: string;
  relationType: string;
  expiresAt: Date;
  createdAt: Date;
}

// Analytics and insights responses
export interface BabyInsightsResponse {
  data: {
    growthTrends: {
      weight: Array<{ date: Date; value: number }>;
      height: Array<{ date: Date; value: number }>;
    };
    milestones: Array<{
      type: string;
      description: string;
      achievedAt?: Date;
      expectedAt: Date;
    }>;
    healthSummary: {
      allergiesCount: number;
      medicationsCount: number;
      lastCheckup?: Date;
    };
    familyActivity: {
      mostActiveMembers: FamilyMember[];
      recentActivities: Array<{
        memberId: string;
        activity: string;
        timestamp: Date;
      }>;
    };
  };
}

// Family permission matrix response
export interface FamilyPermissionMatrixResponse {
  data: Record<
    string,
    {
      member: FamilyMember;
      permissions: Record<string, boolean>;
      canEdit: boolean;
      canRemove: boolean;
    }
  >;
}

// Bulk operations responses
export interface BulkUpdateResponse {
  success: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
}

// Export response
export interface ExportBabyDataResponse {
  exportId: string;
  downloadUrl: string;
  expiresAt: Date;
}
