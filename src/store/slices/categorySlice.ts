// src/store/slices/categorySlice.ts

import { CategoryItem, CategoryState } from '@/models/Category/CategoryModel';
import { GetCategoriesRequest } from '@/models/Category/CategoryRequest';
import { CategoryService } from '@/services/category/categoryService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasNextPage: false,
  },
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params: GetCategoriesRequest = {}, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategories(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  },
);

export const loadMoreCategories = createAsyncThunk(
  'categories/loadMoreCategories',
  async (params: GetCategoriesRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.categories.pagination.page;
      const nextPage = currentPage + 1;

      const response = await CategoryService.getCategories({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more categories');
    }
  },
);

export const fetchAllActiveCategories = createAsyncThunk(
  'categories/fetchAllActiveCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getAllActiveCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch active categories');
    }
  },
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategoryById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch category');
    }
  },
);

export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchCategoryBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategoryBySlug(slug);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch category');
    }
  },
);

export const searchCategories = createAsyncThunk(
  'categories/searchCategories',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await CategoryService.searchCategories(searchTerm);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search categories');
    }
  },
);

export const fetchCategoriesByIds = createAsyncThunk(
  'categories/fetchCategoriesByIds',
  async (categoryIds: string[], { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategoriesByIds(categoryIds);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories by IDs');
    }
  },
);

export const fetchMainCategories = createAsyncThunk(
  'categories/fetchMainCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getMainCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch main categories');
    }
  },
);

export const fetchCategoryNavigation = createAsyncThunk(
  'categories/fetchCategoryNavigation',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CategoryService.getCategoryNavigation();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch category navigation');
    }
  },
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCategory: (state, action: PayloadAction<CategoryItem | null>) => {
      state.currentCategory = action.payload;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearCategories: (state) => {
      state.categories = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
      };
    },
    updateCategoryInList: (state, action: PayloadAction<CategoryItem>) => {
      const index = state.categories.findIndex((category) => category.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        state.pagination = {
          page: action.payload?.page || 1,
          limit: action.payload?.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load more categories
      .addCase(loadMoreCategories.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreCategories.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.categories = [...state.categories, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(loadMoreCategories.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch all active categories
      .addCase(fetchAllActiveCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })

      // Fetch category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch category by slug
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Search categories
      .addCase(searchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch categories by IDs
      .addCase(fetchCategoriesByIds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })

      // Fetch main categories
      .addCase(fetchMainCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })

      // Fetch category navigation
      .addCase(fetchCategoryNavigation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      });
  },
});

export const { clearError, setCurrentCategory, clearCurrentCategory, clearCategories, updateCategoryInList } =
  categorySlice.actions;

export default categorySlice.reducer;
