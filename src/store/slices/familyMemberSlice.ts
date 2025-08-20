// src/store/slices/familyMemberSlice.ts

import { BabyPermissionEnum, FamilyRelationTypeEnum } from '@/models/Baby/BabyEnum';
import { FamilyMember } from '@/models/Baby/BabyModel';
import { BabyService } from '@/services/baby/babyService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FamilyMemberState {
  // Current family members being managed
  members: FamilyMember[];
  currentMember: FamilyMember | null;

  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  isInviting: boolean;

  // Error states
  error: string | null;
  invitationError: string | null;

  // UI state
  selectedMemberId: string | null;
  isManagingPermissions: boolean;

  // Invitation tracking
  pendingInvitations: Array<{
    invitationId: string;
    email: string;
    relationType: FamilyRelationTypeEnum;
    babyId: string;
    sentAt: Date;
  }>;

  // Permission management
  permissionMatrix: Record<
    string,
    {
      memberId: string;
      permissions: BabyPermissionEnum[];
      canEdit: boolean;
      canRemove: boolean;
    }
  >;
}

const initialState: FamilyMemberState = {
  members: [],
  currentMember: null,
  isLoading: false,
  isUpdating: false,
  isInviting: false,
  error: null,
  invitationError: null,
  selectedMemberId: null,
  isManagingPermissions: false,
  pendingInvitations: [],
  permissionMatrix: {},
};

// ==================== ASYNC THUNKS ====================

export const fetchMemberDetails = createAsyncThunk(
  'familyMembers/fetchDetails',
  async ({ babyId, userId }: { babyId: string; userId: string }, { rejectWithValue }) => {
    try {
      const familyMembers = await BabyService.getFamilyMembers(babyId);
      const member = familyMembers.find((m) => m.userId === userId);

      if (!member) {
        throw new Error('Family member not found');
      }

      return member;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch member details');
    }
  },
);

export const updateMemberPermissions = createAsyncThunk(
  'familyMembers/updatePermissions',
  async (
    {
      babyId,
      userId,
      permissions,
    }: {
      babyId: string;
      userId: string;
      permissions: BabyPermissionEnum[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await BabyService.updateFamilyMember(babyId, userId, { permissions });
      return { babyId, userId, permissions, updatedBaby: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update permissions');
    }
  },
);

export const updateMemberRole = createAsyncThunk(
  'familyMembers/updateRole',
  async (
    {
      babyId,
      userId,
      relationType,
      isPrimary,
    }: {
      babyId: string;
      userId: string;
      relationType: FamilyRelationTypeEnum;
      isPrimary?: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await BabyService.updateFamilyMember(babyId, userId, {
        relationType,
        isPrimary,
      });
      return { babyId, userId, relationType, isPrimary, updatedBaby: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update member role');
    }
  },
);

export const bulkUpdatePermissions = createAsyncThunk(
  'familyMembers/bulkUpdatePermissions',
  async (
    {
      babyId,
      updates,
    }: {
      babyId: string;
      updates: Array<{ userId: string; permissions: BabyPermissionEnum[] }>;
    },
    { rejectWithValue },
  ) => {
    try {
      const results = await Promise.allSettled(
        updates.map((update) =>
          BabyService.updateFamilyMember(babyId, update.userId, {
            permissions: update.permissions,
          }),
        ),
      );

      const successful: string[] = [];
      const failed: Array<{ userId: string; error: string }> = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successful.push(updates[index].userId);
        } else {
          failed.push({
            userId: updates[index].userId,
            error: result.reason?.message || 'Update failed',
          });
        }
      });

      return { successful, failed, babyId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update permissions');
    }
  },
);

export const validateInvitation = createAsyncThunk(
  'familyMembers/validateInvitation',
  async ({ email, babyId }: { email: string; babyId: string }, { rejectWithValue }) => {
    try {
      // Check if email is already a family member
      const familyMembers = await BabyService.getFamilyMembers(babyId);
      const existingMember = familyMembers.find((member) => member.user?.email === email);

      if (existingMember) {
        throw new Error('This person is already a family member');
      }

      return { email, isValid: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to validate invitation');
    }
  },
);

export const trackInvitationStatus = createAsyncThunk(
  'familyMembers/trackInvitation',
  async (invitationId: string, { rejectWithValue }) => {
    try {
      // This would typically call an API to check invitation status
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const status = Math.random() > 0.5 ? 'pending' : 'accepted';
      return { invitationId, status };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to track invitation');
    }
  },
);

// ==================== SLICE ====================

const familyMemberSlice = createSlice({
  name: 'familyMembers',
  initialState,
  reducers: {
    // UI state management
    setSelectedMember: (state, action: PayloadAction<string | null>) => {
      state.selectedMemberId = action.payload;
      if (action.payload) {
        state.currentMember = state.members.find((member) => member.userId === action.payload) || null;
      } else {
        state.currentMember = null;
      }
    },

    setManagingPermissions: (state, action: PayloadAction<boolean>) => {
      state.isManagingPermissions = action.payload;
    },

    clearError: (state) => {
      state.error = null;
      state.invitationError = null;
    },

    clearMembers: (state) => {
      state.members = [];
      state.currentMember = null;
      state.selectedMemberId = null;
      state.permissionMatrix = {};
    },

    // Family member data management
    setMembers: (state, action: PayloadAction<FamilyMember[]>) => {
      state.members = action.payload;
      state.permissionMatrix = {};

      // Build permission matrix
      action.payload.forEach((member) => {
        state.permissionMatrix[member.userId] = {
          memberId: member.userId,
          permissions: member.permissions,
          canEdit: !member.isPrimary, // Primary members might have restrictions
          canRemove: !member.isPrimary, // Can't remove primary caregivers
        };
      });
    },

    updateMemberInList: (state, action: PayloadAction<FamilyMember>) => {
      const index = state.members.findIndex((member) => member.userId === action.payload.userId);
      if (index !== -1) {
        state.members[index] = action.payload;
      }

      if (state.currentMember && state.currentMember.userId === action.payload.userId) {
        state.currentMember = action.payload;
      }

      // Update permission matrix
      if (state.permissionMatrix[action.payload.userId]) {
        state.permissionMatrix[action.payload.userId].permissions = action.payload.permissions;
      }
    },

    removeMemberFromList: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.members = state.members.filter((member) => member.userId !== userId);

      if (state.currentMember && state.currentMember.userId === userId) {
        state.currentMember = null;
        state.selectedMemberId = null;
      }

      delete state.permissionMatrix[userId];
    },

    // Invitation management
    addPendingInvitation: (
      state,
      action: PayloadAction<{
        invitationId: string;
        email: string;
        relationType: FamilyRelationTypeEnum;
        babyId: string;
      }>,
    ) => {
      state.pendingInvitations.push({
        ...action.payload,
        sentAt: new Date(),
      });
    },

    removePendingInvitation: (state, action: PayloadAction<string>) => {
      state.pendingInvitations = state.pendingInvitations.filter(
        (invitation) => invitation.invitationId !== action.payload,
      );
    },

    // Permission matrix management
    updatePermissionMatrix: (
      state,
      action: PayloadAction<{
        userId: string;
        permissions: BabyPermissionEnum[];
      }>,
    ) => {
      const { userId, permissions } = action.payload;
      if (state.permissionMatrix[userId]) {
        state.permissionMatrix[userId].permissions = permissions;
      }
    },

    // Optimistic updates
    optimisticPermissionUpdate: (
      state,
      action: PayloadAction<{
        userId: string;
        permissions: BabyPermissionEnum[];
      }>,
    ) => {
      const { userId, permissions } = action.payload;

      // Update in members list
      const member = state.members.find((m) => m.userId === userId);
      if (member) {
        member.permissions = permissions;
      }

      // Update current member
      if (state.currentMember && state.currentMember.userId === userId) {
        state.currentMember.permissions = permissions;
      }

      // Update permission matrix
      if (state.permissionMatrix[userId]) {
        state.permissionMatrix[userId].permissions = permissions;
      }
    },

    optimisticRoleUpdate: (
      state,
      action: PayloadAction<{
        userId: string;
        relationType: FamilyRelationTypeEnum;
        isPrimary?: boolean;
      }>,
    ) => {
      const { userId, relationType, isPrimary } = action.payload;

      // Update in members list
      const member = state.members.find((m) => m.userId === userId);
      if (member) {
        member.relationType = relationType;
        if (isPrimary !== undefined) {
          member.isPrimary = isPrimary;
        }
      }

      // Update current member
      if (state.currentMember && state.currentMember.userId === userId) {
        state.currentMember.relationType = relationType;
        if (isPrimary !== undefined) {
          state.currentMember.isPrimary = isPrimary;
        }
      }

      // Update permission matrix
      if (state.permissionMatrix[userId] && isPrimary !== undefined) {
        state.permissionMatrix[userId].canEdit = !isPrimary;
        state.permissionMatrix[userId].canRemove = !isPrimary;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch member details
      .addCase(fetchMemberDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMemberDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMember = action.payload;
        state.selectedMemberId = action.payload.userId;
        state.error = null;
      })
      .addCase(fetchMemberDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update permissions
      .addCase(updateMemberPermissions.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateMemberPermissions.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { userId, permissions } = action.payload;

        // Update member in list
        const member = state.members.find((m) => m.userId === userId);
        if (member) {
          member.permissions = permissions;
        }

        // Update current member
        if (state.currentMember && state.currentMember.userId === userId) {
          state.currentMember.permissions = permissions;
        }

        // Update permission matrix
        if (state.permissionMatrix[userId]) {
          state.permissionMatrix[userId].permissions = permissions;
        }

        state.error = null;
      })
      .addCase(updateMemberPermissions.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Update role
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        const { userId, relationType, isPrimary } = action.payload;

        // Update member in list
        const member = state.members.find((m) => m.userId === userId);
        if (member) {
          member.relationType = relationType;
          if (isPrimary !== undefined) {
            member.isPrimary = isPrimary;
          }
        }

        // Update current member
        if (state.currentMember && state.currentMember.userId === userId) {
          state.currentMember.relationType = relationType;
          if (isPrimary !== undefined) {
            state.currentMember.isPrimary = isPrimary;
          }
        }
      })

      // Bulk update permissions
      .addCase(bulkUpdatePermissions.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(bulkUpdatePermissions.fulfilled, (state, action) => {
        state.isUpdating = false;
        const { successful, failed } = action.payload;

        if (failed.length > 0) {
          state.error = `Failed to update ${failed.length} members: ${failed.map((f) => f.error).join(', ')}`;
        } else {
          state.error = null;
        }
      })
      .addCase(bulkUpdatePermissions.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Validate invitation
      .addCase(validateInvitation.pending, (state) => {
        state.isInviting = true;
        state.invitationError = null;
      })
      .addCase(validateInvitation.fulfilled, (state) => {
        state.isInviting = false;
        state.invitationError = null;
      })
      .addCase(validateInvitation.rejected, (state, action) => {
        state.isInviting = false;
        state.invitationError = action.payload as string;
      })

      // Track invitation
      .addCase(trackInvitationStatus.fulfilled, (state, action) => {
        const { invitationId, status } = action.payload;

        if (status === 'accepted') {
          // Remove from pending invitations
          state.pendingInvitations = state.pendingInvitations.filter(
            (invitation) => invitation.invitationId !== invitationId,
          );
        }
      });
  },
});

export const {
  setSelectedMember,
  setManagingPermissions,
  clearError,
  clearMembers,
  setMembers,
  updateMemberInList,
  removeMemberFromList,
  addPendingInvitation,
  removePendingInvitation,
  updatePermissionMatrix,
  optimisticPermissionUpdate,
  optimisticRoleUpdate,
} = familyMemberSlice.actions;

export default familyMemberSlice.reducer;
