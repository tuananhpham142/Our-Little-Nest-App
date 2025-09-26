export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface CategoryState {
  categories: CategoryItem[];
  currentCategory: CategoryItem | null;
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
