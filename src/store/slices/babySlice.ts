// src/store/slices/babySlice.ts

import { BabyScreenTab, FamilyRelationTypeEnum } from '@/models/Baby/BabyEnum';
import { Baby, BabyState, FamilyMember } from '@/models/Baby/BabyModel';
import {
    AddFamilyMemberRequest,
    CreateBabyRequest,
    GetBabiesRequest,
    InviteFamilyMemberRequest,
    SearchBabiesRequest,
    UpdateBabyRequest,
    UpdateFamilyMemberRequest,
} from '@/models/Baby/BabyRequest';
import { BabyService } from '@/services/baby/babyService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BabyState = {
  babies: [],
  currentBaby: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  familyMembers: [],
  isLoadingFamilyMembers: false,
  familyMemberError: null,
  selectedBabyId: null,
  activeTab: 'profile',
};

// ==================== ASYNC THUNKS ====================

// Baby CRUD operations
export const createBaby = createAsyncThunk(
  'babies/create',
  async (
    {
      babyData,
      creatorRelationType,
    }: {
      babyData: CreateBabyRequest;
      creatorRelationType?: FamilyRelationTypeEnum;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await BabyService.createBaby(babyData, creatorRelationType);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create baby');
    }
  },
);

export const fetchBabies = createAsyncThunk(
  'babies/fetchBabies',
  async (params: GetBabiesRequest = {}, { rejectWithValue }) => {
    try {
      const response = await BabyService.getBabies(params);
      return { ...response, params };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch babies');
    }
  },
);

export const fetchBabyById = createAsyncThunk('babies/fetchBabyById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await BabyService.getBabyById(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch baby');
  }
});

export const updateBaby = createAsyncThunk(
  'babies/update',
  async ({ id, babyData }: { id: string; babyData: UpdateBabyRequest }, { rejectWithValue }) => {
    try {
      const response = await BabyService.updateBaby(id, babyData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update baby');
    }
  },
);

export const deleteBaby = createAsyncThunk('babies/delete', async (id: string, { rejectWithValue }) => {
  try {
    await BabyService.deleteBaby(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete baby');
  }
});

// Family member operations
export const fetchFamilyMembers = createAsyncThunk(
  'babies/fetchFamilyMembers',
  async (babyId: string, { rejectWithValue }) => {
    try {
      const response = await BabyService.getFamilyMembers(babyId);
      return { babyId, familyMembers: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch family members');
    }
  },
);

export const addFamilyMember = createAsyncThunk(
  'babies/addFamilyMember',
  async ({ babyId, memberData }: { babyId: string; memberData: AddFamilyMemberRequest }, { rejectWithValue }) => {
    try {
      const response = await BabyService.addFamilyMember(babyId, memberData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add family member');
    }
  },
);

export const updateFamilyMember = createAsyncThunk(
  'babies/updateFamilyMember',
  async (
    {
      babyId,
      userId,
      memberData,
    }: {
      babyId: string;
      userId: string;
      memberData: UpdateFamilyMemberRequest;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await BabyService.updateFamilyMember(babyId, userId, memberData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update family member');
    }
  },
);

export const removeFamilyMember = createAsyncThunk(
  'babies/removeFamilyMember',
  async ({ babyId, userId }: { babyId: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await BabyService.removeFamilyMember(babyId, userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove family member');
    }
  },
);

export const inviteFamilyMember = createAsyncThunk(
  'babies/inviteFamilyMember',
  async (
    {
      babyId,
      invitationData,
    }: {
      babyId: string;
      invitationData: InviteFamilyMemberRequest;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await BabyService.inviteFamilyMember(babyId, invitationData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send invitation');
    }
  },
);

export const fetchPrimaryCaregivers = createAsyncThunk(
  'babies/fetchPrimaryCaregivers',
  async (babyId: string, { rejectWithValue }) => {
    try {
      const response = await BabyService.getPrimaryCaregivers(babyId);
      return { babyId, caregivers: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch primary caregivers');
    }
  },
);

// Media operations
export const uploadBabyAvatar = createAsyncThunk(
  'babies/uploadAvatar',
  async ({ babyId, file }: { babyId: string; file: File | FormData }, { rejectWithValue }) => {
    try {
      const response = await BabyService.uploadAvatar(babyId, file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  },
);

// Advanced queries
export const fetchBabiesByRelation = createAsyncThunk(
  'babies/fetchBabiesByRelation',
  async (
    {
      relationType,
      params = {},
    }: {
      relationType: FamilyRelationTypeEnum;
      params?: Partial<GetBabiesRequest>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await BabyService.getBabiesByRelation(relationType, params);
      return { relationType, ...response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch babies by relation');
    }
  },
);

export const fetchBabyStatistics = createAsyncThunk('babies/fetchStatistics', async (_, { rejectWithValue }) => {
  try {
    const response = await BabyService.getBabyStatistics();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch statistics');
  }
});

export const searchBabies = createAsyncThunk(
  'babies/search',
  async (searchParams: SearchBabiesRequest, { rejectWithValue }) => {
    try {
      const response = await BabyService.searchBabies(searchParams);
      return { ...response, searchParams };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search babies');
    }
  },
);

// ==================== SLICE ====================

const babySlice = createSlice({
  name: 'babies',
  initialState,
  reducers: {
    // UI state management
    setSelectedBaby: (state, action: PayloadAction<string | null>) => {
      state.selectedBabyId = action.payload;
      if (action.payload) {
        state.currentBaby = state.babies.find((baby) => baby.id === action.payload) || null;
      } else {
        state.currentBaby = null;
      }
    },

    setActiveTab: (state, action: PayloadAction<BabyScreenTab>) => {
      state.activeTab = action.payload;
    },

    clearCurrentBaby: (state) => {
      state.currentBaby = null;
      state.selectedBabyId = null;
    },

    clearError: (state) => {
      state.error = null;
      state.familyMemberError = null;
    },

    clearBabies: (state) => {
      state.babies = [];
      state.currentBaby = null;
      state.selectedBabyId = null;
    },

    // Update baby in list
    updateBabyInList: (state, action: PayloadAction<Baby>) => {
      const index = state.babies.findIndex((baby) => baby.id === action.payload.id);
      if (index !== -1) {
        state.babies[index] = action.payload;
      }

      if (state.currentBaby && state.currentBaby.id === action.payload.id) {
        state.currentBaby = action.payload;
      }
    },

    // Optimistic updates
    updateBabyOptimistic: (state, action: PayloadAction<{ id: string; updates: Partial<Baby> }>) => {
      const { id, updates } = action.payload;
      const baby = state.babies.find((b) => b.id === id);
      if (baby) {
        Object.assign(baby, updates);
      }
      if (state.currentBaby && state.currentBaby.id === id) {
        Object.assign(state.currentBaby, updates);
      }
    },

    // Family member management
    updateFamilyMemberInBaby: (
      state,
      action: PayloadAction<{ babyId: string; userId: string; updates: Partial<FamilyMember> }>,
    ) => {
      const { babyId, userId, updates } = action.payload;
      const baby = state.babies.find((b) => b.id === babyId);
      if (baby) {
        const memberIndex = baby.familyMembers.findIndex((m) => m.userId === userId);
        if (memberIndex !== -1) {
          Object.assign(baby.familyMembers[memberIndex], updates);
        }
      }
      if (state.currentBaby && state.currentBaby.id === babyId) {
        const memberIndex = state.currentBaby.familyMembers.findIndex((m) => m.userId === userId);
        if (memberIndex !== -1) {
          Object.assign(state.currentBaby.familyMembers[memberIndex], updates);
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Create baby
      .addCase(createBaby.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBaby.fulfilled, (state, action) => {
        state.isLoading = false;
        state.babies.unshift(action.payload);
        state.currentBaby = action.payload;
        state.selectedBabyId = action.payload.id;
        state.error = null;
      })
      .addCase(createBaby.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch babies
      .addCase(fetchBabies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBabies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.babies = action.payload.data;
        state.error = null;
      })
      .addCase(fetchBabies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch baby by ID
      .addCase(fetchBabyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBabyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBaby = action.payload;
        state.selectedBabyId = action.payload.id;

        // Update in babies list if exists
        const index = state.babies.findIndex((baby) => baby.id === action.payload.id);
        if (index !== -1) {
          state.babies[index] = action.payload;
        } else {
          state.babies.push(action.payload);
        }

        state.error = null;
      })
      .addCase(fetchBabyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update baby
      .addCase(updateBaby.fulfilled, (state, action) => {
        const index = state.babies.findIndex((baby) => baby.id === action.payload.id);
        if (index !== -1) {
          state.babies[index] = action.payload;
        }
        if (state.currentBaby && state.currentBaby.id === action.payload.id) {
          state.currentBaby = action.payload;
        }
      })

      // Delete baby
      .addCase(deleteBaby.fulfilled, (state, action) => {
        state.babies = state.babies.filter((baby) => baby.id !== action.payload);
        if (state.currentBaby && state.currentBaby.id === action.payload) {
          state.currentBaby = null;
          state.selectedBabyId = null;
        }
      })

      // Family members
      .addCase(fetchFamilyMembers.pending, (state) => {
        state.isLoadingFamilyMembers = true;
        state.familyMemberError = null;
      })
      .addCase(fetchFamilyMembers.fulfilled, (state, action) => {
        state.isLoadingFamilyMembers = false;
        state.familyMembers = action.payload.familyMembers;

        // Update family members in baby object
        const baby = state.babies.find((b) => b.id === action.payload.babyId);
        if (baby) {
          baby.familyMembers = action.payload.familyMembers;
        }
        if (state.currentBaby && state.currentBaby.id === action.payload.babyId) {
          state.currentBaby.familyMembers = action.payload.familyMembers;
        }

        state.familyMemberError = null;
      })
      .addCase(fetchFamilyMembers.rejected, (state, action) => {
        state.isLoadingFamilyMembers = false;
        state.familyMemberError = action.payload as string;
      })

      // Add family member
      .addCase(addFamilyMember.fulfilled, (state, action) => {
        const updatedBaby = action.payload;
        const index = state.babies.findIndex((baby) => baby.id === updatedBaby.id);
        if (index !== -1) {
          state.babies[index] = updatedBaby;
        }
        if (state.currentBaby && state.currentBaby.id === updatedBaby.id) {
          state.currentBaby = updatedBaby;
          state.familyMembers = updatedBaby.familyMembers;
        }
      })

      // Update family member
      .addCase(updateFamilyMember.fulfilled, (state, action) => {
        const updatedBaby = action.payload;
        const index = state.babies.findIndex((baby) => baby.id === updatedBaby.id);
        if (index !== -1) {
          state.babies[index] = updatedBaby;
        }
        if (state.currentBaby && state.currentBaby.id === updatedBaby.id) {
          state.currentBaby = updatedBaby;
          state.familyMembers = updatedBaby.familyMembers;
        }
      })

      // Remove family member
      .addCase(removeFamilyMember.fulfilled, (state, action) => {
        const updatedBaby = action.payload;
        const index = state.babies.findIndex((baby) => baby.id === updatedBaby.id);
        if (index !== -1) {
          state.babies[index] = updatedBaby;
        }
        if (state.currentBaby && state.currentBaby.id === updatedBaby.id) {
          state.currentBaby = updatedBaby;
          state.familyMembers = updatedBaby.familyMembers;
        }
      })

      // Upload avatar
      .addCase(uploadBabyAvatar.fulfilled, (state, action) => {
        const updatedBaby = action.payload;
        const index = state.babies.findIndex((baby) => baby.id === updatedBaby.id);
        if (index !== -1) {
          state.babies[index] = updatedBaby;
        }
        if (state.currentBaby && state.currentBaby.id === updatedBaby.id) {
          state.currentBaby = updatedBaby;
        }
      })

      // Search babies
      .addCase(searchBabies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.babies = action.payload.data;
        state.error = null;
      })

      // Babies by relation
      .addCase(fetchBabiesByRelation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.babies = action.payload.data;
        state.error = null;
      });
  },
});

export const {
  setSelectedBaby,
  setActiveTab,
  clearCurrentBaby,
  clearError,
  clearBabies,
  updateBabyInList,
  updateBabyOptimistic,
  updateFamilyMemberInBaby,
} = babySlice.actions;

export default babySlice.reducer;
