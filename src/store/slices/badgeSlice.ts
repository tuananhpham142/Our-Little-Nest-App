// src/store/slices/badgeSlice.ts

import { Badge } from '@/models/Badge/BadgeModel';
import { GetBadgesRequest } from '@/models/Badge/BadgeRequest';
import { BadgeService } from '@/services/badges/badgeService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { badges_data } from './badges_data';

// Simplified state - only what's needed
interface BadgeState {
  badges: Badge[];
  currentBadge: Badge | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };
  filters: GetBadgesRequest;
}

const initialState: BadgeState = {
  //@ts-ignore
  badges: badges_data,
  currentBadge: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNextPage: false,
  },
  filters: {
    page: 1,
    limit: 20,
    isActive: true,
  },
};

// Async thunks
export const searchBadges = createAsyncThunk(
  'badges/searchBadges',
  async (params: GetBadgesRequest = {}, { rejectWithValue }) => {
    try {
      const response = await BadgeService.searchBadges(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search badges');
    }
  },
);

export const fetchBadgeById = createAsyncThunk('badges/fetchBadgeById', async (id: string, { rejectWithValue }) => {
  try {
    const badge = await BadgeService.getBadgeById(id);
    return badge;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch badge');
  }
});

const badgeSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBadge: (state, action: PayloadAction<Badge | null>) => {
      state.currentBadge = action.payload;
    },
    updateFilters: (state, action: PayloadAction<GetBadgesRequest>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { page: 1, limit: 20, isActive: true };
    },
    clearBadges: (state) => {
      state.badges = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Search badges
      .addCase(searchBadges.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchBadges.fulfilled, (state, action) => {
        state.isLoading = false;
        state.badges = action.payload.data;
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(searchBadges.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch badge by ID
      .addCase(fetchBadgeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBadgeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBadge = action.payload;
        state.error = null;
      })
      .addCase(fetchBadgeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentBadge, updateFilters, resetFilters, clearBadges } = badgeSlice.actions;

export default badgeSlice.reducer;
