import { CategoryItem } from '../Category/CategoryModel';
import { TagModel } from '../Tag/TagModel';

export enum AgeUnit {
  WEEK = 'week',
  MONTH = 'month',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  BOTH = 'both',
}

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface Article {
  id: string;
  title: string;
  image: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category: CategoryItem;
  tags: TagModel[];
  minAge?: number;
  maxAge?: number;
  ageUnit?: AgeUnit;
  targetGender?: Gender;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  status: ArticleStatus;
  isActive: boolean;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleState {
  articles: Article[];
  currentArticle: Article | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };
  filters: ArticleFilters;
}

export interface ArticleFilters {
  search?: string;
  category?: string;
  tags?: string;
  targetGender?: Gender;
  babyAge?: number;
  ageUnit?: AgeUnit;
  status?: ArticleStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
