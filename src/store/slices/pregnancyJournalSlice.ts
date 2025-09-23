// src/store/slices/pregnancyJournalSlice.ts

import { PregnancyJournalStatus, SortBy, SortOrder } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import {
  PregnancyJournal,
  PregnancyJournalFilters,
  PregnancyJournalState,
} from '@/models/PregnancyJournal/PregnancyJournalModel';
import {
  AddEmotionEntryRequest,
  CreatePregnancyJournalRequest,
  GetPregnancyJournalsRequest,
  ShareJournalRequest,
  UpdatePregnancyJournalRequest,
} from '@/models/PregnancyJournal/PregnancyJournalRequest';
import { PregnancyJournalService } from '@/services/pregnancyJournal/pregnancyJournalService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState: PregnancyJournalState = {
  journals: [],
  currentJournal: null,
  myJournals: [],
  sharedWithMe: [],
  publicJournals: [],
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
    status: PregnancyJournalStatus.ACTIVE,
    sortBy: SortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
  },
};

// Async thunks
export const fetchJournals = createAsyncThunk(
  'pregnancyJournals/fetchJournals',
  async (params: GetPregnancyJournalsRequest = {}, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.getJournals(params);
      return { ...response, params };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch journals');
    }
  },
);

export const loadMoreJournals = createAsyncThunk(
  'pregnancyJournals/loadMoreJournals',
  async (params: GetPregnancyJournalsRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.pregnancyJournals.pagination.page;
      const nextPage = currentPage + 1;

      const response = await PregnancyJournalService.getJournals({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more journals');
    }
  },
);

export const fetchJournalById = createAsyncThunk(
  'pregnancyJournals/fetchJournalById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.getJournalById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch journal');
    }
  },
);

export const fetchMyJournals = createAsyncThunk('pregnancyJournals/fetchMyJournals', async (_, { rejectWithValue }) => {
  try {
    const response = await PregnancyJournalService.getMyJournals();

    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch my journals');
  }
});

export const fetchSharedWithMe = createAsyncThunk(
  'pregnancyJournals/fetchSharedWithMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.getSharedWithMe();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch shared journals');
    }
  },
);

export const fetchPublicJournals = createAsyncThunk(
  'pregnancyJournals/fetchPublicJournals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.getPublicJournals();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch public journals');
    }
  },
);

export const createJournal = createAsyncThunk(
  'pregnancyJournals/createJournal',
  async (data: CreatePregnancyJournalRequest, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.createJournal(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create journal');
    }
  },
);

export const updateJournal = createAsyncThunk(
  'pregnancyJournals/updateJournal',
  async ({ id, data }: { id: string; data: UpdatePregnancyJournalRequest }, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.updateJournal(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update journal');
    }
  },
);

export const deleteJournal = createAsyncThunk(
  'pregnancyJournals/deleteJournal',
  async (id: string, { rejectWithValue }) => {
    try {
      await PregnancyJournalService.deleteJournal(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete journal');
    }
  },
);

export const addEmotionEntry = createAsyncThunk(
  'pregnancyJournals/addEmotionEntry',
  async ({ journalId, data }: { journalId: string; data: AddEmotionEntryRequest }, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.addEmotionEntry(journalId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add emotion entry');
    }
  },
);

export const shareJournal = createAsyncThunk(
  'pregnancyJournals/shareJournal',
  async ({ journalId, data }: { journalId: string; data: ShareJournalRequest }, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.shareJournal(journalId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to share journal');
    }
  },
);

export const updateCurrentWeek = createAsyncThunk(
  'pregnancyJournals/updateCurrentWeek',
  async (journalId: string, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.updateCurrentWeek(journalId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update current week');
    }
  },
);

export const fetchStatistics = createAsyncThunk('pregnancyJournals/fetchStatistics', async (_, { rejectWithValue }) => {
  try {
    const response = await PregnancyJournalService.getStatistics();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch statistics');
  }
});

export const fetchCareRecommendations = createAsyncThunk(
  'pregnancyJournals/fetchCareRecommendations',
  async (journalId: string, { rejectWithValue }) => {
    try {
      const response = await PregnancyJournalService.getCareRecommendations(journalId);
      return { journalId, recommendations: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch care recommendations');
    }
  },
);

const pregnancyJournalSlice = createSlice({
  name: 'pregnancyJournals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentJournal: (state, action: PayloadAction<PregnancyJournal | null>) => {
      state.currentJournal = action.payload;
    },
    clearCurrentJournal: (state) => {
      state.currentJournal = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<PregnancyJournalFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        status: PregnancyJournalStatus.ACTIVE,
        sortBy: SortBy.CREATED_AT,
        sortOrder: SortOrder.DESC,
      };
    },
    clearJournals: (state) => {
      state.journals = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
      };
    },
    updateJournalInList: (state, action: PayloadAction<PregnancyJournal>) => {
      const updateList = (list: PregnancyJournal[]) => {
        const index = list.findIndex((journal) => journal.id === action.payload.id);
        if (index !== -1) {
          list[index] = action.payload;
        }
      };

      updateList(state.journals);
      updateList(state.myJournals);
      updateList(state.sharedWithMe);
      updateList(state.publicJournals);

      if (state.currentJournal?.id === action.payload.id) {
        state.currentJournal = action.payload;
      }
    },
    removeJournalFromLists: (state, action: PayloadAction<string>) => {
      const journalId = action.payload;
      state.journals = state.journals.filter((j) => j.id !== journalId);
      state.myJournals = state.myJournals.filter((j) => j.id !== journalId);
      state.sharedWithMe = state.sharedWithMe.filter((j) => j.id !== journalId);
      state.publicJournals = state.publicJournals.filter((j) => j.id !== journalId);

      if (state.currentJournal?.id === journalId) {
        state.currentJournal = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch journals
      .addCase(fetchJournals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.journals = action.payload.data;
        state.pagination = {
          page: action.payload.params?.page || 1,
          limit: action.payload.params?.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load more journals
      .addCase(loadMoreJournals.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreJournals.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.journals = [...state.journals, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(loadMoreJournals.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch journal by ID
      .addCase(fetchJournalById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJournal = action.payload;
        state.error = null;
      })
      .addCase(fetchJournalById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch my journals
      .addCase(fetchMyJournals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyJournals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myJournals = action.payload.data;
        state.error = null;
      })
      .addCase(fetchMyJournals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch shared with me
      .addCase(fetchSharedWithMe.fulfilled, (state, action) => {
        state.sharedWithMe = action.payload.data;
        state.error = null;
      })

      // Fetch public journals
      .addCase(fetchPublicJournals.fulfilled, (state, action) => {
        state.publicJournals = action.payload.data;
        state.error = null;
      })

      // Create journal
      .addCase(createJournal.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.myJournals.unshift(action.payload);
        state.journals.unshift(action.payload);
        state.currentJournal = action.payload;
        state.error = null;
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Update journal
      .addCase(updateJournal.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateJournal.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const updateList = (list: PregnancyJournal[]) => {
          const index = list.findIndex((j) => j.id === action.payload.id);
          if (index !== -1) {
            list[index] = action.payload;
          }
        };

        updateList(state.journals);
        updateList(state.myJournals);

        if (state.currentJournal?.id === action.payload.id) {
          state.currentJournal = action.payload;
        }
        state.error = null;
      })
      .addCase(updateJournal.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Delete journal
      .addCase(deleteJournal.fulfilled, (state, action) => {
        const journalId = action.payload;
        state.journals = state.journals.filter((j) => j.id !== journalId);
        state.myJournals = state.myJournals.filter((j) => j.id !== journalId);

        if (state.currentJournal?.id === journalId) {
          state.currentJournal = null;
        }
        state.error = null;
      })

      // Add emotion entry
      .addCase(addEmotionEntry.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addEmotionEntry.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const updateList = (list: PregnancyJournal[]) => {
          const index = list.findIndex((j) => j.id === action.payload.data.id);
          if (index !== -1) {
            list[index] = action.payload.data;
          }
        };

        updateList(state.journals);
        updateList(state.myJournals);
        updateList(state.sharedWithMe);

        if (state.currentJournal?.id === action.payload.data.id) {
          state.currentJournal = action.payload.data;
        }
        state.error = null;
      })
      .addCase(addEmotionEntry.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Share journal
      .addCase(shareJournal.fulfilled, (state, action) => {
        const updateList = (list: PregnancyJournal[]) => {
          const index = list.findIndex((j) => j.id === action.payload.data.id);
          if (index !== -1) {
            list[index] = action.payload.data;
          }
        };

        updateList(state.journals);
        updateList(state.myJournals);

        if (action.payload.data.shareSettings.isPublic) {
          const exists = state.publicJournals.some((j) => j.id === action.payload.data.id);
          if (!exists) {
            state.publicJournals.push(action.payload.data);
          }
        }

        if (state.currentJournal?.id === action.payload.data.id) {
          state.currentJournal = action.payload.data;
        }
        state.error = null;
      })

      // Update current week
      .addCase(updateCurrentWeek.fulfilled, (state, action) => {
        const updateList = (list: PregnancyJournal[]) => {
          const index = list.findIndex((j) => j.id === action.payload.data.id);
          if (index !== -1) {
            list[index] = action.payload.data;
          }
        };

        updateList(state.journals);
        updateList(state.myJournals);

        if (state.currentJournal?.id === action.payload.data.id) {
          state.currentJournal = action.payload.data;
        }
        state.error = null;
      })

      // Fetch statistics
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
        state.error = null;
      });
  },
});

export const pregnancyJournalSelectors = {
  selectAllJournals: (state: RootState) => state.pregnancyJournals.journals,
  selectCurrentJournal: (state: RootState) => state.pregnancyJournals.currentJournal,
  selectMyJournals: (state: RootState) => state.pregnancyJournals.myJournals,
  selectSharedJournals: (state: RootState) => state.pregnancyJournals.sharedWithMe,
  selectPublicJournals: (state: RootState) => state.pregnancyJournals.publicJournals,
  selectJournalById: (id: string) => (state: RootState) => state.pregnancyJournals.journals.find((j) => j.id === id),
  selectJournalStatistics: (state: RootState) => state.pregnancyJournals.statistics,
  selectJournalLoadingState: (state: RootState) => ({
    isLoading: state.pregnancyJournals.isLoading,
    isLoadingMore: state.pregnancyJournals.isLoadingMore,
    isSubmitting: state.pregnancyJournals.isSubmitting,
  }),
};

export const {
  clearError,
  setCurrentJournal,
  clearCurrentJournal,
  updateFilters,
  resetFilters,
  clearJournals,
  updateJournalInList,
  removeJournalFromLists,
} = pregnancyJournalSlice.actions;

export default pregnancyJournalSlice.reducer;
