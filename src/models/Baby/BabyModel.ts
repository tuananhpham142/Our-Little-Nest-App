// src/models/Baby/BabyModel.ts

import { BabyPermissionEnum, FamilyRelationTypeEnum } from './BabyEnum';

export interface Baby {
  id: string;
  name: string;
  nickname?: string;
  birthDate: Date;
  gender: 'male' | 'female';
  weight?: number; // in grams
  height?: number; // in cm
  allergies: string[];
  medications: string[];
  notes?: string;
  familyMembers: FamilyMember[];
  avatarUrl?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // Virtual field from backend
  age?: number; // in months
}

export interface FamilyMember {
  userId: string;
  relationType: FamilyRelationTypeEnum;
  displayName?: string;
  isPrimary: boolean;
  permissions: BabyPermissionEnum[];
  addedAt: Date;
  addedBy: string;
  // Populated user info (if included in response)
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface BabyState {
  babies: Baby[];
  currentBaby: Baby | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  // Family member management
  familyMembers: FamilyMember[];
  isLoadingFamilyMembers: boolean;
  familyMemberError: string | null;
  // UI state
  selectedBabyId: string | null;
  activeTab: 'profile' | 'info' | 'family' | 'health';
}

export interface BabyStatistics {
  totalBabies: number;
  babiesAsPrimary: number;
  relationshipDistribution: Record<FamilyRelationTypeEnum, number>;
  averageAge: number;
  familyMembersCount: number;
}

export interface BabyFilters {
  gender?: 'male' | 'female';
  ageRange?: {
    min: number;
    max: number;
  };
  relationType?: FamilyRelationTypeEnum;
}

export interface BabyHealthInfo {
  weight?: number;
  height?: number;
  allergies: string[];
  medications: string[];
  notes?: string;
}

export interface BabyBasicInfo {
  name: string;
  nickname?: string;
  birthDate: Date;
  gender: 'male' | 'female';
  avatarUrl?: string;
}
