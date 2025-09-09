// ============================================
// src/components/Notification/NotificationHeader.tsx
// ============================================

import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

interface NotificationHeaderProps {
  unreadCount: number;
  onBack?: () => void;
  onFilter?: () => void;
  onMarkAllRead?: () => void;
  onSettings?: () => void;
  isSelectionMode?: boolean;
  selectedCount?: number;
  onCancelSelection?: () => void;
  onDeleteSelected?: () => void;
}

const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  onBack,
  onFilter,
  onMarkAllRead,
  onSettings,
  isSelectionMode = false,
  selectedCount = 0,
  onCancelSelection,
  onDeleteSelected,
}) => {
  if (isSelectionMode) {
    return (
      <View className={`${Platform.OS === 'ios' ? 'pt-0' : 'pt-2.5'} pb-3 px-4`}>
        <View className='flex-row items-center justify-between h-11'>
          <TouchableOpacity
            className='w-10 h-10 items-center justify-center'
            onPress={() => {
              onCancelSelection?.();
            }}
            activeOpacity={0.7}
          >
            <Icon iconStyle='solid' name='x' size={24} color='#333' />
          </TouchableOpacity>

          <Text className='flex-1 text-base font-medium text-gray-800 text-center'>{selectedCount} selected</Text>

          <View className='flex-row items-center'>
            {selectedCount > 0 && (
              <TouchableOpacity
                className='w-10 h-10 items-center justify-center'
                onPress={() => {
                  onDeleteSelected?.();
                }}
                activeOpacity={0.7}
              >
                <Icon iconStyle='solid' name='trash' size={20} color='#FF4444' />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={`${Platform.OS === 'ios' ? 'pt-0' : 'pt-2.5'} pb-3 px-4`}>
      <View className='flex-row items-center justify-between h-11'>
        {onBack && (
          <TouchableOpacity
            className='w-10 h-10 items-center justify-center'
            onPress={() => {
              onBack();
            }}
            activeOpacity={0.7}
          >
            <Icon iconStyle='solid' name='arrow-left' size={24} color='#333' />
          </TouchableOpacity>
        )}

        <Text className='flex-1 text-lg font-semibold text-gray-800 text-center'>Notifications</Text>

        <View className='flex-row items-center'>
          {onFilter && (
            <TouchableOpacity
              className='w-10 h-10 items-center justify-center'
              onPress={() => {
                onFilter();
              }}
              activeOpacity={0.7}
            >
              <Icon iconStyle='solid' name='filter' size={20} color='#666' />
            </TouchableOpacity>
          )}

          {onSettings && (
            <TouchableOpacity
              className='w-10 h-10 items-center justify-center'
              onPress={() => {
                onSettings();
              }}
              activeOpacity={0.7}
            >
              <Icon iconStyle='solid' name='gear' size={20} color='#666' />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {unreadCount > 0 && (
        <View className='flex-row items-center justify-between mt-2 px-1'>
          <View className='bg-purple-500 px-3 py-1 rounded-xl'>
            <Text className='text-white text-xs font-semibold'>{unreadCount} new</Text>
          </View>

          {onMarkAllRead && (
            <TouchableOpacity
              className='py-1'
              onPress={() => {
                onMarkAllRead();
              }}
              activeOpacity={0.7}
            >
              <Text className='text-purple-500 text-[13px] font-medium'>Mark all as read</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default NotificationHeader;
