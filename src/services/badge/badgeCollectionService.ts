// src/services/badgeCollection/badgeCollectionService.ts

import { BabyBadgeProgress, BabyBadgeStatistics, BadgeCollection } from '@/models/BadgeCollection/BadgeCollectionModel';
import {
    CreateBadgeCollectionRequest,
    DEFAULT_BADGE_COLLECTION_PARAMS,
    GetBadgeCollectionsRequest,
    UpdateBadgeCollectionRequest
} from '@/models/BadgeCollection/BadgeCollectionRequest';
import {
    BabyBadgesResponse,
    BabyProgressResponse,
    BabyStatsResponse,
    BadgeCollectionDetailResponse,
    BadgeCollectionListResponse,
    CreateBadgeCollectionResponse,
    MySubmissionsResponse,
    PendingVerificationsResponse,
    UpdateBadgeCollectionResponse,
    VerifyBadgeCollectionResponse,
} from '@/models/BadgeCollection/BadgeCollectionResponse';
import { ApiResponse } from '@/types/api';
import { baseApi } from '../baseApi';

export class BadgeCollectionService {
  private static readonly BASE_PATH = '/badge-collections';

  /**
   * Create badge collection (award badge to baby)
   */
  static async createBadgeCollection(data: CreateBadgeCollectionRequest): Promise<BadgeCollection> {
    try {
      const response = await baseApi.post<ApiResponse<CreateBadgeCollectionResponse>>(this.BASE_PATH, data);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge collections with filtering
   */
  static async getBadgeCollections(params: GetBadgeCollectionsRequest = {}): Promise<BadgeCollectionListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_BADGE_COLLECTION_PARAMS,
        ...params,
      });

      const response = await baseApi.get<ApiResponse<BadgeCollectionListResponse>>(
        `${this.BASE_PATH}?${queryParams.toString()}`,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge collection by ID
   */
  static async getBadgeCollectionById(id: string): Promise<BadgeCollection> {
    try {
      if (!id) {
        throw new Error('Badge collection ID is required');
      }

      const response = await baseApi.get<ApiResponse<BadgeCollectionDetailResponse>>(`${this.BASE_PATH}/${id}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update badge collection
   */
  static async updateBadgeCollection(id: string, data: UpdateBadgeCollectionRequest): Promise<BadgeCollection> {
    try {
      if (!id) {
        throw new Error('Badge collection ID is required');
      }

      const response = await baseApi.patch<ApiResponse<UpdateBadgeCollectionResponse>>(`${this.BASE_PATH}/${id}`, data);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete badge collection
   */
  static async deleteBadgeCollection(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Badge collection ID is required');
      }

      await baseApi.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badges for a specific baby
   */
  static async getBabyBadges(babyId: string): Promise<BadgeCollection[]> {
    try {
      if (!babyId) {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.get<ApiResponse<BabyBadgesResponse>>(`${this.BASE_PATH}/baby/${babyId}`);

      return response.data.data.badges;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge statistics for a baby
   */
  static async getBabyStats(babyId: string): Promise<BabyBadgeStatistics> {
    try {
      if (!babyId) {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.get<ApiResponse<BabyStatsResponse>>(`${this.BASE_PATH}/baby/${babyId}/stats`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge progress for a baby
   */
  static async getBabyProgress(babyId: string): Promise<BabyBadgeProgress> {
    try {
      if (!babyId) {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.get<ApiResponse<BabyProgressResponse>>(
        `${this.BASE_PATH}/baby/${babyId}/progress`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pending verifications (admin only)
   */
  static async getPendingVerifications(): Promise<BadgeCollection[]> {
    try {
      const response = await baseApi.get<ApiResponse<PendingVerificationsResponse>>(
        `${this.BASE_PATH}/pending-verifications`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user's badge submissions
   */
  static async getMySubmissions(): Promise<BadgeCollection[]> {
    try {
      const response = await baseApi.get<ApiResponse<MySubmissionsResponse>>(`${this.BASE_PATH}/my-submissions`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Approve badge collection (admin only)
   */
  static async approveBadgeCollection(id: string): Promise<BadgeCollection> {
    try {
      if (!id) {
        throw new Error('Badge collection ID is required');
      }

      const response = await baseApi.patch<ApiResponse<VerifyBadgeCollectionResponse>>(
        `${this.BASE_PATH}/${id}/approve`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reject badge collection (admin only)
   */
  static async rejectBadgeCollection(id: string): Promise<BadgeCollection> {
    try {
      if (!id) {
        throw new Error('Badge collection ID is required');
      }

      const response = await baseApi.patch<ApiResponse<VerifyBadgeCollectionResponse>>(
        `${this.BASE_PATH}/${id}/reject`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload media for badge collection
   */
  static async uploadMedia(collectionId: string, files: FormData): Promise<string[]> {
    try {
      if (!collectionId) {
        throw new Error('Badge collection ID is required');
      }

      const response = await baseApi.post<ApiResponse<{ urls: string[] }>>(
        `${this.BASE_PATH}/${collectionId}/media`,
        files,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response.data.data.urls;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: any): URLSearchParams {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
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
    const errorResponse = error.response?.data;

    if (errorResponse?.message) {
      const message = Array.isArray(errorResponse.message) ? errorResponse.message.join(', ') : errorResponse.message;
      return new Error(message);
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        return new Error('Invalid input or badge not active.');
      case 401:
        return new Error('Authentication required.');
      case 403:
        return new Error('No access to this baby or collection.');
      case 404:
        return new Error('Badge collection not found.');
      case 409:
        return new Error('Badge already awarded to this baby.');
      case 429:
        return new Error('Too many badge submissions. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }
}
