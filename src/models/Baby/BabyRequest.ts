// src/models/Baby/BabyRequest.ts

import { BabyPermissionEnum, FamilyRelationTypeEnum } from './BabyEnum';

// Baby CRUD requests
export interface CreateBabyRequest {
  name: string;
  nickname?: string;
  birthDate: Date;
  gender: 'male' | 'female';
  weight?: number;
  height?: number;
  allergies?: string[];
  medications?: string[];
  notes?: string;
  // Family member info for creator
  creatorRelationType?: FamilyRelationTypeEnum;
  familyMembers?: AddFamilyMemberRequest[];
}

export interface UpdateBabyRequest {
  name?: string;
  nickname?: string;
  birthDate?: Date;
  gender?: 'male' | 'female';
  weight?: number;
  height?: number;
  allergies?: string[];
  medications?: string[];
  notes?: string;
}

export interface GetBabiesRequest {
  // page?: number;
  // limit?: number;
  // gender?: 'male' | 'female';
  // ageRange?: {
  //   min: number;
  //   max: number;
  // };
}

export interface GetBabyByIdRequest {
  id: string;
}

export interface DeleteBabyRequest {
  id: string;
}

// Family member requests
export interface AddFamilyMemberRequest {
  userId: string;
  relationType: FamilyRelationTypeEnum;
  displayName?: string;
  isPrimary?: boolean;
  permissions?: BabyPermissionEnum[];
}

export interface UpdateFamilyMemberRequest {
  relationType?: FamilyRelationTypeEnum;
  displayName?: string;
  isPrimary?: boolean;
  permissions?: BabyPermissionEnum[];
}

export interface RemoveFamilyMemberRequest {
  babyId: string;
  userId: string;
}

export interface InviteFamilyMemberRequest {
  email: string;
  relationType: FamilyRelationTypeEnum;
  displayName?: string;
  isPrimary?: boolean;
  permissions?: BabyPermissionEnum[];
  message?: string;
}

// Media upload requests
export interface UploadAvatarRequest {
  babyId: string;
  file: File | FormData;
}

// Query requests
export interface GetBabiesByRelationRequest {
  relationType: FamilyRelationTypeEnum;
  page?: number;
  limit?: number;
}

export interface GetFamilyMembersRequest {
  babyId: string;
  includeUserDetails?: boolean;
}

export interface GetPrimaryCaregiversRequest {
  babyId: string;
}

export interface GetBabyStatisticsRequest {
  userId?: string;
}

// Search and filter requests
export interface SearchBabiesRequest {
  query?: string;
  filters?: {
    gender?: 'male' | 'female';
    ageRange?: {
      min: number;
      max: number;
    };
    relationType?: FamilyRelationTypeEnum;
    hasAllergies?: boolean;
    hasMedications?: boolean;
  };
  sortBy?: 'name' | 'birthDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Default parameters
export const DEFAULT_BABY_PARAMS: Partial<GetBabiesRequest> = {
  page: 1,
  limit: 10,
};

export const DEFAULT_SEARCH_PARAMS: Partial<SearchBabiesRequest> = {
  page: 1,
  limit: 10,
  sortBy: 'birthDate',
  sortOrder: 'desc',
};

// Validation interfaces
export interface BabyValidationRules {
  name: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  birthDate: {
    required: boolean;
    maxDate: Date; // Can't be in future
  };
  weight: {
    min: number; // grams
    max: number;
  };
  height: {
    min: number; // cm
    max: number;
  };
}

export const BABY_VALIDATION_RULES: BabyValidationRules = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  birthDate: {
    required: true,
    maxDate: new Date(),
  },
  weight: {
    min: 500, // 500g minimum
    max: 10000, // 10kg maximum for babies
  },
  height: {
    min: 20, // 20cm minimum
    max: 100, // 100cm maximum for babies
  },
};
