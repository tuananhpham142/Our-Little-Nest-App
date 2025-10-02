// src/models/Badge/BadgeUIForm.ts

import { BadgeCategory, BadgeDifficulty } from './BadgeEnum';
import { Badge } from './BadgeModel';

// Form interfaces for UI components
export interface BadgeFormUI {
  id?: string;
  title: string;
  description: string;
  instruction: string;
  category: BadgeCategory | '';
  iconUrl: string;
  difficulty: BadgeDifficulty | '';
  minAge: string; // String for form input, will be converted to number
  maxAge: string; // String for form input, will be converted to number
  isCustom: boolean;
  isActive: boolean;
}

// Create badge form
export interface CreateBadgeFormUI extends Omit<BadgeFormUI, 'id' | 'isActive'> {
  // Additional form-specific fields
  submitForReview: boolean;
  agreeToTerms: boolean;
}

// Update badge form
export interface UpdateBadgeFormUI extends Partial<BadgeFormUI> {
  id: string;
  // Form-specific update fields
  reasonForUpdate?: string;
}

// Badge filter form for search/filter UI
export interface BadgeFilterFormUI {
  search: string;
  category: BadgeCategory | 'all';
  difficulty: BadgeDifficulty | 'all';
  minAge: string;
  maxAge: string;
  isActive: 'all' | 'true' | 'false';
  isCustom: 'all' | 'true' | 'false';
  showMyBadgesOnly: boolean;
}

// Badge search form
export interface BadgeSearchFormUI {
  searchTerm: string;
  searchIn: 'title' | 'description' | 'instruction' | 'all';
  category: BadgeCategory | 'all';
  difficulty: BadgeDifficulty | 'all';
  ageRange: {
    min: string;
    max: string;
  };
  isActive: boolean;
  isCustom: 'all' | 'true' | 'false';
  createdBy: 'all' | 'me' | 'others';
}

// Badge validation form
export interface BadgeValidationFormUI {
  title: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  description: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  instruction: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  category: {
    value: BadgeCategory | '';
    isValid: boolean;
    errorMessage: string;
  };
  difficulty: {
    value: BadgeDifficulty | '';
    isValid: boolean;
    errorMessage: string;
  };
  ageRange: {
    minAge: {
      value: string;
      isValid: boolean;
      errorMessage: string;
    };
    maxAge: {
      value: string;
      isValid: boolean;
      errorMessage: string;
    };
    isValidRange: boolean;
    rangeErrorMessage: string;
  };
  iconUrl: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  isFormValid: boolean;
  generalErrors: string[];
}

// Badge display form for read-only views
export interface BadgeDisplayFormUI {
  id: string;
  title: string;
  description: string;
  instruction: string;
  category: {
    value: BadgeCategory;
    label: string;
    icon: string;
    color: string;
  };
  iconUrl: string;
  difficulty: {
    value: BadgeDifficulty;
    label: string;
    color: string;
    stars: number;
  };
  ageRange: {
    min: number;
    max: number;
    display: string;
  };
  isCustom: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
  statistics?: {
    totalAwarded: number;
    recentlyAwarded: number;
    popularityScore: number;
  };
}

// Conversion utilities
export class BadgeFormConverter {
  /**
   * Convert Badge model to form UI
   */
  static toFormUI(badge: Badge): BadgeFormUI {
    return {
      id: badge.id,
      title: badge.title,
      description: badge.description,
      instruction: badge.instruction,
      category: badge.category,
      iconUrl: badge.iconUrl || '',
      difficulty: badge.difficulty,
      minAge: badge.minAge?.toString() || '',
      maxAge: badge.maxAge?.toString() || '',
      isCustom: badge.isCustom,
      isActive: badge.isActive,
    };
  }

  /**
   * Get empty form UI
   */
  static getEmptyForm(): CreateBadgeFormUI {
    return {
      title: '',
      description: '',
      instruction: '',
      category: '',
      iconUrl: '',
      difficulty: '',
      minAge: '',
      maxAge: '',
      isCustom: true,
      submitForReview: false,
      agreeToTerms: false,
    };
  }

  /**
   * Get default filter form
   */
  static getDefaultFilterForm(): BadgeFilterFormUI {
    return {
      search: '',
      category: 'all',
      difficulty: 'all',
      minAge: '',
      maxAge: '',
      isActive: 'true',
      isCustom: 'all',
      showMyBadgesOnly: false,
    };
  }

  /**
   * Validate form data
   */
  // static validateForm(form: CreateBadgeFormUI | UpdateBadgeFormUI): BadgeValidationFormUI {
  //   const validation: BadgeValidationFormUI = {
  //     title: { value: form.title, isValid: true, errorMessage: '' },
  //     description: { value: form.description, isValid: true, errorMessage: '' },
  //     instruction: { value: form.instruction, isValid: true, errorMessage: '' },
  //     category: { value: form.category, isValid: true, errorMessage: '' },
  //     difficulty: { value: form.difficulty, isValid: true, errorMessage: '' },
  //     ageRange: {
  //       minAge: { value: form.minAge, isValid: true, errorMessage: '' },
  //       maxAge: { value: form.maxAge, isValid: true, errorMessage: '' },
  //       isValidRange: true,
  //       rangeErrorMessage: '',
  //     },
  //     iconUrl: { value: form.iconUrl, isValid: true, errorMessage: '' },
  //     isFormValid: true,
  //     generalErrors: [],
  //   };

  //   // Validate title
  //   if (!form.title || form.title.trim().length === 0) {
  //     validation.title.isValid = false;
  //     validation.title.errorMessage = 'Title is required';
  //   } else if (form.title.trim().length < 3) {
  //     validation.title.isValid = false;
  //     validation.title.errorMessage = 'Title must be at least 3 characters';
  //   } else if (form.title.trim().length > 100) {
  //     validation.title.isValid = false;
  //     validation.title.errorMessage = 'Title must be less than 100 characters';
  //   }

  //   // Validate description
  //   if (!form.description || form.description.trim().length === 0) {
  //     validation.description.isValid = false;
  //     validation.description.errorMessage = 'Description is required';
  //   } else if (form.description.trim().length < 10) {
  //     validation.description.isValid = false;
  //     validation.description.errorMessage = 'Description must be at least 10 characters';
  //   } else if (form.description.trim().length > 500) {
  //     validation.description.isValid = false;
  //     validation.description.errorMessage = 'Description must be less than 500 characters';
  //   }

  //   // Validate instruction
  //   if (!form.instruction || form.instruction.trim().length === 0) {
  //     validation.instruction.isValid = false;
  //     validation.instruction.errorMessage = 'Instruction is required';
  //   } else if (form.instruction.trim().length < 10) {
  //     validation.instruction.isValid = false;
  //     validation.instruction.errorMessage = 'Instruction must be at least 10 characters';
  //   } else if (form.instruction.trim().length > 1000) {
  //     validation.instruction.isValid = false;
  //     validation.instruction.errorMessage = 'Instruction must be less than 1000 characters';
  //   }

  //   // Validate category
  //   if (!form.category) {
  //     validation.category.isValid = false;
  //     validation.category.errorMessage = 'Category is required';
  //   }

  //   // Validate difficulty
  //   if (!form.difficulty) {
  //     validation.difficulty.isValid = false;
  //     validation.difficulty.errorMessage = 'Difficulty is required';
  //   }

  //   // Validate age range
  //   const minAge = form.minAge ? parseInt(form.minAge, 10) : null;
  //   const maxAge = form.maxAge ? parseInt(form.maxAge, 10) : null;

  //   if (form.minAge && (isNaN(minAge!) || minAge! < 0)) {
  //     validation.ageRange.minAge.isValid = false;
  //     validation.ageRange.minAge.errorMessage = 'Minimum age must be a valid number';
  //   }

  //   if (form.maxAge && (isNaN(maxAge!) || maxAge! < 0)) {
  //     validation.ageRange.maxAge.isValid = false;
  //     validation.ageRange.maxAge.errorMessage = 'Maximum age must be a valid number';
  //   }

  //   if (minAge !== null && maxAge !== null && minAge > maxAge) {
  //     validation.ageRange.isValidRange = false;
  //     validation.ageRange.rangeErrorMessage = 'Minimum age cannot be greater than maximum age';
  //   }

  //   // Validate icon URL (optional)
  //   if (form.iconUrl && form.iconUrl.trim()) {
  //     try {
  //       new URL(form.iconUrl);
  //     } catch {
  //       validation.iconUrl.isValid = false;
  //       validation.iconUrl.errorMessage = 'Icon URL must be a valid URL';
  //     }
  //   }

  //   // Check overall form validity
  //   validation.isFormValid =
  //     validation.title.isValid &&
  //     validation.description.isValid &&
  //     validation.instruction.isValid &&
  //     validation.category.isValid &&
  //     validation.difficulty.isValid &&
  //     validation.ageRange.minAge.isValid &&
  //     validation.ageRange.maxAge.isValid &&
  //     validation.ageRange.isValidRange &&
  //     validation.iconUrl.isValid;

  //   return validation;
  // }
}
