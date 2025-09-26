// src/store/slices/notificationSlice.ts

import { NotificationFilterType, NotificationSortBy, SortOrder } from '@/models/Notification/NotificationEnum';
import { Notification, NotificationFilters, NotificationState } from '@/models/Notification/NotificationModel';
import {
  ClearNotificationsRequest,
  DeleteBulkNotificationsRequest,
  GetNotificationsRequest,
  MarkAllAsReadRequest,
  UpdatePreferencesRequest,
} from '@/models/Notification/NotificationRequest';
import { NotificationService } from '@/services/notification/notificationService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: NotificationState = {
  // Data
  notifications: [],
  selectedNotification: null,
  unreadNotifications: [],
  priorityNotifications: [],

  // Statistics
  unreadCount: 0,
  statistics: null,

  // Loading states
  isLoading: false,
  isLoadingMore: false,
  isSubmitting: false,
  isRefreshing: false,

  // Pagination
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNextPage: false,
    totalPages: 0,
  },

  // Filters and sorting
  filters: {
    sortBy: NotificationSortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
    filterType: NotificationFilterType.ALL,
  },

  // UI States
  isNotificationPanelOpen: false,
  selectedNotificationIds: [],

  // Cache
  cache: {},

  // Real-time
  isSocketConnected: false,
  lastSyncTime: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: GetNotificationsRequest = {}, { rejectWithValue }) => {
    try {
      const response = await NotificationService.getNotifications(params);
      return { ...response, params };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notifications');
    }
  },
);

export const loadMoreNotifications = createAsyncThunk(
  'notifications/loadMoreNotifications',
  async (params: GetNotificationsRequest = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.notifications.pagination.page;
      const nextPage = currentPage + 1;

      const response = await NotificationService.getNotifications({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more notifications');
    }
  },
);

export const refreshNotifications = createAsyncThunk(
  'notifications/refreshNotifications',
  async (params: GetNotificationsRequest = {}, { rejectWithValue }) => {
    try {
      const response = await NotificationService.getNotifications({
        ...params,
        page: 1,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh notifications');
    }
  },
);

export const fetchNotificationById = createAsyncThunk(
  'notifications/fetchNotificationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await NotificationService.getNotificationById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch notification');
    }
  },
);

export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id: string, { rejectWithValue }) => {
  try {
    const response = await NotificationService.markAsRead(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to mark as read');
  }
});

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (params: MarkAllAsReadRequest, { rejectWithValue }) => {
    try {
      const response = await NotificationService.markAllAsRead(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to mark all as read');
    }
  },
);

export const fetchUnreadCount = createAsyncThunk('notifications/fetchUnreadCount', async (_, { rejectWithValue }) => {
  try {
    const response = await NotificationService.getUnreadCount();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch unread count');
  }
});

export const fetchNotificationStats = createAsyncThunk(
  'notifications/fetchNotificationStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await NotificationService.getStatistics();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch statistics');
    }
  },
);

export const fetchGroupedNotifications = createAsyncThunk(
  'notifications/fetchGroupedNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await NotificationService.getGroupedNotifications();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch grouped notifications');
    }
  },
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: string, { rejectWithValue }) => {
    try {
      await NotificationService.deleteNotification(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete notification');
    }
  },
);

export const deleteBulkNotifications = createAsyncThunk(
  'notifications/deleteBulkNotifications',
  async (params: DeleteBulkNotificationsRequest, { rejectWithValue }) => {
    try {
      const response = await NotificationService.deleteBulkNotifications(params);
      return { ...response, notificationIds: params.notificationIds };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete notifications');
    }
  },
);

export const clearNotifications = createAsyncThunk(
  'notifications/clearNotifications',
  async (params: ClearNotificationsRequest, { rejectWithValue }) => {
    try {
      const response = await NotificationService.clearNotifications(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear notifications');
    }
  },
);

export const fetchPreferences = createAsyncThunk('notifications/fetchPreferences', async (_, { rejectWithValue }) => {
  try {
    const response = await NotificationService.getPreferences();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch preferences');
  }
});

export const updatePreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async (params: UpdatePreferencesRequest, { rejectWithValue }) => {
    try {
      const response = await NotificationService.updatePreferences(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update preferences');
    }
  },
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedNotification: (state, action: PayloadAction<Notification | null>) => {
      state.selectedNotification = action.payload;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<NotificationFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = {
        sortBy: NotificationSortBy.CREATED_AT,
        sortOrder: SortOrder.DESC,
        filterType: NotificationFilterType.ALL,
      };
      state.pagination.page = 1;
    },
    clearNotificationsList: (state) => {
      state.notifications = [];
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        hasNextPage: false,
        totalPages: 0,
      };
    },

    updateNotificationInList: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        const wasUnread = state.notifications[index].status !== 'read';
        const isNowRead = action.payload.status === 'read';

        state.notifications[index] = action.payload;

        if (wasUnread && isNowRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
          state.unreadNotifications = state.unreadNotifications.filter((n) => n.id !== action.payload.id);
        }
      }

      if (state.selectedNotification?.id === action.payload.id) {
        state.selectedNotification = action.payload;
      }
    },
    removeNotificationFromList: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find((n) => n.id === notificationId);

      if (notification) {
        if (notification.status !== 'read') {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }

        state.notifications = state.notifications.filter((n) => n.id !== notificationId);
        state.unreadNotifications = state.unreadNotifications.filter((n) => n.id !== notificationId);
        state.priorityNotifications = state.priorityNotifications.filter((n) => n.id !== notificationId);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      }

      if (state.selectedNotification?.id === notificationId) {
        state.selectedNotification = null;
      }
    },
    toggleNotificationPanel: (state, action: PayloadAction<boolean | undefined>) => {
      state.isNotificationPanelOpen = action.payload ?? !state.isNotificationPanelOpen;
    },
    toggleNotificationSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedNotificationIds.indexOf(id);

      if (index === -1) {
        state.selectedNotificationIds.push(id);
      } else {
        state.selectedNotificationIds.splice(index, 1);
      }
    },
    selectAllNotifications: (state) => {
      state.selectedNotificationIds = state.notifications.map((n) => n.id);
    },
    clearSelectedNotifications: (state) => {
      state.selectedNotificationIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
        state.pagination = {
          page: action.payload.params?.page || 1,
          limit: action.payload.params?.limit || 20,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
          totalPages: Math.ceil(action.payload.total / (action.payload.limit || 20)),
        };
        state.unreadNotifications = action.payload.data.filter((n) => n.status !== 'read');
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
      })

      // Load more notifications
      .addCase(loadMoreNotifications.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(loadMoreNotifications.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.notifications = [...state.notifications, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
      })
      .addCase(loadMoreNotifications.rejected, (state, action) => {
        state.isLoadingMore = false;
      })

      // Refresh notifications
      .addCase(refreshNotifications.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshNotifications.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.notifications = action.payload.data;
        state.unreadCount = action.payload.unreadCount;
        state.pagination.page = 1;
        state.unreadNotifications = action.payload.data.filter((n) => n.status !== 'read');
      })
      .addCase(refreshNotifications.rejected, (state, action) => {
        state.isRefreshing = false;
      })

      // Fetch notification by ID
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.selectedNotification = action.payload;
      })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
          state.unreadNotifications = state.unreadNotifications.filter((n) => n.id !== action.payload.id);
        }

        if (state.selectedNotification?.id === action.payload.id) {
          state.selectedNotification = action.payload;
        }
      })

      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          status: 'read' as any,
          readAt: new Date().toISOString(),
        }));
        state.unreadCount = 0;
        state.unreadNotifications = [];
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })

      // Fetch stats
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.statistics = action.payload;
      })

      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find((n) => n.id === notificationId);

        if (notification && notification.status !== 'read') {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }

        state.notifications = state.notifications.filter((n) => n.id !== notificationId);
        state.unreadNotifications = state.unreadNotifications.filter((n) => n.id !== notificationId);

        if (state.selectedNotification?.id === notificationId) {
          state.selectedNotification = null;
        }
      })

      // Delete bulk notifications
      .addCase(deleteBulkNotifications.fulfilled, (state, action) => {
        const { notificationIds } = action.payload;

        // Update unread count
        const unreadDeleted = state.notifications.filter(
          (n) => notificationIds.includes(n.id) && n.status !== 'read',
        ).length;
        state.unreadCount = Math.max(0, state.unreadCount - unreadDeleted);

        // Remove from lists
        state.notifications = state.notifications.filter((n) => !notificationIds.includes(n.id));
        state.unreadNotifications = state.unreadNotifications.filter((n) => !notificationIds.includes(n.id));

        if (state.selectedNotification && notificationIds.includes(state.selectedNotification.id)) {
          state.selectedNotification = null;
        }

        state.selectedNotificationIds = [];
      })

      // Clear notifications
      .addCase(clearNotifications.fulfilled, (state, action) => {
        state.notifications = [];
        state.unreadNotifications = [];
        state.priorityNotifications = [];
        state.unreadCount = 0;
        state.selectedNotification = null;
        state.selectedNotificationIds = [];
        state.pagination = {
          page: 1,
          limit: 20,
          total: 0,
          hasNextPage: false,
          totalPages: 0,
        };
      })

      // Grouped notifications
      .addCase(fetchGroupedNotifications.fulfilled, (state, action) => {
        const { today, yesterday, thisWeek, older } = action.payload;

        // Merge all grouped notifications
        const allNotifications = [...today, ...yesterday, ...thisWeek, ...older];
        state.notifications = allNotifications;

        // Update unread counts
        state.unreadCount =
          action.payload.unreadCount.today +
          action.payload.unreadCount.yesterday +
          action.payload.unreadCount.thisWeek +
          action.payload.unreadCount.older;

        state.unreadNotifications = allNotifications.filter((n) => n.status !== 'read');
      });
  },
});

export const {
  setSelectedNotification,
  clearSelectedNotification,
  updateFilters,
  resetFilters,
  clearNotificationsList,
  updateNotificationInList,
  removeNotificationFromList,
  toggleNotificationPanel,
  toggleNotificationSelection,
  selectAllNotifications,
  clearSelectedNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
