// src/utils/hooks/useAuth.ts
import { AuthService } from '@/services/auth/authService';
import { clearError, loginWithEmail, loginWithSocial, logout, refreshAuthToken } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { LoginCredentials } from '@/types/auth';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, isAuthenticated, error } = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        await dispatch(loginWithEmail(credentials)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const loginWithFacebook = useCallback(async () => {
    try {
      const authResponse = await AuthService.loginWithFacebook();
      await dispatch(
        loginWithSocial({
          accessToken: authResponse.token,
          provider: 'facebook',
        }),
      ).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const loginWithGoogle = useCallback(async () => {
    try {
      const authResponse = await AuthService.loginWithGoogle();
      await dispatch(
        loginWithSocial({
          accessToken: authResponse.token,
          provider: 'google',
        }),
      ).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const loginWithApple = useCallback(async () => {
    try {
      const authResponse = await AuthService.loginWithApple();
      await dispatch(
        loginWithSocial({
          accessToken: authResponse.token,
          provider: 'apple',
        }),
      ).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const signOut = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      await AuthService.logoutFromSocial();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch]);

  const refreshToken = useCallback(async () => {
    try {
      if (token) {
        await dispatch(refreshAuthToken(token)).unwrap();
      }
    } catch (error) {
      throw error;
    }
  }, [dispatch, token]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    login,
    loginWithFacebook,
    loginWithGoogle,
    loginWithApple,
    logout: signOut,
    refreshToken,
    clearError: clearAuthError,
  };
};
