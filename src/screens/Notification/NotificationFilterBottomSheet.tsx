// src/components/Notification/NotificationFilterBottomSheet.tsx

import {
  NotificationFilterType,
  NotificationPriorityEnum,
  NotificationSortBy,
  NotificationTypeEnum,
  SortOrder,
} from '@/models/Notification/NotificationEnum';
import { NotificationFilters } from '@/models/Notification/NotificationModel';
import { resetFilters, updateFilters } from '@/store/slices/notificationSlice';
import { AppDispatch } from '@/store/store';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Keyboard, Switch, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

interface NotificationFilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  currentFilters: NotificationFilters;
}

interface FilterOption {
  key: string;
  label: string;
  icon: string;
}

interface PriorityOption {
  key: NotificationPriorityEnum;
  label: string;
  color: string;
}

const NotificationFilterBottomSheet: React.FC<NotificationFilterBottomSheetProps> = ({
  visible,
  onClose,
  currentFilters,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Local state for filters
  const [localFilters, setLocalFilters] = React.useState<NotificationFilters>(currentFilters);

  // Update local filters when current filters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Snap points with better calculation for content
  const snapPoints = useMemo(() => {
    const minHeight = Math.min(screenHeight * 0.75, 600);
    const maxHeight = screenHeight * 0.9;
    return [minHeight, maxHeight];
  }, [screenHeight]);

  // Spring animation config for smoother animations
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    stiffness: 500,
  });

  // Handle visibility
  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const filterTypes = useMemo<FilterOption[]>(
    () => [
      { key: NotificationFilterType.ALL, label: 'All', icon: 'inbox' },
      { key: NotificationFilterType.UNREAD, label: 'Unread', icon: 'mail' },
      { key: NotificationFilterType.READ, label: 'Read', icon: 'check-circle' },
      { key: NotificationFilterType.PRIORITY_HIGH, label: 'High Priority', icon: 'alert-circle' },
      { key: NotificationFilterType.TODAY, label: 'Today', icon: 'calendar' },
      { key: NotificationFilterType.THIS_WEEK, label: 'This Week', icon: 'calendar' },
    ],
    [],
  );

  const notificationTypes = useMemo<FilterOption[]>(
    () => [
      { key: NotificationTypeEnum.APPOINTMENT_REMINDER, label: 'Appointments', icon: 'calendar' },
      { key: NotificationTypeEnum.VACCINATION_REMINDER, label: 'Vaccinations', icon: 'shield' },
      { key: NotificationTypeEnum.MEDICATION_REMINDER, label: 'Medications', icon: 'thermometer' },
      { key: NotificationTypeEnum.MILESTONE_ACHIEVED, label: 'Milestones', icon: 'star' },
      { key: NotificationTypeEnum.GROWTH_UPDATE, label: 'Growth Updates', icon: 'trending-up' },
      { key: NotificationTypeEnum.KINDNESS_CLOSET_CREATED, label: 'Kindness Closet', icon: 'heart' },
    ],
    [],
  );

  const priorities = useMemo<PriorityOption[]>(
    () => [
      { key: NotificationPriorityEnum.LOW, label: 'Low', color: 'bg-green-500' },
      { key: NotificationPriorityEnum.NORMAL, label: 'Normal', color: 'bg-blue-500' },
      { key: NotificationPriorityEnum.HIGH, label: 'High', color: 'bg-orange-500' },
      { key: NotificationPriorityEnum.URGENT, label: 'Urgent', color: 'bg-red-500' },
    ],
    [],
  );

  const sortOptions = useMemo<FilterOption[]>(
    () => [
      { key: NotificationSortBy.CREATED_AT, label: 'Date', icon: 'calendar' },
      { key: NotificationSortBy.PRIORITY, label: 'Priority', icon: 'alert-circle' },
      { key: NotificationSortBy.STATUS, label: 'Status', icon: 'check-circle' },
    ],
    [],
  );

  const handleApplyFilters = useCallback(() => {
    dispatch(updateFilters(localFilters));
    bottomSheetRef.current?.close();
  }, [dispatch, localFilters]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
    setLocalFilters({
      sortBy: NotificationSortBy.CREATED_AT,
      sortOrder: SortOrder.DESC,
      filterType: NotificationFilterType.ALL,
    });
  }, [dispatch]);

  const toggleTypeFilter = useCallback(
    (type: NotificationTypeEnum) => {
      const types = localFilters.types || [];
      const updated = types.includes(type) ? types.filter((t) => t !== type) : [...types, type];
      setLocalFilters((prev) => ({ ...prev, types: updated }));
    },
    [localFilters.types],
  );

  const togglePriorityFilter = useCallback(
    (priority: NotificationPriorityEnum) => {
      const priorities = localFilters.priorities || [];
      const updated = priorities.includes(priority)
        ? priorities.filter((p) => p !== priority)
        : [...priorities, priority];
      setLocalFilters((prev) => ({ ...prev, priorities: updated }));
    },
    [localFilters.priorities],
  );

  // Render backdrop with proper typing
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior='close'
        enableTouchThrough={false}
      />
    ),
    [],
  );

  // Render footer with actions
  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={insets.bottom}>
        <View className='flex-row px-5 pt-4 pb-4 bg-white border-t border-gray-100'>
          <TouchableOpacity
            className='flex-1 py-3 items-center rounded-full border border-purple-500 mr-2'
            onPress={handleResetFilters}
            activeOpacity={0.7}
          >
            <Text className='text-sm font-semibold text-purple-500'>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 py-3 items-center rounded-full bg-purple-500 ml-2'
            onPress={handleApplyFilters}
            activeOpacity={0.7}
          >
            <Text className='text-sm font-semibold text-white'>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    ),
    [insets.bottom, handleResetFilters, handleApplyFilters],
  );

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  // Don't render if not visible
  if (!visible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      enableOverDrag={true}
      handleIndicatorStyle={{
        backgroundColor: '#8B7AB8',
        width: 40,
        height: 4,
      }}
      backgroundStyle={{
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
      }}
      animationConfigs={animationConfigs}
      keyboardBehavior='interactive'
      keyboardBlurBehavior='restore'
      android_keyboardInputMode='adjustResize'
    >
      {/* Header */}
      <BottomSheetView className='flex-row items-center justify-between px-5 pt-2 pb-4 border-b border-gray-100'>
        <Text className='text-lg font-semibold text-gray-800'>Filter Notifications</Text>
        <TouchableOpacity
          className='p-1 -mr-1'
          onPress={() => bottomSheetRef.current?.close()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon iconStyle='solid' name='x' size={24} color='#333' />
        </TouchableOpacity>
      </BottomSheetView>

      <BottomSheetScrollView
        contentContainerStyle={{
          paddingBottom: 80,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode='always'
      >
        {/* Quick Filters */}
        <View className='px-5 py-4 border-b border-gray-100'>
          <Text className='text-sm font-semibold text-gray-600 mb-3'>Quick Filters</Text>
          <View className='flex-row flex-wrap -mx-1'>
            {filterTypes.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                className={`flex-row items-center px-3 py-2 rounded-full mx-1 mb-2 ${
                  localFilters.filterType === filter.key ? 'bg-purple-500' : 'bg-gray-100'
                }`}
                onPress={() => {
                  setLocalFilters((prev) => ({ ...prev, filterType: filter.key as NotificationFilterType }));
                }}
                activeOpacity={0.7}
              >
                <Icon
                  iconStyle='solid'
                  name={filter.icon as any}
                  size={16}
                  color={localFilters.filterType === filter.key ? '#FFF' : '#666'}
                />
                <Text
                  className={`ml-1.5 text-[13px] ${
                    localFilters.filterType === filter.key ? 'text-white font-medium' : 'text-gray-600'
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notification Types */}
        <View className='px-5 py-4 border-b border-gray-100'>
          <Text className='text-sm font-semibold text-gray-600 mb-3'>Notification Types</Text>
          <View className='mt-2'>
            {notificationTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                className='flex-row items-center justify-between py-3'
                onPress={() => toggleTypeFilter(type.key as NotificationTypeEnum)}
                activeOpacity={0.7}
              >
                <View className='flex-row items-center flex-1'>
                  <Icon iconStyle='solid' name={type.icon as any} size={20} color='#8B7AB8' />
                  <Text className='text-sm text-gray-800 ml-3'>{type.label}</Text>
                </View>
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    localFilters.types?.includes(type.key as NotificationTypeEnum)
                      ? 'bg-purple-500 border-purple-500'
                      : 'border-gray-300'
                  }`}
                >
                  {localFilters.types?.includes(type.key as NotificationTypeEnum) && (
                    <Icon iconStyle='solid' name='check' size={12} color='#FFF' />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View className='px-5 py-4 border-b border-gray-100'>
          <Text className='text-sm font-semibold text-gray-600 mb-3'>Priority</Text>
          <View className='flex-row justify-between'>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.key}
                className={`flex-1 py-2 items-center rounded-xl mx-1 ${
                  localFilters.priorities?.includes(priority.key) ? priority.color : 'bg-gray-100'
                }`}
                onPress={() => togglePriorityFilter(priority.key)}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-[13px] font-medium ${
                    localFilters.priorities?.includes(priority.key) ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort Options */}
        <View className='px-5 py-4'>
          <Text className='text-sm font-semibold text-gray-600 mb-3'>Sort By</Text>
          <View className='flex-row justify-between mb-4'>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                className={`flex-1 py-2.5 items-center rounded-lg mx-1 ${
                  localFilters.sortBy === option.key ? 'bg-purple-500' : 'bg-gray-100'
                }`}
                onPress={() => {
                  setLocalFilters((prev) => ({ ...prev, sortBy: option.key as NotificationSortBy }));
                }}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-[13px] font-medium ${
                    localFilters.sortBy === option.key ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className='flex-row items-center justify-center'>
            <Text className='text-[13px] text-gray-600 mx-2'>Descending</Text>
            <Switch
              value={localFilters.sortOrder === SortOrder.ASC}
              onValueChange={(value) => {
                setLocalFilters((prev) => ({
                  ...prev,
                  sortOrder: value ? SortOrder.ASC : SortOrder.DESC,
                }));
              }}
              trackColor={{ false: '#E0E0E0', true: '#D4C5E8' }}
              thumbColor={localFilters.sortOrder === SortOrder.ASC ? '#8B7AB8' : '#F4F3F4'}
            />
            <Text className='text-[13px] text-gray-600 mx-2'>Ascending</Text>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default NotificationFilterBottomSheet;

// ============================================
// Updated package.json dependencies for v5
// ============================================
// "@gorhom/bottom-sheet": "^5.0.0-alpha.10" or latest v5
// "react-native-reanimated": "^3.5.4",
// "react-native-gesture-handler": "^2.13.4",
