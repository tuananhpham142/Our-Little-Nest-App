// src/store/slices/tagSlice.ts

import { TagModel, TagState } from '@/models/Tag/TagModel';
import { GetTagsRequest } from '@/models/Tag/TagRequest';
import { TagService } from '@/services/tag/tagService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: TagState = {
  tags: [],
  currentTag: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasNextPage: false,
  },
};

// Async thunks
export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (params: GetTagsRequest = {}, { rejectWithValue }) => {
    try {
      const response = await TagService.getTags(params);
      return { ...response, params };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tags');
    }
  },
);

export const loadMoreTags = createAsyncThunk(
  'tags/loadMoreTags',
  async (params: GetTagsRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentPage = state.tags.pagination.page;
      const nextPage = currentPage + 1;

      const response = await TagService.getTags({
        ...params,
        page: nextPage,
      });

      return { ...response, page: nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load more tags');
    }
  },
);

export const fetchAllActiveTags = createAsyncThunk('tags/fetchAllActiveTags', async (_, { rejectWithValue }) => {
  try {
    const response = await TagService.getAllActiveTags();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch active tags');
  }
});

export const fetchTagById = createAsyncThunk('tags/fetchTagById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await TagService.getTagById(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch tag');
  }
});

export const fetchTagBySlug = createAsyncThunk('tags/fetchTagBySlug', async (slug: string, { rejectWithValue }) => {
  try {
    const response = await TagService.getTagBySlug(slug);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch tag');
  }
});

export const searchTags = createAsyncThunk('tags/searchTags', async (searchTerm: string, { rejectWithValue }) => {
  try {
    const response = await TagService.searchTags(searchTerm);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to search tags');
  }
});

export const fetchTagsByIds = createAsyncThunk('tags/fetchTagsByIds', async (tagIds: string[], { rejectWithValue }) => {
  try {
    const response = await TagService.getTagsByIds(tagIds);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch tags by IDs');
  }
});

export const fetchPopularTags = createAsyncThunk(
  'tags/fetchPopularTags',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await TagService.getPopularTags(limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch popular tags');
    }
  },
);

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTag: (state, action: PayloadAction<TagModel | null>) => {
      state.currentTag = action.payload;
    },
    clearCurrentTag: (state) => {
      state.currentTag = null;
    },
    clearTags: (state) => {
      state.tags = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
      };
    },
    updateTagInList: (state, action: PayloadAction<TagModel>) => {
      const index = state.tags.findIndex((tag) => tag.id === action.payload.id);
      if (index !== -1) {
        state.tags[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tags
      .addCase(fetchTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload.data;
        state.pagination = {
          page: action.payload.params?.page || 1,
          limit: action.payload.params?.limit || 10,
          total: action.payload.total,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Load more tags
      .addCase(loadMoreTags.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreTags.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.tags = [...state.tags, ...action.payload.data];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          hasNextPage: action.payload.hasNextPage,
        };
        state.error = null;
      })
      .addCase(loadMoreTags.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch all active tags
      .addCase(fetchAllActiveTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
        state.error = null;
      })

      // Fetch tag by ID
      .addCase(fetchTagById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTagById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTag = action.payload;
        state.error = null;
      })
      .addCase(fetchTagById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch tag by slug
      .addCase(fetchTagBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTagBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTag = action.payload;
        state.error = null;
      })
      .addCase(fetchTagBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Search tags
      .addCase(searchTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
        state.error = null;
      })
      .addCase(searchTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch tags by IDs
      .addCase(fetchTagsByIds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
        state.error = null;
      })

      // Fetch popular tags
      .addCase(fetchPopularTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
        state.error = null;
      });
  },
});

export const { clearError, setCurrentTag, clearCurrentTag, clearTags, updateTagInList } = tagSlice.actions;

export default tagSlice.reducer;
