// src/models/Tag/TagResponse.ts

import { TagModel } from './TagModel';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface InfinityPaginationResponse<T> {
  data: T[];
  hasNextPage: boolean;
  total: number;
}

export interface TagListResponse {
  data: TagModel[];
  hasNextPage: boolean;
  total: number;
}

export interface TagDetailResponse {
  data: TagModel;
}

export interface TagBySlugResponse {
  data: TagModel;
}

// Error response interface
export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
