// src/utils/badgeUtils.ts

import { BadgeCategory, BadgeDifficulty, VerificationStatus } from '@/models/Badge/BadgeEnum';

// Constants
export const BADGE_CONSTANTS = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    GRAY: '#6B7280',
  },
  ANIMATION: {
    STAGGER_DELAY: 50,
    SPRING_CONFIG: {
      damping: 15,
      stiffness: 100,
    },
  },
  SEARCH_DEBOUNCE_MS: 300,
  CACHE_DURATION: 15 * 60 * 1000, // 15 minutes
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50,
  },
};

// Category utilities
export const getCategoryColor = (category: BadgeCategory): string => {
  const colorMap: Record<BadgeCategory, string> = {
    [BadgeCategory.MILESTONE]: '#F59E0B', // Amber
    [BadgeCategory.DAILY_LIFE]: '#3B82F6', // Blue
    [BadgeCategory.SOCIAL]: '#10B981', // Emerald
    [BadgeCategory.PHYSICAL]: '#EF4444', // Red
    [BadgeCategory.COGNITIVE]: '#8B5CF6', // Violet
    [BadgeCategory.CUSTOM]: '#6B7280', // Gray
  };
  return colorMap[category] || '#9CA3AF';
};

export const getCategoryIcon = (category: BadgeCategory): string => {
  const iconMap: Record<BadgeCategory, string> = {
    [BadgeCategory.MILESTONE]: 'trophy',
    [BadgeCategory.DAILY_LIFE]: 'house',
    [BadgeCategory.SOCIAL]: 'users',
    [BadgeCategory.PHYSICAL]: 'dumbbell',
    [BadgeCategory.COGNITIVE]: 'brain',
    [BadgeCategory.CUSTOM]: 'star',
  };
  return iconMap[category] || 'medal';
};

export const formatCategory = (category: BadgeCategory): string => {
  const formatMap: Record<BadgeCategory, string> = {
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
  const colorMap: Record<BadgeDifficulty, string> = {
    [BadgeDifficulty.EASY]: '#10B981', // Green
    [BadgeDifficulty.MEDIUM]: '#F59E0B', // Amber
    [BadgeDifficulty.HARD]: '#EF4444', // Red
  };
  return colorMap[difficulty] || '#9CA3AF';
};

export const getDifficultyIcon = (difficulty: BadgeDifficulty): string => {
  const iconMap: Record<BadgeDifficulty, string> = {
    [BadgeDifficulty.EASY]: 'star',
    [BadgeDifficulty.MEDIUM]: 'star-half-stroke',
    [BadgeDifficulty.HARD]: 'fire',
  };
  return iconMap[difficulty] || 'star';
};

export const formatDifficulty = (difficulty: BadgeDifficulty): string => {
  const formatMap: Record<BadgeDifficulty, string> = {
    [BadgeDifficulty.EASY]: 'Easy',
    [BadgeDifficulty.MEDIUM]: 'Medium',
    [BadgeDifficulty.HARD]: 'Hard',
  };
  return formatMap[difficulty] || difficulty;
};

// Verification status utilities
export const getVerificationStatusColor = (status: VerificationStatus): string => {
  const colorMap: Record<VerificationStatus, string> = {
    [VerificationStatus.PENDING]: '#F59E0B', // Orange
    [VerificationStatus.APPROVED]: '#10B981', // Green
    [VerificationStatus.REJECTED]: '#EF4444', // Red
    [VerificationStatus.AUTO_APPROVED]: '#10B981', // Green
  };
  return colorMap[status] || '#9CA3AF';
};

export const getVerificationStatusIcon = (status: VerificationStatus): string => {
  const iconMap: Record<VerificationStatus, string> = {
    [VerificationStatus.PENDING]: 'clock',
    [VerificationStatus.APPROVED]: 'check',
    [VerificationStatus.REJECTED]: 'xmark',
    [VerificationStatus.AUTO_APPROVED]: 'check-double',
  };
  return iconMap[status] || 'question';
};

export const formatVerificationStatus = (status: VerificationStatus): string => {
  const formatMap: Record<VerificationStatus, string> = {
    [VerificationStatus.PENDING]: 'Pending Review',
    [VerificationStatus.APPROVED]: 'Approved',
    [VerificationStatus.REJECTED]: 'Rejected',
    [VerificationStatus.AUTO_APPROVED]: 'Auto-Approved',
  };
  return formatMap[status] || status;
};

// Age utilities
export const formatAgeRange = (minAge?: number, maxAge?: number): string => {
  if (!minAge && !maxAge) return 'All ages';
  if (minAge && maxAge) return `${minAge}-${maxAge} months`;
  if (minAge) return `${minAge}+ months`;
  return `Up to ${maxAge} months`;
};

export const getAgeGroupFromMonths = (months: number): string => {
  if (months < 3) return 'Newborn (0-3 months)';
  if (months < 12) return 'Infant (3-12 months)';
  if (months < 36) return 'Toddler (1-3 years)';
  if (months < 60) return 'Preschooler (3-5 years)';
  return 'School age (5+ years)';
};

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

// Accessibility utilities
export const getAccessibilityLabel = (
  title: string,
  category: BadgeCategory,
  difficulty: BadgeDifficulty,
  isActive: boolean,
): string => {
  const categoryText = formatCategory(category);
  const difficultyText = formatDifficulty(difficulty);
  const statusText = isActive ? 'active' : 'inactive';

  return `${title}, ${categoryText} badge, ${difficultyText} difficulty, ${statusText}`;
};

// Date utilities
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

export const formatRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatCompletionDate(date);
};

// Media utilities
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
  if (isImageFile(type)) return 'image';
  if (isVideoFile(type)) return 'video';
  return 'file';
};

// Progress utilities
export const calculateProgressPercentage = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return '#10B981'; // Green
  if (percentage >= 60) return '#3B82F6'; // Blue
  if (percentage >= 40) return '#F59E0B'; // Amber
  return '#EF4444'; // Red
};

// Validation utilities
export const isValidBadgeTitle = (title: string): boolean => {
  return title.trim().length >= 3 && title.trim().length <= 100;
};

export const isValidDescription = (description: string): boolean => {
  return description.trim().length >= 10 && description.trim().length <= 500;
};

export const isValidAgeRange = (minAge?: number, maxAge?: number): boolean => {
  if (!minAge && !maxAge) return true;
  if (minAge && (minAge < 0 || minAge > 60)) return false;
  if (maxAge && (maxAge < 0 || maxAge > 60)) return false;
  if (minAge && maxAge && minAge > maxAge) return false;
  return true;
};

// Search utilities
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const getSearchScore = (item: any, searchTerm: string): number => {
  const term = searchTerm.toLowerCase();
  let score = 0;

  // Title match (highest weight)
  if (item.title?.toLowerCase().includes(term)) {
    score += item.title.toLowerCase().indexOf(term) === 0 ? 10 : 5;
  }

  // Description match
  if (item.description?.toLowerCase().includes(term)) {
    score += 3;
  }

  // Category match
  if (formatCategory(item.category)?.toLowerCase().includes(term)) {
    score += 2;
  }

  return score;
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return !error?.response && (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network'));
};

// Performance utilities
export const shouldUpdateList = (prevItems: any[], newItems: any[]): boolean => {
  if (prevItems.length !== newItems.length) return true;

  return prevItems.some((item, index) => {
    const newItem = newItems[index];
    return item?.id !== newItem?.id || item?.updatedAt !== newItem?.updatedAt;
  });
};

export const createMemoKey = (...args: any[]): string => {
  return args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join('|');
};
