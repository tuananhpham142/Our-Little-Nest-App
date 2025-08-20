// src/services/baby/babyService.ts

import { FamilyRelationTypeEnum } from '@/models/Baby/BabyEnum';
import { Baby, BabyStatistics, FamilyMember } from '@/models/Baby/BabyModel';
import {
  AddFamilyMemberRequest,
  CreateBabyRequest,
  DEFAULT_BABY_PARAMS,
  GetBabiesByRelationRequest,
  GetBabiesRequest,
  InviteFamilyMemberRequest,
  SearchBabiesRequest,
  UpdateBabyRequest,
  UpdateFamilyMemberRequest,
} from '@/models/Baby/BabyRequest';
import {
  AddFamilyMemberResponse,
  ApiErrorResponse,
  BabiesByRelationResponse,
  BabyDetailResponse,
  BabyListResponse,
  BabyStatisticsResponse,
  CreateBabyResponse,
  DeleteBabyResponse,
  FamilyMemberListResponse,
  InviteFamilyMemberResponse,
  PrimaryCaregiversResponse,
  RemoveFamilyMemberResponse,
  UpdateBabyResponse,
  UpdateFamilyMemberResponse,
  UploadAvatarResponse,
} from '@/models/Baby/BabyResponse';
import { ApiResponse } from '@/types/api';
import { baseApi } from '../baseApi';

export class BabyService {
  private static readonly BASE_PATH = '/babies';

  // ==================== BABY CRUD OPERATIONS ====================

  /**
   * Create a new baby
   */
  static async createBaby(babyData: CreateBabyRequest, creatorRelationType?: FamilyRelationTypeEnum): Promise<Baby> {
    try {
      const queryParams = creatorRelationType ? `?creatorRelationType=${creatorRelationType}` : '';

      const response = await baseApi.post<ApiResponse<CreateBabyResponse>>(`${this.BASE_PATH}${queryParams}`, babyData);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all babies for current user
   */
  static async getBabies(params: GetBabiesRequest = {}): Promise<BabyListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_BABY_PARAMS,
        ...params,
      });

      const response = await baseApi.get<ApiResponse<BabyListResponse>>(`${this.BASE_PATH}?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get baby by ID
   */
  static async getBabyById(id: string): Promise<Baby> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.get<ApiResponse<BabyDetailResponse>>(`${this.BASE_PATH}/${id}`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update baby information
   */
  static async updateBaby(id: string, babyData: UpdateBabyRequest): Promise<UpdateBabyResponse> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.patch<ApiResponse<UpdateBabyResponse>>(`${this.BASE_PATH}/${id}`, babyData);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete baby (soft delete)
   */
  static async deleteBaby(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Baby ID is required');
      }

      await baseApi.delete<ApiResponse<DeleteBabyResponse>>(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== FAMILY MEMBER MANAGEMENT ====================

  /**
   * Get family members for a baby
   */
  static async getFamilyMembers(babyId: string): Promise<FamilyMember[]> {
    try {
      if (!babyId) {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.get<ApiResponse<FamilyMemberListResponse>>(
        `${this.BASE_PATH}/${babyId}/family-members`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Add family member to baby
   */
  static async addFamilyMember(babyId: string, memberData: AddFamilyMemberRequest): Promise<AddFamilyMemberResponse> {
    try {
      if (!babyId) {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.post<ApiResponse<AddFamilyMemberResponse>>(
        `${this.BASE_PATH}/${babyId}/family-members`,
        memberData,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update family member information
   */
  static async updateFamilyMember(
    babyId: string,
    userId: string,
    memberData: UpdateFamilyMemberRequest,
  ): Promise<UpdateFamilyMemberResponse> {
    try {
      if (!babyId || !userId) {
        throw new Error('Baby ID and User ID are required');
      }

      const response = await baseApi.patch<ApiResponse<UpdateFamilyMemberResponse>>(
        `${this.BASE_PATH}/${babyId}/family-members/${userId}`,
        memberData,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Remove family member from baby
   */
  static async removeFamilyMember(babyId: string, userId: string): Promise<RemoveFamilyMemberResponse> {
    try {
      if (!babyId || !userId) {
        throw new Error('Baby ID and User ID are required');
      }

      const response = await baseApi.delete<ApiResponse<RemoveFamilyMemberResponse>>(
        `${this.BASE_PATH}/${babyId}/family-members/${userId}`,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Invite family member via email
   */
  static async inviteFamilyMember(
    babyId: string,
    invitationData: InviteFamilyMemberRequest,
  ): Promise<{ invitationId: string; message: string }> {
    try {
      if (!babyId) {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.post<ApiResponse<InviteFamilyMemberResponse>>(
        `${this.BASE_PATH}/${babyId}/invite-family-member`,
        invitationData,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get primary caregivers for a baby
   */
  static async getPrimaryCaregivers(babyId: string): Promise<FamilyMember[]> {
    try {
      if (!babyId) {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.get<ApiResponse<PrimaryCaregiversResponse>>(
        `${this.BASE_PATH}/${babyId}/primary-caregivers`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== MEDIA MANAGEMENT ====================

  /**
   * Upload baby avatar
   */
  static async uploadAvatar(babyId: string, file: File | FormData): Promise<UploadAvatarResponse> {
    try {
      if (!babyId) {
        throw new Error('Baby ID is required');
      }

      const formData = file instanceof FormData ? file : new FormData();
      if (file instanceof File) {
        formData.append('file', file);
      }

      const response = await baseApi.post<ApiResponse<UploadAvatarResponse>>(
        `${this.BASE_PATH}/${babyId}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== ADVANCED QUERIES ====================

  /**
   * Get babies by relation type
   */
  static async getBabiesByRelation(
    relationType: FamilyRelationTypeEnum,
    params: Omit<GetBabiesByRelationRequest, 'relationType'> = {},
  ): Promise<BabyListResponse> {
    try {
      const queryParams = this.buildQueryParams(params);
      const query = queryParams.toString();

      const response = await baseApi.get<ApiResponse<BabiesByRelationResponse>>(
        `${this.BASE_PATH}/by-relation/${relationType}${query ? `?${query}` : ''}`,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user statistics
   */
  static async getBabyStatistics(): Promise<BabyStatistics> {
    try {
      const response = await baseApi.get<ApiResponse<BabyStatisticsResponse>>(`${this.BASE_PATH}/statistics`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search babies with advanced filters
   */
  static async searchBabies(searchParams: SearchBabiesRequest): Promise<BabyListResponse> {
    try {
      const response = await this.getBabies({
        page: searchParams.page,
        limit: searchParams.limit,
        ...searchParams.filters,
      });

      // Filter by search query on client side if needed
      if (searchParams.query && response.data) {
        const query = searchParams.query.toLowerCase();
        response.data = response.data.filter(
          (baby) =>
            baby.name.toLowerCase().includes(query) ||
            baby.nickname?.toLowerCase().includes(query) ||
            baby.notes?.toLowerCase().includes(query),
        );
      }

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: Record<string, any>): URLSearchParams {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object' && !Array.isArray(value)) {
          // Handle nested objects (like ageRange)
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
              queryParams.append(`${key}.${nestedKey}`, nestedValue.toString());
            }
          });
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return queryParams;
  }

  /**
   * Handle API errors with proper error messages
   */
  private static handleError(error: any): Error {
    // Handle network errors
    if (!error.response) {
      return new Error('Network error. Please check your connection.');
    }

    // Handle API error responses
    const errorResponse = error.response?.data as ApiErrorResponse;

    if (errorResponse?.message) {
      const message = Array.isArray(errorResponse.message) ? errorResponse.message.join(', ') : errorResponse.message;
      return new Error(message);
    }

    // Handle HTTP status codes
    switch (error.response?.status) {
      case 400:
        return new Error('Invalid request parameters.');
      case 401:
        return new Error('Authentication required.');
      case 403:
        return new Error("Access denied. You don't have permission for this action.");
      case 404:
        return new Error('Baby not found.');
      case 409:
        return new Error('Conflict. User is already a family member.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }

  /**
   * Clear cache for babies
   */
  static clearCache(): void {
    console.log('Baby cache cleared');
  }

  /**
   * Calculate baby age in months from birth date
   */
  static calculateAge(birthDate: Date): number {
    const now = new Date();
    const birth = new Date(birthDate);
    const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return Math.max(0, ageInMonths);
  }

  /**
   * Format baby age for display
   */
  static formatAge(ageInMonths: number): string {
    if (ageInMonths < 1) {
      return 'Newborn';
    } else if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      if (months === 0) {
        return `${years} year${years !== 1 ? 's' : ''}`;
      }
      return `${years}y ${months}m`;
    }
  }
}
