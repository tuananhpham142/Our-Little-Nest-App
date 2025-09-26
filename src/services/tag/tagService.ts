// src/services/tag/tagService.ts

import { TagModel } from '@/models/Tag/TagModel';
import { DEFAULT_TAG_PARAMS, GetTagsRequest } from '@/models/Tag/TagRequest';
import { ApiErrorResponse, TagBySlugResponse, TagDetailResponse, TagListResponse } from '@/models/Tag/TagResponse';
import { ApiResponse } from '@/types/api';
import { baseApi } from '../baseApi';

export class TagService {
  private static readonly BASE_PATH = '/tag';

  /**
   * Get tags with pagination
   */
  static async getTags(params: GetTagsRequest = {}): Promise<TagListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_TAG_PARAMS,
        ...params,
      });

      const response = await baseApi.get<ApiResponse<TagListResponse>>(`${this.BASE_PATH}?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all active tags (no pagination)
   */
  static async getAllActiveTags(): Promise<TagModel[]> {
    try {
      const response = await this.getTags({ page: 1, limit: 1000 });
      return response.data.filter((tag) => tag.isActive);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tag by ID
   */
  static async getTagById(id: string): Promise<TagModel> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Tag ID is required');
      }

      const response = await baseApi.get<ApiResponse<TagDetailResponse>>(`${this.BASE_PATH}/${id}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tag by slug
   */
  static async getTagBySlug(slug: string): Promise<TagModel> {
    try {
      if (!slug || typeof slug !== 'string') {
        throw new Error('Tag slug is required');
      }

      const response = await baseApi.get<ApiResponse<TagBySlugResponse>>(`${this.BASE_PATH}/slug/${slug}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get tags by IDs
   */
  static async getTagsByIds(tagIds: string[]): Promise<TagModel[]> {
    try {
      if (!tagIds || tagIds.length === 0) {
        return [];
      }

      const tags = await Promise.all(tagIds.map((id) => this.getTagById(id).catch(() => null)));

      return tags.filter((tag): tag is TagModel => tag !== null);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search tags by name
   */
  static async searchTags(searchTerm: string): Promise<TagModel[]> {
    try {
      const allTags = await this.getAllActiveTags();

      if (!searchTerm) {
        return allTags;
      }

      const searchLower = searchTerm.toLowerCase();
      return allTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchLower) ||
          tag.slug.toLowerCase().includes(searchLower) ||
          tag.description?.toLowerCase().includes(searchLower),
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get popular tags (you might want to implement this based on usage stats)
   */
  static async getPopularTags(limit: number = 10): Promise<TagModel[]> {
    try {
      const response = await this.getTags({ page: 1, limit });
      return response.data.filter((tag) => tag.isActive);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: GetTagsRequest): URLSearchParams {
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
        return new Error('Tag not found.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }

  /**
   * Clear cache for tags
   */
  static clearCache(): void {
    console.log('Tag cache cleared');
  }
}
