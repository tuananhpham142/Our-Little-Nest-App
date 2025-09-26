// src/models/Category/CategoryRequest.ts

export interface GetCategoriesRequest {
  page?: number;
  limit?: number;
}

export interface GetCategoryByIdRequest {
  id: string;
}

export interface GetCategoryBySlugRequest {
  slug: string;
}

// For building query string parameters
export interface CategoryQueryParams {
  [key: string]: string | number | undefined;
}

// Default pagination
export const DEFAULT_CATEGORY_PARAMS: Partial<GetCategoriesRequest> = {
  page: 1,
  limit: 10,
};
