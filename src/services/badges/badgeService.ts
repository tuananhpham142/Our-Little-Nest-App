// src/services/badge/badgeService.ts

import { Badge } from '@/models/Badge/BadgeModel';
import { GetBadgesRequest } from '@/models/Badge/BadgeRequest';
import { ApiErrorResponse, BadgeListResponse } from '@/models/Badge/BadgeResponse';
import { baseApi } from '../baseApi';

export class BadgeService {
  private static readonly BASE_PATH = '/badges';

  /**
   * Search badges with filtering
   */
  static async searchBadges(params: GetBadgesRequest = {}): Promise<BadgeListResponse> {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await baseApi.get<BadgeListResponse>(`${this.BASE_PATH}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get badge by ID (for viewing details)
   */
  static async getBadgeById(id: string): Promise<Badge> {
    try {
      const response = await baseApi.get<{ data: Badge }>(`${this.BASE_PATH}/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
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
        return new Error('Access denied.');
      case 404:
        return new Error('Article not found.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }
}
