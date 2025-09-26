// src/components/Badge/SharedBadgeComponents.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { BadgeCategory, BadgeDifficulty } from '@/models/Badge/BadgeEnum';
import { Badge } from '@/models/Badge/BadgeModel';
import { BadgeCollection } from '@/models/BadgeCollection/BadgeCollectionModel';
import {
  formatCompletionDate,
  formatVerificationStatus,
  getVerificationStatusColor,
} from '@/models/BadgeCollection/BadgeCollectionUIForm';
import {
  formatCategory,
  formatDifficulty,
  getCategoryColor,
  getCategoryIcon,
  getDifficultyColor,
  getDifficultyIcon,
} from '@/utils/badgeUtils';

// Types for component props
interface BadgeCardProps {
  badge: Badge;
  onPress?: () => void;
  animationDelay?: number;
  showStatus?: boolean;
  compact?: boolean;
}

interface BadgeCollectionCardProps {
  collection: BadgeCollection;
  onPress?: () => void;
  animationDelay?: number;
  showMedia?: boolean;
}

interface BadgeCategoryChipProps {
  category: BadgeCategory;
  isSelected?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

interface BadgeDifficultyIndicatorProps {
  difficulty: BadgeDifficulty;
  showLabel?: boolean;
}

interface VerificationStatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

// Badge Card Component
export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  onPress,
  animationDelay = 0,
  showStatus = true,
  compact = false,
}) => {
  const categoryColor = getCategoryColor(badge.category);
  const categoryIcon = getCategoryIcon(badge.category);

  return (
    <Animated.View entering={FadeInDown.delay(animationDelay)}>
      <TouchableOpacity
        onPress={onPress}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 ${compact ? 'p-3' : 'p-4'}`}
        activeOpacity={0.8}
      >
        <View className='flex-row items-start'>
          {/* Badge Icon */}
          <View
            className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full items-center justify-center mr-3`}
            style={{ backgroundColor: categoryColor + '20' }}
          >
            <Icon name={categoryIcon as any} iconStyle='solid' size={compact ? 14 : 16} color={categoryColor} />
          </View>

          {/* Content */}
          <View className='flex-1'>
            <View className='flex-row items-start justify-between mb-2'>
              <Text
                className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-800 flex-1`}
                numberOfLines={1}
              >
                {badge.title}
              </Text>
              {showStatus && (
                <View className='flex-row items-center ml-2'>
                  {badge.isCustom && (
                    <View className='bg-purple-100 px-2 py-1 rounded-full mr-2'>
                      <Text className='text-xs text-purple-600 font-medium'>Custom</Text>
                    </View>
                  )}
                  <View className={`w-2 h-2 rounded-full ${badge.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                </View>
              )}
            </View>

            {!compact && (
              <Text className='text-gray-600 mb-2' numberOfLines={2}>
                {badge.description}
              </Text>
            )}

            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center'>
                <BadgeCategoryChip category={badge.category} size='small' />
                <BadgeDifficultyIndicator difficulty={badge.difficulty} />
              </View>

              {(badge.minAge || badge.maxAge) && (
                <View className='bg-gray-100 px-2 py-1 rounded-full'>
                  <Text className='text-xs text-gray-600'>
                    {badge.minAge && badge.maxAge
                      ? `${badge.minAge}-${badge.maxAge}m`
                      : badge.minAge
                        ? `${badge.minAge}m+`
                        : `<${badge.maxAge}m`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Badge Collection Card Component
export const BadgeCollectionCard: React.FC<BadgeCollectionCardProps> = ({
  collection,
  onPress,
  animationDelay = 0,
  showMedia = true,
}) => {
  const categoryColor = getCategoryColor(collection.badge?.category || BadgeCategory.CUSTOM);
  const categoryIcon = getCategoryIcon(collection.badge?.category || BadgeCategory.CUSTOM);

  return (
    <Animated.View entering={FadeInDown.delay(animationDelay)}>
      <TouchableOpacity
        onPress={onPress}
        className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3'
        activeOpacity={0.8}
      >
        <View className='flex-row items-start'>
          {/* Achievement Icon */}
          <View
            className='w-12 h-12 rounded-full items-center justify-center mr-4'
            style={{ backgroundColor: categoryColor + '20' }}
          >
            <Icon name={categoryIcon as any} iconStyle='solid' size={20} color={categoryColor} />
          </View>

          {/* Content */}
          <View className='flex-1'>
            <View className='flex-row items-start justify-between mb-2'>
              <Text className='text-lg font-semibold text-gray-800 flex-1' numberOfLines={1}>
                {collection.badge?.title || 'Badge Achievement'}
              </Text>
              <VerificationStatusBadge status={collection.verificationStatus} />
            </View>

            <Text className='text-gray-600 mb-2' numberOfLines={2}>
              {collection.badge?.description || 'Achievement description'}
            </Text>

            <View className='flex-row items-center justify-between'>
              <Text className='text-sm text-gray-500'>Completed {formatCompletionDate(collection.completedAt)}</Text>

              {showMedia && collection.submissionMedia && collection.submissionMedia.length > 0 && (
                <View className='flex-row items-center'>
                  <Icon name='image' iconStyle='solid' size={12} color='#9CA3AF' />
                  <Text className='text-xs text-gray-500 ml-1'>{collection.submissionMedia.length}</Text>
                </View>
              )}
            </View>

            {collection.submissionNote && (
              <View className='mt-3 bg-gray-50 p-3 rounded-lg'>
                <Text className='text-sm text-gray-600' numberOfLines={2}>
                  "{collection.submissionNote}"
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Badge Category Chip Component
export const BadgeCategoryChip: React.FC<BadgeCategoryChipProps> = ({
  category,
  isSelected = false,
  onPress,
  size = 'medium',
}) => {
  const categoryColor = getCategoryColor(category);
  const categoryText = formatCategory(category);

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full mr-2 ${sizeClasses[size]} ${isSelected ? 'shadow-sm' : ''}`}
      style={{
        backgroundColor: isSelected ? categoryColor : categoryColor + '20',
      }}
      disabled={!onPress}
    >
      <Text className='font-medium' style={{ color: isSelected ? 'white' : categoryColor }}>
        {categoryText}
      </Text>
    </TouchableOpacity>
  );
};

// Badge Difficulty Indicator Component
export const BadgeDifficultyIndicator: React.FC<BadgeDifficultyIndicatorProps> = ({
  difficulty,
  showLabel = false,
}) => {
  const color = getDifficultyColor(difficulty);
  const icon = getDifficultyIcon(difficulty);

  return (
    <View className='flex-row items-center'>
      <Icon name={icon as any} iconStyle='solid' size={12} color={color} />
      {showLabel && <Text className='text-xs text-gray-600 ml-1'>{formatDifficulty(difficulty)}</Text>}
    </View>
  );
};

// Verification Status Badge Component
export const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ status, showIcon = true }) => {
  const statusColor = getVerificationStatusColor(status as any);
  const statusText = formatVerificationStatus(status as any);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'clock';
      case 'approved':
        return 'check';
      case 'auto_approved':
        return 'check';
      case 'rejected':
        return 'xmark';
      default:
        return 'question';
    }
  };

  return (
    <View className='px-2 py-1 rounded-full flex-row items-center' style={{ backgroundColor: statusColor + '20' }}>
      {showIcon && (
        <Icon name={getStatusIcon(status)} iconStyle='solid' size={10} color={statusColor} style={{ marginRight: 4 }} />
      )}
      <Text className='text-xs font-medium' style={{ color: statusColor }}>
        {statusText}
      </Text>
    </View>
  );
};

// Progress Ring Component - Fixed for React Native
export const ProgressRing: React.FC<{
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}> = ({
  progress,
  size = 64,
  strokeWidth = 4,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className='items-center justify-center relative' style={{ width: size, height: size }}>
      {/* Background Circle */}
      <View
        className='absolute rounded-full border-4'
        style={{
          width: size,
          height: size,
          borderColor: backgroundColor,
        }}
      />

      {/* Progress Circle - Using animated View instead of SVG */}
      <Animated.View
        className='absolute rounded-full border-4'
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderTopColor: 'transparent',
          borderRightColor: progress > 25 ? color : 'transparent',
          borderBottomColor: progress > 50 ? color : 'transparent',
          borderLeftColor: progress > 75 ? color : 'transparent',
          transform: [{ rotate: `${(progress / 100) * 360}deg` }],
        }}
      />

      {showPercentage && (
        <View className='absolute inset-0 items-center justify-center'>
          <Text className='text-sm font-bold text-gray-800'>{Math.round(progress)}%</Text>
        </View>
      )}
    </View>
  );
};

// Statistics Card Component
export const StatisticsCard: React.FC<{
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}> = ({ title, value, icon, color, trend }) => {
  return (
    <Animated.View entering={FadeInUp} className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 mx-1'>
      <View className='flex-row items-center justify-between mb-2'>
        <View className='w-10 h-10 rounded-full items-center justify-center' style={{ backgroundColor: color + '20' }}>
          <Icon name={icon as any} iconStyle='solid' size={16} color={color} />
        </View>

        {trend && (
          <View
            className={`flex-row items-center px-2 py-1 rounded-full ${
              trend.isPositive ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <Icon
              name={trend.isPositive ? 'arrow-up' : 'arrow-down'}
              iconStyle='solid'
              size={10}
              color={trend.isPositive ? '#10B981' : '#EF4444'}
            />
            <Text className={`text-xs font-semibold ml-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>

      <Text className='text-2xl font-bold text-gray-800 mb-1'>{value}</Text>
      <Text className='text-sm text-gray-500'>{title}</Text>
    </Animated.View>
  );
};
