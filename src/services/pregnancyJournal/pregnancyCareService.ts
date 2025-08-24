// src/services/pregnancyCare/pregnancyCareService.ts

import {
    DEFAULT_PREGNANCY_CARE_PARAMS,
    GetPregnancyCaresRequest,
    PregnancyCare,
    PregnancyCareDetailResponse,
    PregnancyCareListResponse,
    SearchPregnancyCareRequest,
} from '@/models/PregnancyCare/PregnancyCareModel';
import { ApiResponse } from '@/types/api';
import { baseApi } from '../baseApi';

export class PregnancyCareService {
  private static readonly BASE_PATH = '/pregnancy-cares';
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private static cache = new Map<string, { data: any; timestamp: number }>();

  /**
   * Get pregnancy cares with filtering and pagination
   */
  static async getCares(params: GetPregnancyCaresRequest = {}): Promise<PregnancyCareListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_PREGNANCY_CARE_PARAMS,
        ...params,
      });

      const cacheKey = `cares:${queryParams.toString()}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await baseApi.get<ApiResponse<PregnancyCareListResponse>>(
        `${this.BASE_PATH}?${queryParams.toString()}`,
      );

      const data = response.data.data;
      this.setCachedData(cacheKey, data);

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pregnancy care by ID
   */
  static async getCareById(id: string): Promise<PregnancyCare> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Care ID is required');
      }

      const cacheKey = `care:${id}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await baseApi.get<ApiResponse<PregnancyCareDetailResponse>>(`${this.BASE_PATH}/${id}`);

      const data = response.data.data.data;
      this.setCachedData(cacheKey, data);

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search pregnancy cares
   */
  static async searchCares(params: SearchPregnancyCareRequest): Promise<PregnancyCareListResponse> {
    try {
      if (!params.query) {
        throw new Error('Search query is required');
      }

      const queryParams = this.buildQueryParams({
        search: params.query,
        category: params.category,
        trimester: params.trimester,
        importance: params.importance,
        page: params.page || 1,
        limit: params.limit || 10,
      });

      const response = await baseApi.get<ApiResponse<PregnancyCareListResponse>>(
        `${this.BASE_PATH}/search?${queryParams.toString()}`,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pregnancy cares by category
   */
  static async getCaresByCategory(
    category: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PregnancyCareListResponse> {
    try {
      return await this.getCares({
        category: category as any,
        page,
        limit,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pregnancy cares by trimester
   */
  static async getCaresByTrimester(
    trimester: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PregnancyCareListResponse> {
    try {
      return await this.getCares({
        trimester: trimester as any,
        page,
        limit,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pregnancy cares for specific week
   */
  static async getCaresForWeek(week: number, page: number = 1, limit: number = 10): Promise<PregnancyCareListResponse> {
    try {
      if (week < 1 || week > 42) {
        throw new Error('Week must be between 1 and 42');
      }

      return await this.getCares({
        currentWeek: week,
        page,
        limit,
        sortBy: 'importance',
        sortOrder: 'desc',
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get high importance pregnancy cares
   */
  static async getImportantCares(limit: number = 10): Promise<PregnancyCareListResponse> {
    try {
      return await this.getCares({
        importance: 'high' as any,
        sortBy: 'importance',
        sortOrder: 'desc',
        page: 1,
        limit,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get trending pregnancy cares (most viewed)
   */
  static async getTrendingCares(limit: number = 10): Promise<PregnancyCareListResponse> {
    try {
      return await this.getCares({
        sortBy: 'viewCount',
        sortOrder: 'desc',
        page: 1,
        limit,
      });
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
        if (key === 'tags' && Array.isArray(value)) {
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
  private static setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cache
   */
  static clearCache(): void {
    this.cache.clear();
    console.log('Pregnancy care cache cleared');
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

    // Handle HTTP status codes
    switch (error.response?.status) {
      case 400:
        return new Error('Invalid request parameters.');
      case 401:
        return new Error('Authentication required.');
      case 403:
        return new Error('Access denied.');
      case 404:
        return new Error('Pregnancy care not found.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }
}
