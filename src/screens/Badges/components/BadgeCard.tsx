// src/screens/Badge/components/BadgeCard.tsx

import { getBadgeCategoryInfo } from '@/models/Badge/BadgeEnum';
import { Badge } from '@/models/Badge/BadgeModel';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface BadgeCardProps {
  badge: Badge;
  onPress: () => void;
  isEarned?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onPress, isEarned = false }) => {
  const categoryInfo = getBadgeCategoryInfo(badge.category);

  const bgColor = isEarned ? '#E0F9F5' : '#F3F4F6';

  return (
    <TouchableOpacity
      onPress={onPress}
      className='relative mb-3'
      style={{
        flex: 1,
        height: '100%',
        paddingHorizontal: 4,
        width: 'auto',
      }}
      activeOpacity={0.7}
    >
      {/* Card Background with Pastel Color */}
      <View
        className='w-full h-full rounded-3xl items-center justify-center py-4'
        style={{
          backgroundColor: bgColor,
        }}
      >
        {/* Circular Icon Container */}
        <View
          className='rounded-full items-center justify-center mb-3'
          style={{
            width: 80,
            height: 80,
            backgroundColor: isEarned ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)',
            shadowColor: isEarned ? '#000' : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {badge.iconUrl ? (
            <Image
              source={{ uri: 'https://i.pinimg.com/1200x/05/ad/11/05ad113ccb60629835d19dc0e013c5e4.jpg' }}
              // source={{ uri: badge.iconUrl }}
              className='rounded-2xl w-full h-full'
              // style={{ width: 80, height: 80 }}
              resizeMode='cover'
            />
          ) : (
            <Icon name={categoryInfo.icon as any} size={40} color={isEarned ? categoryInfo.color : '#9CA3AF'} />
          )}
        </View>

        {/* Badge Name */}
        <Text
          className='text-center font-semibold text-sm px-1.5'
          style={{
            // color: isEarned ? '#1F2937' : '#9CA3AF',
            maxWidth: '100%',
          }}
          numberOfLines={2}
        >
          {badge.title}
        </Text>
      </View>

      {/* Checkmark Indicator for Earned Badges */}
      {isEarned && (
        <View
          className='absolute rounded-full items-center justify-center'
          style={{
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            backgroundColor: '#10B981',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Icon name='check' size={14} color='#FFFFFF' iconStyle='solid' />
        </View>
      )}

      {/* Locked Overlay for Unearned */}
      {!isEarned && (
        <View
          className='absolute inset-0 rounded-3xl items-center justify-center'
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
        >
          {/* <View
            className='rounded-full items-center justify-center'
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'rgba(156, 163, 175, 0.3)',
            }}
          >
            <Icon name='lock' size={20} color='#6B7280' iconStyle='solid' />
          </View> */}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BadgeCard;
