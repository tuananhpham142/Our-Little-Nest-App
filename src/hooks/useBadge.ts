// src/hooks/useBadge.ts

import { BadgeCategory } from '@/models/Badge/BadgeEnum';
import { Badge, BadgeFilters } from '@/models/Badge/BadgeModel';
import { CreateBadgeRequest, GetBadgesRequest, UpdateBadgeRequest } from '@/models/Badge/BadgeRequest';
import {
  activateBadge,
  clearBadges,
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
  resetFilters,
  setCurrentBadge,
  updateBadge,
  updateFilters,
} from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useCallback, useEffect, useState } from 'react';

// Main badges hook
export const useBadges = () => {
  const dispatch = useAppDispatch();
  const {
    badges,
    currentBadge,
    myCustomBadges,
    categoryBadges,
    suitableForAgeBadges,
    recommendedBadges,
    statistics,
    isLoading,
    isLoadingMore,
    isSubmitting,
    error,
    pagination,
    filters,
  } = useAppSelector((state) => state.badges);

  const loadBadges = useCallback(
    (params?: GetBadgesRequest) => {
      const loadParams = { ...filters, ...params };
      dispatch(fetchBadges(loadParams));
    },
    [dispatch, filters],
  );

  const loadMoreBadges = useCallback(() => {
    if (pagination.hasNextPage && !isLoadingMore && !isLoading) {
      return dispatch(loadMoreBadges(filters));
    }
  }, [dispatch, filters, pagination.hasNextPage, isLoadingMore, isLoading]);

  const refreshBadges = useCallback(() => {
    dispatch(clearBadges());
    dispatch(fetchBadges({ ...filters, page: 1 }));
  }, [dispatch, filters]);

  const setFilters = useCallback(
    (newFilters: Partial<BadgeFilters>) => {
      dispatch(updateFilters(newFilters));
      // Auto-load with new filters
      dispatch(fetchBadges({ ...filters, ...newFilters }));
    },
    [dispatch, filters],
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(fetchBadges({}));
  }, [dispatch]);

  const clearErrorCallback = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    badges,
    currentBadge,
    myCustomBadges,
    categoryBadges,
    suitableForAgeBadges,
    recommendedBadges,
    statistics,
    isLoading,
    isLoadingMore,
    isSubmitting,
    error,
    pagination,
    filters,
    loadBadges,
    loadMoreBadges,
    refreshBadges,
    setFilters,
    clearFilters,
    clearError,
  };
};

// Badge detail hook
export const useBadgeDetail = () => {
  const dispatch = useAppDispatch();
  const { currentBadge, isLoading, error } = useAppSelector((state) => state.badges);

  const loadBadgeDetail = useCallback(
    (badgeId: string) => {
      dispatch(fetchBadgeById(badgeId));
    },
    [dispatch],
  );

  const clearBadgeDetail = useCallback(() => {
    dispatch(setCurrentBadge(null));
  }, [dispatch]);

  return {
    badge: currentBadge,
    isLoading,
    error,
    loadBadgeDetail,
    clearBadgeDetail,
  };
};

// Badge creation/editing hook
export const useBadgeForm = () => {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector((state) => state.badges);

  const createNewBadge = useCallback(
    (data: CreateBadgeRequest) => {
      return dispatch(createBadge(data));
    },
    [dispatch],
  );

  const updateExistingBadge = useCallback(
    (id: string, data: UpdateBadgeRequest) => {
      return dispatch(updateBadge({ id, data }));
    },
    [dispatch],
  );

  const deleteBadgeById = useCallback(
    (id: string) => {
      return dispatch(deleteBadge(id));
    },
    [dispatch],
  );

  const activateBadgeById = useCallback(
    (id: string) => {
      return dispatch(activateBadge(id));
    },
    [dispatch],
  );

  const deactivateBadgeById = useCallback(
    (id: string) => {
      return dispatch(deactivateBadge(id));
    },
    [dispatch],
  );

  return {
    isSubmitting,
    error,
    createBadge: createNewBadge,
    updateBadge: updateExistingBadge,
    deleteBadge: deleteBadgeById,
    activateBadge: activateBadgeById,
    deactivateBadge: deactivateBadgeById,
  };
};

// Badge category hook
export const useBadgesByCategory = (category?: BadgeCategory) => {
  const dispatch = useAppDispatch();
  const { categoryBadges, isLoading, error } = useAppSelector((state) => state.badges);

  const loadBadgesByCategory = useCallback(
    (targetCategory: BadgeCategory) => {
      dispatch(fetchBadgesByCategory(targetCategory));
    },
    [dispatch],
  );

  useEffect(() => {
    if (category && !categoryBadges[category]) {
      loadBadgesByCategory(category);
    }
  }, [category, categoryBadges, loadBadgesByCategory]);

  return {
    badges: category ? categoryBadges[category] || [] : [],
    isLoading,
    error,
    loadBadgesByCategory,
  };
};

// Badge recommendations hook
export const useBadgeRecommendations = () => {
  const dispatch = useAppDispatch();
  const { recommendedBadges, isLoading, error } = useAppSelector((state) => state.badges);

  const loadRecommendations = useCallback(
    (babyAgeInMonths: number, excludeBadgeIds?: string[]) => {
      dispatch(fetchBadgeRecommendations({ babyAgeInMonths, excludeBadgeIds }));
    },
    [dispatch],
  );

  return {
    recommendations: recommendedBadges,
    isLoading,
    error,
    loadRecommendations,
  };
};

// Badge statistics hook
export const useBadgeStatistics = () => {
  const dispatch = useAppDispatch();
  const { statistics, isLoading, error } = useAppSelector((state) => state.badges);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadStatistics = useCallback(() => {
    dispatch(fetchBadgeStatistics());
    setHasLoaded(true);
  }, [dispatch]);

  useEffect(() => {
    if (!hasLoaded && !statistics && !isLoading) {
      loadStatistics();
    }
  }, [hasLoaded, statistics, isLoading, loadStatistics]);

  return {
    statistics,
    isLoading,
    error,
    loadStatistics,
  };
};

// Custom badges hook
export const useCustomBadges = () => {
  const dispatch = useAppDispatch();
  const { myCustomBadges, isLoading, error } = useAppSelector((state) => state.badges);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadCustomBadges = useCallback(() => {
    dispatch(fetchMyCustomBadges());
    setHasLoaded(true);
  }, [dispatch]);

  useEffect(() => {
    if (!hasLoaded && !myCustomBadges.length && !isLoading) {
      loadCustomBadges();
    }
  }, [hasLoaded, myCustomBadges.length, isLoading, loadCustomBadges]);

  return {
    customBadges: myCustomBadges,
    isLoading,
    error,
    loadCustomBadges,
  };
};

// Age-appropriate badges hook
export const useBadgesForAge = (ageInMonths?: number) => {
  const dispatch = useAppDispatch();
  const { suitableForAgeBadges, isLoading, error } = useAppSelector((state) => state.badges);

  const loadBadgesForAge = useCallback(
    (targetAge: number) => {
      dispatch(fetchBadgesForAge(targetAge));
    },
    [dispatch],
  );

  useEffect(() => {
    if (ageInMonths && ageInMonths > 0) {
      loadBadgesForAge(ageInMonths);
    }
  }, [ageInMonths, loadBadgesForAge]);

  return {
    badges: suitableForAgeBadges,
    isLoading,
    error,
    loadBadgesForAge,
  };
};

// Badge selection hook (for awarding badges)
export const useBadgesForSelection = () => {
  const dispatch = useAppDispatch();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBadges = useCallback(
    async (params?: GetBadgesRequest) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await dispatch(
          fetchBadges({
            isActive: true,
            ...params,
            limit: 50, // Get more badges for selection
          }),
        );

        if (fetchBadges.fulfilled.match(response)) {
          setBadges(response.payload.data);
        } else {
          setError('Failed to load badges');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load badges');
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  return {
    badges,
    isLoading,
    error,
    loadBadges,
  };
};

// Badge search hook
export const useBadgeSearch = () => {
  const [searchResults, setSearchResults] = useState<Badge[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const searchBadges = useCallback(
    async (query: string, filters?: Partial<BadgeFilters>) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        setSearchError(null);

        const response = await dispatch(
          fetchBadges({
            search: query,
            ...filters,
            limit: 20,
          }),
        );

        if (fetchBadges.fulfilled.match(response)) {
          setSearchResults(response.payload.data);
        } else {
          setSearchError('Search failed');
          setSearchResults([]);
        }
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : 'Search failed');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch],
  );

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchBadges,
    clearSearch,
  };
};
