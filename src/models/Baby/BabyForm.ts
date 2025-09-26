// src/models/Baby/BabyFormInterface.ts

import { BabyPermissionEnum, FamilyRelationTypeEnum } from './BabyEnum';

// Baby creation/edit form
export interface BabyFormData {
  name: string;
  nickname?: string;
  birthDate: Date | null;
  gender: 'male' | 'female' | '';
  weight?: string; // String for form input, converted to number
  height?: string; // String for form input, converted to number
  allergies: string[];
  medications: string[];
  notes?: string;
  avatarUri?: string; // Local URI for uploaded image
}

export interface BabyFormErrors {
  name?: string;
  birthDate?: string;
  gender?: string;
  weight?: string;
  height?: string;
  allergies?: string;
  medications?: string;
  general?: string;
}

export interface BabyFormState {
  data: BabyFormData;
  errors: BabyFormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Family member forms
export interface AddFamilyMemberFormData {
  email: string; // For invitation
  userId?: string; // For direct addition
  relationType: FamilyRelationTypeEnum;
  displayName?: string;
  isPrimary: boolean;
  permissions: BabyPermissionEnum[];
  message?: string; // For invitation
}

export interface AddFamilyMemberFormErrors {
  email?: string;
  userId?: string;
  relationType?: string;
  displayName?: string;
  permissions?: string;
  general?: string;
}

export interface AddFamilyMemberFormState {
  data: AddFamilyMemberFormData;
  errors: AddFamilyMemberFormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  mode: 'invite' | 'add'; // Invite by email or add existing user
}

// Edit family member form
export interface EditFamilyMemberFormData {
  relationType: FamilyRelationTypeEnum;
  displayName?: string;
  isPrimary: boolean;
  permissions: BabyPermissionEnum[];
}

export interface EditFamilyMemberFormErrors {
  relationType?: string;
  displayName?: string;
  permissions?: string;
  general?: string;
}

export interface EditFamilyMemberFormState {
  data: EditFamilyMemberFormData;
  errors: EditFamilyMemberFormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  canEditPrimary: boolean;
  canEditPermissions: boolean;
}

// Search and filter forms
export interface BabySearchFormData {
  query?: string;
  gender?: 'male' | 'female' | '';
  ageRange?: {
    min?: string;
    max?: string;
  };
  relationType?: FamilyRelationTypeEnum | '';
  hasAllergies?: boolean;
  hasMedications?: boolean;
}

export interface BabyFilterFormData {
  genderFilter: 'all' | 'male' | 'female';
  ageFilter: 'all' | 'newborn' | 'infant' | 'toddler';
  relationFilter: 'all' | FamilyRelationTypeEnum;
  healthFilter: 'all' | 'allergies' | 'medications' | 'both';
}

// UI component interfaces
export interface BabyCardData {
  id: string;
  name: string;
  nickname?: string;
  age: number; // in months
  gender: 'male' | 'female';
  avatarUrl?: string;
  isPrimary: boolean;
  relationshipToUser: FamilyRelationTypeEnum;
  healthFlags: {
    hasAllergies: boolean;
    hasMedications: boolean;
  };
}

export interface FamilyMemberCardData {
  userId: string;
  displayName: string;
  relationType: FamilyRelationTypeEnum;
  isPrimary: boolean;
  permissions: BabyPermissionEnum[];
  userInfo?: {
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  canEdit: boolean;
  canRemove: boolean;
  isCurrentUser: boolean;
}

// Form field configurations
export interface FormFieldConfig {
  required: boolean;
  disabled?: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
}

export interface BabyFormConfig {
  name: FormFieldConfig;
  nickname: FormFieldConfig;
  birthDate: FormFieldConfig;
  gender: FormFieldConfig;
  weight: FormFieldConfig;
  height: FormFieldConfig;
  allergies: FormFieldConfig;
  medications: FormFieldConfig;
  notes: FormFieldConfig;
}

// Permission management interfaces
export interface PermissionOption {
  permission: BabyPermissionEnum;
  label: string;
  description: string;
  icon: string;
  category: 'basic' | 'medical' | 'management' | 'advanced';
}

export interface PermissionGroup {
  category: string;
  label: string;
  permissions: PermissionOption[];
}

export interface RelationTypeOption {
  value: FamilyRelationTypeEnum;
  label: string;
  description?: string;
  icon: string;
  category: 'parent' | 'grandparent' | 'relative' | 'caregiver' | 'other';
  defaultPermissions: BabyPermissionEnum[];
}

// Modal and dialog interfaces
export interface ConfirmDeleteModalData {
  isVisible: boolean;
  babyName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface InvitationModalData {
  isVisible: boolean;
  babyName: string;
  onSend: (data: AddFamilyMemberFormData) => void;
  onCancel: () => void;
}

export interface PermissionModalData {
  isVisible: boolean;
  currentPermissions: BabyPermissionEnum[];
  relationType: FamilyRelationTypeEnum;
  onSave: (permissions: BabyPermissionEnum[]) => void;
  onCancel: () => void;
}

// Step-by-step form interfaces (for multi-step baby creation)
export interface BabyCreationStepData {
  step: 1 | 2 | 3 | 4;
  stepLabels: string[];
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export interface BabyCreationStep1Data {
  name: string;
  nickname?: string;
  gender: 'male' | 'female' | '';
}

export interface BabyCreationStep2Data {
  birthDate: Date | null;
  weight?: string;
  height?: string;
}

export interface BabyCreationStep3Data {
  allergies: string[];
  medications: string[];
  notes?: string;
}

export interface BabyCreationStep4Data {
  avatarUri?: string;
  familyMembers: AddFamilyMemberFormData[];
}
