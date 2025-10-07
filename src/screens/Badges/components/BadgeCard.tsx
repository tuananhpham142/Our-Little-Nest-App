// src/screens/Badge/components/BadgeCard.tsx

import { getBadgeCategoryInfo, getBadgeDifficultyInfo } from '@/models/Badge/BadgeEnum';
import { Badge } from '@/models/Badge/BadgeModel';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface BadgeCardProps {
  badge: Badge;
  onPress: () => void;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onPress }) => {
  const categoryInfo = getBadgeCategoryInfo(badge.category);
  const difficultyInfo = getBadgeDifficultyInfo(badge.difficulty);

  return (
    <TouchableOpacity
      onPress={onPress}
      className='bg-white rounded-3xl p-5 mx-4 mb-4 shadow-lg'
      style={{
        shadowColor: categoryInfo.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <View className='flex-row items-start'>
        {/* Badge Icon */}
        <View
          className='w-20 h-20 rounded-2xl items-center justify-center mr-4'
          style={{ backgroundColor: `${categoryInfo.color}20` }}
        >
          {badge.iconUrl ? (
            <Image source={{ uri: badge.iconUrl }} className='w-16 h-16' resizeMode='contain' />
          ) : (
            <Icon name={categoryInfo.icon as any} size={36} color={categoryInfo.color} />
          )}
        </View>

        {/* Badge Info */}
        <View className='flex-1'>
          {/* Title */}
          <Text className='text-lg font-bold text-gray-900 mb-1'>{badge.title}</Text>

          {/* Description */}
          <Text className='text-sm text-gray-600 mb-3' numberOfLines={2}>
            {badge.description}
          </Text>

          {/* Metadata */}
          <View className='flex-row items-center flex-wrap'>
            {/* Category */}
            <View
              className='flex-row items-center px-3 py-1 rounded-full mr-2 mb-2'
              style={{ backgroundColor: `${categoryInfo.color}15` }}
            >
              <Icon name={categoryInfo.icon as any} size={12} color={categoryInfo.color} />
              <Text className='ml-1 text-xs font-semibold' style={{ color: categoryInfo.color }}>
                {categoryInfo.label}
              </Text>
            </View>

            {/* Difficulty */}
            <View
              className='flex-row items-center px-3 py-1 rounded-full mr-2 mb-2'
              style={{ backgroundColor: `${difficultyInfo.color}15` }}
            >
              {Array.from({ length: difficultyInfo.stars }).map((_, index) => (
                <Icon
                  key={index}
                  name='star'
                  iconStyle='solid'
                  size={10}
                  color={difficultyInfo.color}
                  style={{ marginRight: 2 }}
                />
              ))}
              <Text className='ml-1 text-xs font-semibold' style={{ color: difficultyInfo.color }}>
                {difficultyInfo.label}
              </Text>
            </View>

            {/* Age Range */}
            {badge.minAge !== undefined && badge.maxAge !== undefined && (
              <View className='flex-row items-center px-3 py-1 rounded-full bg-blue-50 mb-2'>
                <Icon iconStyle='solid' name='baby' size={12} color='#3B82F6' />
                <Text className='ml-1 text-xs font-semibold text-blue-600'>
                  {Math.floor(badge.minAge / 12)}-{Math.floor(badge.maxAge / 12)}y
                </Text>
              </View>
            )}

            {/* Custom Badge */}
            {badge.isCustom && (
              <View className='flex-row items-center px-3 py-1 rounded-full bg-purple-50 mb-2'>
                <Icon iconStyle='solid' name='wand-magic-sparkles' size={12} color='#A855F7' />
                <Text className='ml-1 text-xs font-semibold text-purple-600'>Custom</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BadgeCard;
