// src/services/notification/notificationService.ts

import { useToast } from '@/components/Toast/useToast';
import { Notification, NotificationPreferences, NotificationStatistics } from '@/models/Notification/NotificationModel';
import {
  ClearNotificationsRequest,
  DEFAULT_NOTIFICATION_PARAMS,
  DeleteBulkNotificationsRequest,
  GetNotificationsRequest,
  MarkAllAsReadRequest,
  UpdatePreferencesRequest,
} from '@/models/Notification/NotificationRequest';
import {
  ClearNotificationsResponse,
  DeleteNotificationResponse,
  MarkAllAsReadResponse,
  MarkAsReadResponse,
  NotificationDetailResponse,
  NotificationGroupedResponse,
  NotificationListResponse,
  NotificationPreferencesResponse,
  NotificationStatisticsResponse,
  UnreadCountResponse,
} from '@/models/Notification/NotificationResponse';
import { ApiResponse } from '@/types/api';
import { RootStackNavigationProp } from '@/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { baseApi } from '../baseApi';

export class NotificationService {
  private static readonly BASE_PATH = '/notifications';
  private static readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for notifications
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly STORAGE_KEYS = {
    PREFERENCES: '@notification_preferences',
    LAST_READ_TIME: '@notification_last_read',
    CACHED_COUNT: '@notification_cached_count',
  };

  /**
   * Get notifications with filtering and pagination
   */
  static async getNotifications(params: GetNotificationsRequest = {}): Promise<NotificationListResponse> {
    try {
      const queryParams = this.buildQueryParams({
        ...DEFAULT_NOTIFICATION_PARAMS,
        ...params,
      });

      // Don't cache if filtering by read status or date ranges
      const shouldCache = !params.isRead && !params.startDate && !params.endDate;
      const cacheKey = `notifications:${queryParams.toString()}`;

      if (shouldCache) {
        const cached = this.getCachedData(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const response = await baseApi.get<ApiResponse<NotificationListResponse>>(
        `${this.BASE_PATH}?${queryParams.toString()}`,
      );

      const data = response.data.data;

      if (shouldCache) {
        this.setCachedData(cacheKey, data);
      }

      // Update cached unread count
      await this.updateCachedUnreadCount(data.unreadCount);

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get notification by ID
   */
  static async getNotificationById(id: string): Promise<Notification> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Notification ID is required');
      }

      const response = await baseApi.get<ApiResponse<NotificationDetailResponse>>(`${this.BASE_PATH}/${id}`);

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string): Promise<Notification> {
    try {
      if (!id) {
        throw new Error('Notification ID is required');
      }

      const response = await baseApi.patch<ApiResponse<MarkAsReadResponse>>(`${this.BASE_PATH}/${id}/read`);

      // Clear cache after marking as read
      this.clearNotificationCache();

      // Update last read time
      await AsyncStorage.setItem(this.STORAGE_KEYS.LAST_READ_TIME, new Date().toISOString());

      return response.data.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(params?: MarkAllAsReadRequest): Promise<MarkAllAsReadResponse> {
    try {
      const queryParams = params ? this.buildQueryParams(params) : '';

      const response = await baseApi.patch<ApiResponse<MarkAllAsReadResponse>>(
        `${this.BASE_PATH}/mark-all-read${queryParams ? '?' + queryParams : ''}`,
      );

      // Clear cache
      this.clearNotificationCache();

      // Update cached unread count
      await this.updateCachedUnreadCount(0);

      // Update last read time
      await AsyncStorage.setItem(this.STORAGE_KEYS.LAST_READ_TIME, new Date().toISOString());

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(): Promise<UnreadCountResponse> {
    try {
      // Check cached count first
      const cachedCount = await this.getCachedUnreadCount();
      if (cachedCount !== null) {
        return {
          count: cachedCount,
          hasNew: cachedCount > 0,
        };
      }

      const response = await baseApi.get<ApiResponse<UnreadCountResponse>>(`${this.BASE_PATH}/unread-count`);

      const data = response.data.data;

      // Cache the count
      await this.updateCachedUnreadCount(data.count);

      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get notification statistics
   */
  static async getStatistics(): Promise<NotificationStatistics> {
    try {
      const cacheKey = 'notifications:statistics';
      const cached = this.getCachedData(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await baseApi.get<ApiResponse<NotificationStatisticsResponse>>(`${this.BASE_PATH}/statistics`);

      const stats = response.data.data.data;
      this.setCachedData(cacheKey, stats, 5 * 60 * 1000); // Cache for 5 minutes

      return stats;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get grouped notifications (today, yesterday, this week, older)
   */
  static async getGroupedNotifications(): Promise<NotificationGroupedResponse> {
    try {
      const response = await baseApi.get<ApiResponse<NotificationGroupedResponse>>(`${this.BASE_PATH}/grouped`);

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(id: string): Promise<DeleteNotificationResponse> {
    try {
      if (!id) {
        throw new Error('Notification ID is required');
      }

      const response = await baseApi.delete<ApiResponse<DeleteNotificationResponse>>(`${this.BASE_PATH}/${id}`);

      // Clear cache after deletion
      this.clearNotificationCache();

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete multiple notifications
   */
  static async deleteBulkNotifications(params: DeleteBulkNotificationsRequest): Promise<DeleteNotificationResponse> {
    try {
      const response = await baseApi.post<ApiResponse<DeleteNotificationResponse>>(
        `${this.BASE_PATH}/bulk-delete`,
        params,
      );

      // Clear cache after deletion
      this.clearNotificationCache();

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Clear notifications
   */
  static async clearNotifications(params: ClearNotificationsRequest): Promise<ClearNotificationsResponse> {
    try {
      const response = await baseApi.post<ApiResponse<ClearNotificationsResponse>>(`${this.BASE_PATH}/clear`, params);

      // Clear cache
      this.clearNotificationCache();

      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get notification preferences
   */
  static async getPreferences(): Promise<NotificationPreferences> {
    try {
      // Check local storage first
      const cached = await AsyncStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await baseApi.get<ApiResponse<NotificationPreferencesResponse>>(`${this.BASE_PATH}/preferences`);

      const preferences = response.data.data.data;

      // Cache preferences locally
      await AsyncStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));

      return preferences;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(params: UpdatePreferencesRequest): Promise<NotificationPreferences> {
    try {
      const response = await baseApi.patch<ApiResponse<NotificationPreferencesResponse>>(
        `${this.BASE_PATH}/preferences`,
        params,
      );

      const preferences = response.data.data.data;

      // Update cached preferences
      await AsyncStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));

      return preferences;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build query parameters for API requests
   */
  private static buildQueryParams(params: any): URLSearchParams {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item.toString()));
        } else if (typeof value === 'boolean') {
          queryParams.append(key, value.toString());
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return queryParams;
  }

  /**
   * Get cached data if available and not expired
   */
  private static getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached) {
      const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
      if (!isExpired) {
        return cached.data;
      }
      this.cache.delete(key);
    }
    return null;
  }

  /**
   * Set cached data
   */
  private static setCachedData(key: string, data: any, duration?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Auto-clear cache after duration
    setTimeout(() => {
      this.cache.delete(key);
    }, duration || this.CACHE_DURATION);
  }

  /**
   * Clear notification-related cache
   */
  private static clearNotificationCache(): void {
    // Clear only notification-related cache entries
    Array.from(this.cache.keys()).forEach((key) => {
      if (key.startsWith('notifications:')) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Clear all cache
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update cached unread count
   */
  private static async updateCachedUnreadCount(count: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.CACHED_COUNT,
        JSON.stringify({
          count,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error('Failed to cache unread count:', error);
    }
  }

  /**
   * Get cached unread count
   */
  private static async getCachedUnreadCount(): Promise<number | null> {
    try {
      const cached = await AsyncStorage.getItem(this.STORAGE_KEYS.CACHED_COUNT);
      if (!cached) return null;

      const { count, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > 60000; // 1 minute expiry

      return isExpired ? null : count;
    } catch (error) {
      console.error('Failed to get cached unread count:', error);
      return null;
    }
  }

  /**
   * Get last read time
   */
  static async getLastReadTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.STORAGE_KEYS.LAST_READ_TIME);
    } catch (error) {
      console.error('Failed to get last read time:', error);
      return null;
    }
  }

  /**
   * Handle API errors with proper error messages
   */
  private static handleError(error: any): Error {
    // Handle network errors
    if (!error.response) {
      return new Error('Network error. Please check your connection.');
    }

    // Handle API error responses
    const errorResponse = error.response?.data;

    if (errorResponse?.message) {
      const message = Array.isArray(errorResponse.message) ? errorResponse.message.join(', ') : errorResponse.message;
      return new Error(message);
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        return new Error('Invalid request parameters.');
      case 401:
        return new Error('Authentication required. Please login again.');
      case 403:
        return new Error('Access denied.');
      case 404:
        return new Error('Notification not found.');
      case 429:
        return new Error('Too many requests. Please try again later.');
      case 500:
        return new Error('Server error. Please try again later.');
      default:
        return new Error(error.message || 'Something went wrong.');
    }
  }
}

export const setupNotificationHandler = () => {
  // Handle foreground notifications
  messaging().onMessage(async (remoteMessage) => {
    const { showNotification } = useToast();
    const navigation = useNavigation<RootStackNavigationProp>();
    // Show toast in app
    showNotification(
      remoteMessage.notification?.title || 'Thông báo mới',
      remoteMessage.notification?.body || '',
      () => {
        // Navigate based on notification data
        if (remoteMessage.data?.screen) {
          navigation.navigate(remoteMessage.data.screen as any);
        }
      },
      remoteMessage.notification?.android?.imageUrl || remoteMessage.notification?.image,
    );
  });
};
