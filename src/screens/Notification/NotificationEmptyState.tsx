// ============================================
// src/components/Notification/NotificationEmptyState.tsx
// ============================================

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface NotificationEmptyStateProps {
  type: 'all' | 'unread' | 'filtered' | 'error';
  onAction?: () => void;
  actionLabel?: string;
  title?: string;
  message?: string;
  icon?: string;
}

interface EmptyStateContent {
  icon: string;
  title: string;
  message: string;
  actionLabel: string;
  showBaby: boolean;
}

const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  type,
  onAction,
  actionLabel,
  title: customTitle,
  message: customMessage,
  icon: customIcon,
}) => {
  const getEmptyStateContent = (): EmptyStateContent => {
    switch (type) {
      case 'all':
        return {
          icon: 'bell-off',
          title: customTitle || "You're all caught up",
          message: customMessage || 'Come back later for Reminders, health tips, moments and weight notifications',
          actionLabel: actionLabel || 'Refresh',
          showBaby: true,
        };
      case 'unread':
        return {
          icon: 'check-circle',
          title: customTitle || 'No new notifications',
          message: customMessage || 'All your notifications have been read',
          actionLabel: actionLabel || 'View All',
          showBaby: false,
        };
      case 'filtered':
        return {
          icon: 'filter',
          title: customTitle || 'No matching notifications',
          message: customMessage || 'Try adjusting your filters to see more results',
          actionLabel: actionLabel || 'Clear Filters',
          showBaby: false,
        };
      case 'error':
        return {
          icon: 'wifi-off',
          title: customTitle || 'Something went wrong',
          message: customMessage || 'Unable to load notifications. Please try again',
          actionLabel: actionLabel || 'Try Again',
          showBaby: false,
        };
      default:
        return {
          icon: 'bell',
          title: customTitle || 'No notifications',
          message: customMessage || 'You have no notifications at this time',
          actionLabel: actionLabel || 'Refresh',
          showBaby: false,
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <View className='flex-1 justify-center items-center px-10 bg-pink-50'>
      <View className='items-center -mt-12'>
        <View className='w-45 h-45 mb-6 items-center justify-center'>
          <Text>Illustration</Text>
        </View>

        <Text className='text-xl font-semibold text-gray-800 mb-3 text-center'>{content.title}</Text>
        <Text className='text-sm text-gray-600 text-center leading-5 mb-6 px-5'>{content.message}</Text>

        {onAction && (
          <TouchableOpacity
            className='bg-purple-500 px-6 py-3 rounded-full shadow-md'
            onPress={onAction}
            activeOpacity={0.8}
          >
            <Text className='text-white text-sm font-semibold'>{content.actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const BabyIllustration: React.FC = () => {
  return (
    <View className='w-35 h-35 bg-pink-200 rounded-full items-center justify-center relative'>
      <View className='w-25 h-25 bg-orange-50 rounded-full items-center justify-center shadow-md'>
        <View className='flex-row mb-2.5'>
          <View className='w-0.5 h-3 bg-gray-800 rounded-full mx-3 rotate-[-5deg]' />
          <View className='w-0.5 h-3 bg-gray-800 rounded-full mx-3 rotate-[-5deg]' />
        </View>
        <View className='w-5 h-2.5 border-b-2 border-gray-800 rounded-b-lg' />
        <View className='absolute bottom-3 w-7.5 h-7.5 bg-purple-500 rounded-full items-center justify-center'>
          <View className='absolute -top-2.5 w-10 h-5 border-3 border-purple-500 rounded-t-full border-b-0' />
        </View>
      </View>

      <Text className='absolute text-2xl font-bold text-purple-500 -top-5 right-2.5'>Z</Text>
      <Text className='absolute text-lg font-bold text-purple-500 -top-8.5 right-6'>z</Text>
      <Text className='absolute text-sm font-bold text-purple-500 -top-11 right-10'>z</Text>
    </View>
  );
};

export default NotificationEmptyState;
