// src/models/Category/CategoryResponse.ts

import { CategoryItem } from './CategoryModel';

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

export interface CategoryListResponse {
  data: CategoryItem[];
  hasNextPage: boolean;
  total: number;
}

export interface CategoryDetailResponse {
  data: CategoryItem;
}

export interface CategoryBySlugResponse {
  data: CategoryItem;
}

// Error response interface
export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
