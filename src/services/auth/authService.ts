// src/services/auth/AuthService.ts

// Social Auth imports
import { ApiResponse } from '@/types/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, SocialAuthCredentials } from '@/types/auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { baseApi } from '../baseApi';

export class AuthService {
  /**
   * Email/Password Authentication
   */
  static async loginWithEmail(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await baseApi.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await baseApi.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
      return response.data.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    try {
      await baseApi.post('/auth/forgot-password', { email });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await baseApi.post('/auth/reset-password', { token, password: newPassword });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Social Authentication
   */
  static async loginWithSocial(credentials: SocialAuthCredentials): Promise<AuthResponse> {
    try {
      const response = await baseApi.post<ApiResponse<AuthResponse>>('/auth/social', credentials);
      return response.data.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Facebook Authentication
   */
  static async loginWithFacebook(): Promise<AuthResponse> {
    try {
      // Request permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        throw new Error('Facebook login was cancelled');
      }

      // Get access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Failed to get Facebook access token');
      }

      // Authenticate with backend
      return await this.loginWithSocial({
        accessToken: data.accessToken,
        provider: 'facebook',
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Google Authentication
   */
  static async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // Configure Google Sign-In (should be done once in App.tsx)
      await GoogleSignin.hasPlayServices();

      // Sign in
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error('Failed to get Google ID token');
      }

      // Authenticate with backend
      return await this.loginWithSocial({
        accessToken: userInfo.data.idToken,
        provider: 'google',
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Apple Authentication (iOS only)
   */
  static async loginWithApple(): Promise<AuthResponse> {
    try {
      if (Platform.OS !== 'ios') {
        throw new Error('Apple Sign-In is only available on iOS');
      }

      // Check if Apple Sign-In is available
      const isSupported = appleAuth.isSupported;
      if (!isSupported) {
        throw new Error('Apple Sign-In is not supported on this device');
      }

      // Perform sign-in
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Get current authentication state
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      if (credentialState !== appleAuth.State.AUTHORIZED) {
        throw new Error('Apple Sign-In authorization failed');
      }

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Failed to get Apple identity token');
      }

      // Authenticate with backend
      return await this.loginWithSocial({
        accessToken: appleAuthRequestResponse.identityToken,
        provider: 'apple',
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Token Management
   */
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await baseApi.post<ApiResponse<AuthResponse>>('/auth/refresh', {
        refreshToken,
      });
      return response.data.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  static async logout(token: string): Promise<void> {
    try {
      await baseApi.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      // Log but don't throw error for logout
      console.warn('Logout API call failed:', error);
    }
  }

  /**
   * Social logout methods
   */
  static async logoutFromSocial(): Promise<void> {
    try {
      // Facebook logout
      await LoginManager.logOut();

      // Google logout
      if (await GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut();
      }

      // Apple logout (no explicit logout needed)
    } catch (error) {
      console.warn('Social logout failed:', error);
    }
  }

  /**
   * Utility Methods
   */
  static async configureGoogleSignIn(): Promise<void> {
    try {
      GoogleSignin.configure({
        webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID', // From Google Developer Console
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
    } catch (error) {
      console.error('Google Sign-In configuration failed:', error);
    }
  }

  static async getCurrentUser(): Promise<any> {
    try {
      const response = await baseApi.get<ApiResponse<any>>('/auth/me');
      return response.data.data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Error handling
   */
  private static handleAuthError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }

    if (error.message) {
      return new Error(error.message);
    }

    return new Error('Authentication failed');
  }
}
