// src/store/slices/articleSlice.ts

import { Article, ArticleFilters, ArticleState, ArticleStatus } from '@/models/Article/ArticleModel';
import { GetArticlesRequest } from '@/models/Article/ArticleRequest';
import { ArticleService } from '@/services/article/articleService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ArticleState = {
  articles: [],
  currentArticle: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasNextPage: false,
  },
  filters: {
    status: ArticleStatus.PUBLISHED,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  },
};

// Async thunks
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params: GetArticlesRequest = {}, { rejectWithValue }) => {
    try {
      const response = await ArticleService.getArticles(params);
      return { ...response, params };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch articles');
    }
  },
);

export const loadMoreArticles = createAsyncThunk(
  'articles/loadMoreArticles',
  async (params: GetArticlesRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.articles.pagination.page;
      const nextPage = currentPage + 1;

      const response = await ArticleService.getArticles({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more articles');
    }
  },
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ArticleService.getArticleById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch article');
    }
  },
);

export const fetchArticleBySlug = createAsyncThunk(
  'articles/fetchArticleBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await ArticleService.getArticleBySlug(slug);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch article');
    }
  },
);

export const searchArticles = createAsyncThunk(
  'articles/searchArticles',
  async (filters: ArticleFilters, { rejectWithValue }) => {
    try {
      const response = await ArticleService.searchArticles(filters);
      return { ...response, filters };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search articles');
    }
  },
);

export const fetchArticlesByCategory = createAsyncThunk(
  'articles/fetchArticlesByCategory',
  async (
    { categoryId, page = 1, limit = 10 }: { categoryId: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await ArticleService.getArticlesByCategory(categoryId, page, limit);
      return { ...response, categoryId, page };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch articles by category');
    }
  },
);

export const fetchArticlesByTags = createAsyncThunk(
  'articles/fetchArticlesByTags',
  async (
    { tagIds, page = 1, limit = 10 }: { tagIds: string[]; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await ArticleService.getArticlesByTags(tagIds, page, limit);
      return { ...response, tagIds, page };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch articles by tags');
    }
  },
);

export const fetchTrendingArticles = createAsyncThunk(
  'articles/fetchTrendingArticles',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await ArticleService.getTrendingArticles(limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trending articles');
    }
  },
);

export const fetchLatestArticles = createAsyncThunk(
  'articles/fetchLatestArticles',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await ArticleService.getLatestArticles(limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch latest articles');
    }
  },
);

export const fetchArticlesForBaby = createAsyncThunk(
  'articles/fetchArticlesForBaby',
  async (
    {
      babyAge,
      ageUnit,
      targetGender,
      page = 1,
      limit = 10,
    }: {
      babyAge: number;
      ageUnit: string;
      targetGender: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await ArticleService.getArticlesForBaby(babyAge, ageUnit, targetGender, page, limit);
      return { ...response, babyAge, ageUnit, targetGender, page };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch articles for baby');
    }
  },
);

const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentArticle: (state, action: PayloadAction<Article | null>) => {
      state.currentArticle = action.payload;
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<ArticleFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        status: ArticleStatus.PUBLISHED,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      };
    },
    clearArticles: (state) => {
      state.articles = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
      };
    },
    updateArticleInList: (state, action: PayloadAction<Article>) => {
      const index = state.articles.findIndex((article) => article.id === action.payload.id);
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
    },
    incrementViewCount: (state, action: PayloadAction<string>) => {
      const articleId = action.payload;

      // Update in articles list
      const articleIndex = state.articles.findIndex((article) => article.id === articleId);
      if (articleIndex !== -1) {
        state.articles[articleIndex].viewCount += 1;
      }

      // Update current article if it matches
      if (state.currentArticle && state.currentArticle.id === articleId) {
        state.currentArticle.viewCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch articles
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.pagination = {
          page: action.payload.params?.page || 1,
          limit: action.payload.params?.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load more articles
      .addCase(loadMoreArticles.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreArticles.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.articles = [...state.articles, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(loadMoreArticles.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch article by ID
      .addCase(fetchArticleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentArticle = action.payload;
        state.error = null;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch article by slug
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentArticle = action.payload;
        state.error = null;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Search articles
      .addCase(searchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.filters = { ...state.filters, ...action.payload.filters };
        state.pagination = {
          page: 1,
          limit: 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch articles by category
      .addCase(fetchArticlesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.filters = { ...state.filters, category: action.payload.categoryId };
        state.error = null;
      })

      // Fetch articles by tags
      .addCase(fetchArticlesByTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.filters = { ...state.filters, tags: action.payload.tagIds?.join(',') };
        state.error = null;
      })

      // Trending articles
      .addCase(fetchTrendingArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.pagination = {
          page: 1,
          limit: action.payload.data.length,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })

      // Latest articles
      .addCase(fetchLatestArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.pagination = {
          page: 1,
          limit: action.payload.data.length,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })

      // Articles for baby
      .addCase(fetchArticlesForBaby.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.filters = {
          ...state.filters,
          babyAge: action.payload.babyAge,
          ageUnit: action.payload.ageUnit as any,
          targetGender: action.payload.targetGender as any,
        };
        state.error = null;
      });
  },
});

export const {
  clearError,
  setCurrentArticle,
  clearCurrentArticle,
  updateFilters,
  resetFilters,
  clearArticles,
  updateArticleInList,
  incrementViewCount,
} = articleSlice.actions;

export default articleSlice.reducer;
