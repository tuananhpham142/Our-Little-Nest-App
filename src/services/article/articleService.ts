import { Article, ArticleFilters } from '@/models/Article/ArticleModel';
import { DEFAULT_ARTICLE_PARAMS, GetArticlesRequest } from '@/models/Article/ArticleRequest';
import {
  ApiErrorResponse,
  ArticleDetailResponse,
  ArticleListResponse,
  ArticlesBySlugResponse,
} from '@/models/Article/ArticleResponse';
import { ApiResponse } from '@/types/api';
import { baseApi } from '../baseApi';

export class ArticleService {
  private static readonly BASE_PATH = '/articles';

  /**
   * Get articles with filtering and pagination
   */
  static async getArticles(params: GetArticlesRequest = {}): Promise<ArticleListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_ARTICLE_PARAMS,
        ...params,
      });

      const response = await baseApi.get<ApiResponse<ArticleListResponse>>(
        `${this.BASE_PATH}?${queryParams.toString()}`,
      );

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get article by ID
   */
  static async getArticleById(id: string): Promise<Article> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Article ID is required');
      }

      const response = await baseApi.get<ApiResponse<ArticleDetailResponse>>(`${this.BASE_PATH}/${id}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get article by slug
   */
  static async getArticleBySlug(slug: string): Promise<Article> {
    try {
      if (!slug || typeof slug !== 'string') {
        throw new Error('Article slug is required');
      }

      const response = await baseApi.get<ApiResponse<ArticlesBySlugResponse>>(`${this.BASE_PATH}/slug/${slug}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search articles with advanced filters
   */
  static async searchArticles(filters: ArticleFilters): Promise<ArticleListResponse> {
    try {
      const searchParams: GetArticlesRequest = {
        search: filters.search,
        category: filters.category,
        tags: filters.tags,
        targetGender: filters.targetGender,
        babyAge: filters.babyAge,
        ageUnit: filters.ageUnit,
        status: filters.status,
        sortBy: filters.sortBy || 'publishedAt',
        sortOrder: filters.sortOrder || 'desc',
        page: 1,
        limit: 10,
      };

      return await this.getArticles(searchParams);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get articles by category
   */
  static async getArticlesByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ArticleListResponse> {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      return await this.getArticles({
        category: categoryId,
        page,
        limit,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get articles by tags
   */
  static async getArticlesByTags(tagIds: string[], page: number = 1, limit: number = 10): Promise<ArticleListResponse> {
    try {
      if (!tagIds || tagIds.length === 0) {
        throw new Error('Tag IDs are required');
      }

      return await this.getArticles({
        tags: tagIds.join(','),
        page,
        limit,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get articles for specific age and gender
   */
  static async getArticlesForBaby(
    babyAge: number,
    ageUnit: string,
    targetGender: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ArticleListResponse> {
    try {
      return await this.getArticles({
        babyAge,
        ageUnit: ageUnit as any,
        targetGender: targetGender as any,
        page,
        limit,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get trending articles (most viewed)
   */
  static async getTrendingArticles(limit: number = 10): Promise<ArticleListResponse> {
    try {
      return await this.getArticles({
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
   * Get latest articles
   */
  static async getLatestArticles(limit: number = 10): Promise<ArticleListResponse> {
    try {
      return await this.getArticles({
        sortBy: 'publishedAt',
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
  private static buildQueryParams(params: GetArticlesRequest): URLSearchParams {
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
        return new Error('Article not found.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }

  /**
   * Clear cache for articles (if using cache)
   */
  static clearCache(): void {
    // Implementation depends on your caching strategy
    // This could clear React Query cache, AsyncStorage, etc.
    console.log('Article cache cleared');
  }
}
