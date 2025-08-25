// src/store/slices/badgeSlice.ts

import { BadgeCategory, BadgeSortBy, SortOrder } from '@/models/Badge/BadgeEnum';
import { Badge, BadgeFilters, BadgeState } from '@/models/Badge/BadgeModel';
import { CreateBadgeRequest, GetBadgesRequest, UpdateBadgeRequest } from '@/models/Badge/BadgeRequest';
import { BadgeService } from '@/services/badge/badgeService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BadgeState = {
  badges: [],
  currentBadge: null,
  myCustomBadges: [],
  categoryBadges: {} as Record<BadgeCategory, Badge[]>,
  suitableForAgeBadges: [],
  recommendedBadges: [],
  statistics: null,
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
    sortBy: BadgeSortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
    isActive: true,
  },
  cache: {},
};

// Async thunks
export const fetchBadges = createAsyncThunk(
  'badges/fetchBadges',
  async (params: GetBadgesRequest = {}, { rejectWithValue }) => {
    try {
      const response = await BadgeService.getBadges(params);
      return { ...response, params };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch badges');
    }
  },
);

export const loadMoreBadges = createAsyncThunk(
  'badges/loadMoreBadges',
  async (params: GetBadgesRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.badges.pagination.page;
      const nextPage = currentPage + 1;

      const response = await BadgeService.getBadges({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more badges');
    }
  },
);

export const fetchBadgeById = createAsyncThunk('badges/fetchBadgeById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await BadgeService.getBadgeById(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch badge');
  }
});

export const createBadge = createAsyncThunk(
  'badges/createBadge',
  async (data: CreateBadgeRequest, { rejectWithValue }) => {
    try {
      const response = await BadgeService.createBadge(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create badge');
    }
  },
);

export const updateBadge = createAsyncThunk(
  'badges/updateBadge',
  async ({ id, data }: { id: string; data: UpdateBadgeRequest }, { rejectWithValue }) => {
    try {
      const response = await BadgeService.updateBadge(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update badge');
    }
  },
);

export const deleteBadge = createAsyncThunk('badges/deleteBadge', async (id: string, { rejectWithValue }) => {
  try {
    await BadgeService.deleteBadge(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete badge');
  }
});

export const fetchBadgesByCategory = createAsyncThunk(
  'badges/fetchBadgesByCategory',
  async (category: BadgeCategory, { rejectWithValue }) => {
    try {
      const response = await BadgeService.getBadgesByCategory(category);
      return { category, badges: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch badges by category');
    }
  },
);

export const fetchBadgesForAge = createAsyncThunk(
  'badges/fetchBadgesForAge',
  async (ageInMonths: number, { rejectWithValue }) => {
    try {
      const response = await BadgeService.getBadgesForAge(ageInMonths);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch badges for age');
    }
  },
);

export const fetchMyCustomBadges = createAsyncThunk('badges/fetchMyCustomBadges', async (_, { rejectWithValue }) => {
  try {
    const response = await BadgeService.getMyCustomBadges();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch custom badges');
  }
});

export const fetchBadgeStatistics = createAsyncThunk('badges/fetchBadgeStatistics', async (_, { rejectWithValue }) => {
  try {
    const response = await BadgeService.getStatistics();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch badge statistics');
  }
});

export const activateBadge = createAsyncThunk('badges/activateBadge', async (id: string, { rejectWithValue }) => {
  try {
    const response = await BadgeService.activateBadge(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to activate badge');
  }
});

export const deactivateBadge = createAsyncThunk('badges/deactivateBadge', async (id: string, { rejectWithValue }) => {
  try {
    const response = await BadgeService.deactivateBadge(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to deactivate badge');
  }
});

export const fetchBadgeRecommendations = createAsyncThunk(
  'badges/fetchBadgeRecommendations',
  async (
    { babyAgeInMonths, excludeBadgeIds = [] }: { babyAgeInMonths: number; excludeBadgeIds?: string[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await BadgeService.getRecommendations({
        babyAgeInMonths,
        excludeBadgeIds,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch badge recommendations');
    }
  },
);

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
    clearCurrentBadge: (state) => {
      state.currentBadge = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<BadgeFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        sortBy: BadgeSortBy.CREATED_AT,
        sortOrder: SortOrder.DESC,
        isActive: true,
      };
    },
    clearBadges: (state) => {
      state.badges = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
      };
    },
    updateBadgeInList: (state, action: PayloadAction<Badge>) => {
      const updateList = (list: Badge[]) => {
        const index = list.findIndex((badge) => badge.id === action.payload.id);
        if (index !== -1) {
          list[index] = action.payload;
        }
      };

      updateList(state.badges);
      updateList(state.myCustomBadges);
      updateList(state.suitableForAgeBadges);

      // Update in category badges
      Object.keys(state.categoryBadges).forEach((category) => {
        updateList(state.categoryBadges[category as BadgeCategory]);
      });

      if (state.currentBadge?.id === action.payload.id) {
        state.currentBadge = action.payload;
      }
    },
    removeBadgeFromLists: (state, action: PayloadAction<string>) => {
      const badgeId = action.payload;
      state.badges = state.badges.filter((b) => b.id !== badgeId);
      state.myCustomBadges = state.myCustomBadges.filter((b) => b.id !== badgeId);
      state.suitableForAgeBadges = state.suitableForAgeBadges.filter((b) => b.id !== badgeId);

      // Remove from category badges
      Object.keys(state.categoryBadges).forEach((category) => {
        state.categoryBadges[category as BadgeCategory] = state.categoryBadges[category as BadgeCategory].filter(
          (b) => b.id !== badgeId,
        );
      });

      if (state.currentBadge?.id === badgeId) {
        state.currentBadge = null;
      }
    },
    addToCache: (state, action: PayloadAction<{ key: string; data: Badge[]; expiresIn?: number }>) => {
      const { key, data, expiresIn = 15 * 60 * 1000 } = action.payload;
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
      // Fetch badges
      .addCase(fetchBadges.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.isLoading = false;
        state.badges = action.payload.data;
        state.pagination = {
          page: action.payload.params?.page || 1,
          limit: action.payload.params?.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load more badges
      .addCase(loadMoreBadges.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreBadges.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.badges = [...state.badges, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(loadMoreBadges.rejected, (state, action) => {
        state.isLoadingMore = false;
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
      })

      // Create badge
      .addCase(createBadge.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createBadge.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.badges.unshift(action.payload);
        if (action.payload.isCustom) {
          state.myCustomBadges.unshift(action.payload);
        }
        state.currentBadge = action.payload;
        state.error = null;
      })
      .addCase(createBadge.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Update badge
      .addCase(updateBadge.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateBadge.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const updateList = (list: Badge[]) => {
          const index = list.findIndex((b) => b.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };

        updateList(state.badges);
        updateList(state.myCustomBadges);

        if (state.currentBadge?.id === action.payload.id) {
          state.currentBadge = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBadge.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Delete badge
      .addCase(deleteBadge.fulfilled, (state, action) => {
        const badgeId = action.payload;
        state.badges = state.badges.filter((b) => b.id !== badgeId);
        state.myCustomBadges = state.myCustomBadges.filter((b) => b.id !== badgeId);

        if (state.currentBadge?.id === badgeId) {
          state.currentBadge = null;
        }
        state.error = null;
      })

      // Fetch badges by category
      .addCase(fetchBadgesByCategory.fulfilled, (state, action) => {
        state.categoryBadges[action.payload.category] = action.payload.badges;
        state.error = null;
      })

      // Fetch badges for age
      .addCase(fetchBadgesForAge.fulfilled, (state, action) => {
        state.suitableForAgeBadges = action.payload;
        state.error = null;
      })

      // Fetch custom badges
      .addCase(fetchMyCustomBadges.fulfilled, (state, action) => {
        state.myCustomBadges = action.payload;
        state.error = null;
      })

      // Fetch statistics
      .addCase(fetchBadgeStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
        state.error = null;
      })

      // Activate/Deactivate badge
      .addCase(activateBadge.fulfilled, (state, action) => {
        const updateList = (list: Badge[]) => {
          const index = list.findIndex((b) => b.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };

        updateList(state.badges);
        if (state.currentBadge?.id === action.payload.id) {
          state.currentBadge = action.payload;
        }
        state.error = null;
      })
      .addCase(deactivateBadge.fulfilled, (state, action) => {
        const updateList = (list: Badge[]) => {
          const index = list.findIndex((b) => b.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };

        updateList(state.badges);
        if (state.currentBadge?.id === action.payload.id) {
          state.currentBadge = action.payload;
        }
        state.error = null;
      })

      // Fetch recommendations
      .addCase(fetchBadgeRecommendations.fulfilled, (state, action) => {
        state.recommendedBadges = action.payload;
        state.error = null;
      });
  },
});

export const {
  clearError,
  setCurrentBadge,
  clearCurrentBadge,
  updateFilters,
  resetFilters,
  clearBadges,
  updateBadgeInList,
  removeBadgeFromLists,
  addToCache,
  clearCache,
  removeExpiredCache,
} = badgeSlice.actions;

export default badgeSlice.reducer;
