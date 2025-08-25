// src/models/Badge/BadgeUIForm.ts

import { BadgeCategory, BadgeDifficulty } from './BadgeEnum';
import { BADGE_VALIDATION } from './BadgeRequest';

// Form field validation interfaces
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: FormFieldError[];
}

// Create/Edit Badge Form
export interface BadgeFormData {
  title: string;
  description: string;
  instruction: string;
  category: BadgeCategory | '';
  iconUrl: string;
  difficulty: BadgeDifficulty | '';
  minAge: string;
  maxAge: string;
  isActive: boolean;
  isCustom: boolean;
}

// Search/Filter Form
export interface BadgeFilterForm {
  search: string;
  category: BadgeCategory | '';
  difficulty: BadgeDifficulty | '';
  minAge: string;
  maxAge: string;
  isActive: boolean | null;
  isCustom: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Badge Selection Form (for awarding badges)
export interface BadgeSelectionForm {
  selectedBadgeId: string;
  selectedBabyId: string;
  completionDate: Date | string;
  note: string;
  mediaFiles: Array<{
    uri: string;
    type: string;
    name: string;
  }>;
}

// Form Props for React Native components
export interface BadgeFormProps {
  initialData?: Partial<BadgeFormData>;
  mode: 'create' | 'edit';
  isCustomBadge?: boolean;
  onSubmit: (data: BadgeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: FormFieldError[];
}

export interface BadgeFilterFormProps {
  initialFilters?: Partial<BadgeFilterForm>;
  onApply: (filters: BadgeFilterForm) => void;
  onClear: () => void;
  showCustomFilter?: boolean;
}

export interface BadgeSelectionFormProps {
  badges: Array<{ id: string; title: string; category: string }>;
  babies: Array<{ id: string; name: string; age: number }>;
  onSubmit: (data: BadgeSelectionForm) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: FormFieldError[];
}

// Form validation helpers
export const BadgeFormValidation = {
  validateTitle: (title: string): string | null => {
    if (!title || title.trim().length === 0) {
      return 'Title is required';
    }
    if (title.length < BADGE_VALIDATION.TITLE_MIN_LENGTH) {
      return `Title must be at least ${BADGE_VALIDATION.TITLE_MIN_LENGTH} characters`;
    }
    if (title.length > BADGE_VALIDATION.TITLE_MAX_LENGTH) {
      return `Title cannot exceed ${BADGE_VALIDATION.TITLE_MAX_LENGTH} characters`;
    }
    return null;
  },

  validateDescription: (description: string): string | null => {
    if (!description || description.trim().length === 0) {
      return 'Description is required';
    }
    if (description.length < BADGE_VALIDATION.DESCRIPTION_MIN_LENGTH) {
      return `Description must be at least ${BADGE_VALIDATION.DESCRIPTION_MIN_LENGTH} characters`;
    }
    if (description.length > BADGE_VALIDATION.DESCRIPTION_MAX_LENGTH) {
      return `Description cannot exceed ${BADGE_VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
    }
    return null;
  },

  validateInstruction: (instruction: string): string | null => {
    if (!instruction || instruction.trim().length === 0) {
      return 'Instruction is required';
    }
    if (instruction.length < BADGE_VALIDATION.INSTRUCTION_MIN_LENGTH) {
      return `Instruction must be at least ${BADGE_VALIDATION.INSTRUCTION_MIN_LENGTH} characters`;
    }
    if (instruction.length > BADGE_VALIDATION.INSTRUCTION_MAX_LENGTH) {
      return `Instruction cannot exceed ${BADGE_VALIDATION.INSTRUCTION_MAX_LENGTH} characters`;
    }
    return null;
  },

  validateAgeRange: (minAge: string, maxAge: string): string | null => {
    const min = parseInt(minAge, 10);
    const max = parseInt(maxAge, 10);

    if (minAge && isNaN(min)) {
      return 'Minimum age must be a number';
    }
    if (maxAge && isNaN(max)) {
      return 'Maximum age must be a number';
    }

    if (min < BADGE_VALIDATION.MIN_AGE || min > BADGE_VALIDATION.MAX_AGE) {
      return `Minimum age must be between ${BADGE_VALIDATION.MIN_AGE} and ${BADGE_VALIDATION.MAX_AGE} months`;
    }

    if (max < BADGE_VALIDATION.MIN_AGE || max > BADGE_VALIDATION.MAX_AGE) {
      return `Maximum age must be between ${BADGE_VALIDATION.MIN_AGE} and ${BADGE_VALIDATION.MAX_AGE} months`;
    }

    if (min && max && min > max) {
      return 'Minimum age cannot be greater than maximum age';
    }

    // Business rule: Hard difficulty not appropriate for babies under 6 months
    if (min < 6) {
      return 'Badges for babies under 6 months should not be hard difficulty';
    }

    return null;
  },

  validateCategory: (category: string): string | null => {
    if (!category) {
      return 'Category is required';
    }
    if (!Object.values(BadgeCategory).includes(category as BadgeCategory)) {
      return 'Invalid category selected';
    }
    return null;
  },

  validateDifficulty: (difficulty: string): string | null => {
    if (!difficulty) {
      return 'Difficulty is required';
    }
    if (!Object.values(BadgeDifficulty).includes(difficulty as BadgeDifficulty)) {
      return 'Invalid difficulty selected';
    }
    return null;
  },

  validateForm: (data: BadgeFormData): FormValidation => {
    const errors: FormFieldError[] = [];

    const titleError = BadgeFormValidation.validateTitle(data.title);
    if (titleError) {
      errors.push({ field: 'title', message: titleError });
    }

    const descError = BadgeFormValidation.validateDescription(data.description);
    if (descError) {
      errors.push({ field: 'description', message: descError });
    }

    const instructionError = BadgeFormValidation.validateInstruction(data.instruction);
    if (instructionError) {
      errors.push({ field: 'instruction', message: instructionError });
    }

    const categoryError = BadgeFormValidation.validateCategory(data.category);
    if (categoryError) {
      errors.push({ field: 'category', message: categoryError });
    }

    const difficultyError = BadgeFormValidation.validateDifficulty(data.difficulty);
    if (difficultyError) {
      errors.push({ field: 'difficulty', message: difficultyError });
    }

    if (data.minAge || data.maxAge) {
      const ageError = BadgeFormValidation.validateAgeRange(data.minAge, data.maxAge);
      if (ageError) {
        errors.push({ field: 'ageRange', message: ageError });
      }
    }

    // Additional validation for hard difficulty
    if (data.difficulty === BadgeDifficulty.HARD && data.minAge) {
      const minAge = parseInt(data.minAge, 10);
      if (minAge < 6) {
        errors.push({
          field: 'difficulty',
          message: 'Hard difficulty not appropriate for babies under 6 months',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Helper to check if user can create more custom badges
  canCreateMoreCustomBadges: (currentCount: number): boolean => {
    return currentCount < BADGE_VALIDATION.MAX_CUSTOM_BADGES_PER_USER;
  },

  getRemainingCustomBadges: (currentCount: number): number => {
    return Math.max(0, BADGE_VALIDATION.MAX_CUSTOM_BADGES_PER_USER - currentCount);
  },
};

// Helper to get age group from months
export const getAgeGroupFromMonths = (months: number): string => {
  if (months < 3) return 'Newborn (0-3 months)';
  if (months < 12) return 'Infant (3-12 months)';
  if (months < 36) return 'Toddler (1-3 years)';
  if (months < 60) return 'Preschooler (3-5 years)';
  return 'School age (5+ years)';
};

// Helper to format age display
export const formatAgeDisplay = (months: number): string => {
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
};
