// src/services/badge/badgeCollectionService.ts

import { BabyBadgeProgress, BabyBadgeStatistics, BadgeCollection } from '@/models/BadgeCollection/BadgeCollectionModel';
import {
  CreateBadgeCollectionRequest,
  DEFAULT_BADGE_COLLECTION_PARAMS,
  GetBadgeCollectionsRequest,
  UpdateBadgeCollectionRequest,
  VerifyBadgeCollectionRequest,
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
      if (!data.babyId || !data.badgeId) {
        throw new Error('Baby ID and Badge ID are required');
      }

      const response = await baseApi.post<CreateBadgeCollectionResponse>(this.BASE_PATH, data);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge collections with filtering and pagination
   */
  static async getBadgeCollections(params: GetBadgeCollectionsRequest = {}): Promise<BadgeCollectionListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_BADGE_COLLECTION_PARAMS,
        ...params,
      });

      const response = await baseApi.get<BadgeCollectionListResponse>(`${this.BASE_PATH}?${queryParams.toString()}`);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge collection by ID
   */
  static async getBadgeCollectionById(id: string): Promise<BadgeCollection> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Badge collection ID is required');
      }

      const response = await baseApi.get<BadgeCollectionDetailResponse>(`${this.BASE_PATH}/${id}`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update badge collection
   */
  static async updateBadgeCollection(id: string, data: UpdateBadgeCollectionRequest): Promise<BadgeCollection> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Badge collection ID is required');
      }

      const response = await baseApi.patch<UpdateBadgeCollectionResponse>(`${this.BASE_PATH}/${id}`, data);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete badge collection
   */
  static async deleteBadgeCollection(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
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
  static async getBabyBadges(
    babyId: string,
    params: { verificationStatus?: string } = {},
  ): Promise<BabyBadgesResponse> {
    try {
      if (!babyId || typeof babyId !== 'string') {
        throw new Error('Baby ID is required');
      }

      const queryParams = this.buildQueryParams(params);
      const queryString = queryParams.toString();
      const url = `${this.BASE_PATH}/baby/${babyId}${queryString ? `?${queryString}` : ''}`;

      const response = await baseApi.get<BabyBadgesResponse>(url);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge statistics for a baby
   */
  static async getBabyStats(babyId: string): Promise<BabyBadgeStatistics> {
    try {
      if (!babyId || typeof babyId !== 'string') {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.get<BabyStatsResponse>(`${this.BASE_PATH}/baby/${babyId}/stats`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge progress for a baby
   */
  static async getBabyProgress(babyId: string): Promise<BabyBadgeProgress> {
    try {
      if (!babyId || typeof babyId !== 'string') {
        throw new Error('Baby ID is required');
      }

      const response = await baseApi.get<BabyProgressResponse>(`${this.BASE_PATH}/baby/${babyId}/progress`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pending verifications (admin only)
   */
  static async getPendingVerifications(
    params: { page?: number; limit?: number } = {},
  ): Promise<PendingVerificationsResponse> {
    try {
      const queryParams = this.buildQueryParams(params);
      const queryString = queryParams.toString();
      const url = `${this.BASE_PATH}/pending-verifications${queryString ? `?${queryString}` : ''}`;

      const response = await baseApi.get<PendingVerificationsResponse>(url);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user's badge submissions
   */
  static async getMySubmissions(
    params: { verificationStatus?: string; page?: number; limit?: number } = {},
  ): Promise<MySubmissionsResponse> {
    try {
      const queryParams = this.buildQueryParams(params);
      const queryString = queryParams.toString();
      const url = `${this.BASE_PATH}/my-submissions${queryString ? `?${queryString}` : ''}`;

      const response = await baseApi.get<MySubmissionsResponse>(url);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify badge collection (admin only)
   */
  static async verifyBadgeCollection(id: string, data: VerifyBadgeCollectionRequest): Promise<BadgeCollection> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Badge collection ID is required');
      }

      if (!data.action || !['approve', 'reject'].includes(data.action)) {
        throw new Error('Valid action (approve/reject) is required');
      }

      const endpoint = data.action === 'approve' ? 'approve' : 'reject';
      const response = await baseApi.patch<VerifyBadgeCollectionResponse>(`${this.BASE_PATH}/${id}/${endpoint}`, {
        verificationNote: data.verificationNote,
      });

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Approve badge collection (admin only)
   */
  static async approveBadgeCollection(id: string, verificationNote?: string): Promise<BadgeCollection> {
    return this.verifyBadgeCollection(id, { action: 'approve', verificationNote });
  }

  /**
   * Reject badge collection (admin only)
   */
  static async rejectBadgeCollection(id: string, verificationNote?: string): Promise<BadgeCollection> {
    return this.verifyBadgeCollection(id, { action: 'reject', verificationNote });
  }

  /**
   * Upload media for badge collection
   */
  static async uploadMedia(collectionId: string, files: FormData): Promise<string[]> {
    try {
      if (!collectionId || typeof collectionId !== 'string') {
        throw new Error('Badge collection ID is required');
      }

      if (!files) {
        throw new Error('Files are required');
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
   * Get badge collection timeline for a baby
   */
  static async getBabyTimeline(babyId: string, params: { startDate?: string; endDate?: string } = {}): Promise<any> {
    try {
      if (!babyId || typeof babyId !== 'string') {
        throw new Error('Baby ID is required');
      }

      const queryParams = this.buildQueryParams(params);
      const queryString = queryParams.toString();
      const url = `${this.BASE_PATH}/baby/${babyId}/timeline${queryString ? `?${queryString}` : ''}`;

      const response = await baseApi.get<ApiResponse<any>>(url);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge recommendations for a baby
   */
  static async getBadgeRecommendations(babyId: string, params: { limit?: number } = {}): Promise<any[]> {
    try {
      if (!babyId || typeof babyId !== 'string') {
        throw new Error('Baby ID is required');
      }

      const queryParams = this.buildQueryParams(params);
      const queryString = queryParams.toString();
      const url = `${this.BASE_PATH}/baby/${babyId}/recommendations${queryString ? `?${queryString}` : ''}`;

      const response = await baseApi.get<ApiResponse<{ recommendations: any[] }>>(url);

      return response.data.data.recommendations;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: Record<string, any>): URLSearchParams {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
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
    const errorResponse = error.response?.data;

    if (errorResponse?.message) {
      const message = Array.isArray(errorResponse.message) ? errorResponse.message.join(', ') : errorResponse.message;
      return new Error(message);
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        return new Error('Invalid request. Please check your input.');
      case 401:
        return new Error('Authentication required. Please sign in.');
      case 403:
        return new Error("Access denied. You don't have permission to perform this action.");
      case 404:
        return new Error('Badge collection not found.');
      case 409:
        return new Error('Badge already awarded to this baby or conflict detected.');
      case 422:
        return new Error('Invalid data provided. Please check your input.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      case 503:
        return new Error('Service temporarily unavailable. Please try again later.');
      default:
        return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}
