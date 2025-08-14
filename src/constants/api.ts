// src/utils/constants/api.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    SOCIAL: '/auth/social',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    AVATAR: '/users/avatar',
    DELETE: '/users/delete',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/mark-read',
    MARK_ALL_READ: '/notifications/mark-all-read',
    SETTINGS: '/notifications/settings',
    REGISTER_DEVICE: '/notifications/register-device',
    UNREGISTER_DEVICE: '/notifications/unregister-device',
  },
  TRIPS: {
    LIST: '/trips',
    CREATE: '/trips',
    DETAIL: '/trips/:id',
    UPDATE: '/trips/:id',
    DELETE: '/trips/:id',
  },
} as const;
