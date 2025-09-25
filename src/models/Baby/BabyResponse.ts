// src/models/Baby/BabyResponse.ts

import { ApiResponse } from '@/types/api';
import { Baby, BabyStatistics, FamilyMember } from './BabyModel';

export interface GetOneResponse<T> {
  data: T;
}

// Baby-specific responses
export interface BabyListResponse extends ApiResponse<Baby[]> {}

export interface BabyDetailResponse extends ApiResponse<Baby> {}

export interface CreateBabyResponse extends ApiResponse<Baby> {}

export interface UpdateBabyResponse extends ApiResponse<Baby> {}

export interface DeleteBabyResponse {
  message: string;
}

// Family member responses
export interface FamilyMemberListResponse extends ApiResponse<FamilyMember[]> {}

export interface AddFamilyMemberResponse extends ApiResponse<Baby> {}

export interface UpdateFamilyMemberResponse extends ApiResponse<Baby> {}

export interface RemoveFamilyMemberResponse extends ApiResponse<Baby> {}

export interface InviteFamilyMemberResponse {
  invitationId: string;
  message: string;
}

// Media upload responses
export interface UploadAvatarResponse extends ApiResponse<Baby> {}

// Statistics responses
export interface BabyStatisticsResponse extends ApiResponse<BabyStatistics> {}

export interface RelationStatisticsResponse {
  data: Baby[];
}

// Special query responses
export interface PrimaryCaregiversResponse extends ApiResponse<FamilyMember[]> {}

export interface BabiesByRelationResponse extends ApiResponse<Baby[]> {}

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
