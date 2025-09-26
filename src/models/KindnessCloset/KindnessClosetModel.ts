// src/models/KindnessCloset/KindnessClosetModel.ts

import { Location } from '../Location/LocationModel';
import { User } from '../User/UserModel';
import {
  AgeUnit,
  ApplicationStatus,
  Gender,
  KindnessClosetStatus,
  KindnessClosetType,
  SortBy,
  SortOrder,
} from './KindnessClosetEnum';

export interface BabyInfo {
  name?: string;
  ageFrom?: number;
  ageTo?: number;
  ageUnit?: AgeUnit;
  gender?: Gender;
  weight?: number;
  height?: number;
}

export interface KindnessCloset {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  type: KindnessClosetType;
  title: string;
  description: string;
  babyInfo?: BabyInfo;
  location: Location | string; // Can be populated Location object or ObjectId string
  tags: string[];
  images: string[];
  videos: string[];
  conditions?: string;
  status: KindnessClosetStatus;
  user: User | string; // Can be populated User object or ObjectId string
  applicationsCount: number;
  viewsCount: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  version?: number;
  __v?: number;
}

export interface ContactInfo {
  phoneNumber: string;
  contactName: string;
  address?: string;
}

export interface ItemInfo {
  itemName: string;
  condition?: string;
  quantity?: number;
  images?: string[];
}

export interface KindnessClosetApplication {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  kindnessCloset: KindnessCloset; // Can be populated or ObjectId string
  applicant: User | string; // Can be populated or ObjectId string
  message?: string;
  contactInfo: ContactInfo;
  babyInfo?: BabyInfo;
  itemsInfo?: ItemInfo[] | null;
  status: ApplicationStatus;
  note?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface KindnessClosetHistory {
  id: string;
  _id?: string; // MongoDB ObjectId as string
  giver: User | string; // Can be populated or ObjectId string
  receiver: User | string; // Can be populated or ObjectId string
  type: KindnessClosetType;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  location: Location | string; // Can be populated or ObjectId string
  babyInfo?: BabyInfo;
  contactInfo: ContactInfo;
  completedAt: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// State interfaces
export interface KindnessClosetFilters {
  type?: KindnessClosetType;
  status?: KindnessClosetStatus;
  city?: string;
  district?: string;
  tag?: string;
  search?: string;
  minAgeFrom?: number;
  maxAgeTo?: number;
  ageUnit?: AgeUnit;
  gender?: Gender;
  latitude?: number;
  longitude?: number;
  radius?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export interface KindnessClosetState {
  posts: KindnessCloset[];
  myPosts: KindnessCloset[];
  currentPost: KindnessCloset | null;
  similarPosts: KindnessCloset[];

  applications: KindnessClosetApplication[];
  myApplications: KindnessClosetApplication[];
  postApplications: KindnessClosetApplication[];
  currentApplication: KindnessClosetApplication | null;

  histories: KindnessClosetHistory[];
  givenHistory: KindnessClosetHistory[];
  receivedHistory: KindnessClosetHistory[];

  isLoading: boolean;
  isLoadingMore: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  error: string | null;

  pagination: PaginationInfo;
  myPostsPagination: PaginationInfo;
  applicationsPagination: PaginationInfo;
  historyPagination: PaginationInfo;

  filters: KindnessClosetFilters;
}
