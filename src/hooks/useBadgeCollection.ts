// src/hooks/useBadgeCollection.ts

import { VerificationStatus } from '@/models/Badge/BadgeEnum';
import { BadgeCollectionFilters } from '@/models/BadgeCollection/BadgeCollectionModel';
import {
    CreateBadgeCollectionRequest,
    GetBadgeCollectionsRequest,
    UpdateBadgeCollectionRequest,
} from '@/models/BadgeCollection/BadgeCollectionRequest';
import {
    approveBadgeCollection,
    clearBabyData,
    clearError,
    createBadgeCollection,
    deleteBadgeCollection,
    fetchBabyBadges,
    fetchBabyProgress,
    fetchBabyStats,
    fetchBadgeCollectionById,
    fetchBadgeCollections,
    fetchMySubmissions,
    fetchPendingVerifications,
    rejectBadgeCollection,
    resetFilters,
    setActiveTab,
    updateBadgeCollection,
    updateFilters,
    uploadBadgeMedia
} from '@/store/slices/badgeCollectionSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Hook for managing badge collections list
export const useBadgeCollections = () => {
  const dispatch = useAppDispatch();
  const { collections, isLoading, isLoadingMore, error, pagination, filters } = useAppSelector(
    (state) => state.badgeCollections,
  );

  const loadCollections = useCallback(
    (params?: GetBadgeCollectionsRequest) => {
      return dispatch(fetchBadgeCollections(params || filters));
    },
    [dispatch, filters],
  );

  const setFilters = useCallback(
    (newFilters: Partial<BadgeCollectionFilters>) => {
      dispatch(updateFilters(newFilters));
    },
    [dispatch],
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const refresh = useCallback(() => {
    return loadCollections({ ...filters, page: 1 });
  }, [loadCollections, filters]);

  return {
    collections,
    isLoading,
    isLoadingMore,
    error,
    pagination,
    filters,
    loadCollections,
    setFilters,
    clearFilters,
    refresh,
  };
};

// Hook for awarding badges to babies
export const useAwardBadge = () => {
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector((state) => state.badgeCollections);

  const awardBadge = useCallback(
    async (data: CreateBadgeCollectionRequest) => {
      return dispatch(createBadgeCollection(data)).unwrap();
    },
    [dispatch],
  );

  const clearAwardError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    awardBadge,
    isSubmitting,
    error,
    clearError: clearAwardError,
  };
};

// Hook for managing a single badge collection
export const useBadgeCollection = (collectionId?: string) => {
  const dispatch = useAppDispatch();
  const { currentCollection, isLoading, isSubmitting, error } = useAppSelector((state) => state.badgeCollections);

  useEffect(() => {
    if (collectionId) {
      dispatch(fetchBadgeCollectionById(collectionId));
    }
  }, [dispatch, collectionId]);

  const update = useCallback(
    async (data: UpdateBadgeCollectionRequest) => {
      if (!collectionId) return;
      return dispatch(updateBadgeCollection({ id: collectionId, data })).unwrap();
    },
    [dispatch, collectionId],
  );

  const remove = useCallback(async () => {
    if (!collectionId) return;
    return dispatch(deleteBadgeCollection(collectionId)).unwrap();
  }, [dispatch, collectionId]);

  const approve = useCallback(async () => {
    if (!collectionId) return;
    return dispatch(approveBadgeCollection(collectionId)).unwrap();
  }, [dispatch, collectionId]);

  const reject = useCallback(async () => {
    if (!collectionId) return;
    return dispatch(rejectBadgeCollection(collectionId)).unwrap();
  }, [dispatch, collectionId]);

  const uploadMedia = useCallback(
    async (files: FormData) => {
      if (!collectionId) return;
      return dispatch(uploadBadgeMedia({ collectionId, files })).unwrap();
    },
    [dispatch, collectionId],
  );

  return {
    collection: currentCollection,
    isLoading,
    isSubmitting,
    error,
    update,
    remove,
    approve,
    reject,
    uploadMedia,
  };
};

// Hook for baby badges
export const useBabyBadges = (babyId?: string) => {
  const dispatch = useAppDispatch();
  const { babyCollections, babyStatistics, babyProgress, isLoading, error } = useAppSelector(
    (state) => state.badgeCollections,
  );

  const collections = useMemo(() => {
    return babyId ? babyCollections[babyId] || [] : [];
  }, [babyCollections, babyId]);

  const stats = useMemo(() => {
    return babyId ? babyStatistics[babyId] || null : null;
  }, [babyStatistics, babyId]);

  const progress = useMemo(() => {
    return babyId ? babyProgress[babyId] || null : null;
  }, [babyProgress, babyId]);

  const loadBabyBadges = useCallback(async () => {
    if (!babyId) return;
    return dispatch(fetchBabyBadges(babyId)).unwrap();
  }, [dispatch, babyId]);

  const loadBabyStats = useCallback(async () => {
    if (!babyId) return;
    return dispatch(fetchBabyStats(babyId)).unwrap();
  }, [dispatch, babyId]);

  const loadBabyProgress = useCallback(async () => {
    if (!babyId) return;
    return dispatch(fetchBabyProgress(babyId)).unwrap();
  }, [dispatch, babyId]);

  const loadAll = useCallback(async () => {
    if (!babyId) return;
    await Promise.all([loadBabyBadges(), loadBabyStats(), loadBabyProgress()]);
  }, [babyId, loadBabyBadges, loadBabyStats, loadBabyProgress]);

  useEffect(() => {
    if (babyId && !collections.length) {
      loadAll();
    }
  }, [babyId, collections.length, loadAll]);

  const clearData = useCallback(() => {
    if (babyId) {
      dispatch(clearBabyData(babyId));
    }
  }, [dispatch, babyId]);

  return {
    badges: collections,
    statistics: stats,
    progress,
    isLoading,
    error,
    loadBadges: loadBabyBadges,
    loadStats: loadBabyStats,
    loadProgress: loadBabyProgress,
    refresh: loadAll,
    clearData,
  };
};

// Hook for baby badge timeline
export const useBabyBadgeTimeline = (babyId?: string) => {
  const { badges } = useBabyBadges(babyId);

  const timeline = useMemo(() => {
    if (!badges.length) return [];

    // Group badges by date
    const grouped: Record<string, typeof badges> = {};
    badges.forEach((badge) => {
      const date = new Date(badge.completedAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(badge);
    });

    // Convert to timeline entries
    return Object.entries(grouped)
      .map(([date, collections]) => ({
        date,
        collections,
        totalForDay: collections.length,
        milestoneAchieved: collections.some((c) => c.badge?.category === 'milestone'),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [badges]);

  const monthlyStats = useMemo(() => {
    const stats: Record<string, number> = {};
    badges.forEach((badge) => {
      const month = new Date(badge.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
      stats[month] = (stats[month] || 0) + 1;
    });
    return stats;
  }, [badges]);

  return {
    timeline,
    monthlyStats,
    totalBadges: badges.length,
  };
};

// Hook for pending verifications (admin)
export const usePendingVerifications = () => {
  const dispatch = useAppDispatch();
  const { pendingVerifications, isLoading, error } = useAppSelector((state) => state.badgeCollections);

  const loadPending = useCallback(() => {
    return dispatch(fetchPendingVerifications());
  }, [dispatch]);

  useEffect(() => {
    if (!pendingVerifications.length) {
      loadPending();
    }
  }, [pendingVerifications.length, loadPending]);

  const approveCollection = useCallback(
    async (collectionId: string) => {
      return dispatch(approveBadgeCollection(collectionId)).unwrap();
    },
    [dispatch],
  );

  const rejectCollection = useCallback(
    async (collectionId: string) => {
      return dispatch(rejectBadgeCollection(collectionId)).unwrap();
    },
    [dispatch],
  );

  const stats = useMemo(() => {
    const now = Date.now();
    const waitTimes = pendingVerifications.map((c) => now - new Date(c.createdAt).getTime());

    return {
      total: pendingVerifications.length,
      averageWaitTime:
        waitTimes.length > 0
          ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length / (1000 * 60 * 60) // in hours
          : 0,
      oldestPending:
        pendingVerifications.length > 0
          ? Math.max(...waitTimes) / (1000 * 60 * 60) // in hours
          : 0,
    };
  }, [pendingVerifications]);

  return {
    pendingVerifications,
    isLoading,
    error,
    stats,
    refresh: loadPending,
    approveCollection,
    rejectCollection,
  };
};

// Hook for user's badge submissions
export const useMyBadgeSubmissions = () => {
  const dispatch = useAppDispatch();
  const { mySubmissions, isLoading, error } = useAppSelector((state) => state.badgeCollections);

  const loadSubmissions = useCallback(() => {
    return dispatch(fetchMySubmissions());
  }, [dispatch]);

  useEffect(() => {
    if (!mySubmissions.length) {
      loadSubmissions();
    }
  }, [mySubmissions.length, loadSubmissions]);

  const stats = useMemo(() => {
    const statusCounts = {
      approved: 0,
      pending: 0,
      rejected: 0,
      autoApproved: 0,
    };

    mySubmissions.forEach((submission) => {
      switch (submission.verificationStatus) {
        case VerificationStatus.APPROVED:
          statusCounts.approved++;
          break;
        case VerificationStatus.PENDING:
          statusCounts.pending++;
          break;
        case VerificationStatus.REJECTED:
          statusCounts.rejected++;
          break;
        case VerificationStatus.AUTO_APPROVED:
          statusCounts.autoApproved++;
          break;
      }
    });

    return {
      total: mySubmissions.length,
      ...statusCounts,
      approvalRate:
        mySubmissions.length > 0
          ? ((statusCounts.approved + statusCounts.autoApproved) / mySubmissions.length) * 100
          : 0,
    };
  }, [mySubmissions]);

  const groupedByBaby = useMemo(() => {
    const grouped: Record<string, typeof mySubmissions> = {};
    mySubmissions.forEach((submission) => {
      const babyId = submission.babyId;
      if (!grouped[babyId]) {
        grouped[babyId] = [];
      }
      grouped[babyId].push(submission);
    });
    return grouped;
  }, [mySubmissions]);

  return {
    submissions: mySubmissions,
    isLoading,
    error,
    stats,
    groupedByBaby,
    refresh: loadSubmissions,
  };
};

// Hook for badge collection tabs
export const useBadgeCollectionTabs = () => {
  const dispatch = useAppDispatch();
  const { activeTab, collections } = useAppSelector((state) => state.badgeCollections);

  const setTab = useCallback(
    (tab: 'all' | 'pending' | 'approved' | 'rejected') => {
      dispatch(setActiveTab(tab));
    },
    [dispatch],
  );

  const filteredCollections = useMemo(() => {
    if (activeTab === 'all') return collections;

    const statusMap = {
      pending: VerificationStatus.PENDING,
      approved: [VerificationStatus.APPROVED, VerificationStatus.AUTO_APPROVED],
      rejected: VerificationStatus.REJECTED,
    };

    const targetStatus = statusMap[activeTab as keyof typeof statusMap];

    if (Array.isArray(targetStatus)) {
      return collections.filter((c) => targetStatus.includes(c.verificationStatus));
    }

    return collections.filter((c) => c.verificationStatus === targetStatus);
  }, [collections, activeTab]);

  const tabCounts = useMemo(() => {
    const counts = {
      all: collections.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    collections.forEach((collection) => {
      switch (collection.verificationStatus) {
        case VerificationStatus.PENDING:
          counts.pending++;
          break;
        case VerificationStatus.APPROVED:
        case VerificationStatus.AUTO_APPROVED:
          counts.approved++;
          break;
        case VerificationStatus.REJECTED:
          counts.rejected++;
          break;
      }
    });

    return counts;
  }, [collections]);

  return {
    activeTab,
    setTab,
    filteredCollections,
    tabCounts,
  };
};

// Hook for media upload
export const useBadgeMediaUpload = (collectionId?: string) => {
  const dispatch = useAppDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMedia = useCallback(
    async (files: File[]) => {
      if (!collectionId || files.length === 0) return;

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append(`file${index}`, file);
        });

        // Simulate progress (actual progress would come from upload API)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const result = await dispatch(uploadBadgeMedia({ collectionId, files: formData })).unwrap();

        clearInterval(progressInterval);
        setUploadProgress(100);

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);

        return result;
      } catch (error) {
        setIsUploading(false);
        setUploadProgress(0);
        throw error;
      }
    },
    [dispatch, collectionId],
  );

  return {
    uploadMedia,
    isUploading,
    uploadProgress,
  };
};
