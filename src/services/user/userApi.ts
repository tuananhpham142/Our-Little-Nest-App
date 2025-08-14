// src/services/api/userApi.ts
import { User } from '@/types/auth';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../baseApi';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Profile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: ['Profile'],
    }),
    updateUserProfile: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Profile'],
    }),
    uploadAvatar: builder.mutation<{ avatarUrl: string }, { userId: string; formData: FormData }>({
      query: ({ userId, formData }) => ({
        url: `/users/${userId}/avatar`,
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useUploadAvatarMutation } = userApi;
