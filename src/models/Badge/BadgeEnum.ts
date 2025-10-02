// src/models/Badge/BadgeEnum.ts

// Badge categories (20 categories)
export enum BadgeCategory {
  MILESTONE = 'milestone',
  DAILY_LIFE = 'daily_life',
  SOCIAL = 'social',
  PHYSICAL = 'physical',
  COGNITIVE = 'cognitive',
  MOTOR_SKILLS = 'motor_skills',
  EMOTIONAL = 'emotional',
  LANGUAGE = 'language',
  FEEDING = 'feeding',
  SLEEPING = 'sleeping',
  HEALTH = 'health',
  SAFETY = 'safety',
  PLAY = 'play',
  CREATIVITY = 'creativity',
  MUSIC = 'music',
  NATURE = 'nature',
  FAMILY = 'family',
  CULTURAL = 'cultural',
  SEASONAL = 'seasonal',
  CUSTOM = 'custom',
}

// Badge difficulty levels
export enum BadgeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

// Display labels
export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  [BadgeCategory.MILESTONE]: 'Milestone',
  [BadgeCategory.DAILY_LIFE]: 'Daily Life',
  [BadgeCategory.SOCIAL]: 'Social',
  [BadgeCategory.PHYSICAL]: 'Physical',
  [BadgeCategory.COGNITIVE]: 'Cognitive',
  [BadgeCategory.MOTOR_SKILLS]: 'Motor Skills',
  [BadgeCategory.EMOTIONAL]: 'Emotional',
  [BadgeCategory.LANGUAGE]: 'Language',
  [BadgeCategory.FEEDING]: 'Feeding',
  [BadgeCategory.SLEEPING]: 'Sleeping',
  [BadgeCategory.HEALTH]: 'Health',
  [BadgeCategory.SAFETY]: 'Safety',
  [BadgeCategory.PLAY]: 'Play',
  [BadgeCategory.CREATIVITY]: 'Creativity',
  [BadgeCategory.MUSIC]: 'Music',
  [BadgeCategory.NATURE]: 'Nature',
  [BadgeCategory.FAMILY]: 'Family',
  [BadgeCategory.CULTURAL]: 'Cultural',
  [BadgeCategory.SEASONAL]: 'Seasonal',
  [BadgeCategory.CUSTOM]: 'Custom',
};

export const BADGE_CATEGORY_COLORS: Record<BadgeCategory, string> = {
  [BadgeCategory.MILESTONE]: '#F59E0B',
  [BadgeCategory.DAILY_LIFE]: '#10B981',
  [BadgeCategory.SOCIAL]: '#EC4899',
  [BadgeCategory.PHYSICAL]: '#EF4444',
  [BadgeCategory.COGNITIVE]: '#8B5CF6',
  [BadgeCategory.MOTOR_SKILLS]: '#3B82F6',
  [BadgeCategory.EMOTIONAL]: '#06B6D4',
  [BadgeCategory.LANGUAGE]: '#84CC16',
  [BadgeCategory.FEEDING]: '#F97316',
  [BadgeCategory.SLEEPING]: '#6366F1',
  [BadgeCategory.HEALTH]: '#059669',
  [BadgeCategory.SAFETY]: '#DC2626',
  [BadgeCategory.PLAY]: '#F472B6',
  [BadgeCategory.CREATIVITY]: '#A855F7',
  [BadgeCategory.MUSIC]: '#14B8A6',
  [BadgeCategory.NATURE]: '#65A30D',
  [BadgeCategory.FAMILY]: '#D97706',
  [BadgeCategory.CULTURAL]: '#7C3AED',
  [BadgeCategory.SEASONAL]: '#0891B2',
  [BadgeCategory.CUSTOM]: '#6B7280',
};

export const BADGE_CATEGORY_ICONS: Record<BadgeCategory, string> = {
  [BadgeCategory.MILESTONE]: 'star',
  [BadgeCategory.DAILY_LIFE]: 'home',
  [BadgeCategory.SOCIAL]: 'users',
  [BadgeCategory.PHYSICAL]: 'activity',
  [BadgeCategory.COGNITIVE]: 'brain',
  [BadgeCategory.MOTOR_SKILLS]: 'move',
  [BadgeCategory.EMOTIONAL]: 'heart',
  [BadgeCategory.LANGUAGE]: 'message-circle',
  [BadgeCategory.FEEDING]: 'coffee',
  [BadgeCategory.SLEEPING]: 'moon',
  [BadgeCategory.HEALTH]: 'shield',
  [BadgeCategory.SAFETY]: 'alert-triangle',
  [BadgeCategory.PLAY]: 'smile',
  [BadgeCategory.CREATIVITY]: 'palette',
  [BadgeCategory.MUSIC]: 'music',
  [BadgeCategory.NATURE]: 'leaf',
  [BadgeCategory.FAMILY]: 'heart',
  [BadgeCategory.CULTURAL]: 'globe',
  [BadgeCategory.SEASONAL]: 'calendar',
  [BadgeCategory.CUSTOM]: 'settings',
};

export const BADGE_DIFFICULTY_LABELS: Record<BadgeDifficulty, string> = {
  [BadgeDifficulty.EASY]: 'Easy',
  [BadgeDifficulty.MEDIUM]: 'Medium',
  [BadgeDifficulty.HARD]: 'Hard',
  [BadgeDifficulty.EXPERT]: 'Expert',
};

export const BADGE_DIFFICULTY_COLORS: Record<BadgeDifficulty, string> = {
  [BadgeDifficulty.EASY]: '#10B981',
  [BadgeDifficulty.MEDIUM]: '#F59E0B',
  [BadgeDifficulty.HARD]: '#EF4444',
  [BadgeDifficulty.EXPERT]: '#8B5CF6',
};

export const BADGE_DIFFICULTY_STARS: Record<BadgeDifficulty, number> = {
  [BadgeDifficulty.EASY]: 1,
  [BadgeDifficulty.MEDIUM]: 2,
  [BadgeDifficulty.HARD]: 3,
  [BadgeDifficulty.EXPERT]: 4,
};

// Helper functions
export const getBadgeCategoryInfo = (category: BadgeCategory) => ({
  label: BADGE_CATEGORY_LABELS[category],
  color: BADGE_CATEGORY_COLORS[category],
  icon: BADGE_CATEGORY_ICONS[category],
});

export const getBadgeDifficultyInfo = (difficulty: BadgeDifficulty) => ({
  label: BADGE_DIFFICULTY_LABELS[difficulty],
  color: BADGE_DIFFICULTY_COLORS[difficulty],
  stars: BADGE_DIFFICULTY_STARS[difficulty],
});

export const getCategoryList = () => {
  return Object.values(BadgeCategory).map((category) => ({
    value: category,
    label: BADGE_CATEGORY_LABELS[category],
    icon: BADGE_CATEGORY_ICONS[category],
    color: BADGE_CATEGORY_COLORS[category],
  }));
};

export const getDifficultyList = () => {
  return Object.values(BadgeDifficulty).map((difficulty) => ({
    value: difficulty,
    label: BADGE_DIFFICULTY_LABELS[difficulty],
    stars: BADGE_DIFFICULTY_STARS[difficulty],
    color: BADGE_DIFFICULTY_COLORS[difficulty],
  }));
};
