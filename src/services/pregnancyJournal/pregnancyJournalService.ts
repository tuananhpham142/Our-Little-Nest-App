// src/services/pregnancyJournal/pregnancyJournalService.ts

import { PregnancyCare } from '@/models/PregnancyCare/PregnancyCareModel';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import {
    AddEmotionEntryRequest,
    CreatePregnancyJournalRequest,
    DEFAULT_PREGNANCY_JOURNAL_PARAMS,
    GetPregnancyJournalsRequest,
    ShareJournalRequest,
    UpdatePregnancyJournalRequest,
} from '@/models/PregnancyJournal/PregnancyJournalRequest';
import {
    AddEmotionEntryResponse,
    ApiErrorResponse,
    PregnancyJournalDetailResponse,
    PregnancyJournalListResponse,
    PregnancyJournalStatisticsResponse,
    ShareJournalResponse,
    UpdateWeekResponse,
} from '@/models/PregnancyJournal/PregnancyJournalResponse';
import { ApiResponse } from '@/types/api';
import { baseApi } from '../baseApi';

export class PregnancyJournalService {
  private static readonly BASE_PATH = '/pregnancy-journals';

  /**
   * Get pregnancy journals with filtering and pagination
   */
  static async getJournals(params: GetPregnancyJournalsRequest = {}): Promise<PregnancyJournalListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_PREGNANCY_JOURNAL_PARAMS,
        ...params,
      });

      const response = await baseApi.get<ApiResponse<PregnancyJournalListResponse>>(
        `${this.BASE_PATH}?${queryParams.toString()}`,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pregnancy journal by ID
   */
  static async getJournalById(id: string): Promise<PregnancyJournal> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Journal ID is required');
      }

      const response = await baseApi.get<ApiResponse<PregnancyJournalDetailResponse>>(`${this.BASE_PATH}/${id}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new pregnancy journal
   */
  static async createJournal(data: CreatePregnancyJournalRequest): Promise<PregnancyJournal> {
    try {
      const response = await baseApi.post<ApiResponse<PregnancyJournal>>(this.BASE_PATH, data);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update pregnancy journal
   */
  static async updateJournal(id: string, data: UpdatePregnancyJournalRequest): Promise<PregnancyJournal> {
    try {
      if (!id) {
        throw new Error('Journal ID is required');
      }

      const response = await baseApi.patch<ApiResponse<PregnancyJournalDetailResponse>>(
        `${this.BASE_PATH}/${id}`,
        data,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete pregnancy journal
   */
  static async deleteJournal(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Journal ID is required');
      }

      await baseApi.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's own pregnancy journals
   */
  static async getMyJournals(): Promise<PregnancyJournal[]> {
    try {
      const response = await baseApi.get<ApiResponse<{ data: PregnancyJournal[] }>>(`${this.BASE_PATH}/my-journals`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get journals shared with current user
   */
  static async getSharedWithMe(): Promise<PregnancyJournal[]> {
    try {
      const response = await baseApi.get<ApiResponse<{ data: PregnancyJournal[] }>>(`${this.BASE_PATH}/shared-with-me`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get public pregnancy journals
   */
  static async getPublicJournals(): Promise<PregnancyJournal[]> {
    try {
      const response = await baseApi.get<ApiResponse<{ data: PregnancyJournal[] }>>(`${this.BASE_PATH}/public`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Add emotion entry to journal
   */
  static async addEmotionEntry(journalId: string, data: AddEmotionEntryRequest): Promise<PregnancyJournal> {
    try {
      if (!journalId) {
        throw new Error('Journal ID is required');
      }

      const response = await baseApi.post<ApiResponse<AddEmotionEntryResponse>>(
        `${this.BASE_PATH}/${journalId}/emotion-entries`,
        data,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Share pregnancy journal
   */
  static async shareJournal(journalId: string, data: ShareJournalRequest): Promise<PregnancyJournal> {
    try {
      if (!journalId) {
        throw new Error('Journal ID is required');
      }

      const response = await baseApi.post<ApiResponse<ShareJournalResponse>>(
        `${this.BASE_PATH}/${journalId}/share`,
        data,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update current pregnancy week
   */
  static async updateCurrentWeek(journalId: string): Promise<PregnancyJournal> {
    try {
      if (!journalId) {
        throw new Error('Journal ID is required');
      }

      const response = await baseApi.patch<ApiResponse<UpdateWeekResponse>>(
        `${this.BASE_PATH}/${journalId}/update-week`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pregnancy journal statistics
   */
  static async getStatistics(): Promise<PregnancyJournalStatisticsResponse['data']> {
    try {
      const response = await baseApi.get<ApiResponse<PregnancyJournalStatisticsResponse>>(
        `${this.BASE_PATH}/statistics`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get care recommendations for a journal
   */
  static async getCareRecommendations(journalId: string): Promise<PregnancyCare[]> {
    try {
      if (!journalId) {
        throw new Error('Journal ID is required');
      }

      const response = await baseApi.get<ApiResponse<{ data: PregnancyCare[] }>>(
        `${this.BASE_PATH}/${journalId}/care-recommendations`,
      );

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: GetPregnancyJournalsRequest): URLSearchParams {
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
        return new Error('Pregnancy journal not found.');
      case 409:
        return new Error('Journal limit reached or conflict occurred.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }

  /**
   * Clear cache for pregnancy journals (if using cache)
   */
  static clearCache(): void {
    // Implementation depends on your caching strategy
    console.log('Pregnancy journal cache cleared');
  }
}
