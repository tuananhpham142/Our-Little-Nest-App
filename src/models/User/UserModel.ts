// src/models/User/UserModel.ts

export interface FileSchema {
  id?: string;
  path?: string;
  url?: string;
}

export interface RoleSchema {
  _id: string;
  name?: number;
}

export interface StatusSchema {
  _id: number;
  id: number;
}

export interface User {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  email: string | null;
  phoneNumber: string | null;
  password?: string;
  provider: string;
  socialId?: string | null;
  firstName: string | null;
  lastName: string | null;
  photo?: FileSchema | null;
  role?: RoleSchema | null;
  status?: StatusSchema;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  __v?: number;
}

// Helper to get full name
export const getUserFullName = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.firstName || user.lastName || 'Unknown User';
};

// Auth provider enum
export enum AuthProvidersEnum {
  EMAIL = 'email',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  APPLE = 'apple',
}
