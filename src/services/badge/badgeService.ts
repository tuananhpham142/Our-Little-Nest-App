// src/services/badge/badgeService.ts

import { Badge, BadgeRecommendation, BadgeStatistics } from '@/models/Badge/BadgeModel';
import {
    CreateBadgeRequest,
    DEFAULT_BADGE_PARAMS,
    GetBadgeRecommendationsRequest,
    GetBadgesRequest,
    UpdateBadgeRequest
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
import { ApiResponse } from '@/types/api';
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

      const cacheKey = `badges:${queryParams.toString()}`;
      const cached = this.getCachedData(cacheKey);
      if (cached && !params.createdBy) {
        // Don't cache user-specific queries
        return cached;
      }

      const response = await baseApi.get<ApiResponse<BadgeListResponse>>(`${this.BASE_PATH}?${queryParams.toString()}`);

      const data = response.data.data;

      // Cache non-personalized queries
      if (!params.createdBy) {
        this.setCachedData(cacheKey, data);
      }

      return data;
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

      const cacheKey = `badge:${id}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await baseApi.get<ApiResponse<BadgeDetailResponse>>(`${this.BASE_PATH}/${id}`);

      const badge = response.data.data.data;
      this.setCachedData(cacheKey, badge);

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
      const response = await baseApi.post<ApiResponse<BadgeMutationResponse>>(this.BASE_PATH, data);

      // Clear cache after creation
      this.clearCache();

      return response.data.data.data;
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

      const response = await baseApi.patch<ApiResponse<BadgeMutationResponse>>(`${this.BASE_PATH}/${id}`, data);

      // Clear cache after update
      this.clearCache();

      return response.data.data.data;
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

      // Clear cache after deletion
      this.clearCache();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badges by category
   */
  static async getBadgesByCategory(category: string): Promise<Badge[]> {
    try {
      const cacheKey = `badges:category:${category}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await baseApi.get<ApiResponse<CategoryBadgesResponse>>(
        `${this.BASE_PATH}/by-category/${category}`,
      );

      const badges = response.data.data.badges;
      this.setCachedData(cacheKey, badges);

      return badges;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badges suitable for age
   */
  static async getBadgesForAge(ageInMonths: number): Promise<Badge[]> {
    try {
      if (ageInMonths < 0) {
        throw new Error('Age must be positive');
      }

      const cacheKey = `badges:age:${ageInMonths}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await baseApi.get<ApiResponse<AgeBadgesResponse>>(
        `${this.BASE_PATH}/suitable-for-age/${ageInMonths}`,
      );

      const badges = response.data.data.badges;
      this.setCachedData(cacheKey, badges);

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
      const response = await baseApi.get<ApiResponse<CustomBadgesResponse>>(`${this.BASE_PATH}/my-custom`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge statistics
   */
  static async getStatistics(): Promise<BadgeStatistics> {
    try {
      const cacheKey = 'badges:statistics';
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await baseApi.get<ApiResponse<BadgeStatisticsResponse>>(`${this.BASE_PATH}/statistics`);

      const stats = response.data.data.data;
      this.setCachedData(cacheKey, stats, 60 * 60 * 1000); // Cache for 1 hour

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

      const response = await baseApi.patch<ApiResponse<BadgeActivationResponse>>(`${this.BASE_PATH}/${id}/activate`);

      // Clear cache after activation
      this.clearCache();

      return response.data.data.data;
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

      const response = await baseApi.patch<ApiResponse<BadgeActivationResponse>>(`${this.BASE_PATH}/${id}/deactivate`);

      // Clear cache after deactivation
      this.clearCache();

      return response.data.data.data;
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

      const response = await baseApi.get<ApiResponse<BadgeRecommendationsResponse>>(
        `${this.BASE_PATH}/recommendations?${queryParams.toString()}`,
      );

      return response.data.data.data;
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
   * Get cached data if available and not expired
   */
  private static getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached) {
      const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
      if (!isExpired) {
        return cached.data;
      }
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * Set cached data
   */
  private static setCachedData(key: string, data: any, duration?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Auto-clear cache after duration
    setTimeout(() => {
      this.cache.delete(key);
    }, duration || this.CACHE_DURATION);
  }

  /**
   * Clear all cache
   */
  static clearCache(): void {
    this.cache.clear();
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
