// src/models/PregnancyJournal/PregnancyJournalUIForm.ts

import { GenderType, MoodType, PregnancyJournalStatus, SharePermission } from './PregnancyJournalEnum';

// Form field validation interfaces
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: FormFieldError[];
}

// Create/Edit Journal Form
export interface PregnancyJournalFormData {
  title: string;
  description: string;
  babyNickname: string;
  babyGender: GenderType;
  expectedDueDate: Date | string;
  currentWeek: string;
  estimatedWeight: string;
  estimatedLength: string;
  pregnancyStartDate: Date | string;
  status: PregnancyJournalStatus;
  isPublic: boolean;
  defaultPermission: SharePermission;
}

// Emotion Entry Form
export interface EmotionEntryFormData {
  date: Date | string;
  content: string;
  mood: MoodType | '';
  isPrivate: boolean;
}

// Share Journal Form
export interface ShareJournalFormData {
  searchUser: string;
  selectedUsers: Array<{
    userId: string;
    username: string;
    avatar?: string;
  }>;
  permission: SharePermission;
  makePublic: boolean;
}

// Search/Filter Form
export interface PregnancyJournalFilterForm {
  search: string;
  status: PregnancyJournalStatus | '';
  currentWeekFrom: string;
  currentWeekTo: string;
  isPublic: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateFrom: Date | null;
  dateTo: Date | null;
}

// Form Props for React Native components
export interface PregnancyJournalFormProps {
  initialData?: Partial<PregnancyJournalFormData>;
  mode: 'create' | 'edit';
  onSubmit: (data: PregnancyJournalFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: FormFieldError[];
}

export interface EmotionEntryFormProps {
  journalId: string;
  onSubmit: (data: EmotionEntryFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: FormFieldError[];
}

export interface ShareJournalFormProps {
  journalId: string;
  currentSettings?: {
    isPublic: boolean;
    permission: SharePermission;
    sharedWith: Array<{ userId: string; permission: SharePermission }>;
  };
  onSubmit: (data: ShareJournalFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: FormFieldError[];
}

// Form validation helpers
export const PregnancyJournalFormValidation = {
  validateTitle: (title: string): string | null => {
    if (!title || title.trim().length === 0) {
      return 'Title is required';
    }
    if (title.length < 3) {
      return 'Title must be at least 3 characters';
    }
    if (title.length > 200) {
      return 'Title cannot exceed 200 characters';
    }
    return null;
  },

  validateDescription: (description?: string): string | null => {
    if (description && description.length > 1000) {
      return 'Description cannot exceed 1000 characters';
    }
    return null;
  },

  validateCurrentWeek: (week: string | number): string | null => {
    const weekNum = typeof week === 'string' ? parseInt(week, 10) : week;
    if (isNaN(weekNum)) {
      return 'Week must be a number';
    }
    if (weekNum < 1 || weekNum > 42) {
      return 'Week must be between 1 and 42';
    }
    return null;
  },

  validateDueDate: (dueDate: Date | string, pregnancyStartDate: Date | string): string | null => {
    const due = new Date(dueDate);
    const start = new Date(pregnancyStartDate);

    if (due < start) {
      return 'Due date cannot be before pregnancy start date';
    }

    const diffWeeks = Math.floor((due.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
    if (diffWeeks < 35 || diffWeeks > 45) {
      return 'Due date should be approximately 40 weeks from start date';
    }

    return null;
  },

  validateEmotionContent: (content: string): string | null => {
    if (!content || content.trim().length === 0) {
      return 'Content is required';
    }
    if (content.length > 2000) {
      return 'Content cannot exceed 2000 characters';
    }
    return null;
  },

  validateForm: (data: PregnancyJournalFormData): FormValidation => {
    const errors: FormFieldError[] = [];

    const titleError = PregnancyJournalFormValidation.validateTitle(data.title);
    if (titleError) {
      errors.push({ field: 'title', message: titleError });
    }

    const descError = PregnancyJournalFormValidation.validateDescription(data.description);
    if (descError) {
      errors.push({ field: 'description', message: descError });
    }

    const weekError = PregnancyJournalFormValidation.validateCurrentWeek(data.currentWeek);
    if (weekError) {
      errors.push({ field: 'currentWeek', message: weekError });
    }

    const dueDateError = PregnancyJournalFormValidation.validateDueDate(data.expectedDueDate, data.pregnancyStartDate);
    if (dueDateError) {
      errors.push({ field: 'expectedDueDate', message: dueDateError });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
