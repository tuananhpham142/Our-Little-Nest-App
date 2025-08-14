// src/models/Article/ArticleRequest.ts

import { AgeUnit, ArticleStatus, Gender } from './ArticleModel';

export interface GetArticlesRequest {
  search?: string;
  category?: string;
  tags?: string; // comma-separated tag IDs
  targetGender?: Gender;
  babyAge?: number;
  ageUnit?: AgeUnit;
  status?: ArticleStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetArticleByIdRequest {
  id: string;
}

export interface GetArticleBySlugRequest {
  slug: string;
}

// For building query string parameters
export interface ArticleQueryParams {
  [key: string]: string | number | undefined;
}

// Default pagination and sorting
export const DEFAULT_ARTICLE_PARAMS: Partial<GetArticlesRequest> = {
  page: 1,
  limit: 10,
  sortBy: 'publishedAt',
  sortOrder: 'desc',
  status: ArticleStatus.PUBLISHED,
};
