// src/store/slices/pregnancyCareSlice.ts

import {
  GetPregnancyCaresRequest,
  PregnancyCare,
  PregnancyCareCategory,
  PregnancyCareFilters,
  PregnancyCareState,
  PregnancyTrimester,
  SearchPregnancyCareRequest,
} from '@/models/PregnancyCare/PregnancyCareModel';
import { PregnancyCareService } from '@/services/pregnancyJournal/pregnancyCareService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: PregnancyCareState = {
  cares: [],
  currentCare: null,
  recommendedCares: [],
  searchResults: [],
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
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isActive: true,
  },
  cache: {},
};

// Async thunks
export const fetchCares = createAsyncThunk(
  'pregnancyCares/fetchCares',
  async (params: GetPregnancyCaresRequest = {}, { rejectWithValue }) => {
    try {
      const response = await PregnancyCareService.getCares(params);
      return { ...response, params };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch pregnancy cares');
    }
  },
);

export const loadMoreCares = createAsyncThunk(
  'pregnancyCares/loadMoreCares',
  async (params: GetPregnancyCaresRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.pregnancyCares.pagination.page;
      const nextPage = currentPage + 1;

      const response = await PregnancyCareService.getCares({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more pregnancy cares');
    }
  },
);

export const fetchCareById = createAsyncThunk(
  'pregnancyCares/fetchCareById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await PregnancyCareService.getCareById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch pregnancy care');
    }
  },
);

export const searchCares = createAsyncThunk(
  'pregnancyCares/searchCares',
  async (params: SearchPregnancyCareRequest, { rejectWithValue }) => {
    try {
      const response = await PregnancyCareService.searchCares(params);
      return { ...response, query: params.query };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search pregnancy cares');
    }
  },
);

export const fetchCaresByCategory = createAsyncThunk(
  'pregnancyCares/fetchCaresByCategory',
  async (
    { category, page = 1, limit = 10 }: { category: PregnancyCareCategory; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await PregnancyCareService.getCaresByCategory(category, page, limit);
      return { ...response, category, page };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cares by category');
    }
  },
);

export const fetchCaresByTrimester = createAsyncThunk(
  'pregnancyCares/fetchCaresByTrimester',
  async (
    { trimester, page = 1, limit = 10 }: { trimester: PregnancyTrimester; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await PregnancyCareService.getCaresByTrimester(trimester, page, limit);
      return { ...response, trimester, page };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cares by trimester');
    }
  },
);

export const fetchCaresForWeek = createAsyncThunk(
  'pregnancyCares/fetchCaresForWeek',
  async ({ week, page = 1, limit = 10 }: { week: number; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await PregnancyCareService.getCaresForWeek(week, page, limit);
      return { ...response, week, page };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cares for week');
    }
  },
);

export const fetchImportantCares = createAsyncThunk(
  'pregnancyCares/fetchImportantCares',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await PregnancyCareService.getImportantCares(limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch important cares');
    }
  },
);

export const fetchTrendingCares = createAsyncThunk(
  'pregnancyCares/fetchTrendingCares',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await PregnancyCareService.getTrendingCares(limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trending cares');
    }
  },
);

const pregnancyCareSlice = createSlice({
  name: 'pregnancyCares',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCare: (state, action: PayloadAction<PregnancyCare | null>) => {
      state.currentCare = action.payload;
    },
    clearCurrentCare: (state) => {
      state.currentCare = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<PregnancyCareFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        isActive: true,
      };
    },
    clearCares: (state) => {
      state.cares = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
      };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setRecommendedCares: (state, action: PayloadAction<PregnancyCare[]>) => {
      state.recommendedCares = action.payload;
    },
    updateCareInList: (state, action: PayloadAction<PregnancyCare>) => {
      const updateList = (list: PregnancyCare[]) => {
        const index = list.findIndex((care) => care.id === action.payload.id);
        if (index !== -1) {
          list[index] = action.payload;
        }
      };

      updateList(state.cares);
      updateList(state.recommendedCares);
      updateList(state.searchResults);

      if (state.currentCare?.id === action.payload.id) {
        state.currentCare = action.payload;
      }
    },
    incrementViewCount: (state, action: PayloadAction<string>) => {
      const careId = action.payload;

      const incrementInList = (list: PregnancyCare[]) => {
        const care = list.find((c) => c.id === careId);
        if (care) {
          care.viewCount += 1;
        }
      };

      incrementInList(state.cares);
      incrementInList(state.recommendedCares);
      incrementInList(state.searchResults);

      if (state.currentCare?.id === careId) {
        state.currentCare.viewCount += 1;
      }
    },
    incrementHelpfulCount: (state, action: PayloadAction<string>) => {
      const careId = action.payload;

      const incrementInList = (list: PregnancyCare[]) => {
        const care = list.find((c) => c.id === careId);
        if (care) {
          care.helpfulCount += 1;
        }
      };

      incrementInList(state.cares);
      incrementInList(state.recommendedCares);
      incrementInList(state.searchResults);

      if (state.currentCare?.id === careId) {
        state.currentCare.helpfulCount += 1;
      }
    },
    addToCache: (state, action: PayloadAction<{ key: string; data: PregnancyCare[]; expiresIn?: number }>) => {
      const { key, data, expiresIn = 30 * 60 * 1000 } = action.payload; // Default 30 minutes
      state.cache[key] = {
        data,
        timestamp: Date.now(),
        expiresIn,
      };
    },
    clearCache: (state) => {
      state.cache = {};
    },
    removeExpiredCache: (state) => {
      const now = Date.now();
      Object.keys(state.cache).forEach((key) => {
        const cached = state.cache[key];
        if (now - cached.timestamp > cached.expiresIn) {
          delete state.cache[key];
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cares
      .addCase(fetchCares.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCares.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cares = action.payload.data;
        state.pagination = {
          page: action.payload.params?.page || 1,
          limit: action.payload.params?.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchCares.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load more cares
      .addCase(loadMoreCares.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreCares.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.cares = [...state.cares, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(loadMoreCares.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch care by ID
      .addCase(fetchCareById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCareById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCare = action.payload;
        state.error = null;
      })
      .addCase(fetchCareById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Search cares
      .addCase(searchCares.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCares.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
        state.pagination = {
          page: 1,
          limit: 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(searchCares.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch cares by category
      .addCase(fetchCaresByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cares = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.filters = { ...state.filters, category: action.payload.category };
        state.error = null;
      })

      // Fetch cares by trimester
      .addCase(fetchCaresByTrimester.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cares = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.filters = { ...state.filters, trimester: action.payload.trimester };
        state.error = null;
      })

      // Fetch cares for week
      .addCase(fetchCaresForWeek.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cares = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.filters = { ...state.filters, currentWeek: action.payload.week };
        state.error = null;

        // Cache by week
        const cacheKey = `week_${action.payload.week}`;
        state.cache[cacheKey] = {
          data: action.payload.data,
          timestamp: Date.now(),
          expiresIn: 60 * 60 * 1000, // 1 hour for week-specific data
        };
      })

      // Important cares
      .addCase(fetchImportantCares.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendedCares = action.payload.data;
        state.error = null;

        // Cache important cares
        state.cache['important'] = {
          data: action.payload.data,
          timestamp: Date.now(),
          expiresIn: 2 * 60 * 60 * 1000, // 2 hours for important cares
        };
      })

      // Trending cares
      .addCase(fetchTrendingCares.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cares = action.payload.data;
        state.pagination = {
          page: 1,
          limit: action.payload.data.length,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;

        // Cache trending cares
        state.cache['trending'] = {
          data: action.payload.data,
          timestamp: Date.now(),
          expiresIn: 30 * 60 * 1000, // 30 minutes for trending
        };
      });
  },
});

export const pregnancyCareSelectors = {
  selectAllCares: (state: RootState) => state.pregnancyCares.cares,
  selectCurrentCare: (state: RootState) => state.pregnancyCares.currentCare,
  selectRecommendedCares: (state: RootState) => state.pregnancyCares.recommendedCares,
  selectSearchResults: (state: RootState) => state.pregnancyCares.searchResults,
  selectCareById: (id: string) => (state: RootState) => state.pregnancyCares.cares.find((c) => c.id === id),
  selectCaresByCategory: (category: string) => (state: RootState) =>
    state.pregnancyCares.cares.filter((c) => c.category === category),
  selectCaresByWeek: (week: number) => (state: RootState) =>
    state.pregnancyCares.cares.filter((c) => c.weekStart <= week && c.weekEnd >= week),
  selectCareLoadingState: (state: RootState) => ({
    isLoading: state.pregnancyCares.isLoading,
    isLoadingMore: state.pregnancyCares.isLoadingMore,
  }),
};

export const {
  clearError,
  setCurrentCare,
  clearCurrentCare,
  updateFilters,
  resetFilters,
  clearCares,
  clearSearchResults,
  setRecommendedCares,
  updateCareInList,
  incrementViewCount,
  incrementHelpfulCount,
  addToCache,
  clearCache,
  removeExpiredCache,
} = pregnancyCareSlice.actions;

export default pregnancyCareSlice.reducer;
