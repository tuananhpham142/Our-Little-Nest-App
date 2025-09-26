// src/models/BadgeCollection/BadgeCollectionUIForm.ts

import { VerificationStatus } from '../Badge/BadgeEnum';
import { BADGE_COLLECTION_VALIDATION } from './BadgeCollectionRequest';

// Form field validation interfaces
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: FormFieldError[];
}

// Award Badge Form
export interface AwardBadgeFormData {
  babyId: string;
  badgeId: string;
  completedAt: Date | string;
  submissionNote: string;
  mediaFiles: Array<{
    uri: string;
    type: string;
    name: string;
    size: number;
  }>;
}

// Update Badge Collection Form
export interface UpdateBadgeCollectionFormData {
  completedAt: Date | string;
  submissionNote: string;
  mediaFiles: Array<{
    uri: string;
    type: string;
    name: string;
    size: number;
  }>;
}

// Verification Form (Admin)
export interface VerificationFormData {
  action: 'approve' | 'reject';
  verificationNote: string;
}

// Filter Form
export interface BadgeCollectionFilterForm {
  babyId: string;
  badgeId: string;
  verificationStatus: VerificationStatus | '';
  completedAfter: Date | null;
  completedBefore: Date | null;
  sortBy: 'completedAt' | 'createdAt' | 'verifiedAt';
  sortOrder: 'asc' | 'desc';
}

// Form Props for React Native components
export interface AwardBadgeFormProps {
  babies: Array<{ id: string; name: string; age: number }>;
  badges: Array<{ id: string; title: string; category: string; difficulty: string }>;
  onSubmit: (data: AwardBadgeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: FormFieldError[];
  defaultBabyId?: string;
  defaultBadgeId?: string;
}

export interface UpdateBadgeCollectionFormProps {
  initialData?: Partial<UpdateBadgeCollectionFormData>;
  onSubmit: (data: UpdateBadgeCollectionFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errors?: FormFieldError[];
}

export interface VerificationFormProps {
  collectionId: string;
  collectionDetails: {
    babyName: string;
    badgeTitle: string;
    submittedBy: string;
    submittedAt: string;
    note?: string;
    media?: string[];
  };
  onApprove: () => void;
  onReject: (note?: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface BadgeCollectionFilterFormProps {
  initialFilters?: Partial<BadgeCollectionFilterForm>;
  babies: Array<{ id: string; name: string }>;
  badges: Array<{ id: string; title: string }>;
  onApply: (filters: BadgeCollectionFilterForm) => void;
  onClear: () => void;
}

// Form validation helpers
export const BadgeCollectionFormValidation = {
  validateBabyId: (babyId: string): string | null => {
    if (!babyId || babyId.trim().length === 0) {
      return 'Please select a baby';
    }
    return null;
  },

  validateBadgeId: (badgeId: string): string | null => {
    if (!badgeId || badgeId.trim().length === 0) {
      return 'Please select a badge';
    }
    return null;
  },

  validateCompletedAt: (completedAt: Date | string): string | null => {
    const date = new Date(completedAt);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    if (date > now) {
      return 'Completion date cannot be in the future';
    }

    // Check if date is not too far in the past (e.g., 5 years)
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    if (date < fiveYearsAgo) {
      return 'Completion date seems too far in the past';
    }

    return null;
  },

  validateSubmissionNote: (note?: string): string | null => {
    if (note && note.length > BADGE_COLLECTION_VALIDATION.NOTE_MAX_LENGTH) {
      return `Note cannot exceed ${BADGE_COLLECTION_VALIDATION.NOTE_MAX_LENGTH} characters`;
    }
    return null;
  },

  validateMediaFiles: (files: Array<{ size: number; type: string }>): string | null => {
    if (files.length > BADGE_COLLECTION_VALIDATION.MAX_MEDIA_FILES) {
      return `Maximum ${BADGE_COLLECTION_VALIDATION.MAX_MEDIA_FILES} files allowed`;
    }

    for (const file of files) {
      if (file.size > BADGE_COLLECTION_VALIDATION.MAX_FILE_SIZE) {
        return 'File size cannot exceed 10MB';
      }

      if (!BADGE_COLLECTION_VALIDATION.ALLOWED_FILE_TYPES.includes(file.type)) {
        return 'Invalid file type. Only images and videos are allowed';
      }
    }

    return null;
  },

  validateAwardBadgeForm: (data: AwardBadgeFormData): FormValidation => {
    const errors: FormFieldError[] = [];

    const babyError = BadgeCollectionFormValidation.validateBabyId(data.babyId);
    if (babyError) {
      errors.push({ field: 'babyId', message: babyError });
    }

    const badgeError = BadgeCollectionFormValidation.validateBadgeId(data.badgeId);
    if (badgeError) {
      errors.push({ field: 'badgeId', message: badgeError });
    }

    const dateError = BadgeCollectionFormValidation.validateCompletedAt(data.completedAt);
    if (dateError) {
      errors.push({ field: 'completedAt', message: dateError });
    }

    const noteError = BadgeCollectionFormValidation.validateSubmissionNote(data.submissionNote);
    if (noteError) {
      errors.push({ field: 'submissionNote', message: noteError });
    }

    if (data.mediaFiles && data.mediaFiles.length > 0) {
      const mediaError = BadgeCollectionFormValidation.validateMediaFiles(data.mediaFiles);
      if (mediaError) {
        errors.push({ field: 'mediaFiles', message: mediaError });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Helper to check if can submit more badges today
  canSubmitMoreToday: (todaySubmissions: number): boolean => {
    return todaySubmissions < BADGE_COLLECTION_VALIDATION.MAX_BADGES_PER_DAY;
  },

  getRemainingSubmissionsToday: (todaySubmissions: number): number => {
    return Math.max(0, BADGE_COLLECTION_VALIDATION.MAX_BADGES_PER_DAY - todaySubmissions);
  },
};

// Helper functions for display
export const formatVerificationStatus = (status: VerificationStatus): string => {
  const statusMap = {
    [VerificationStatus.PENDING]: 'Pending Review',
    [VerificationStatus.APPROVED]: 'Approved',
    [VerificationStatus.REJECTED]: 'Rejected',
    [VerificationStatus.AUTO_APPROVED]: 'Auto-Approved',
  };
  return statusMap[status] || status;
};

export const getVerificationStatusColor = (status: VerificationStatus): string => {
  const colorMap = {
    [VerificationStatus.PENDING]: '#FFA500', // Orange
    [VerificationStatus.APPROVED]: '#4CAF50', // Green
    [VerificationStatus.REJECTED]: '#F44336', // Red
    [VerificationStatus.AUTO_APPROVED]: '#4CAF50', // Green
  };
  return colorMap[status] || '#999999';
};

export const getVerificationStatusIcon = (status: VerificationStatus): string => {
  const iconMap = {
    [VerificationStatus.PENDING]: '⏳',
    [VerificationStatus.APPROVED]: '✅',
    [VerificationStatus.REJECTED]: '❌',
    [VerificationStatus.AUTO_APPROVED]: '✅',
  };
  return iconMap[status] || '❓';
};

// Helper to format date for display
export const formatCompletionDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper to group collections by month
export const groupCollectionsByMonth = (
  collections: Array<{ completedAt: string }>,
): Record<string, typeof collections> => {
  const grouped: Record<string, typeof collections> = {};

  collections.forEach((collection) => {
    const month = new Date(collection.completedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(collection);
  });

  return grouped;
};

// Media file helpers
export const isImageFile = (type: string): boolean => {
  return type.startsWith('image/');
};

export const isVideoFile = (type: string): boolean => {
  return type.startsWith('video/');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getFileIcon = (type: string): string => {
  if (isImageFile(type)) return '🖼️';
  if (isVideoFile(type)) return '🎥';
  return '📎';
};
