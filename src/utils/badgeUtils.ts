// src/utils/badge/badgeUtils.ts
import { BadgeCategory, BadgeDifficulty, VerificationStatus } from '@/models/Badge/BadgeEnum';

// Category utilities
export const getCategoryIcon = (category: BadgeCategory): string => {
  const iconMap = {
    [BadgeCategory.MILESTONE]: 'trophy',
    [BadgeCategory.DAILY_LIFE]: 'house',
    [BadgeCategory.SOCIAL]: 'users',
    [BadgeCategory.PHYSICAL]: 'dumbbell',
    [BadgeCategory.COGNITIVE]: 'brain',
    [BadgeCategory.CUSTOM]: 'star',
  };
  return iconMap[category] || 'medal';
};

export const getCategoryColor = (category: BadgeCategory): string => {
  const colorMap = {
    [BadgeCategory.MILESTONE]: '#F59E0B',
    [BadgeCategory.DAILY_LIFE]: '#3B82F6',
    [BadgeCategory.SOCIAL]: '#10B981',
    [BadgeCategory.PHYSICAL]: '#EF4444',
    [BadgeCategory.COGNITIVE]: '#8B5CF6',
    [BadgeCategory.CUSTOM]: '#6B7280',
  };
  return colorMap[category] || '#9CA3AF';
};

export const formatCategory = (category: BadgeCategory): string => {
  const formatMap = {
    [BadgeCategory.MILESTONE]: 'Milestone',
    [BadgeCategory.DAILY_LIFE]: 'Daily Life',
    [BadgeCategory.SOCIAL]: 'Social',
    [BadgeCategory.PHYSICAL]: 'Physical',
    [BadgeCategory.COGNITIVE]: 'Cognitive',
    [BadgeCategory.CUSTOM]: 'Custom',
  };
  return formatMap[category] || category;
};

// Difficulty utilities
export const getDifficultyColor = (difficulty: BadgeDifficulty): string => {
  const colorMap = {
    [BadgeDifficulty.EASY]: '#10B981',
    [BadgeDifficulty.MEDIUM]: '#F59E0B',
    [BadgeDifficulty.HARD]: '#EF4444',
  };
  return colorMap[difficulty] || '#9CA3AF';
};

export const getDifficultyIcon = (difficulty: BadgeDifficulty): string => {
  const iconMap = {
    [BadgeDifficulty.EASY]: 'star',
    [BadgeDifficulty.MEDIUM]: 'star-half-stroke',
    [BadgeDifficulty.HARD]: 'fire',
  };
  return iconMap[difficulty] || 'circle';
};

export const formatDifficulty = (difficulty: BadgeDifficulty): string => {
  const formatMap = {
    [BadgeDifficulty.EASY]: 'Easy',
    [BadgeDifficulty.MEDIUM]: 'Medium',
    [BadgeDifficulty.HARD]: 'Hard',
  };
  return formatMap[difficulty] || difficulty;
};

// Verification status utilities
export const getVerificationStatusColor = (status: VerificationStatus): string => {
  const colorMap = {
    [VerificationStatus.PENDING]: '#F59E0B',
    [VerificationStatus.APPROVED]: '#10B981',
    [VerificationStatus.REJECTED]: '#EF4444',
    [VerificationStatus.AUTO_APPROVED]: '#10B981',
  };
  return colorMap[status] || '#9CA3AF';
};

export const getVerificationStatusIcon = (status: VerificationStatus): string => {
  const iconMap = {
    [VerificationStatus.PENDING]: 'clock',
    [VerificationStatus.APPROVED]: 'check',
    [VerificationStatus.REJECTED]: 'xmark',
    [VerificationStatus.AUTO_APPROVED]: 'check',
  };
  return iconMap[status] || 'question';
};

export const formatVerificationStatus = (status: VerificationStatus): string => {
  const formatMap = {
    [VerificationStatus.PENDING]: 'Pending Review',
    [VerificationStatus.APPROVED]: 'Approved',
    [VerificationStatus.REJECTED]: 'Rejected',
    [VerificationStatus.AUTO_APPROVED]: 'Auto-Approved',
  };
  return formatMap[status] || status;
};

// Age utilities
export const formatAgeDisplay = (months: number): string => {
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  return `${years}y ${remainingMonths}m`;
};

export const getAgeGroupFromMonths = (months: number): string => {
  if (months < 3) return 'Newborn (0-3 months)';
  if (months < 12) return 'Infant (3-12 months)';
  if (months < 36) return 'Toddler (1-3 years)';
  if (months < 60) return 'Preschooler (3-5 years)';
  return 'School age (5+ years)';
};

// Date utilities
export const formatCompletionDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

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

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// File utilities
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

// Media validation
export const validateMediaFile = (file: { size: number; type: string; name?: string }): string | null => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];

  if (file.size > MAX_FILE_SIZE) {
    return 'File size cannot exceed 10MB';
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only images (JPEG, PNG, GIF) and videos (MP4, MOV) are allowed';
  }

  return null;
};

// Search utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Statistics utilities
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const groupBadgesByMonth = <T extends { completedAt: string }>(badges: T[]): Record<string, T[]> => {
  const grouped: Record<string, T[]> = {};

  badges.forEach((badge) => {
    const month = new Date(badge.completedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });

    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(badge);
  });

  return grouped;
};

// Accessibility utilities
export const getAccessibilityLabel = (
  badgeTitle: string,
  category: BadgeCategory,
  difficulty: BadgeDifficulty,
  isActive: boolean,
): string => {
  const statusText = isActive ? 'active' : 'inactive';
  return `${badgeTitle} badge, ${formatCategory(category)} category, ${formatDifficulty(difficulty)} difficulty, ${statusText}`;
};

export const getCollectionAccessibilityLabel = (
  badgeTitle: string,
  completionDate: string,
  verificationStatus: VerificationStatus,
): string => {
  return `${badgeTitle} achievement, completed ${formatCompletionDate(completionDate)}, ${formatVerificationStatus(verificationStatus)}`;
};

// Constants
export const BADGE_CONSTANTS = {
  MAX_CUSTOM_BADGES_PER_USER: 50,
  MAX_BADGES_PER_DAY: 20,
  MAX_MEDIA_FILES: 5,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_NOTE_LENGTH: 500,
  SEARCH_DEBOUNCE_MS: 300,
  CACHE_DURATION_MS: 15 * 60 * 1000, // 15 minutes

  // Age ranges in months
  AGE_RANGES: {
    NEWBORN: { min: 0, max: 3 },
    INFANT: { min: 3, max: 12 },
    TODDLER: { min: 12, max: 36 },
    PRESCHOOLER: { min: 36, max: 60 },
  },

  // Animation durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 250,
    SLOW: 350,
    STAGGER_DELAY: 50,
  },

  // Colors
  COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    DANGER: '#EF4444',
    GRAY: '#9CA3AF',
  },
} as const;
