// src/services/badge/badgeService.ts

import { Badge, BadgeRecommendation, BadgeStatistics } from '@/models/Badge/BadgeModel';
import {
  CreateBadgeRequest,
  DEFAULT_BADGE_PARAMS,
  GetBadgeRecommendationsRequest,
  GetBadgesRequest,
  UpdateBadgeRequest,
} from '@/models/Badge/BadgeRequest';
import {
  AgeBadgesResponse,
  BadgeActivationResponse,
  BadgeDetailResponse,
  BadgeListResponse,
  BadgeMutationResponse,
  BadgeRecommendationsResponse,
  BadgeStatisticsResponse,
  CategoryBadgesResponse,
  CustomBadgesResponse,
} from '@/models/Badge/BadgeResponse';
import { baseApi } from '../baseApi';

export class BadgeService {
  private static readonly BASE_PATH = '/badges';
  private static readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  private static cache = new Map<string, { data: any; timestamp: number }>();

  /**
   * Get badges with filtering and pagination
   */
  static async getBadges(params: GetBadgesRequest = {}): Promise<BadgeListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_BADGE_PARAMS,
        ...params,
      });

      const response = await baseApi.get<BadgeListResponse>(`${this.BASE_PATH}?${queryParams.toString()}`);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge by ID
   */
  static async getBadgeById(id: string): Promise<Badge> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Badge ID is required');
      }

      const response = await baseApi.get<BadgeDetailResponse>(`${this.BASE_PATH}/${id}`);

      const badge = response.data.data;

      return badge;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new badge
   */
  static async createBadge(data: CreateBadgeRequest): Promise<Badge> {
    try {
      const response = await baseApi.post<BadgeMutationResponse>(this.BASE_PATH, data);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update badge
   */
  static async updateBadge(id: string, data: UpdateBadgeRequest): Promise<Badge> {
    try {
      if (!id) {
        throw new Error('Badge ID is required');
      }

      const response = await baseApi.patch<BadgeMutationResponse>(`${this.BASE_PATH}/${id}`, data);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete badge
   */
  static async deleteBadge(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Badge ID is required');
      }

      await baseApi.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badges by category
   */
  static async getBadgesByCategory(category: string): Promise<CategoryBadgesResponse> {
    try {
      const response = await baseApi.get<CategoryBadgesResponse>(`${this.BASE_PATH}/by-category/${category}`);

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badges suitable for age
   */
  static async getBadgesForAge(ageInMonths: number): Promise<AgeBadgesResponse> {
    try {
      if (ageInMonths < 0) {
        throw new Error('Age must be positive');
      }

      const response = await baseApi.get<AgeBadgesResponse>(`${this.BASE_PATH}/suitable-for-age/${ageInMonths}`);

      const badges = response.data;

      return badges;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's custom badges
   */
  static async getMyCustomBadges(): Promise<Badge[]> {
    try {
      const response = await baseApi.get<CustomBadgesResponse>(`${this.BASE_PATH}/my-custom`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge statistics
   */
  static async getStatistics(): Promise<BadgeStatistics> {
    try {
      const response = await baseApi.get<BadgeStatisticsResponse>(`${this.BASE_PATH}/statistics`);

      const stats = response.data.data;

      return stats;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Activate badge
   */
  static async activateBadge(id: string): Promise<Badge> {
    try {
      if (!id) {
        throw new Error('Badge ID is required');
      }

      const response = await baseApi.patch<BadgeActivationResponse>(`${this.BASE_PATH}/${id}/activate`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Deactivate badge
   */
  static async deactivateBadge(id: string): Promise<Badge> {
    try {
      if (!id) {
        throw new Error('Badge ID is required');
      }

      const response = await baseApi.patch<BadgeActivationResponse>(`${this.BASE_PATH}/${id}/deactivate`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge recommendations for a baby
   */
  static async getRecommendations(params: GetBadgeRecommendationsRequest): Promise<BadgeRecommendation[]> {
    try {
      const queryParams = this.buildQueryParams(params);

      const response = await baseApi.get<BadgeRecommendationsResponse>(
        `${this.BASE_PATH}/recommendations?${queryParams.toString()}`,
      );

      return response.data.data;
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
        return new Error('Invalid request parameters.');
      case 401:
        return new Error('Authentication required.');
      case 403:
        return new Error('Access denied. Admin privileges may be required.');
      case 404:
        return new Error('Badge not found.');
      case 409:
        return new Error('Badge limit reached or duplicate badge.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }
}
