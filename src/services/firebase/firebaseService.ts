// src/services/firebase/FirebaseService.ts
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { DeviceTokenPayload, PushNotificationPayload } from '../../types/firebase';
import { baseApi } from '../baseApi';

export class FirebaseService {
  private static instance: FirebaseService;
  private deviceToken: string | null = null;
  private isInitialized = false;

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  /**
   * Get device token for push notifications
   */
  static async getDeviceToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('Device token:', token);
      return token;
    } catch (error) {
      console.error('Failed to get device token:', error);
      return null;
    }
  }

  /**
   * Register device token with backend
   */
  static async registerDeviceToken(deviceToken: string, userId: string): Promise<void> {
    try {
      const payload: DeviceTokenPayload = {
        deviceToken,
        platform: Platform.OS as 'ios' | 'android',
        userId,
      };

      await baseApi.post('/notifications/register-device', payload);
      console.log('Device token registered successfully');
    } catch (error) {
      console.error('Failed to register device token:', error);
      throw error;
    }
  }

  /**
   * Unregister device token from backend
   */
  static async unregisterDeviceToken(deviceToken: string, userId: string): Promise<void> {
    try {
      await baseApi.delete('/notifications/unregister-device', {
        data: { deviceToken, userId },
      });
      console.log('Device token unregistered successfully');
    } catch (error) {
      console.error('Failed to unregister device token:', error);
      throw error;
    }
  }

  /**
   * Initialize Firebase Messaging
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Request permission for iOS
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.warn('Push notification permission not granted');
          return;
        }
      }

      // Request permission for Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Push notification permission not granted');
          return;
        }
      }

      // Get device token
      //@ts-ignore
      await this.getDeviceToken();

      // Set up message handlers
      this.setupMessageHandlers();

      // Set up token refresh listener
      this.setupTokenRefreshListener();

      this.isInitialized = true;
      console.log('Firebase messaging initialized successfully');
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup message handlers for different app states
   */
  private setupMessageHandlers(): void {
    // Handle messages when app is in foreground
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      this.handleForegroundMessage(remoteMessage);
    });

    // Handle messages when app is in background but not killed
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Background message opened app:', remoteMessage);
      this.handleNotificationPress(remoteMessage);
    });

    // Handle messages when app is opened from killed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App opened from killed state by notification:', remoteMessage);
          this.handleNotificationPress(remoteMessage);
        }
      });

    // Store unsubscribe function if needed
    // this.unsubscribeForeground = unsubscribeForeground;
  }

  /**
   * Setup token refresh listener
   */
  private setupTokenRefreshListener(): void {
    messaging().onTokenRefresh(async (token) => {
      console.log('Device token refreshed:', token);
      this.deviceToken = token;

      // Update token in backend if user is authenticated
      // This should be handled by the app's authentication state
      try {
        // Get current user from store and update token
        // const currentUser = store.getState().auth.user;
        // if (currentUser) {
        //   await this.registerDeviceToken(token, currentUser.id);
        // }
      } catch (error) {
        console.error('Failed to update refreshed token:', error);
      }
    });
  }

  /**
   * Handle foreground message (show custom notification or alert)
   */
  private handleForegroundMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    const { notification, data } = remoteMessage;

    if (notification) {
      // Show custom in-app notification or alert
      Alert.alert(notification.title || 'Notification', notification.body || 'You have a new message', [
        {
          text: 'Dismiss',
          style: 'cancel',
        },
        {
          text: 'View',
          onPress: () => this.handleNotificationPress(remoteMessage),
        },
      ]);
    }

    // Handle custom data
    if (data) {
      this.handleNotificationData(data as { [key: string]: string });
    }
  }

  /**
   * Handle notification press (navigation, deep linking)
   */
  private handleNotificationPress(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    const { data } = remoteMessage;

    if (data) {
      // Handle navigation based on notification data
      switch (data.type) {
        case 'chat_message':
          // Navigate to chat screen
          console.log('Navigate to chat:', data.chatId);
          break;
        case 'trip_update':
          // Navigate to trip details
          console.log('Navigate to trip:', data.tripId);
          break;
        case 'user_follow':
          // Navigate to user profile
          console.log('Navigate to profile:', data.userId);
          break;
        default:
          // Navigate to notifications screen
          console.log('Navigate to notifications');
          break;
      }
    }
  }

  /**
   * Handle notification data for app state updates
   */
  private handleNotificationData(data: { [key: string]: string }): void {
    // Update app state based on notification data
    // This could trigger Redux actions to update UI
    console.log('Processing notification data:', data);

    // Example: Update unread message count
    if (data.type === 'chat_message') {
      // dispatch(incrementUnreadMessages(data.chatId));
    }

    // Example: Refresh user data
    if (data.type === 'user_update') {
      // dispatch(refreshUserData());
    }
  }

  /**
   * Subscribe to topic
   */
  static async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to subscribe to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe from topic
   */
  static async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to unsubscribe from topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Send test notification (for development)
   */
  static async sendTestNotification(payload: PushNotificationPayload): Promise<void> {
    try {
      await baseApi.post('/notifications/send-test', payload);
      console.log('Test notification sent');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(): Promise<any> {
    try {
      const response = await baseApi.get('/notifications/settings');
      return response.data.data;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(settings: any): Promise<void> {
    try {
      await baseApi.put('/notifications/settings', settings);
      console.log('Notification settings updated');
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  }

  /**
   * Clear all notifications
   */
  static async clearAllNotifications(): Promise<void> {
    try {
      // Clear notifications from system tray (Android only)
      if (Platform.OS === 'android') {
        // This would require additional native implementation
        console.log('Clearing Android notifications');
      }

      // Mark all notifications as read in backend
      await baseApi.post('/notifications/mark-all-read');
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      throw error;
    }
  }

  /**
   * Check notification permission status
   */
  static async checkPermissionStatus(): Promise<FirebaseMessagingTypes.AuthorizationStatus> {
    return await messaging().hasPermission();
  }

  /**
   * Request notification permissions
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      } else {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    }
  }

  /**
   * Open notification settings
   */
  static async openNotificationSettings(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Failed to open notification settings:', error);
    }
  }
}
