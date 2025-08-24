// src/utils/pregnancyUtils.ts

import { PregnancyTrimester } from '@/models/PregnancyCare/PregnancyCareModel';

/**
 * Pregnancy-related utility functions
 */
export class PregnancyUtils {
  // Constants
  static readonly PREGNANCY_DURATION_WEEKS = 40;
  static readonly MAX_PREGNANCY_WEEKS = 42;
  static readonly DAYS_IN_WEEK = 7;
  static readonly MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
  static readonly MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

  /**
   * Calculate expected due date from last menstrual period (LMP)
   * Uses Naegele's Rule: LMP + 280 days
   */
  static calculateDueDate(lastMenstrualPeriod: Date): Date {
    const dueDate = new Date(lastMenstrualPeriod);
    dueDate.setDate(dueDate.getDate() + 280);
    return dueDate;
  }

  /**
   * Calculate current pregnancy week from LMP
   */
  static calculateCurrentWeek(lastMenstrualPeriod: Date, referenceDate: Date = new Date()): number {
    const diffTime = referenceDate.getTime() - lastMenstrualPeriod.getTime();
    const diffWeeks = Math.floor(diffTime / this.MILLISECONDS_IN_WEEK);
    return Math.min(Math.max(diffWeeks + 1, 1), this.MAX_PREGNANCY_WEEKS);
  }

  /**
   * Calculate pregnancy start date from due date
   */
  static calculateStartDateFromDueDate(dueDate: Date): Date {
    const startDate = new Date(dueDate);
    startDate.setDate(startDate.getDate() - 280);
    return startDate;
  }

  /**
   * Get trimester from week number
   */
  static getTrimesterFromWeek(week: number): PregnancyTrimester | null {
    if (week < 1 || week > this.MAX_PREGNANCY_WEEKS) return null;
    if (week <= 13) return PregnancyTrimester.FIRST;
    if (week <= 27) return PregnancyTrimester.SECOND;
    return PregnancyTrimester.THIRD;
  }

  /**
   * Get week range for a trimester
   */
  static getTrimesterWeekRange(trimester: PregnancyTrimester): { start: number; end: number } {
    switch (trimester) {
      case PregnancyTrimester.FIRST:
        return { start: 1, end: 13 };
      case PregnancyTrimester.SECOND:
        return { start: 14, end: 27 };
      case PregnancyTrimester.THIRD:
        return { start: 28, end: 42 };
      default:
        return { start: 1, end: 42 };
    }
  }

  /**
   * Calculate days until due date
   */
  static getDaysUntilDue(dueDate: Date, fromDate: Date = new Date()): number {
    const diffTime = dueDate.getTime() - fromDate.getTime();
    return Math.ceil(diffTime / this.MILLISECONDS_IN_DAY);
  }

  /**
   * Calculate weeks and days format (e.g., "12 weeks, 3 days")
   */
  static formatWeeksAndDays(totalDays: number): string {
    const weeks = Math.floor(totalDays / 7);
    const days = totalDays % 7;

    if (weeks === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    }

    if (days === 0) {
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    }

    return `${weeks} week${weeks !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`;
  }

  /**
   * Format pregnancy week display (e.g., "Week 12 of 40")
   */
  static formatPregnancyWeek(currentWeek: number): string {
    return `Week ${currentWeek} of ${this.PREGNANCY_DURATION_WEEKS}`;
  }

  /**
   * Calculate pregnancy progress percentage
   */
  static calculateProgress(currentWeek: number): number {
    return Math.min(Math.round((currentWeek / this.PREGNANCY_DURATION_WEEKS) * 100), 100);
  }

  /**
   * Get baby development milestone for week
   */
  static getBabyDevelopmentMilestone(week: number): string {
    const milestones: Record<number, string> = {
      4: 'Embryo implantation complete',
      6: 'Heart begins to beat',
      8: 'All major organs begin forming',
      10: 'Embryo becomes a fetus',
      12: "Baby's reflexes develop",
      14: 'Baby can make facial expressions',
      16: "Baby's sex can be determined",
      18: 'Baby begins to hear',
      20: 'You might feel first movements',
      22: "Baby's sense of touch develops",
      24: "Baby's lungs develop",
      26: "Baby's eyes open",
      28: 'Baby can dream',
      30: "Baby's bones harden",
      32: 'Baby practices breathing',
      34: "Baby's immune system develops",
      36: 'Baby is considered full-term soon',
      38: 'Baby is full-term',
      40: 'Your due date!',
    };

    // Find the closest milestone
    const weeks = Object.keys(milestones)
      .map(Number)
      .sort((a, b) => a - b);
    const closestWeek = weeks.reduce((prev, curr) => (Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev));

    return milestones[closestWeek] || 'Baby continues to grow and develop';
  }

  /**
   * Get estimated baby size for week
   */
  static getEstimatedBabySize(week: number): { length: number; weight: number; comparison: string } {
    const sizes: Record<number, { length: number; weight: number; comparison: string }> = {
      4: { length: 0.1, weight: 0.001, comparison: 'poppy seed' },
      8: { length: 1.6, weight: 1, comparison: 'raspberry' },
      12: { length: 5.4, weight: 14, comparison: 'lime' },
      16: { length: 11.6, weight: 100, comparison: 'avocado' },
      20: { length: 16.4, weight: 300, comparison: 'banana' },
      24: { length: 21.3, weight: 540, comparison: 'corn cob' },
      28: { length: 25.4, weight: 1000, comparison: 'eggplant' },
      32: { length: 28.9, weight: 1700, comparison: 'squash' },
      36: { length: 32.4, weight: 2600, comparison: 'honeydew melon' },
      40: { length: 36.3, weight: 3400, comparison: 'watermelon' },
    };

    // Find closest week
    const weeks = Object.keys(sizes)
      .map(Number)
      .sort((a, b) => a - b);
    const closestWeek = weeks.reduce((prev, curr) => (Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev));

    return sizes[closestWeek] || { length: 0, weight: 0, comparison: 'growing baby' };
  }

  /**
   * Validate pregnancy dates
   */
  static validatePregnancyDates(
    startDate: Date,
    dueDate: Date,
    currentDate: Date = new Date(),
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if dates are valid
    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      errors.push('Invalid start date');
    }

    if (!(dueDate instanceof Date) || isNaN(dueDate.getTime())) {
      errors.push('Invalid due date');
    }

    // Start date should not be in the future
    if (startDate > currentDate) {
      errors.push('Start date cannot be in the future');
    }

    // Due date should be after start date
    if (dueDate <= startDate) {
      errors.push('Due date must be after start date');
    }

    // Pregnancy duration should be reasonable (between 35-45 weeks)
    const diffWeeks = Math.floor((dueDate.getTime() - startDate.getTime()) / this.MILLISECONDS_IN_WEEK);
    if (diffWeeks < 35 || diffWeeks > 45) {
      errors.push('Pregnancy duration should be between 35-45 weeks');
    }

    // Pregnancy should not be more than 42 weeks old
    const currentWeek = this.calculateCurrentWeek(startDate, currentDate);
    if (currentWeek > this.MAX_PREGNANCY_WEEKS) {
      errors.push('Pregnancy duration exceeds maximum (42 weeks)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format date for display
   */
  static formatDate(date: Date, format: 'short' | 'long' | 'relative' = 'short'): string {
    if (format === 'relative') {
      const now = new Date();
      const diffDays = Math.floor((date.getTime() - now.getTime()) / this.MILLISECONDS_IN_DAY);

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays > 0 && diffDays < 7) return `In ${diffDays} days`;
      if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;
      if (diffDays >= 7 && diffDays < 14) return 'Next week';
      if (diffDays <= -7 && diffDays > -14) return 'Last week';
    }

    const options: Intl.DateTimeFormatOptions =
      format === 'long'
        ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' };

    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Get pregnancy tips for current week
   */
  static getWeeklyTips(week: number): string[] {
    const trimester = this.getTrimesterFromWeek(week);

    const tips: Record<PregnancyTrimester, string[]> = {
      [PregnancyTrimester.FIRST]: [
        'Take prenatal vitamins with folic acid',
        'Stay hydrated - drink plenty of water',
        'Get plenty of rest',
        'Avoid alcohol, smoking, and excessive caffeine',
        'Schedule your first prenatal appointment',
      ],
      [PregnancyTrimester.SECOND]: [
        'Continue regular prenatal check-ups',
        'Stay active with pregnancy-safe exercises',
        'Start planning your nursery',
        'Consider prenatal classes',
        'Monitor baby movements',
      ],
      [PregnancyTrimester.THIRD]: [
        'Prepare your hospital bag',
        'Practice breathing exercises',
        'Monitor contractions and baby movements',
        'Finalize birth plan with your healthcare provider',
        'Rest as much as possible',
      ],
      [PregnancyTrimester.ALL]: [
        'Maintain a healthy, balanced diet',
        'Stay active with doctor-approved exercise',
        'Attend all prenatal appointments',
        'Listen to your body and rest when needed',
        'Stay positive and manage stress',
      ],
    };

    return tips[trimester || PregnancyTrimester.ALL];
  }

  /**
   * Calculate baby's zodiac sign based on due date
   */
  static getBabyZodiacSign(dueDate: Date): { sign: string; element: string } {
    const month = dueDate.getMonth() + 1;
    const day = dueDate.getDate();

    const zodiacSigns = [
      { sign: 'Capricorn', element: 'Earth', start: [12, 22], end: [1, 19] },
      { sign: 'Aquarius', element: 'Air', start: [1, 20], end: [2, 18] },
      { sign: 'Pisces', element: 'Water', start: [2, 19], end: [3, 20] },
      { sign: 'Aries', element: 'Fire', start: [3, 21], end: [4, 19] },
      { sign: 'Taurus', element: 'Earth', start: [4, 20], end: [5, 20] },
      { sign: 'Gemini', element: 'Air', start: [5, 21], end: [6, 20] },
      { sign: 'Cancer', element: 'Water', start: [6, 21], end: [7, 22] },
      { sign: 'Leo', element: 'Fire', start: [7, 23], end: [8, 22] },
      { sign: 'Virgo', element: 'Earth', start: [8, 23], end: [9, 22] },
      { sign: 'Libra', element: 'Air', start: [9, 23], end: [10, 22] },
      { sign: 'Scorpio', element: 'Water', start: [10, 23], end: [11, 21] },
      { sign: 'Sagittarius', element: 'Fire', start: [11, 22], end: [12, 21] },
    ];

    for (const zodiac of zodiacSigns) {
      const [startMonth, startDay] = zodiac.start;
      const [endMonth, endDay] = zodiac.end;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (startMonth > endMonth && (month === startMonth || month === endMonth))
      ) {
        return { sign: zodiac.sign, element: zodiac.element };
      }
    }

    return { sign: 'Unknown', element: 'Unknown' };
  }
}

// Export helper functions for direct use
export const {
  calculateDueDate,
  calculateCurrentWeek,
  calculateStartDateFromDueDate,
  getTrimesterFromWeek,
  getDaysUntilDue,
  formatWeeksAndDays,
  formatPregnancyWeek,
  calculateProgress,
  getBabyDevelopmentMilestone,
  getEstimatedBabySize,
  validatePregnancyDates,
  formatDate,
  getWeeklyTips,
  getBabyZodiacSign,
} = PregnancyUtils;
