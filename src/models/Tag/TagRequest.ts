// src/models/Tag/TagRequest.ts

export interface GetTagsRequest {
  page?: number;
  limit?: number;
}

export interface GetTagByIdRequest {
  id: string;
}

export interface GetTagBySlugRequest {
  slug: string;
}

// For building query string parameters
export interface TagQueryParams {
  [key: string]: string | number | undefined;
}

// Default pagination
export const DEFAULT_TAG_PARAMS: Partial<GetTagsRequest> = {
  page: 1,
  limit: 10,
};
