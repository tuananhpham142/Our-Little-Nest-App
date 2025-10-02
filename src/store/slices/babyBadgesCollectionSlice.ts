// src/store/slices/babyBadgesCollectionSlice.ts

import { BabyBadgesCollection } from '@/models/BabyBadgesCollection/BabyBadgesCollectionModel';
import { CreateBabyBadgesCollectionRequest } from '@/models/BabyBadgesCollection/BabyBadgesCollectionRequest';
import { BabyBadgeCollectionsService } from '@/services/badges/babyBadgesCollectionService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Simplified state - only what's needed
interface BabyBadgesCollectionState {
  babyBadges: BabyBadgesCollection[]; // Badges for current baby
  selectedBabyId: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: BabyBadgesCollectionState = {
  babyBadges: [],
  selectedBabyId: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Async thunks
export const awardBadge = createAsyncThunk(
  'babyBadgesCollections/awardBadge',
  async (awardData: CreateBabyBadgesCollectionRequest, { rejectWithValue }) => {
    try {
      const collection = await BabyBadgeCollectionsService.awardBadge(awardData);
      return collection;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to award badge');
    }
  },
);

export const fetchBabyBadges = createAsyncThunk(
  'babyBadgesCollections/fetchBabyBadges',
  async (babyId: string, { rejectWithValue }) => {
    try {
      const collections = await BabyBadgeCollectionsService.getBabyBadges(babyId);
      return { babyId, collections };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch baby badges');
    }
  },
);

const babyBadgesCollectionSlice = createSlice({
  name: 'babyBadgesCollections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBabyBadges: (state) => {
      state.babyBadges = [];
      state.selectedBabyId = null;
    },
    setSelectedBabyId: (state, action: PayloadAction<string | null>) => {
      state.selectedBabyId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Award badge
      .addCase(awardBadge.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(awardBadge.fulfilled, (state, action) => {
        state.isSubmitting = false;
        // Add new badge to the beginning of the list
        state.babyBadges.unshift(action.payload);
        state.error = null;
      })
      .addCase(awardBadge.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Fetch baby badges
      .addCase(fetchBabyBadges.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBabyBadges.fulfilled, (state, action) => {
        state.isLoading = false;
        state.babyBadges = action.payload.collections;
        state.selectedBabyId = action.payload.babyId;
        state.error = null;
      })
      .addCase(fetchBabyBadges.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearBabyBadges, setSelectedBabyId } = babyBadgesCollectionSlice.actions;

export default babyBadgesCollectionSlice.reducer;
