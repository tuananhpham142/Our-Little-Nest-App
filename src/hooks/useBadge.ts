// src/hooks/useBadge.ts

import { BadgeCategory } from '@/models/Badge/BadgeEnum';
import { BadgeFilters } from '@/models/Badge/BadgeModel';
import { CreateBadgeRequest, GetBadgesRequest, UpdateBadgeRequest } from '@/models/Badge/BadgeRequest';
import {
  activateBadge,
  clearError,
  createBadge,
  deactivateBadge,
  deleteBadge,
  fetchBadgeById,
  fetchBadgeRecommendations,
  fetchBadges,
  fetchBadgesByCategory,
  fetchBadgesForAge,
  fetchBadgeStatistics,
  fetchMyCustomBadges,
  loadMoreBadges,
  removeExpiredCache,
  resetFilters,
  updateBadge,
  updateFilters,
} from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useCallback, useEffect, useMemo } from 'react';

// Hook for managing badges list
export const useBadges = () => {
  const dispatch = useAppDispatch();
  const { badges, isLoading, isLoadingMore, error, pagination, filters } = useAppSelector((state) => state.badges);

  // Clean expired cache on mount
  useEffect(() => {
    dispatch(removeExpiredCache());
  }, [dispatch]);

  const loadBadges = useCallback(
    (params?: GetBadgesRequest) => {
      return dispatch(fetchBadges(params || filters));
    },
    [dispatch, filters],
  );

  const loadMore = useCallback(() => {
    if (pagination.hasNextPage && !isLoadingMore) {
      return dispatch(loadMoreBadges(filters));
    }
  }, [dispatch, filters, pagination, isLoadingMore]);

  const setFilters = useCallback(
    (newFilters: Partial<BadgeFilters>) => {
      dispatch(updateFilters(newFilters));
    },
    [dispatch],
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const refresh = useCallback(() => {
    return loadBadges({ ...filters, page: 1 });
  }, [loadBadges, filters]);

  return {
    badges,
    isLoading,
    isLoadingMore,
    error,
    pagination,
    filters,
    loadBadges,
    loadMore,
    setFilters,
    clearFilters,
    refresh,
  };
};

// Hook for managing a single badge
export const useBadge = (badgeId?: string) => {
  const dispatch = useAppDispatch();
  const { currentBadge, isLoading, isSubmitting, error } = useAppSelector((state) => state.badges);

  useEffect(() => {
    if (badgeId) {
      dispatch(fetchBadgeById(badgeId));
    }
  }, [dispatch, badgeId]);

  const update = useCallback(
    async (data: UpdateBadgeRequest) => {
      if (!badgeId) return;
      return dispatch(updateBadge({ id: badgeId, data })).unwrap();
    },
    [dispatch, badgeId],
  );

  const remove = useCallback(async () => {
    if (!badgeId) return;
    return dispatch(deleteBadge(badgeId)).unwrap();
  }, [dispatch, badgeId]);

  const activate = useCallback(async () => {
    if (!badgeId) return;
    return dispatch(activateBadge(badgeId)).unwrap();
  }, [dispatch, badgeId]);

  const deactivate = useCallback(async () => {
    if (!badgeId) return;
    return dispatch(deactivateBadge(badgeId)).unwrap();
  }, [dispatch, badgeId]);

  return {
    badge: currentBadge,
    isLoading,
    isSubmitting,
    error,
    update,
    remove,
    activate,
    deactivate,
  };
};

// Hook for creating a new badge
export const useCreateBadge = () => {
  const dispatch = useAppDispatch();
  const { isSubmitting, error, myCustomBadges } = useAppSelector((state) => state.badges);

  const create = useCallback(
    async (data: CreateBadgeRequest) => {
      return dispatch(createBadge(data)).unwrap();
    },
    [dispatch],
  );

  const clearCreateError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const canCreateMore = useMemo(() => {
    const MAX_CUSTOM_BADGES = 50;
    return myCustomBadges.length < MAX_CUSTOM_BADGES;
  }, [myCustomBadges]);

  const remainingSlots = useMemo(() => {
    const MAX_CUSTOM_BADGES = 50;
    return Math.max(0, MAX_CUSTOM_BADGES - myCustomBadges.length);
  }, [myCustomBadges]);

  return {
    create,
    isSubmitting,
    error,
    clearError: clearCreateError,
    canCreateMore,
    remainingSlots,
    customBadgesCount: myCustomBadges.length,
  };
};

// Hook for badges by category
export const useBadgesByCategory = (category?: BadgeCategory) => {
  const dispatch = useAppDispatch();
  const { categoryBadges, isLoading, error } = useAppSelector((state) => state.badges);

  const badges = useMemo(() => {
    return category ? categoryBadges[category] || [] : [];
  }, [categoryBadges, category]);

  const loadByCategory = useCallback(
    (cat: BadgeCategory) => {
      return dispatch(fetchBadgesByCategory(cat));
    },
    [dispatch],
  );

  useEffect(() => {
    if (category && !badges.length) {
      loadByCategory(category);
    }
  }, [category, badges.length, loadByCategory]);

  return {
    badges,
    isLoading,
    error,
    loadByCategory,
    refresh: () => category && loadByCategory(category),
  };
};

// Hook for age-appropriate badges
export const useBadgesForAge = (ageInMonths?: number) => {
  const dispatch = useAppDispatch();
  const { suitableForAgeBadges, isLoading, error } = useAppSelector((state) => state.badges);

  const loadForAge = useCallback(
    (age: number) => {
      return dispatch(fetchBadgesForAge(age));
    },
    [dispatch],
  );

  useEffect(() => {
    if (ageInMonths !== undefined && ageInMonths >= 0) {
      loadForAge(ageInMonths);
    }
  }, [ageInMonths, loadForAge]);

  const ageGroup = useMemo(() => {
    if (!ageInMonths) return null;
    if (ageInMonths < 3) return 'Newborn';
    if (ageInMonths < 12) return 'Infant';
    if (ageInMonths < 36) return 'Toddler';
    if (ageInMonths < 60) return 'Preschooler';
    return 'School age';
  }, [ageInMonths]);

  return {
    badges: suitableForAgeBadges,
    isLoading,
    error,
    ageGroup,
    loadForAge,
  };
};

// Hook for custom badges
export const useMyCustomBadges = () => {
  const dispatch = useAppDispatch();
  const { myCustomBadges, isLoading, error } = useAppSelector((state) => state.badges);

  const loadCustomBadges = useCallback(() => {
    return dispatch(fetchMyCustomBadges());
  }, [dispatch]);

  useEffect(() => {
    if (myCustomBadges.length === 0) {
      loadCustomBadges();
    }
  }, [loadCustomBadges, myCustomBadges.length]);

  const stats = useMemo(() => {
    const MAX_CUSTOM_BADGES = 50;
    return {
      total: myCustomBadges.length,
      remaining: Math.max(0, MAX_CUSTOM_BADGES - myCustomBadges.length),
      canCreateMore: myCustomBadges.length < MAX_CUSTOM_BADGES,
      percentageUsed: (myCustomBadges.length / MAX_CUSTOM_BADGES) * 100,
    };
  }, [myCustomBadges]);

  return {
    badges: myCustomBadges,
    isLoading,
    error,
    stats,
    refresh: loadCustomBadges,
  };
};

// Hook for badge statistics (admin)
export const useBadgeStatistics = () => {
  const dispatch = useAppDispatch();
  const { statistics, isLoading, error } = useAppSelector((state) => state.badges);

  const loadStatistics = useCallback(() => {
    return dispatch(fetchBadgeStatistics());
  }, [dispatch]);

  useEffect(() => {
    if (!statistics) {
      loadStatistics();
    }
  }, [statistics, loadStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refresh: loadStatistics,
  };
};

// Hook for badge recommendations
export const useBadgeRecommendations = (babyAgeInMonths?: number, awardedBadgeIds?: string[]) => {
  const dispatch = useAppDispatch();
  const { recommendedBadges, isLoading, error } = useAppSelector((state) => state.badges);

  const loadRecommendations = useCallback(
    (age: number, excludeIds: string[] = []) => {
      return dispatch(
        fetchBadgeRecommendations({
          babyAgeInMonths: age,
          excludeBadgeIds: excludeIds,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (babyAgeInMonths !== undefined && babyAgeInMonths >= 0) {
      loadRecommendations(babyAgeInMonths, awardedBadgeIds || []);
    }
  }, [babyAgeInMonths, awardedBadgeIds, loadRecommendations]);

  const categorizedRecommendations = useMemo(() => {
    const grouped: Record<string, typeof recommendedBadges> = {};
    recommendedBadges.forEach((rec) => {
      const category = rec.badge.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(rec);
    });
    return grouped;
  }, [recommendedBadges]);

  const highPriorityRecommendations = useMemo(() => {
    return recommendedBadges.filter((rec) => rec.matchScore >= 80);
  }, [recommendedBadges]);

  return {
    recommendations: recommendedBadges,
    categorizedRecommendations,
    highPriorityRecommendations,
    isLoading,
    error,
    refresh: () => babyAgeInMonths !== undefined && loadRecommendations(babyAgeInMonths, awardedBadgeIds || []),
  };
};

// Hook for badge search
export const useSearchBadges = () => {
  const dispatch = useAppDispatch();
  const { badges, isLoading, error, filters } = useAppSelector((state) => state.badges);

  const search = useCallback(
    (query: string) => {
      dispatch(updateFilters({ search: query }));
      return dispatch(fetchBadges({ ...filters, search: query, page: 1 }));
    },
    [dispatch, filters],
  );

  const clearSearch = useCallback(() => {
    dispatch(updateFilters({ search: undefined }));
  }, [dispatch]);

  return {
    results: badges,
    isLoading,
    error,
    search,
    clearSearch,
    currentQuery: filters.search,
  };
};

// Hook for badge templates
export const useBadgeTemplates = () => {
  const templates = useMemo(
    () => [
      {
        id: 'first-steps',
        title: 'First Steps',
        description: 'Baby took their first independent steps',
        category: BadgeCategory.MILESTONE,
        suggestedAge: { min: 9, max: 18 },
        icon: '👣',
      },
      {
        id: 'first-word',
        title: 'First Word',
        description: 'Baby said their first clear word',
        category: BadgeCategory.MILESTONE,
        suggestedAge: { min: 10, max: 18 },
        icon: '💬',
      },
      {
        id: 'sleep-champion',
        title: 'Sleep Champion',
        description: 'Baby slept through the night',
        category: BadgeCategory.DAILY_LIFE,
        suggestedAge: { min: 3, max: 12 },
        icon: '😴',
      },
      {
        id: 'first-smile',
        title: 'First Smile',
        description: 'Baby gave their first social smile',
        category: BadgeCategory.SOCIAL,
        suggestedAge: { min: 1, max: 3 },
        icon: '😊',
      },
      {
        id: 'tummy-time-pro',
        title: 'Tummy Time Pro',
        description: 'Completed daily tummy time',
        category: BadgeCategory.PHYSICAL,
        suggestedAge: { min: 0, max: 6 },
        icon: '🤸',
      },
      {
        id: 'book-lover',
        title: 'Book Lover',
        description: 'Read 10 books together',
        category: BadgeCategory.COGNITIVE,
        suggestedAge: { min: 0, max: 60 },
        icon: '📚',
      },
    ],
    [],
  );

  const getTemplateByCategory = useCallback(
    (category: BadgeCategory) => {
      return templates.filter((t) => t.category === category);
    },
    [templates],
  );

  const getTemplateForAge = useCallback(
    (ageInMonths: number) => {
      return templates.filter((t) => ageInMonths >= t.suggestedAge.min && ageInMonths <= t.suggestedAge.max);
    },
    [templates],
  );

  return {
    templates,
    getTemplateByCategory,
    getTemplateForAge,
  };
};
