// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'facebook' | 'google' | 'apple' | 'email';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface SocialAuthCredentials {
  accessToken: string;
  provider: 'facebook' | 'google' | 'apple';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
