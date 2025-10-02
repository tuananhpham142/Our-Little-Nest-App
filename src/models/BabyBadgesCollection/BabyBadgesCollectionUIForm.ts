// src/models/BabyBadgesCollection/BabyBadgesCollectionUIForm.ts

import { VerificationStatus } from './BabyBadgesCollectionEnum';
import { BabyBadgesCollection } from './BabyBadgesCollectionModel';

// Form interfaces for UI components
export interface BabyBadgesCollectionFormUI {
  id?: string;
  babyId: string;
  badgeId: string;
  completedAt: string; // String for form input, will be converted to Date
  submissionNote: string;
  submissionMedia: Array<{
    id: string;
    url: string;
    type: 'image' | 'video' | 'audio';
    name: string;
    size?: number;
    isNew?: boolean; // For tracking new uploads
  }>;
  verificationStatus?: VerificationStatus;
}

// Award badge form
export interface AwardBadgeFormUI {
  babyId: string;
  badgeId: string;
  completedAt: string;
  submissionNote: string;
  submissionMedia: Array<{
    id: string;
    file?: File;
    url?: string;
    type: 'image' | 'video' | 'audio';
    name: string;
    size?: number;
    preview?: string;
  }>;
  agreeToTerms: boolean;
  notifyFamilyMembers: boolean;
  customNotificationMessage: string;
}

// Update collection form
export interface UpdateBabyBadgesCollectionFormUI extends Partial<BabyBadgesCollectionFormUI> {
  id: string;
  reasonForUpdate?: string;
  keepExistingMedia: boolean;
}

// Verification form
export interface VerifyBadgeCollectionFormUI {
  collectionId: string;
  action: 'approve' | 'reject' | '';
  verificationNote: string;
  requiresAdditionalInfo: boolean;
  additionalInfoRequested: string;
  notifyParent: boolean;
  customNotificationMessage: string;
}

// Filter form for badge collections
export interface BabyBadgesCollectionFilterFormUI {
  search: string;
  babyId: string | 'all';
  badgeId: string | 'all';
  verificationStatus: VerificationStatus | 'all';
  completedAfter: string;
  completedBefore: string;
  sortBy: 'completedAt' | 'createdAt' | 'verifiedAt';
  sortOrder: 'asc' | 'desc';
  showMySubmissions: boolean;
  showPendingOnly: boolean;
}

// Search form
export interface SearchBadgeCollectionsFormUI {
  searchTerm: string;
  searchIn: 'note' | 'badge' | 'baby' | 'all';
  babyId: string | 'all';
  badgeCategory: string | 'all';
  verificationStatus: VerificationStatus | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  hasMedia: 'all' | 'yes' | 'no';
  sortBy: 'relevance' | 'completedAt' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

// Validation form
export interface BabyBadgesCollectionValidationFormUI {
  babyId: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  badgeId: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  completedAt: {
    value: string;
    isValid: boolean;
    errorMessage: string;
  };
  submissionNote: {
    value: string;
    isValid: boolean;
    errorMessage: string;
    characterCount: number;
    maxCharacters: number;
  };
  submissionMedia: {
    files: Array<{
      id: string;
      isValid: boolean;
      errorMessage: string;
      size: number;
      type: string;
    }>;
    totalSize: number;
    maxTotalSize: number;
    maxFiles: number;
    isValid: boolean;
    errorMessage: string;
  };
  isFormValid: boolean;
  generalErrors: string[];
  warnings: string[];
}

// Display form for read-only views
export interface BabyBadgesCollectionDisplayFormUI {
  id: string;
  baby: {
    id: string;
    name: string;
    avatar?: string;
    ageAtCompletion: string;
  };
  badge: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    iconUrl?: string;
  };
  completedAt: {
    date: string;
    formatted: string;
    timeAgo: string;
  };
  submissionNote: string;
  submissionMedia: Array<{
    id: string;
    url: string;
    type: 'image' | 'video' | 'audio';
    name: string;
    size?: number;
    thumbnail?: string;
  }>;
  verificationStatus: {
    status: VerificationStatus;
    label: string;
    color: string;
    icon: string;
  };
  verificationDetails?: {
    verifiedAt: string;
    verifiedBy: {
      id: string;
      name: string;
      avatar?: string;
    };
    verificationNote?: string;
  };
  submittedBy: {
    id: string;
    name: string;
    avatar?: string;
    relation: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Bulk operation forms
export interface BulkAwardBadgesFormUI {
  awards: Array<{
    id: string;
    babyId: string;
    babyName: string;
    badgeId: string;
    badgeTitle: string;
    completedAt: string;
    submissionNote: string;
    isValid: boolean;
    errors: string[];
  }>;
  globalSettings: {
    autoApprove: boolean;
    notifyFamilyMembers: boolean;
    defaultNote: string;
  };
  isFormValid: boolean;
  totalItems: number;
  validItems: number;
}

export interface BulkVerifyBadgesFormUI {
  verifications: Array<{
    collectionId: string;
    babyName: string;
    badgeTitle: string;
    submittedAt: string;
    action: 'approve' | 'reject' | '';
    verificationNote: string;
    isValid: boolean;
    errors: string[];
  }>;
  globalSettings: {
    defaultAction: 'approve' | 'reject' | '';
    defaultNote: string;
    notifyParents: boolean;
  };
  isFormValid: boolean;
  totalItems: number;
  completedItems: number;
}

// Conversion utilities
export class BabyBadgesCollectionFormConverter {
  /**
   * Convert collection model to form UI
   */
  static toFormUI(collection: BabyBadgesCollection): BabyBadgesCollectionFormUI {
    return {
      id: collection.id,
      babyId: collection.babyId,
      badgeId: collection.badgeId,
      completedAt: new Date(collection.completedAt).toISOString().split('T')[0],
      submissionNote: collection.submissionNote || '',
      submissionMedia: (collection.submissionMedia || []).map((url, index) => ({
        id: `media-${index}`,
        url,
        type: this.detectMediaType(url),
        name: this.extractFileName(url),
      })),
    };
  }

  /**
   * Get empty award form UI
   */
  static getEmptyAwardForm(): AwardBadgeFormUI {
    return {
      babyId: '',
      badgeId: '',
      completedAt: new Date().toISOString().split('T')[0],
      submissionNote: '',
      submissionMedia: [],
      agreeToTerms: false,
      notifyFamilyMembers: true,
      customNotificationMessage: '',
    };
  }

  /**
   * Get default filter form
   */
  static getDefaultFilterForm(): BabyBadgesCollectionFilterFormUI {
    return {
      search: '',
      babyId: 'all',
      badgeId: 'all',
      verificationStatus: 'all',
      completedAfter: '',
      completedBefore: '',
      sortBy: 'completedAt',
      sortOrder: 'desc',
      showMySubmissions: false,
      showPendingOnly: false,
    };
  }

  /**
   * Validate award form data
   */
  static validateAwardForm(form: AwardBadgeFormUI): BabyBadgesCollectionValidationFormUI {
    const validation: BabyBadgesCollectionValidationFormUI = {
      babyId: { value: form.babyId, isValid: true, errorMessage: '' },
      badgeId: { value: form.badgeId, isValid: true, errorMessage: '' },
      completedAt: { value: form.completedAt, isValid: true, errorMessage: '' },
      submissionNote: {
        value: form.submissionNote,
        isValid: true,
        errorMessage: '',
        characterCount: form.submissionNote.length,
        maxCharacters: 1000,
      },
      submissionMedia: {
        files: [],
        totalSize: 0,
        maxTotalSize: 50 * 1024 * 1024, // 50MB
        maxFiles: 10,
        isValid: true,
        errorMessage: '',
      },
      isFormValid: true,
      generalErrors: [],
      warnings: [],
    };

    // Validate baby ID
    if (!form.babyId) {
      validation.babyId.isValid = false;
      validation.babyId.errorMessage = 'Baby selection is required';
    }

    // Validate badge ID
    if (!form.badgeId) {
      validation.badgeId.isValid = false;
      validation.badgeId.errorMessage = 'Badge selection is required';
    }

    // Validate completion date
    if (!form.completedAt) {
      validation.completedAt.isValid = false;
      validation.completedAt.errorMessage = 'Completion date is required';
    } else {
      const completedDate = new Date(form.completedAt);
      const today = new Date();

      if (isNaN(completedDate.getTime())) {
        validation.completedAt.isValid = false;
        validation.completedAt.errorMessage = 'Valid completion date is required';
      } else if (completedDate > today) {
        validation.completedAt.isValid = false;
        validation.completedAt.errorMessage = 'Completion date cannot be in the future';
      }
    }

    // Validate submission note
    if (form.submissionNote.length > validation.submissionNote.maxCharacters) {
      validation.submissionNote.isValid = false;
      validation.submissionNote.errorMessage = `Note cannot exceed ${validation.submissionNote.maxCharacters} characters`;
    }

    // Validate submission media
    let totalSize = 0;
    form.submissionMedia.forEach((media, index) => {
      const mediaValidation = {
        id: media.id,
        isValid: true,
        errorMessage: '',
        size: media.size || 0,
        type: media.type,
      };

      if (media.size) {
        totalSize += media.size;

        // Check individual file size (10MB limit)
        if (media.size > 10 * 1024 * 1024) {
          mediaValidation.isValid = false;
          mediaValidation.errorMessage = 'File size cannot exceed 10MB';
        }
      }

      // Check file type
      if (!['image', 'video', 'audio'].includes(media.type)) {
        mediaValidation.isValid = false;
        mediaValidation.errorMessage = 'Invalid file type';
      }

      validation.submissionMedia.files.push(mediaValidation);
    });

    validation.submissionMedia.totalSize = totalSize;

    // Check total file count
    if (form.submissionMedia.length > validation.submissionMedia.maxFiles) {
      validation.submissionMedia.isValid = false;
      validation.submissionMedia.errorMessage = `Cannot upload more than ${validation.submissionMedia.maxFiles} files`;
    }

    // Check total file size
    if (totalSize > validation.submissionMedia.maxTotalSize) {
      validation.submissionMedia.isValid = false;
      validation.submissionMedia.errorMessage = 'Total file size cannot exceed 50MB';
    }

    // Check terms agreement
    if (!form.agreeToTerms) {
      validation.generalErrors.push('You must agree to the terms and conditions');
    }

    // Check overall form validity
    validation.isFormValid =
      validation.babyId.isValid &&
      validation.badgeId.isValid &&
      validation.completedAt.isValid &&
      validation.submissionNote.isValid &&
      validation.submissionMedia.isValid &&
      validation.submissionMedia.files.every((file) => file.isValid) &&
      form.agreeToTerms &&
      validation.generalErrors.length === 0;

    return validation;
  }

  /**
   * Detect media type from URL
   */
  private static detectMediaType(url: string): 'image' | 'video' | 'audio' {
    const extension = url.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension || '')) {
      return 'video';
    } else {
      return 'audio';
    }
  }

  /**
   * Extract file name from URL
   */
  private static extractFileName(url: string): string {
    return url.split('/').pop()?.split('?')[0] || 'media';
  }
}
