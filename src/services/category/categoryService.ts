// src/services/category/categoryService.ts

import { CategoryItem } from '@/models/Category/CategoryModel';
import { DEFAULT_CATEGORY_PARAMS, GetCategoriesRequest } from '@/models/Category/CategoryRequest';
import {
    ApiErrorResponse,
    CategoryBySlugResponse,
    CategoryDetailResponse,
    CategoryListResponse,
} from '@/models/Category/CategoryResponse';
import { ApiResponse } from '@/types/api';
import { baseApi } from '../baseApi';

export class CategoryService {
  private static readonly BASE_PATH = '/categories';

  /**
   * Get categories with pagination
   */
  static async getCategories(params: GetCategoriesRequest = {}): Promise<CategoryListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_CATEGORY_PARAMS,
        ...params,
      });

      const response = await baseApi.get<ApiResponse<CategoryListResponse>>(
        `${this.BASE_PATH}?${queryParams.toString()}`,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all active categories (no pagination)
   */
  static async getAllActiveCategories(): Promise<CategoryItem[]> {
    try {
      const response = await this.getCategories({ page: 1, limit: 1000 });
      return response.data.filter((category) => category.isActive);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<CategoryItem> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Category ID is required');
      }

      const response = await baseApi.get<ApiResponse<CategoryDetailResponse>>(`${this.BASE_PATH}/${id}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<CategoryItem> {
    try {
      if (!slug || typeof slug !== 'string') {
        throw new Error('Category slug is required');
      }

      const response = await baseApi.get<ApiResponse<CategoryBySlugResponse>>(`${this.BASE_PATH}/slug/${slug}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get categories by IDs
   */
  static async getCategoriesByIds(categoryIds: string[]): Promise<CategoryItem[]> {
    try {
      if (!categoryIds || categoryIds.length === 0) {
        return [];
      }

      const categories = await Promise.all(categoryIds.map((id) => this.getCategoryById(id).catch(() => null)));

      return categories.filter((category): category is CategoryItem => category !== null);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search categories by name
   */
  static async searchCategories(searchTerm: string): Promise<CategoryItem[]> {
    try {
      const allCategories = await this.getAllActiveCategories();

      if (!searchTerm) {
        return allCategories;
      }

      const searchLower = searchTerm.toLowerCase();
      return allCategories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchLower) ||
          category.slug.toLowerCase().includes(searchLower) ||
          category.description?.toLowerCase().includes(searchLower),
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get main categories (you might want to implement this based on business logic)
   */
  static async getMainCategories(): Promise<CategoryItem[]> {
    try {
      const response = await this.getCategories({ page: 1, limit: 20 });
      return response.data.filter((category) => category.isActive);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get category navigation (for menu/navigation purposes)
   */
  static async getCategoryNavigation(): Promise<CategoryItem[]> {
    try {
      const activeCategories = await this.getAllActiveCategories();
      // You might want to sort by a specific order or priority field
      return activeCategories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: GetCategoriesRequest): URLSearchParams {
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
        return new Error('Category not found.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }

  /**
   * Clear cache for categories
   */
  static clearCache(): void {
    console.log('Category cache cleared');
  }
}
