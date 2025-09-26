// ============================================
// src/components/Notification/NotificationItem.tsx
// ============================================

import Icon from '@react-native-vector-icons/fontawesome6';
import React, { memo, useCallback, useRef } from 'react';
import { Animated, Platform, Text, TouchableOpacity, View } from 'react-native';
import Swipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { NotificationPriorityEnum, NotificationTypeEnum } from '@/models/Notification/NotificationEnum';
import { Notification } from '@/models/Notification/NotificationModel';
import { SharedValue } from 'react-native-reanimated';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  formatTime: (date: string) => string;
}

interface IconConfig {
  name: string;
  color: string;
  bgColor: string;
  library: 'feather' | 'material';
}

const NotificationItem: React.FC<NotificationItemProps> = memo(
  ({ notification, onPress, onLongPress, onDelete, isSelected = false, isSelectionMode = false, formatTime }) => {
    const swipeableRef = useRef<SwipeableMethods>(null);
    const isUnread = notification.status !== 'read';

    const getNotificationIcon = useCallback((): IconConfig => {
      const iconMap: Record<string, IconConfig> = {
        [NotificationTypeEnum.APPOINTMENT_REMINDER]: {
          name: 'calendar',
          color: '#4CAF50',
          bgColor: '#4CAF5020',
          library: 'feather',
        },
        [NotificationTypeEnum.VACCINATION_REMINDER]: {
          name: 'needle',
          color: '#FF9800',
          bgColor: '#FF980020',
          library: 'material',
        },
        [NotificationTypeEnum.MEDICATION_REMINDER]: {
          name: 'pill',
          color: '#2196F3',
          bgColor: '#2196F320',
          library: 'material',
        },
        [NotificationTypeEnum.MILESTONE_ACHIEVED]: {
          name: 'star',
          color: '#FFD700',
          bgColor: '#FFD70020',
          library: 'feather',
        },
        [NotificationTypeEnum.GROWTH_UPDATE]: {
          name: 'trending-up',
          color: '#9C27B0',
          bgColor: '#9C27B020',
          library: 'feather',
        },
        [NotificationTypeEnum.KINDNESS_CLOSET_CREATED]: {
          name: 'heart',
          color: '#E91E63',
          bgColor: '#E91E6320',
          library: 'feather',
        },
        [NotificationTypeEnum.BIRTHDAY_REMINDER]: {
          name: 'cake-variant',
          color: '#FF69B4',
          bgColor: '#FF69B420',
          library: 'material',
        },
        [NotificationTypeEnum.GENERAL_REMINDER]: {
          name: 'bell',
          color: '#8B7AB8',
          bgColor: '#8B7AB820',
          library: 'feather',
        },
        [NotificationTypeEnum.URGENT]: {
          name: 'alert-circle',
          color: '#F44336',
          bgColor: '#F4433620',
          library: 'feather',
        },
      };

      return (
        iconMap[notification.type] || {
          name: 'bell',
          color: '#8B7AB8',
          bgColor: '#8B7AB820',
          library: 'feather',
        }
      );
    }, [notification.type]);

    const getPriorityIndicator = useCallback(() => {
      if (notification.priority === NotificationPriorityEnum.URGENT) {
        return (
          <View className='bg-red-500 px-1.5 py-0.5 rounded'>
            <Text className='text-white text-[10px] font-semibold'>Urgent</Text>
          </View>
        );
      }
      if (notification.priority === NotificationPriorityEnum.HIGH) {
        return <View className='w-1.5 h-1.5 bg-orange-500 rounded-full ml-2' />;
      }
      return null;
    }, [notification.priority]);

    const renderRightActions = useCallback(
      (progress: SharedValue<number>, drag: SharedValue<number>, swipeableMethods: SwipeableMethods) => {
        if (!onDelete) return null;

        const translateX = drag.value;

        return (
          <Animated.View className='w-20 flex-row my-1 mr-4' style={{ transform: [{ translateX }] }}>
            <TouchableOpacity
              className='flex-1 bg-red-500 justify-center items-center rounded-xl'
              onPress={() => {
                swipeableRef.current?.close();
                onDelete();
              }}
            >
              <Icon iconStyle='solid' name='trash' size={20} color='#FFFFFF' />
            </TouchableOpacity>
          </Animated.View>
        );
      },
      [onDelete],
    );

    const iconInfo = getNotificationIcon();
    const priorityIndicator = getPriorityIndicator();

    const content = (
      <View
        className={`
        flex-row items-center bg-white mx-4 px-4 py-3 my-1 rounded-xl 
        ${isUnread ? 'border-l-4 border-purple-500' : ''}
        ${isSelected ? 'bg-purple-50 border border-purple-500' : ''}
        ${Platform.OS === 'ios' ? 'shadow-sm' : 'elevation-1'}
      `}
        style={
          Platform.OS === 'ios'
            ? {
                // Shadow for iOS
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                // Elevation for Android
                elevation: 4,
              }
            : {}
        }
      >
        {isSelectionMode && (
          <View className='mr-3'>
            <View
              className={`
            w-5 h-5 rounded border-2 items-center justify-center
            ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-purple-500'}
          `}
            >
              {isSelected && <Icon iconStyle='solid' name='check' size={14} color='#FFFFFF' />}
            </View>
          </View>
        )}

        <View
          className='w-10 h-10 rounded-full items-center justify-center mr-3'
          style={{ backgroundColor: iconInfo.bgColor }}
        >
          {iconInfo.library === 'feather' ? (
            <Icon iconStyle='solid' name={iconInfo.name as any} size={20} color={iconInfo.color} />
          ) : (
            <Icon iconStyle='solid' name={iconInfo.name as any} size={20} color={iconInfo.color} />
          )}
        </View>

        <View className='flex-1 mr-2'>
          <View className='flex-row items-center mb-1'>
            <Text
              className={`flex-1 text-base ${isUnread ? 'font-bold text-black' : 'font-medium text-gray-800'}`}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {priorityIndicator}
          </View>

          <Text className='text-sm text-gray-600 leading-[18px] mb-1' numberOfLines={2}>
            {notification.message}
          </Text>

          {notification.data?.actionText && (
            <TouchableOpacity className='mt-1'>
              <Text className='text-sm text-purple-500 font-medium'>{notification.data.actionText}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className='items-end'>
          <Text className='text-xs text-gray-500 mb-1'>{formatTime(notification.createdAt)}</Text>
          {isUnread && <View className='w-2 h-2 bg-purple-500 rounded-full' />}
        </View>
      </View>
    );

    if (onDelete && !isSelectionMode) {
      return (
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          overshootRight={false}
          friction={2}
          rightThreshold={40}
        >
          <TouchableOpacity activeOpacity={0.7} onPress={onPress} onLongPress={onLongPress} delayLongPress={500}>
            {content}
          </TouchableOpacity>
        </Swipeable>
      );
    }

    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} onLongPress={onLongPress} delayLongPress={500}>
        {content}
      </TouchableOpacity>
    );
  },
);

NotificationItem.displayName = 'NotificationItem';

export default NotificationItem;
