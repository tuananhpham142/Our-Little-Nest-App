// src/models/Article/ArticleResponse.ts

import { Article } from './ArticleModel';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface InfinityPaginationResponse<T> {
  data: T[];
  hasNextPage: boolean;
  total: number;
}

export interface ArticleListResponse {
  data: Article[];
  hasNextPage: boolean;
  total: number;
}

export interface ArticleDetailResponse {
  data: Article;
}

export interface ArticlesBySlugResponse {
  data: Article;
}

// Error response interface
export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}
