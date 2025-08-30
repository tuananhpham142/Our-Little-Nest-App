// src/models/KindnessCloset/KindnessClosetRequest.ts

import {
    AgeUnit,
    ApplicationStatus,
    Gender,
    KindnessClosetStatus,
    KindnessClosetType,
    SortBy,
    SortOrder,
} from './KindnessClosetEnum';

// Create/Update DTOs
export interface CreateBabyInfoDto {
  name?: string;
  ageFrom?: number;
  ageTo?: number;
  ageUnit?: AgeUnit;
  gender?: Gender;
  weight?: number;
  height?: number;
}

export interface CreateKindnessClosetDto {
  type: KindnessClosetType;
  title: string;
  description: string;
  babyInfo?: CreateBabyInfoDto;
  location: string; // location ID
  tags: string[];
  images?: string[];
  videos?: string[];
  conditions?: string;
  expiresAt?: string;
}

export interface UpdateKindnessClosetDto {
  type?: KindnessClosetType;
  title?: string;
  description?: string;
  babyInfo?: CreateBabyInfoDto;
  location?: string;
  tags?: string[];
  images?: string[];
  videos?: string[];
  conditions?: string;
  status?: KindnessClosetStatus;
  expiresAt?: string;
}

// Query Parameters
export interface QueryKindnessClosetDto {
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
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface FindAllKindnessClosetsDto {
  page?: number;
  limit?: number;
}

// Default query parameters
export const DEFAULT_KINDNESS_CLOSET_PARAMS: QueryKindnessClosetDto = {
  page: 1,
  limit: 10,
  sortBy: SortBy.CREATED_AT,
  sortOrder: SortOrder.DESC,
  status: KindnessClosetStatus.ACTIVE,
};

// Application DTOs
export interface CreateContactInfoDto {
  phoneNumber: string;
  contactName: string;
  address?: string;
}

export interface CreateItemsInfoDto {
  itemName: string;
  condition?: string;
  quantity?: number;
  images?: string[];
}

export interface CreateKindnessClosetApplicationDto {
  message?: string;
  contactInfo: CreateContactInfoDto;
  babyInfo?: CreateBabyInfoDto;
  itemsInfo?: CreateItemsInfoDto[];
}

export interface UpdateKindnessClosetApplicationDto {
  status: ApplicationStatus;
  note?: string;
}

export interface QueryKindnessClosetApplicationDto {
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// History Query DTOs
export interface FindAllKindnessClosetHistoriesDto {
  page?: number;
  limit?: number;
}
