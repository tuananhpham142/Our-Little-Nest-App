/* eslint-disable react-hooks/exhaustive-deps */
// ============================================
// src/screens/NotificationScreen.tsx
// ============================================

import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlashList, FlashListRef } from '@shopify/flash-list';
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Platform, RefreshControl, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import AppLayout from '@/components/layout/AppLayout';
import { NotificationFilterType } from '@/models/Notification/NotificationEnum';
import { Notification } from '@/models/Notification/NotificationModel';
import {
  deleteNotification,
  fetchNotifications,
  loadMoreNotifications,
  markAllAsRead,
  markAsRead,
  refreshNotifications,
  toggleNotificationSelection,
} from '@/store/slices/notificationSlice';
import { AppDispatch, RootState } from '@/store/store';
import NotificationEmptyState from './NotificationEmptyState';
import NotificationFilterBottomSheet from './NotificationFilterBottomSheet';
import NotificationItem from './NotificationItem';
import { mockNotifications } from './mockup-data';

type RootStackParamList = {
  Appointments: { appointmentId?: string };
  Vaccinations: { babyId?: string };
  Milestones: { milestoneId?: string };
  KindnessCloset: { postId?: string };
  NotificationDetail: { notification: Notification };
};

const ESTIMATED_ITEM_SIZE = 88;

const NotificationScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    isRefreshing,
    pagination,
    filters,
    selectedNotificationIds,
  } = useSelector((state: RootState) => state.notifications);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flashListRef = useRef<FlashListRef<Notification>>(null);

  useEffect(() => {
    loadNotifications();
  }, [filters]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
      return () => {};
    }, []),
  );

  const loadNotifications = useCallback(() => {
    dispatch(
      fetchNotifications({
        ...filters,
        page: 1,
        limit: 20,
      }),
    );
  }, [dispatch, filters]);

  const handleRefresh = useCallback(() => {
    dispatch(refreshNotifications(filters));
  }, [dispatch, filters]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNextPage && !isLoadingMore) {
      dispatch(loadMoreNotifications(filters));
    }
  }, [dispatch, filters, pagination.hasNextPage, isLoadingMore]);

  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      if (isSelectionMode) {
        dispatch(toggleNotificationSelection(notification.id));
        return;
      }

      if (notification.status !== 'read') {
        dispatch(markAsRead(notification.id));
      }

      navigateToRelatedScreen(notification);
    },
    [dispatch, isSelectionMode],
  );

  const handleNotificationLongPress = useCallback(
    (notification: Notification) => {
      setIsSelectionMode(true);
      dispatch(toggleNotificationSelection(notification.id));
    },
    [dispatch],
  );

  const handleDeleteNotification = useCallback(
    (id: string) => {
      dispatch(deleteNotification(id));
    },
    [dispatch],
  );

  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllAsRead({}));
  }, [dispatch]);

  const navigateToRelatedScreen = (notification: Notification) => {
    const { type, data } = notification;

    try {
      switch (type) {
        case 'appointment_reminder':
        case 'doctor_appointment':
          navigation.navigate('Appointments', { appointmentId: data?.appointmentId });
          break;
        case 'vaccination_reminder':
        case 'vaccination_due':
          navigation.navigate('Vaccinations', { babyId: data?.babyId });
          break;
        case 'milestone_achieved':
          navigation.navigate('Milestones', { milestoneId: data?.milestoneId });
          break;
        case 'kindness_closet_created':
        case 'application_received':
          navigation.navigate('KindnessCloset', { postId: data?.postId });
          break;
        default:
          navigation.navigate('NotificationDetail', { notification });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const formatNotificationTime = useCallback((date: string): string => {
    try {
      const notificationDate = parseISO(date);

      if (isToday(notificationDate)) {
        return formatDistanceToNow(notificationDate, { addSuffix: false });
      } else if (isYesterday(notificationDate)) {
        return 'Yesterday';
      } else {
        return format(notificationDate, 'MMM d');
      }
    } catch (error) {
      return '';
    }
  }, []);

  const renderNotification = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationItem
        notification={item}
        onPress={() => handleNotificationPress(item)}
        onLongPress={() => handleNotificationLongPress(item)}
        onDelete={() => handleDeleteNotification(item.id)}
        isSelected={selectedNotificationIds.includes(item.id)}
        isSelectionMode={isSelectionMode}
        formatTime={formatNotificationTime}
      />
    ),
    [
      handleNotificationPress,
      handleNotificationLongPress,
      handleDeleteNotification,
      selectedNotificationIds,
      isSelectionMode,
      formatNotificationTime,
    ],
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;

    return (
      <View className='py-5 items-center'>
        <ActivityIndicator size='small' color='#8B7AB8' />
      </View>
    );
  }, [isLoadingMore]);

  const renderEmptyState = useCallback(() => {
    if (isLoading && notifications.length === 0) {
      return (
        <View className='flex-1 justify-center items-center pt-24'>
          <ActivityIndicator size='large' color='#8B7AB8' />
        </View>
      );
    }

    return (
      <NotificationEmptyState
        type={filters.filterType === NotificationFilterType.UNREAD ? 'unread' : 'all'}
        onAction={loadNotifications}
      />
    );
  }, [isLoading, notifications.length, filters.filterType, loadNotifications]);

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 60],
    extrapolate: 'clamp',
  });

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: 20,
    }),
    [],
  );

  const listEmptyComponentStyle = useMemo(
    () => ({
      flex: 1,
      minHeight: 400,
    }),
    [],
  );

  return (
    <AppLayout>
      {/* <Animated.View className='border-b border-gray-100 shadow-sm'>
        <NotificationHeader
          unreadCount={unreadCount}
          onBack={() => navigation.goBack()}
          onFilter={() => setIsFilterModalVisible(true)}
          onMarkAllRead={handleMarkAllAsRead}
          isSelectionMode={isSelectionMode}
          selectedCount={selectedNotificationIds.length}
          onCancelSelection={() => {
            setIsSelectionMode(false);
            dispatch(clearSelectedNotifications());
          }}
        />
      </Animated.View> */}

      <View className='flex-1'>
        <FlashList
          ref={flashListRef}
          data={mockNotifications}
          renderItem={renderNotification}
          keyExtractor={keyExtractor}
          contentContainerStyle={contentContainerStyle}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#8B7AB8']}
              tintColor='#8B7AB8'
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === 'android'}
          drawDistance={200}
          overrideItemLayout={(layout, item) => {
            layout.span = ESTIMATED_ITEM_SIZE;
          }}
        />
      </View>
      <NotificationFilterBottomSheet
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        currentFilters={filters}
      />
    </AppLayout>
  );
};

export default NotificationScreen;
