// src/services/api/baseApi.ts
import { RootState } from '@/store/store';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AsyncStorageService } from './storage/asyncStorageService';

// API Configuration
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api/v1' // Development
  : 'https://api.ourlittlenest.com/api/v1'; // Production

const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
export const baseApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
baseApi.interceptors.request.use(
  async (config) => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTFiMmMzZDRlNWY2Nzg5YWJjZGVmMyIsInJvbGUiOnsiaWQiOiIyIn0sInNlc3Npb25JZCI6IjY4Y2QxY2Q2MTZmYWVlYTYyOGUyZTNkNSIsImlhdCI6MTc1ODI3MjcyNiwiZXhwIjoxNzg5ODA4NzI2fQ.-F1-IsrODdGRgQsp9XWQN15e3ZChHeTpRjQWcR0AJ34';
      //await AsyncStorageService.getItem<string>('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token from storage:', error);
    }

    // Add request timestamp for debugging
    //@ts-ignore
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling auth and errors
baseApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time for debugging
    //@ts-ignore
    if (response.config.metadata?.startTime) {
      //@ts-ignore
      const duration = new Date().getTime() - response.config.metadata.startTime.getTime();
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorageService.getItem<string>('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;

          // Store new tokens
          await AsyncStorageService.setItem('authToken', token);
          await AsyncStorageService.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return baseApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorageService.removeItem('authToken');
        await AsyncStorageService.removeItem('refreshToken');
        // Dispatch logout action or navigate to login screen
        console.error('Token refresh failed:', refreshError);
      }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      error.message = 'Network connection error. Please check your internet connection.';
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    }

    return Promise.reject(error);
  },
);

// RTK Query base query
export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// RTK Query base query with re-auth
export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult.data) {
      // Store the new token
      // api.dispatch(tokenReceived(refreshResult.data));

      // Retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // api.dispatch(loggedOut());
    }
  }

  return result;
};
