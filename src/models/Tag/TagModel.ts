// src/models/Tag/TagModel.ts

export interface TagModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string; // Default: '#3B82F6'
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TagState {
  tags: TagModel[];
  currentTag: TagModel | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };
}
