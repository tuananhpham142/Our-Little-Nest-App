// src/models/Badge/BadgeResponse.ts

import { Badge } from './BadgeModel';

// Search badges response (with pagination)
export interface BadgeListResponse {
  data: Badge[];
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

// Single badge detail response
export interface BadgeDetailResponse {
  data: Badge;
}

// API Error Response
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}
