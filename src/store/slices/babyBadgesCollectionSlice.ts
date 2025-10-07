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
  babyBadges: [
    {
      id: '68d639d41eee92e612ea0425',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225379',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-01-15T10:30:00.000Z',

      submissionNote: 'Sweetest first real smile while looking at daddy! 😊',
      submissionMedia: ['uploads/baby-badges/first-smile-photo1.jpg', 'uploads/baby-badges/first-smile-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.296Z',

      updatedAt: '2025-09-26T06:59:32.296Z',
    },
    {
      id: '68d639d41eee92e612ea0432',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba022537b',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-02-02T14:20:00.000Z',

      submissionNote: 'Made the cutest "ooooh" and "ahhh" sounds during tummy time!',
      submissionMedia: ['uploads/baby-badges/first-coo-audio1.mp3'],

      createdAt: '2025-09-26T06:59:32.317Z',

      updatedAt: '2025-09-26T06:59:32.317Z',
    },
    {
      id: '68d639d41eee92e612ea0440',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba022537d',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-02-20T11:45:00.000Z',

      submissionNote: 'Held head up for 45 seconds during tummy time! Getting so strong!',
      submissionMedia: ['uploads/baby-badges/head-up-photo1.jpg'],

      createdAt: '2025-09-26T06:59:32.329Z',

      updatedAt: '2025-09-26T06:59:32.329Z',
    },
    {
      id: '68d639d41eee92e612ea044b',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba022537f',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-01-28T16:10:00.000Z',

      submissionNote: 'Followed my finger and her favorite rattle from side to side',
      submissionMedia: ['uploads/baby-badges/eye-tracking-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.333Z',

      updatedAt: '2025-09-26T06:59:32.333Z',
    },
    {
      id: '68d639d41eee92e612ea0454',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225381',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-03-12T19:30:00.000Z',

      submissionNote: 'First genuine giggle when daddy made funny faces! Melted our hearts ❤️',
      submissionMedia: ['uploads/baby-badges/first-laugh-video1.mp4', 'uploads/baby-badges/first-laugh-photo1.jpg'],

      createdAt: '2025-09-26T06:59:32.336Z',

      updatedAt: '2025-09-26T06:59:32.336Z',
    },
    {
      id: '68d639d41eee92e612ea045e',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225383',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-04-18T12:00:00.000Z',

      submissionNote: 'First successful roll from tummy to back! She was so proud of herself.',
      submissionMedia: ['uploads/baby-badges/rolling-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.340Z',

      updatedAt: '2025-09-26T06:59:32.340Z',
    },
    {
      id: '68d639d41eee92e612ea0464',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225385',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-06-05T15:45:00.000Z',

      submissionNote: 'Sat up for 2 whole minutes without falling over! Independence begins!',
      submissionMedia: ['uploads/baby-badges/sitting-photo1.jpg', 'uploads/baby-badges/sitting-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.342Z',

      updatedAt: '2025-09-26T06:59:32.342Z',
    },
    {
      id: '68d639d41eee92e612ea046e',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225387',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-07-22T08:30:00.000Z',

      submissionNote: 'Bottom front tooth finally broke through! Explains all the drooling lately.',
      submissionMedia: ['uploads/baby-badges/first-tooth-photo1.jpg'],

      createdAt: '2025-09-26T06:59:32.344Z',

      updatedAt: '2025-09-26T06:59:32.344Z',
    },
    {
      id: '68d639d41eee92e612ea0476',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225389',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-08-10T17:20:00.000Z',

      submissionNote: "First real crawling steps! Watch out world, she's mobile now!",
      submissionMedia: ['uploads/baby-badges/crawling-video1.mp4', 'uploads/baby-badges/crawling-video2.mp4'],

      createdAt: '2025-09-26T06:59:32.345Z',

      updatedAt: '2025-09-26T06:59:32.345Z',
    },
    {
      id: '68d639d41eee92e612ea047d',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba02253ab',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-05-15T12:30:00.000Z',

      submissionNote: 'First taste of sweet potato puree - made the funniest confused face!',
      submissionMedia: ['uploads/baby-badges/first-solid-photo1.jpg', 'uploads/baby-badges/first-solid-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.347Z',

      updatedAt: '2025-09-26T06:59:32.347Z',
    },
    {
      id: '68d639d41eee92e612ea0483',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba02253b5',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-03-25T07:00:00.000Z',

      submissionNote: 'Slept from 10 PM to 6 AM without waking! Parents finally got some rest!',
      submissionMedia: [],

      createdAt: '2025-09-26T06:59:32.349Z',

      updatedAt: '2025-09-26T06:59:32.349Z',
    },
    {
      id: '68d639d41eee92e612ea0487',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba02253bb',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-02-10T18:45:00.000Z',

      submissionNote: 'Finally enjoys bath time! Splashing and playing with rubber ducky.',
      submissionMedia: ['uploads/baby-badges/bath-fun-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.350Z',

      updatedAt: '2025-09-26T06:59:32.350Z',
    },
    {
      id: '68d639d41eee92e612ea048b',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba022540d',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-01-20T14:15:00.000Z',

      submissionNote: 'Now enjoys tummy time for 15+ minutes! Building those neck muscles.',
      submissionMedia: ['uploads/baby-badges/tummy-time-photo1.jpg'],

      createdAt: '2025-09-26T06:59:32.351Z',

      updatedAt: '2025-09-26T06:59:32.351Z',
    },
    {
      id: '68d639d41eee92e612ea048f',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba022540f',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-02-05T11:30:00.000Z',

      submissionNote: 'Deliberately reaching for her favorite rattle during play time!',
      submissionMedia: ['uploads/baby-badges/reaching-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.352Z',

      updatedAt: '2025-09-26T06:59:32.352Z',
    },
    {
      id: '68d639d41eee92e612ea0492',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225411',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-03-01T10:20:00.000Z',

      submissionNote: 'Successfully grabbing and holding toys in both hands!',
      submissionMedia: ['uploads/baby-badges/grasping-photo1.jpg'],

      createdAt: '2025-09-26T06:59:32.353Z',

      updatedAt: '2025-09-26T06:59:32.353Z',
    },
    {
      id: '68d639d41eee92e612ea0495',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225413',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-04-08T16:45:00.000Z',

      submissionNote: 'Passing toys from one hand to the other like a pro!',
      submissionMedia: ['uploads/baby-badges/transferring-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.354Z',

      updatedAt: '2025-09-26T06:59:32.354Z',
    },
    {
      id: '68d639d41eee92e612ea0498',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba02253e5',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-01-12T09:15:00.000Z',

      submissionNote: 'Smiles back every time we talk to her! Such a social little butterfly.',
      submissionMedia: ['uploads/baby-badges/social-smile-photo1.jpg'],

      createdAt: '2025-09-26T06:59:32.355Z',

      updatedAt: '2025-09-26T06:59:32.355Z',
    },
    {
      id: '68d639d41eee92e612ea049b',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba02253e7',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-04-25T13:40:00.000Z',

      submissionNote: 'Giggles and anticipates when we play peek-a-boo! She loves this game.',
      submissionMedia: ['uploads/baby-badges/peekaboo-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.356Z',

      updatedAt: '2025-09-26T06:59:32.356Z',
    },
    {
      id: '68d639d41eee92e612ea049e',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba02253fb',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-07-30T20:10:00.000Z',

      submissionNote: 'Gives the sweetest little hugs and snuggles before bedtime ❤️',
      submissionMedia: ['uploads/baby-badges/affection-photo1.jpg'],

      createdAt: '2025-09-26T06:59:32.357Z',

      updatedAt: '2025-09-26T06:59:32.357Z',
    },
    {
      id: '68d639d41eee92e612ea04a1',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba022543f',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-06-20T14:30:00.000Z',

      submissionNote: 'Looks for her toy when we hide it under the blanket! Smart cookie!',
      submissionMedia: ['uploads/baby-badges/object-permanence-video1.mp4'],
      createdAt: '2025-09-26T06:59:32.358Z',

      updatedAt: '2025-09-26T06:59:32.358Z',
    },
    {
      id: '68d639d41eee92e612ea04a3',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225441',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-07-15T11:50:00.000Z',

      submissionNote: 'Deliberately drops toys from high chair to see what happens. Learning!',
      submissionMedia: ['uploads/baby-badges/cause-effect-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.359Z',

      updatedAt: '2025-09-26T06:59:32.359Z',
    },
    {
      id: '68d639d41eee92e612ea04a5',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba022538b',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-09-01T16:20:00.000Z',

      submissionNote: 'Pulled herself up using the coffee table! Need to baby-proof everything now!',
      submissionMedia: ['uploads/baby-badges/pulling-stand-video1.mp4', 'uploads/baby-badges/pulling-stand-photo1.jpg'],

      createdAt: '2025-09-26T06:59:32.360Z',

      updatedAt: '2025-09-26T06:59:32.360Z',
    },
    {
      id: '68d639d41eee92e612ea04a7',
      babyId: '64f1a2b3c4d5e6f789abcde2',

      badgeId: '6881e4139d248f7ba0225415',

      parentId: '64f1a2b3c4d5e6f789abcde1',

      completedAt: '2024-08-25T12:15:00.000Z',

      submissionNote: 'Picking up Cheerios with thumb and forefinger like a little pro!',
      submissionMedia: ['uploads/baby-badges/pincer-grasp-video1.mp4'],

      createdAt: '2025-09-26T06:59:32.361Z',

      updatedAt: '2025-09-26T06:59:32.361Z',
    },
    {
      id: '68d639d41eee92e612ea04a9',
      babyId: '64f1a2b3c4d5e6f789abcde2',
      badgeId: '6881e4139d248f7ba022538d',
      parentId: '64f1a2b3c4d5e6f789abcde1',
      completedAt: '2024-08-30T19:45:00.000Z',
      submissionNote: 'Said "mama" clearly! Though it might have been random babbling...',
      submissionMedia: ['uploads/baby-badges/first-word-audio1.mp3'],
      createdAt: '2025-09-26T06:59:32.361Z',
      updatedAt: '2025-09-26T06:59:32.361Z',
    },
  ],
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
