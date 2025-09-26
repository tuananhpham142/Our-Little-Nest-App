// src/store/slices/kindnessClosetSlice.ts

import { KindnessClosetStatus, SortBy, SortOrder } from '@/models/KindnessCloset/KindnessClosetEnum';
import {
    KindnessCloset,
    KindnessClosetFilters,
    KindnessClosetState,
    PaginationInfo
} from '@/models/KindnessCloset/KindnessClosetModel';
import {
    CreateKindnessClosetApplicationDto,
    CreateKindnessClosetDto,
    FindAllKindnessClosetHistoriesDto,
    FindAllKindnessClosetsDto,
    QueryKindnessClosetDto,
    UpdateKindnessClosetApplicationDto,
    UpdateKindnessClosetDto,
} from '@/models/KindnessCloset/KindnessClosetRequest';
import { KindnessClosetService } from '@/services/kindnessCloset/kindnessClosetService';
import { normalizeId, normalizeIds } from '@/utils/kindnessClosetUtils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Initial state
const initialPagination: PaginationInfo = {
  page: 1,
  limit: 10,
  total: 0,
  hasNextPage: false,
};

const initialState: KindnessClosetState = {
  posts: [],
  myPosts: [],
  currentPost: null,
  similarPosts: [],

  applications: [],
  myApplications: [],
  postApplications: [],
  currentApplication: null,

  histories: [],
  givenHistory: [],
  receivedHistory: [],

  isLoading: false,
  isLoadingMore: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  error: null,

  pagination: { ...initialPagination },
  myPostsPagination: { ...initialPagination },
  applicationsPagination: { ...initialPagination },
  historyPagination: { ...initialPagination },

  filters: {
    status: KindnessClosetStatus.ACTIVE,
    sortBy: SortBy.CREATED_AT,
    sortOrder: SortOrder.DESC,
  },
};

// ============= Async Thunks for Posts =============

export const createPost = createAsyncThunk(
  'kindnessCloset/createPost',
  async (data: CreateKindnessClosetDto, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.createPost(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create post');
    }
  },
);

export const fetchPosts = createAsyncThunk(
  'kindnessCloset/fetchPosts',
  async (params: QueryKindnessClosetDto = {}, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getPosts(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch posts');
    }
  },
);

export const loadMorePosts = createAsyncThunk(
  'kindnessCloset/loadMorePosts',
  async (params: QueryKindnessClosetDto, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.kindnessCloset.pagination.page;
      const nextPage = currentPage + 1;

      const response = await KindnessClosetService.getPosts({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more posts');
    }
  },
);

export const fetchMyPosts = createAsyncThunk(
  'kindnessCloset/fetchMyPosts',
  async (params: FindAllKindnessClosetsDto = {}, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getMyPosts(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch my posts');
    }
  },
);

export const fetchPostById = createAsyncThunk(
  'kindnessCloset/fetchPostById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getPostById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch post');
    }
  },
);

export const fetchSimilarPosts = createAsyncThunk(
  'kindnessCloset/fetchSimilarPosts',
  async ({ id, limit = 5 }: { id: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getSimilarPosts(id, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch similar posts');
    }
  },
);

export const updatePost = createAsyncThunk(
  'kindnessCloset/updatePost',
  async ({ id, data }: { id: string; data: UpdateKindnessClosetDto }, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.updatePost(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update post');
    }
  },
);

export const deletePost = createAsyncThunk('kindnessCloset/deletePost', async (id: string, { rejectWithValue }) => {
  try {
    await KindnessClosetService.deletePost(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete post');
  }
});

// ============= Async Thunks for Applications =============

export const createApplication = createAsyncThunk(
  'kindnessCloset/createApplication',
  async ({ postId, data }: { postId: string; data: CreateKindnessClosetApplicationDto }, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.createApplication(postId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create application');
    }
  },
);

export const fetchPostApplications = createAsyncThunk(
  'kindnessCloset/fetchPostApplications',
  async ({ postId, params = {} }: { postId: string; params?: FindAllKindnessClosetsDto }, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getPostApplications(postId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch applications');
    }
  },
);

export const fetchAllPostApplications = createAsyncThunk(
  'kindnessCloset/fetchAllPostApplications',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getAllPostApplications(postId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch all applications');
    }
  },
);

export const fetchMyApplications = createAsyncThunk(
  'kindnessCloset/fetchMyApplications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getMyApplications();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch my applications');
    }
  },
);

export const updateApplicationStatus = createAsyncThunk(
  'kindnessCloset/updateApplicationStatus',
  async (
    { applicationId, data }: { applicationId: string; data: UpdateKindnessClosetApplicationDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await KindnessClosetService.updateApplicationStatus(applicationId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update application');
    }
  },
);

export const cancelApplication = createAsyncThunk(
  'kindnessCloset/cancelApplication',
  async (applicationId: string, { rejectWithValue }) => {
    try {
      await KindnessClosetService.cancelApplication(applicationId);
      return applicationId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel application');
    }
  },
);

// ============= Async Thunks for History =============

export const fetchMyHistory = createAsyncThunk(
  'kindnessCloset/fetchMyHistory',
  async (params: FindAllKindnessClosetHistoriesDto = {}, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getMyHistory(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch history');
    }
  },
);

export const fetchGivenHistory = createAsyncThunk(
  'kindnessCloset/fetchGivenHistory',
  async (params: FindAllKindnessClosetHistoriesDto = {}, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getGivenHistory(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch given history');
    }
  },
);

export const fetchReceivedHistory = createAsyncThunk(
  'kindnessCloset/fetchReceivedHistory',
  async (params: FindAllKindnessClosetHistoriesDto = {}, { rejectWithValue }) => {
    try {
      const response = await KindnessClosetService.getReceivedHistory(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch received history');
    }
  },
);

// ============= Slice =============

const kindnessClosetSlice = createSlice({
  name: 'kindnessCloset',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPost: (state, action: PayloadAction<KindnessCloset | null>) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    setSimilarPosts: (state, action: PayloadAction<KindnessCloset[]>) => {
      state.similarPosts = action.payload;
    },
    clearSimilarPosts: (state) => {
      state.similarPosts = [];
    },
    updateFilters: (state, action: PayloadAction<Partial<KindnessClosetFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        status: KindnessClosetStatus.ACTIVE,
        sortBy: SortBy.CREATED_AT,
        sortOrder: SortOrder.DESC,
      };
    },
    clearPosts: (state) => {
      state.posts = [];
      state.pagination = { ...initialPagination };
    },
    clearMyPosts: (state) => {
      state.myPosts = [];
      state.myPostsPagination = { ...initialPagination };
    },
    clearApplications: (state) => {
      state.applications = [];
      state.myApplications = [];
      state.postApplications = [];
      state.applicationsPagination = { ...initialPagination };
    },
    clearHistory: (state) => {
      state.histories = [];
      state.givenHistory = [];
      state.receivedHistory = [];
      state.historyPagination = { ...initialPagination };
    },
    incrementViewCount: (state, action: PayloadAction<string>) => {
      const postId = action.payload;

      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].viewsCount += 1;
      }

      if (state.currentPost && state.currentPost.id === postId) {
        state.currentPost.viewsCount += 1;
      }
    },
    incrementApplicationCount: (state, action: PayloadAction<string>) => {
      const postId = action.payload;

      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex].applicationsCount += 1;
      }

      if (state.currentPost && state.currentPost.id === postId) {
        state.currentPost.applicationsCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ============= Posts =============
      // Create post
      .addCase(createPost.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreating = false;
        const normalizedPost = normalizeId(action.payload);
        state.myPosts.unshift(normalizedPost);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = normalizeIds(action.payload.data);
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load more posts
      .addCase(loadMorePosts.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMorePosts.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.posts = [...state.posts, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(loadMorePosts.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch my posts
      .addCase(fetchMyPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myPosts = action.payload.data;
        state.myPostsPagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch similar posts
      .addCase(fetchSimilarPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSimilarPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.similarPosts = action.payload;
        state.error = null;
      })
      .addCase(fetchSimilarPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedPost = action.payload;

        // Update in posts list
        const postIndex = state.posts.findIndex((p) => p.id === updatedPost.id);
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedPost;
        }

        // Update in my posts
        const myPostIndex = state.myPosts.findIndex((p) => p.id === updatedPost.id);
        if (myPostIndex !== -1) {
          state.myPosts[myPostIndex] = updatedPost;
        }

        // Update current post
        if (state.currentPost?.id === updatedPost.id) {
          state.currentPost = updatedPost;
        }

        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedId = action.payload;

        // Remove from posts
        state.posts = state.posts.filter((p) => p.id !== deletedId);

        // Remove from my posts
        state.myPosts = state.myPosts.filter((p) => p.id !== deletedId);

        // Clear current post if deleted
        if (state.currentPost?.id === deletedId) {
          state.currentPost = null;
        }

        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

      // ============= Applications =============
      // Create application
      .addCase(createApplication.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.isCreating = false;
        state.myApplications.unshift(action.payload);

        // Increment application count for the post
        const postId = action.payload.kindnessCloset.id;
        const postIndex = state.posts.findIndex((p) => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].applicationsCount += 1;
        }

        state.error = null;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })

      // Fetch post applications
      .addCase(fetchPostApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.postApplications = action.payload.data;
        state.applicationsPagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchPostApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch all post applications
      .addCase(fetchAllPostApplications.fulfilled, (state, action) => {
        state.postApplications = action.payload;
        state.error = null;
      })

      // Fetch my applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myApplications = action.payload;
        state.error = null;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedApplication = action.payload;

        // Update in post applications
        const appIndex = state.postApplications.findIndex((a) => a.id === updatedApplication.id);
        if (appIndex !== -1) {
          state.postApplications[appIndex] = updatedApplication;
        }

        state.error = null;
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })

      // Cancel application
      .addCase(cancelApplication.fulfilled, (state, action) => {
        const cancelledId = action.payload;

        // Remove from my applications
        state.myApplications = state.myApplications.filter((a) => a.id !== cancelledId);

        // Remove from post applications
        state.postApplications = state.postApplications.filter((a) => a.id !== cancelledId);

        state.error = null;
      })

      // ============= History =============
      // Fetch my history
      .addCase(fetchMyHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.histories = action.payload.data;
        state.historyPagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchMyHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch given history
      .addCase(fetchGivenHistory.fulfilled, (state, action) => {
        state.givenHistory = action.payload.data;
        state.error = null;
      })

      // Fetch received history
      .addCase(fetchReceivedHistory.fulfilled, (state, action) => {
        state.receivedHistory = action.payload.data;
        state.error = null;
      });
  },
});

export const {
  clearError,
  setCurrentPost,
  clearCurrentPost,
  setSimilarPosts,
  clearSimilarPosts,
  updateFilters,
  resetFilters,
  clearPosts,
  clearMyPosts,
  clearApplications,
  clearHistory,
  incrementViewCount,
  incrementApplicationCount,
} = kindnessClosetSlice.actions;

export default kindnessClosetSlice.reducer;
