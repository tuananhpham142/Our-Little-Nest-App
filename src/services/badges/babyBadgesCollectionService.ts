// src/services/babyBadgeCollections/babyBadgeCollectionsService.ts

import { BabyBadgesCollection } from '@/models/BabyBadgesCollection/BabyBadgesCollectionModel';
import { CreateBabyBadgesCollectionRequest } from '@/models/BabyBadgesCollection/BabyBadgesCollectionRequest';
import { ApiErrorResponse } from '@/models/BabyBadgesCollection/BabyBadgesCollectionResponse';
import { baseApi } from '../baseApi';

export class BabyBadgeCollectionsService {
  private static readonly BASE_PATH = '/baby-badges-collections';

  /**
   * Award a badge to a baby (Add badge for my baby)
   */
  static async awardBadge(awardData: CreateBabyBadgesCollectionRequest): Promise<BabyBadgesCollection> {
    try {
      // Validate required fields
      if (!awardData.babyId) throw new Error('Baby ID is required');
      if (!awardData.badgeId) throw new Error('Badge ID is required');
      if (!awardData.completedAt) throw new Error('Completion date is required');

      // Validate completion date not in future
      const completedDate = new Date(awardData.completedAt);
      if (completedDate > new Date()) {
        throw new Error('Completion date cannot be in the future');
      }

      const response = await baseApi.post<BabyBadgesCollection>(`${this.BASE_PATH}`, awardData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all badges for a baby (Fetch badges of my baby)
   */
  static async getBabyBadges(babyId: string): Promise<BabyBadgesCollection[]> {
    try {
      if (!babyId) throw new Error('Baby ID is required');

      const response = await baseApi.get<BabyBadgesCollection[]>(`${this.BASE_PATH}/baby/${babyId}`);
      return response.data;
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
