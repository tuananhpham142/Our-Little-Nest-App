// src/hooks/useBadgeCollection.ts

import { BadgeCollectionFilters } from '@/models/BadgeCollection/BadgeCollectionModel';
import {
  CreateBadgeCollectionRequest,
  GetBadgeCollectionsRequest,
  UpdateBadgeCollectionRequest,
  VerifyBadgeCollectionRequest,
} from '@/models/BadgeCollection/BadgeCollectionRequest';
import {
  approveBadgeCollection,
  clearCollections,
  createBadgeCollection,
  deleteBadgeCollection,
  fetchBabyBadges,
  fetchBabyProgress,
  fetchBabyStats,
  fetchBabyTimeline,
  fetchBadgeCollectionById,
  fetchBadgeCollections,
  fetchMySubmissions,
  fetchPendingVerifications,
  loadMoreBadgeCollections,
  rejectBadgeCollection,
  resetFilters,
  setActiveTab,
  setCurrentCollection,
  setSelectedBabyId,
  updateBadgeCollection,
  updateFilters,
  uploadBadgeMedia,
  verifyBadgeCollection,
} from '@/store/slices/badgeCollectionSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Main badge collections hook
export const useBadgeCollections = () => {
  const dispatch = useAppDispatch();
  const {
    collections,
    currentCollection,
    babyCollections,
    mySubmissions,
    pendingVerifications,
    babyStatistics,
    babyProgress,
    isLoading,
    isLoadingMore,
    isSubmitting,
    error,
    pagination,
    filters,
    selectedBabyId,
    activeTab,
  } = useAppSelector((state) => state.badgeCollections);

  const loadCollections = useCallback(
    (params?: GetBadgeCollectionsRequest) => {
      const loadParams = { ...filters, ...params };
      dispatch(fetchBadgeCollections(loadParams));
    },
    [dispatch, filters],
  );

  const loadMoreCollections = useCallback(() => {
    if (pagination.hasNextPage && !isLoadingMore && !isLoading) {
      return dispatch(loadMoreBadgeCollections(filters));
    }
  }, [dispatch, filters, pagination.hasNextPage, isLoadingMore, isLoading]);

  const refreshCollections = useCallback(() => {
    dispatch(clearCollections());
    dispatch(fetchBadgeCollections({ ...filters, page: 1 }));
  }, [dispatch, filters]);

  const setFilters = useCallback(
    (newFilters: Partial<BadgeCollectionFilters>) => {
      dispatch(updateFilters(newFilters));
      dispatch(fetchBadgeCollections({ ...filters, ...newFilters }));
    },
    [dispatch, filters],
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
    dispatch(fetchBadgeCollections());
  }, [dispatch]);

  const selectBaby = useCallback(
    (babyId: string | null) => {
      dispatch(setSelectedBabyId(babyId));
    },
    [dispatch],
  );

  const setTab = useCallback(
    (tab: 'all' | 'pending' | 'approved' | 'rejected') => {
      dispatch(setActiveTab(tab));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    collections,
    currentCollection,
    babyCollections,
    mySubmissions,
    pendingVerifications,
    babyStatistics,
    babyProgress,
    isLoading,
    isLoadingMore,
    isSubmitting,
    error,
    pagination,
    filters,
    selectedBabyId,
    activeTab,
    loadCollections,
    loadMoreCollections,
    refreshCollections,
    setFilters,
    clearFilters,
    selectBaby,
    setTab,
    clearError,
  };
};

// Badge collection detail hook
export const useBadgeCollectionDetail = () => {
  const dispatch = useAppDispatch();
  const { currentCollection, isLoading, error } = useAppSelector((state) => state.badgeCollections);

  const loadCollectionDetail = useCallback(
    (collectionId: string) => {
      dispatch(fetchBadgeCollectionById(collectionId));
    },
    [dispatch],
  );

  const clearCollectionDetail = useCallback(() => {
    dispatch(setCurrentCollection(null));
  }, [dispatch]);

  return {
    collection: currentCollection,
    isLoading,
    error,
    loadCollectionDetail,
    clearCollectionDetail,
  };
};

// Badge collection form hook (create/update)
export const useBadgeCollectionForm = () => {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector((state) => state.badgeCollections);

  const createCollection = useCallback(
    (data: CreateBadgeCollectionRequest) => {
      return dispatch(createBadgeCollection(data));
    },
    [dispatch],
  );

  const updateCollection = useCallback(
    (id: string, data: UpdateBadgeCollectionRequest) => {
      return dispatch(updateBadgeCollection({ id, data }));
    },
    [dispatch],
  );

  const deleteCollection = useCallback(
    (id: string) => {
      return dispatch(deleteBadgeCollection(id));
    },
    [dispatch],
  );

  const uploadMedia = useCallback(
    (collectionId: string, files: FormData) => {
      return dispatch(uploadBadgeMedia({ collectionId, files }));
    },
    [dispatch],
  );

  return {
    isSubmitting,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    uploadMedia,
  };
};

// Award badge hook (simplified create hook)
export const useAwardBadge = () => {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector((state) => state.badgeCollections);

  const awardBadge = useCallback(
    (data: CreateBadgeCollectionRequest) => {
      return dispatch(createBadgeCollection(data));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    awardBadge,
    isSubmitting,
    error,
    clearError,
  };
};

// Baby badge collections hook
export const useBabyBadgeCollections = (babyId: string) => {
  const dispatch = useAppDispatch();
  const { babyCollections, babyStatistics, babyProgress, isLoading, error } = useAppSelector(
    (state) => state.badgeCollections,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const collections = babyCollections[babyId] || [];
  const statistics = babyStatistics[babyId];
  const progress = babyProgress[babyId];

  const loadCollections = useCallback(() => {
    if (babyId) {
      dispatch(fetchBabyBadges({ babyId }));
      dispatch(fetchBabyStats(babyId));
      dispatch(fetchBabyProgress(babyId));
    }
  }, [dispatch, babyId]);

  const refreshCollections = useCallback(async () => {
    if (!babyId) return;

    try {
      setIsRefreshing(true);
      await Promise.all([
        dispatch(fetchBabyBadges({ babyId })),
        dispatch(fetchBabyStats(babyId)),
        dispatch(fetchBabyProgress(babyId)),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, babyId]);

  const loadCollectionsByStatus = useCallback(
    (verificationStatus?: string) => {
      if (babyId) {
        dispatch(fetchBabyBadges({ babyId, params: { verificationStatus } }));
      }
    },
    [dispatch, babyId],
  );

  return {
    collections,
    statistics,
    progress,
    isLoading,
    isRefreshing,
    error,
    loadCollections,
    refreshCollections,
    loadCollectionsByStatus,
  };
};

// Badge collection verification hook (admin)
export const useBadgeVerification = () => {
  const dispatch = useAppDispatch();
  const { pendingVerifications, isLoading, isSubmitting, error } = useAppSelector((state) => state.badgeCollections);

  const loadPendingVerifications = useCallback(
    (params?: { page?: number; limit?: number }) => {
      dispatch(fetchPendingVerifications(params));
    },
    [dispatch],
  );

  const verifyCollection = useCallback(
    (id: string, data: VerifyBadgeCollectionRequest) => {
      return dispatch(verifyBadgeCollection({ id, data }));
    },
    [dispatch],
  );

  const approveCollection = useCallback(
    (id: string, verificationNote?: string) => {
      return dispatch(approveBadgeCollection({ id, verificationNote }));
    },
    [dispatch],
  );

  const rejectCollection = useCallback(
    (id: string, verificationNote?: string) => {
      return dispatch(rejectBadgeCollection({ id, verificationNote }));
    },
    [dispatch],
  );

  return {
    pendingVerifications,
    isLoading,
    isSubmitting,
    error,
    loadPendingVerifications,
    verifyCollection,
    approveCollection,
    rejectCollection,
  };
};

// My submissions hook
export const useMySubmissions = () => {
  const dispatch = useAppDispatch();
  const { mySubmissions, isLoading, error } = useAppSelector((state) => state.badgeCollections);

  const loadMySubmissions = useCallback(
    (params?: { verificationStatus?: string; page?: number; limit?: number }) => {
      dispatch(fetchMySubmissions(params));
    },
    [dispatch],
  );

  const refreshMySubmissions = useCallback(() => {
    dispatch(fetchMySubmissions());
  }, [dispatch]);

  return {
    submissions: mySubmissions,
    isLoading,
    error,
    loadMySubmissions,
    refreshMySubmissions,
  };
};

// Baby timeline hook
export const useBabyTimeline = (babyId: string) => {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const loadTimeline = useCallback(
    async (params?: { startDate?: string; endDate?: string }) => {
      if (!babyId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await dispatch(fetchBabyTimeline({ babyId, params }));

        if (fetchBabyTimeline.fulfilled.match(response)) {
          setTimeline(response.payload.timeline);
        } else {
          setError('Failed to load timeline');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load timeline');
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, babyId],
  );

  const refreshTimeline = useCallback(() => {
    loadTimeline();
  }, [loadTimeline]);

  return {
    timeline,
    isLoading,
    error,
    loadTimeline,
    refreshTimeline,
  };
};

// Badge collection tabs hook
export const useBadgeCollectionTabs = () => {
  const { collections, activeTab } = useAppSelector((state) => state.badgeCollections);
  const dispatch = useAppDispatch();

  const filteredCollections = useMemo(() => {
    if (activeTab === 'all') return collections;
    return collections.filter((c) => c.verificationStatus === activeTab);
  }, [collections, activeTab]);

  const tabCounts = useMemo(() => {
    const counts = collections.reduce(
      (acc, collection) => {
        acc.all++;
        const status = collection.verificationStatus;
        if (status === 'approved') acc.approved++;
        else if (status === 'pending') acc.pending++;
        else if (status === 'rejected') acc.rejected++;
        return acc;
      },
      { all: 0, approved: 0, pending: 0, rejected: 0 },
    );
    return counts;
  }, [collections]);

  const setTab = useCallback(
    (tab: typeof activeTab) => {
      dispatch(setActiveTab(tab));
    },
    [dispatch],
  );

  return {
    activeTab,
    filteredCollections,
    tabCounts,
    setTab,
  };
};

// Badge collection analytics hook
export const useBadgeCollectionAnalytics = (babyId?: string) => {
  const { babyStatistics, babyProgress } = useAppSelector((state) => state.badgeCollections);
  const [analytics, setAnalytics] = useState<any>(null);

  const statistics = babyId ? babyStatistics[babyId] : null;
  const progress = babyId ? babyProgress[babyId] : null;

  useEffect(() => {
    if (statistics && progress) {
      const completionRate =
        statistics.totalBadges > 0 ? (statistics.approvedBadges / statistics.totalBadges) * 100 : 0;

      const verificationRate =
        statistics.totalBadges > 0
          ? ((statistics.approvedBadges + statistics.rejectedBadges) / statistics.totalBadges) * 100
          : 0;

      const recentActivity = statistics.recentBadges || [];

      setAnalytics({
        completionRate,
        verificationRate,
        recentActivity: recentActivity.slice(0, 5), // Latest 5
        categoryProgress: statistics.categoryDistribution || {},
        totalAchievements: statistics.totalBadges,
        monthlyGrowth: 0, // Calculate based on timeline data
      });
    }
  }, [statistics, progress]);

  return {
    analytics,
    statistics,
    progress,
  };
};
