// src/store/slices/badgeCollectionSlice.ts

import { VerificationStatus } from '@/models/Badge/BadgeEnum';
import {
  BadgeCollection,
  BadgeCollectionFilters,
  BadgeCollectionState,
} from '@/models/BadgeCollection/BadgeCollectionModel';
import {
  CreateBadgeCollectionRequest,
  GetBadgeCollectionsRequest,
  UpdateBadgeCollectionRequest,
  VerifyBadgeCollectionRequest,
} from '@/models/BadgeCollection/BadgeCollectionRequest';
import { BadgeCollectionService } from '@/services/badge/badgeCollectionService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BadgeCollectionState = {
  collections: [],
  currentCollection: null,
  babyCollections: {},
  mySubmissions: [],
  pendingVerifications: [],
  babyStatistics: {},
  babyProgress: {},
  isLoading: false,
  isLoadingMore: false,
  isSubmitting: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasNextPage: false,
  },
  filters: {
    sortBy: 'completedAt',
    sortOrder: 'desc',
  },
  selectedBabyId: null,
  activeTab: 'all',
};

// Async thunks
export const createBadgeCollection = createAsyncThunk(
  'badgeCollections/createBadgeCollection',
  async (data: CreateBadgeCollectionRequest, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.createBadgeCollection(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to award badge');
    }
  },
);

export const fetchBadgeCollections = createAsyncThunk(
  'badgeCollections/fetchBadgeCollections',
  async (params: GetBadgeCollectionsRequest = {}, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.getBadgeCollections(params);
      return { ...response, params };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch badge collections');
    }
  },
);

export const loadMoreBadgeCollections = createAsyncThunk(
  'badgeCollections/loadMoreBadgeCollections',
  async (params: GetBadgeCollectionsRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.badgeCollections.pagination.page;
      const nextPage = currentPage + 1;

      const response = await BadgeCollectionService.getBadgeCollections({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more collections');
    }
  },
);

export const fetchBadgeCollectionById = createAsyncThunk(
  'badgeCollections/fetchBadgeCollectionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.getBadgeCollectionById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch badge collection');
    }
  },
);

export const updateBadgeCollection = createAsyncThunk(
  'badgeCollections/updateBadgeCollection',
  async ({ id, data }: { id: string; data: UpdateBadgeCollectionRequest }, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.updateBadgeCollection(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update badge collection');
    }
  },
);

export const deleteBadgeCollection = createAsyncThunk(
  'badgeCollections/deleteBadgeCollection',
  async (id: string, { rejectWithValue }) => {
    try {
      await BadgeCollectionService.deleteBadgeCollection(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete badge collection');
    }
  },
);

export const fetchBabyBadges = createAsyncThunk(
  'badgeCollections/fetchBabyBadges',
  async (
    { babyId, params = {} }: { babyId: string; params?: { verificationStatus?: string } },
    { rejectWithValue },
  ) => {
    try {
      const response = await BadgeCollectionService.getBabyBadges(babyId, params);
      return { ...response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch baby badges');
    }
  },
);

export const fetchBabyStats = createAsyncThunk(
  'badgeCollections/fetchBabyStats',
  async (babyId: string, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.getBabyStats(babyId);
      return { babyId, stats: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch baby statistics');
    }
  },
);

export const fetchBabyProgress = createAsyncThunk(
  'badgeCollections/fetchBabyProgress',
  async (babyId: string, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.getBabyProgress(babyId);
      return { babyId, progress: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch baby progress');
    }
  },
);

export const fetchPendingVerifications = createAsyncThunk(
  'badgeCollections/fetchPendingVerifications',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.getPendingVerifications(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch pending verifications');
    }
  },
);

export const fetchMySubmissions = createAsyncThunk(
  'badgeCollections/fetchMySubmissions',
  async (params: { verificationStatus?: string; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.getMySubmissions(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch submissions');
    }
  },
);

export const verifyBadgeCollection = createAsyncThunk(
  'badgeCollections/verifyBadgeCollection',
  async ({ id, data }: { id: string; data: VerifyBadgeCollectionRequest }, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.verifyBadgeCollection(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify badge collection');
    }
  },
);

export const approveBadgeCollection = createAsyncThunk(
  'badgeCollections/approveBadgeCollection',
  async ({ id, verificationNote }: { id: string; verificationNote?: string }, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.approveBadgeCollection(id, verificationNote);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to approve badge collection');
    }
  },
);

export const rejectBadgeCollection = createAsyncThunk(
  'badgeCollections/rejectBadgeCollection',
  async ({ id, verificationNote }: { id: string; verificationNote?: string }, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.rejectBadgeCollection(id, verificationNote);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reject badge collection');
    }
  },
);

export const uploadBadgeMedia = createAsyncThunk(
  'badgeCollections/uploadBadgeMedia',
  async ({ collectionId, files }: { collectionId: string; files: FormData }, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.uploadMedia(collectionId, files);
      return { collectionId, urls: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload media');
    }
  },
);

export const fetchBabyTimeline = createAsyncThunk(
  'badgeCollections/fetchBabyTimeline',
  async (
    { babyId, params = {} }: { babyId: string; params?: { startDate?: string; endDate?: string } },
    { rejectWithValue },
  ) => {
    try {
      const response = await BadgeCollectionService.getBabyTimeline(babyId, params);
      return { babyId, timeline: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch baby timeline');
    }
  },
);

export const fetchBadgeRecommendations = createAsyncThunk(
  'badgeCollections/fetchBadgeRecommendations',
  async ({ babyId, params = {} }: { babyId: string; params?: { limit?: number } }, { rejectWithValue }) => {
    try {
      const response = await BadgeCollectionService.getBadgeRecommendations(babyId, params);
      return { babyId, recommendations: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch recommendations');
    }
  },
);

const badgeCollectionSlice = createSlice({
  name: 'badgeCollections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCollection: (state, action: PayloadAction<BadgeCollection | null>) => {
      state.currentCollection = action.payload;
    },
    clearCurrentCollection: (state) => {
      state.currentCollection = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<BadgeCollectionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        sortBy: 'completedAt',
        sortOrder: 'desc',
      };
    },
    clearCollections: (state) => {
      state.collections = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
      };
    },
    setSelectedBabyId: (state, action: PayloadAction<string | null>) => {
      state.selectedBabyId = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'all' | 'pending' | 'approved' | 'rejected'>) => {
      state.activeTab = action.payload;
    },
    updateCollectionInList: (state, action: PayloadAction<BadgeCollection>) => {
      const updateList = (list: BadgeCollection[]) => {
        const index = list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          list[index] = action.payload;
        }
      };

      updateList(state.collections);
      updateList(state.mySubmissions);
      updateList(state.pendingVerifications);

      // Update in baby collections
      if (action.payload.babyId && state.babyCollections[action.payload.babyId]) {
        updateList(state.babyCollections[action.payload.babyId]);
      }

      if (state.currentCollection?.id === action.payload.id) {
        state.currentCollection = action.payload;
      }
    },
    removeCollectionFromLists: (state, action: PayloadAction<string>) => {
      const collectionId = action.payload;

      state.collections = state.collections.filter((c) => c.id !== collectionId);
      state.mySubmissions = state.mySubmissions.filter((c) => c.id !== collectionId);
      state.pendingVerifications = state.pendingVerifications.filter((c) => c.id !== collectionId);

      // Remove from baby collections
      Object.keys(state.babyCollections).forEach((babyId) => {
        state.babyCollections[babyId] = state.babyCollections[babyId].filter((c) => c.id !== collectionId);
      });

      if (state.currentCollection?.id === collectionId) {
        state.currentCollection = null;
      }
    },
    clearBabyData: (state, action: PayloadAction<string>) => {
      const babyId = action.payload;
      delete state.babyCollections[babyId];
      delete state.babyStatistics[babyId];
      delete state.babyProgress[babyId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create badge collection
      .addCase(createBadgeCollection.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createBadgeCollection.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.collections.unshift(action.payload);
        state.mySubmissions.unshift(action.payload);

        // Add to baby collections
        if (action.payload.babyId) {
          if (!state.babyCollections[action.payload.babyId]) {
            state.babyCollections[action.payload.babyId] = [];
          }
          state.babyCollections[action.payload.babyId].unshift(action.payload);
        }

        // Add to pending if needed
        if (action.payload.verificationStatus === VerificationStatus.PENDING) {
          state.pendingVerifications.unshift(action.payload);
        }

        state.currentCollection = action.payload;
        state.error = null;
      })
      .addCase(createBadgeCollection.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Fetch badge collections
      .addCase(fetchBadgeCollections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBadgeCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.collections = action.payload.data;
        state.pagination = {
          page: action.payload.params?.page || 1,
          limit: action.payload.params?.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchBadgeCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load more badge collections
      .addCase(loadMoreBadgeCollections.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreBadgeCollections.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.collections = [...state.collections, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(loadMoreBadgeCollections.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch badge collection by ID
      .addCase(fetchBadgeCollectionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBadgeCollectionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCollection = action.payload;
        state.error = null;
      })
      .addCase(fetchBadgeCollectionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update badge collection
      .addCase(updateBadgeCollection.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateBadgeCollection.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const updateList = (list: BadgeCollection[]) => {
          const index = list.findIndex((c) => c.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };

        updateList(state.collections);
        updateList(state.mySubmissions);

        if (state.currentCollection?.id === action.payload.id) {
          state.currentCollection = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBadgeCollection.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Delete badge collection
      .addCase(deleteBadgeCollection.fulfilled, (state, action) => {
        const collectionId = action.payload;

        state.collections = state.collections.filter((c) => c.id !== collectionId);
        state.mySubmissions = state.mySubmissions.filter((c) => c.id !== collectionId);
        state.pendingVerifications = state.pendingVerifications.filter((c) => c.id !== collectionId);

        if (state.currentCollection?.id === collectionId) {
          state.currentCollection = null;
        }
        state.error = null;
      })

      // Fetch baby badges
      .addCase(fetchBabyBadges.fulfilled, (state, action) => {
        state.babyCollections[action.payload.babyId] = action.payload.badges;
        state.error = null;
      })

      // Fetch baby stats
      .addCase(fetchBabyStats.fulfilled, (state, action) => {
        state.babyStatistics[action.payload.babyId] = action.payload.stats;
        state.error = null;
      })

      // Fetch baby progress
      .addCase(fetchBabyProgress.fulfilled, (state, action) => {
        state.babyProgress[action.payload.babyId] = action.payload.progress;
        state.error = null;
      })

      // Fetch pending verifications
      .addCase(fetchPendingVerifications.fulfilled, (state, action) => {
        state.pendingVerifications = action.payload.data;
        state.error = null;
      })

      // Fetch my submissions
      .addCase(fetchMySubmissions.fulfilled, (state, action) => {
        state.mySubmissions = action.payload.data;
        state.error = null;
      })

      // Verify badge collection (approve/reject)
      .addCase(verifyBadgeCollection.fulfilled, (state, action) => {
        const updateList = (list: BadgeCollection[]) => {
          const index = list.findIndex((c) => c.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };

        updateList(state.collections);

        // Remove from pending
        state.pendingVerifications = state.pendingVerifications.filter((c) => c.id !== action.payload.id);

        if (state.currentCollection?.id === action.payload.id) {
          state.currentCollection = action.payload;
        }
        state.error = null;
      })

      // Approve badge collection
      .addCase(approveBadgeCollection.fulfilled, (state, action) => {
        const updateList = (list: BadgeCollection[]) => {
          const index = list.findIndex((c) => c.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };

        updateList(state.collections);

        // Remove from pending
        state.pendingVerifications = state.pendingVerifications.filter((c) => c.id !== action.payload.id);

        if (state.currentCollection?.id === action.payload.id) {
          state.currentCollection = action.payload;
        }
        state.error = null;
      })

      // Reject badge collection
      .addCase(rejectBadgeCollection.fulfilled, (state, action) => {
        const updateList = (list: BadgeCollection[]) => {
          const index = list.findIndex((c) => c.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };

        updateList(state.collections);

        // Remove from pending
        state.pendingVerifications = state.pendingVerifications.filter((c) => c.id !== action.payload.id);

        if (state.currentCollection?.id === action.payload.id) {
          state.currentCollection = action.payload;
        }
        state.error = null;
      })

      // Upload media
      .addCase(uploadBadgeMedia.fulfilled, (state, action) => {
        const { collectionId, urls } = action.payload;

        const updateCollection = (collection: BadgeCollection) => {
          if (collection.id === collectionId) {
            collection.submissionMedia = urls;
          }
        };

        state.collections.forEach(updateCollection);
        state.mySubmissions.forEach(updateCollection);

        if (state.currentCollection?.id === collectionId) {
          state.currentCollection.submissionMedia = urls;
        }
        state.error = null;
      });
  },
});

export const {
  clearError,
  setCurrentCollection,
  clearCurrentCollection,
  updateFilters,
  resetFilters,
  clearCollections,
  setSelectedBabyId,
  setActiveTab,
  updateCollectionInList,
  removeCollectionFromLists,
  clearBabyData,
} = badgeCollectionSlice.actions;

export default badgeCollectionSlice.reducer;
