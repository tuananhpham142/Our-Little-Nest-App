// ============================================
// src/components/Notification/NotificationFilterModal.tsx
// ============================================

import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Platform, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

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

interface NotificationFilterModalProps {
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

const NotificationFilterModal: React.FC<NotificationFilterModalProps> = ({ visible, onClose, currentFilters }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [localFilters, setLocalFilters] = useState<NotificationFilters>(currentFilters);

  React.useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

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
    onClose();
  }, [dispatch, localFilters, onClose]);

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

  return (
    <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={onClose}>
      <View className='flex-1 bg-black/50 justify-end'>
        <View className={`bg-white rounded-t-3xl max-h-[80%] ${Platform.OS === 'ios' ? 'pb-8' : ''}`}>
          <View className='flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100'>
            <Text className='text-lg font-semibold text-gray-800'>Filter Notifications</Text>
            <TouchableOpacity className='p-1' onPress={onClose} activeOpacity={0.7}>
              <Icon iconStyle='solid' name='x' size={24} color='#333' />
            </TouchableOpacity>
          </View>

          <ScrollView className='px-5' showsVerticalScrollIndicator={false}>
            <View className='py-4 border-b border-gray-100'>
              <Text className='text-sm font-semibold text-gray-600 mb-3'>Quick Filters</Text>
              <View className='flex-row flex-wrap -mx-1'>
                {filterTypes.map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    className={`flex-row items-center px-3 py-2 rounded-full mx-1 mb-2 ${
                      localFilters.filterType === filter.key ? 'bg-purple-500' : 'bg-gray-100'
                    }`}
                    onPress={() =>
                      setLocalFilters((prev) => ({ ...prev, filterType: filter.key as NotificationFilterType }))
                    }
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
                        localFilters.filterType === filter.key ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className='py-4 border-b border-gray-100'>
              <Text className='text-sm font-semibold text-gray-600 mb-3'>Notification Types</Text>
              <View className='mt-2'>
                {notificationTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    className='flex-row items-center justify-between py-3'
                    onPress={() => toggleTypeFilter(type.key as NotificationTypeEnum)}
                    activeOpacity={0.7}
                  >
                    <View className='flex-row items-center'>
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

            <View className='py-4 border-b border-gray-100'>
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

            <View className='py-4 border-b border-gray-100'>
              <Text className='text-sm font-semibold text-gray-600 mb-3'>Sort By</Text>
              <View className='flex-row justify-between mb-4'>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    className={`flex-1 py-2.5 items-center rounded-lg mx-1 ${
                      localFilters.sortBy === option.key ? 'bg-purple-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setLocalFilters((prev) => ({ ...prev, sortBy: option.key as NotificationSortBy }))}
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
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      sortOrder: value ? SortOrder.ASC : SortOrder.DESC,
                    }))
                  }
                  trackColor={{ false: '#E0E0E0', true: '#D4C5E8' }}
                  thumbColor={localFilters.sortOrder === SortOrder.ASC ? '#8B7AB8' : '#F4F3F4'}
                />
                <Text className='text-[13px] text-gray-600 mx-2'>Ascending</Text>
              </View>
            </View>
          </ScrollView>

          <View className='flex-row px-5 pt-4 pb-4 border-t border-gray-100'>
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
        </View>
      </View>
    </Modal>
  );
};

export default NotificationFilterModal;
