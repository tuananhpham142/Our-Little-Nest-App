// src/models/KindnessCloset/KindnessClosetResponse.ts

import { KindnessCloset, KindnessClosetApplication, KindnessClosetHistory } from './KindnessClosetModel';

// Base response interfaces
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export interface InfinityPaginationResponse<T> {
  data: T[];
  hasNextPage: boolean;
  page: number;
  limit: number;
  total: number;
}

export interface GetOneResponse<T> {
  data: T;
}

export interface GetAllResponse<T> {
  data: T[];
}

// KindnessCloset specific responses
export interface KindnessClosetListResponse extends InfinityPaginationResponse<KindnessCloset> {}

export interface KindnessClosetDetailResponse extends GetOneResponse<KindnessCloset> {}

export interface SimilarPostsResponse extends GetAllResponse<KindnessCloset> {}

// Application specific responses
export interface KindnessClosetApplicationListResponse extends InfinityPaginationResponse<KindnessClosetApplication> {}

export interface KindnessClosetApplicationDetailResponse extends GetOneResponse<KindnessClosetApplication> {}

export interface AllApplicationsResponse extends GetAllResponse<KindnessClosetApplication> {}

// History specific responses
export interface KindnessClosetHistoryListResponse extends InfinityPaginationResponse<KindnessClosetHistory> {}

export interface KindnessClosetHistoryDetailResponse extends GetOneResponse<KindnessClosetHistory> {}

// Error response
export interface ApiErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}

// Success response for create/update/delete operations
export interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}

// Statistics response (optional for dashboard)
export interface KindnessClosetStatistics {
  totalPosts: number;
  activePosts: number;
  completedPosts: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalGiven: number;
  totalReceived: number;
}
