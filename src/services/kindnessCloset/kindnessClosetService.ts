// src/services/kindnessCloset/kindnessClosetService.ts

import {
    KindnessCloset,
    KindnessClosetApplication,
    KindnessClosetHistory,
} from '@/models/KindnessCloset/KindnessClosetModel';
import {
    CreateKindnessClosetApplicationDto,
    CreateKindnessClosetDto,
    DEFAULT_KINDNESS_CLOSET_PARAMS,
    FindAllKindnessClosetHistoriesDto,
    FindAllKindnessClosetsDto,
    QueryKindnessClosetDto,
    UpdateKindnessClosetApplicationDto,
    UpdateKindnessClosetDto,
} from '@/models/KindnessCloset/KindnessClosetRequest';
import {
    AllApplicationsResponse,
    ApiErrorResponse,
    ApiSuccessResponse,
    KindnessClosetApplicationDetailResponse,
    KindnessClosetApplicationListResponse,
    KindnessClosetDetailResponse,
    KindnessClosetHistoryListResponse,
    KindnessClosetListResponse,
    SimilarPostsResponse,
} from '@/models/KindnessCloset/KindnessClosetResponse';
import { normalizeId } from '@/utils/kindnessClosetUtils';
import { baseApi } from '../baseApi';

export class KindnessClosetService {
  private static readonly BASE_PATH = '/kindness-closets';
  private static readonly APPLICATIONS_PATH = '/kindness-closet-applications';
  private static readonly HISTORIES_PATH = '/kindness-closet-histories';

  /**
   * Transform MongoDB document to frontend model
   */
  private static transformPost(post: any): KindnessCloset {
    const transformed = {
      ...post,
      id: post.id || post._id?.toString() || post._id?.$oid || '',
      location: post.location?._id ? post.location : post.location,
      user: post.user?._id ? post.user : post.user,
      createdAt: post.createdAt?.$date || post.createdAt || '',
      updatedAt: post.updatedAt?.$date || post.updatedAt || '',
      deletedAt: post.deletedAt?.$date || post.deletedAt || null,
    };

    // Ensure nested ObjectIds are properly handled
    if (transformed.location?._id?.$oid) {
      transformed.location.id = transformed.location._id.$oid;
    }
    if (transformed.user?._id?.$oid) {
      transformed.user.id = transformed.user._id.$oid;
    }

    return normalizeId(transformed);
  }

  /**
   * Transform MongoDB application document to frontend model
   */
  private static transformApplication(app: any): KindnessClosetApplication {
    const transformed = {
      ...app,
      id: app.id || app._id?.toString() || app._id?.$oid || '',
      kindnessCloset: app.kindnessCloset?._id ? app.kindnessCloset : app.kindnessCloset,
      applicant: app.applicant?._id ? app.applicant : app.applicant,
      createdAt: app.createdAt?.$date || app.createdAt || '',
      updatedAt: app.updatedAt?.$date || app.updatedAt || '',
      approvedAt: app.approvedAt?.$date || app.approvedAt || null,
      rejectedAt: app.rejectedAt?.$date || app.rejectedAt || null,
      deletedAt: app.deletedAt?.$date || app.deletedAt || null,
    };

    return normalizeId(transformed);
  }

  /**
   * Transform MongoDB history document to frontend model
   */
  private static transformHistory(history: any): KindnessClosetHistory {
    const transformed = {
      ...history,
      id: history.id || history._id?.toString() || history._id?.$oid || '',
      giver: history.giver?._id ? history.giver : history.giver,
      receiver: history.receiver?._id ? history.receiver : history.receiver,
      location: history.location?._id ? history.location : history.location,
      completedAt: history.completedAt?.$date || history.completedAt || '',
      createdAt: history.createdAt?.$date || history.createdAt || '',
      updatedAt: history.updatedAt?.$date || history.updatedAt || '',
      deletedAt: history.deletedAt?.$date || history.deletedAt || null,
    };

    return normalizeId(transformed);
  }

  // ============= KindnessCloset CRUD Operations =============

  /**
   * Create a new kindness closet post
   */
  static async createPost(data: CreateKindnessClosetDto): Promise<KindnessCloset> {
    try {
      const response = await baseApi.post<KindnessClosetDetailResponse>(this.BASE_PATH, data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get posts with filtering and pagination
   */
  static async getPosts(params: QueryKindnessClosetDto = {}): Promise<KindnessClosetListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_KINDNESS_CLOSET_PARAMS,
        ...params,
      });

      const response = await baseApi.get<KindnessClosetListResponse>(`${this.BASE_PATH}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's own posts
   */
  static async getMyPosts(params: FindAllKindnessClosetsDto = {}): Promise<KindnessClosetListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        page: params.page || 1,
        limit: params.limit || 10,
      });

      const response = await baseApi.get<KindnessClosetListResponse>(
        `${this.BASE_PATH}/my-posts?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get post by ID
   */
  static async getPostById(id: string): Promise<KindnessCloset> {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }

      const response = await baseApi.get<KindnessClosetDetailResponse>(`${this.BASE_PATH}/${id}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get similar posts
   */
  static async getSimilarPosts(id: string, limit: number = 5): Promise<KindnessCloset[]> {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }

      const response = await baseApi.get<SimilarPostsResponse>(`${this.BASE_PATH}/${id}/similar?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a post
   */
  static async updatePost(id: string, data: UpdateKindnessClosetDto): Promise<KindnessCloset> {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }

      const response = await baseApi.patch<KindnessClosetDetailResponse>(`${this.BASE_PATH}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(id: string): Promise<ApiSuccessResponse> {
    try {
      if (!id) {
        throw new Error('Post ID is required');
      }

      await baseApi.delete(`${this.BASE_PATH}/${id}`);
      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============= Application Operations =============

  /**
   * Create an application for a post
   */
  static async createApplication(
    postId: string,
    data: CreateKindnessClosetApplicationDto,
  ): Promise<KindnessClosetApplication> {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      const response = await baseApi.post<KindnessClosetApplicationDetailResponse>(
        `${this.BASE_PATH}/${postId}/applications`,
        data,
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get applications for a specific post
   */
  static async getPostApplications(
    postId: string,
    params: FindAllKindnessClosetsDto = {},
  ): Promise<KindnessClosetApplicationListResponse> {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      const queryParams = this.buildQueryParams({
        page: params.page || 1,
        limit: params.limit || 10,
      });

      const response = await baseApi.get<KindnessClosetApplicationListResponse>(
        `${this.BASE_PATH}/${postId}/applications?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all applications for a post (no pagination)
   */
  static async getAllPostApplications(postId: string): Promise<KindnessClosetApplication[]> {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      const response = await baseApi.get<AllApplicationsResponse>(`${this.BASE_PATH}/${postId}/all-applications`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's applications
   */
  static async getMyApplications(): Promise<KindnessClosetApplication[]> {
    try {
      const response = await baseApi.get<AllApplicationsResponse>(`${this.BASE_PATH}/applications/my`);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update application status (approve/reject)
   */
  static async updateApplicationStatus(
    applicationId: string,
    data: UpdateKindnessClosetApplicationDto,
  ): Promise<KindnessClosetApplication> {
    try {
      if (!applicationId) {
        throw new Error('Application ID is required');
      }

      const response = await baseApi.patch<KindnessClosetApplicationDetailResponse>(
        `${this.BASE_PATH}/applications/${applicationId}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cancel an application
   */
  static async cancelApplication(applicationId: string): Promise<ApiSuccessResponse> {
    try {
      if (!applicationId) {
        throw new Error('Application ID is required');
      }

      await baseApi.delete(`${this.BASE_PATH}/applications/${applicationId}`);
      return { success: true, message: 'Application cancelled successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============= History Operations =============

  /**
   * Get user's transaction history
   */
  static async getMyHistory(
    params: FindAllKindnessClosetHistoriesDto = {},
  ): Promise<KindnessClosetHistoryListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        page: params.page || 1,
        limit: params.limit || 10,
      });

      const response = await baseApi.get<KindnessClosetHistoryListResponse>(
        `${this.BASE_PATH}/history/my?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get given history
   */
  static async getGivenHistory(
    params: FindAllKindnessClosetHistoriesDto = {},
  ): Promise<KindnessClosetHistoryListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        page: params.page || 1,
        limit: params.limit || 10,
      });

      const response = await baseApi.get<KindnessClosetHistoryListResponse>(
        `${this.BASE_PATH}/history/given?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get received history
   */
  static async getReceivedHistory(
    params: FindAllKindnessClosetHistoriesDto = {},
  ): Promise<KindnessClosetHistoryListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        page: params.page || 1,
        limit: params.limit || 10,
      });

      const response = await baseApi.get<KindnessClosetHistoryListResponse>(
        `${this.BASE_PATH}/history/received?${queryParams.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ============= Helper Methods =============

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: any): URLSearchParams {
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
        return new Error('Dữ liệu không hợp lệ.');
      case 401:
        return new Error('Vui lòng đăng nhập để tiếp tục.');
      case 403:
        return new Error('Bạn không có quyền thực hiện thao tác này.');
      case 404:
        return new Error('Không tìm thấy dữ liệu.');
      case 409:
        return new Error('Bạn đã đăng ký cho bài viết này rồi.');
      case 429:
        return new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
      case 500:
        return new Error('Lỗi máy chủ. Vui lòng thử lại sau.');
      default:
        return new Error(error.message || 'Đã có lỗi xảy ra.');
    }
  }

  /**
   * Clear cache for kindness closet data (if using cache)
   */
  static clearCache(): void {
    console.log('KindnessCloset cache cleared');
  }
}
