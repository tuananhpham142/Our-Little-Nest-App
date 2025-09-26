// src/screens/Badge/BadgeDetailScreen.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBadgeDetail } from '@/hooks/useBadge';
import { BadgeCategory } from '@/models/Badge/BadgeEnum';
import { formatCategory, formatDifficulty } from '@/utils/badgeUtils';

interface Props {
  navigation: any;
  route: {
    params: {
      badgeId: string;
    };
  };
}

const BadgeDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { badgeId } = route.params;
  const { badge, isLoading, error, loadBadgeDetail } = useBadgeDetail();

  useEffect(() => {
    if (badgeId) {
      loadBadgeDetail(badgeId);
    }
  }, [badgeId, loadBadgeDetail]);

  const handleAwardBadge = () => {
    navigation.navigate('AwardBadge', { badgeId: badge?.id });
  };

  const handleEditBadge = () => {
    if (badge?.isCustom) {
      navigation.navigate('EditBadge', { badgeId: badge.id });
    } else {
      Alert.alert('Cannot Edit', 'System badges cannot be edited');
    }
  };

  const getCategoryColor = (category: BadgeCategory): string => {
    const colorMap = {
      [BadgeCategory.MILESTONE]: '#F59E0B',
      [BadgeCategory.DAILY_LIFE]: '#3B82F6',
      [BadgeCategory.SOCIAL]: '#10B981',
      [BadgeCategory.PHYSICAL]: '#EF4444',
      [BadgeCategory.COGNITIVE]: '#8B5CF6',
      [BadgeCategory.CUSTOM]: '#6B7280',
    };
    return colorMap[category] || '#9CA3AF';
  };

  const getCategoryIcon = (category: BadgeCategory): string => {
    const iconMap = {
      [BadgeCategory.MILESTONE]: 'trophy',
      [BadgeCategory.DAILY_LIFE]: 'house',
      [BadgeCategory.SOCIAL]: 'users',
      [BadgeCategory.PHYSICAL]: 'dumbbell',
      [BadgeCategory.COGNITIVE]: 'brain',
      [BadgeCategory.CUSTOM]: 'star',
    };
    return iconMap[category] || 'medal';
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#3B82F6' />
          <Text className='text-gray-500 mt-4'>Loading badge details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !badge) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='px-4 py-4 bg-white shadow-sm'>
          <View className='flex-row items-center justify-between'>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
            >
              <Icon name='arrow-left' iconStyle='solid' size={16} color='#374151' />
            </TouchableOpacity>
            <Text className='text-xl font-bold text-gray-800'>Badge Details</Text>
            <View className='w-10' />
          </View>
        </View>

        <View className='flex-1 items-center justify-center px-8'>
          <Icon name='triangle-exclamation' iconStyle='solid' size={64} color='#EF4444' />
          <Text className='text-xl font-semibold text-gray-600 mt-4 mb-2 text-center'>
            {error || 'Badge not found'}
          </Text>
          <Text className='text-gray-500 text-center leading-6 mb-6'>
            Unable to load badge details. Please try again.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className='bg-blue-500 px-6 py-3 rounded-full'>
            <Text className='text-white font-semibold'>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='px-4 py-4 bg-white shadow-sm'>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
          >
            <Icon name='arrow-left' iconStyle='solid' size={16} color='#374151' />
          </TouchableOpacity>

          <Text className='text-xl font-bold text-gray-800'>Badge Details</Text>

          {badge.isCustom && (
            <TouchableOpacity
              onPress={handleEditBadge}
              className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
            >
              <Icon name='pen-to-square' iconStyle='solid' size={16} color='#374151' />
            </TouchableOpacity>
          )}
          {!badge.isCustom && <View className='w-10' />}
        </View>
      </View>

      {/* Content */}
      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        {/* Badge Header */}
        <Animated.View entering={FadeInUp} className='items-center mb-8'>
          <View
            className='w-24 h-24 rounded-full items-center justify-center mb-4'
            style={{ backgroundColor: getCategoryColor(badge.category) + '20' }}
          >
            <Icon
              name={getCategoryIcon(badge.category) as any}
              iconStyle='solid'
              size={40}
              color={getCategoryColor(badge.category)}
            />
          </View>

          <Text className='text-3xl font-bold text-gray-800 text-center mb-2'>{badge.title}</Text>

          <View className='flex-row items-center mb-4'>
            <View
              className='px-3 py-1 rounded-full mr-2'
              style={{ backgroundColor: getCategoryColor(badge.category) + '20' }}
            >
              <Text className='font-medium' style={{ color: getCategoryColor(badge.category) }}>
                {formatCategory(badge.category)}
              </Text>
            </View>

            <View className='px-3 py-1 rounded-full bg-gray-100'>
              <Text className='text-gray-700 font-medium'>{formatDifficulty(badge.difficulty)}</Text>
            </View>
          </View>

          <View className='flex-row items-center'>
            {badge.isActive && (
              <View className='flex-row items-center mr-4'>
                <View className='w-2 h-2 rounded-full bg-green-500 mr-2' />
                <Text className='text-green-600 font-medium'>Active</Text>
              </View>
            )}

            {badge.isCustom && (
              <View className='flex-row items-center'>
                <Icon name='star' iconStyle='solid' size={12} color='#8B5CF6' />
                <Text className='text-purple-600 font-medium ml-1'>Custom Badge</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(100)} className='mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-3'>Description</Text>
          <View className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <Text className='text-gray-700 leading-6'>{badge.description}</Text>
          </View>
        </Animated.View>

        {/* How to Achieve */}
        <Animated.View entering={FadeInDown.delay(200)} className='mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-3'>How to Achieve</Text>
          <View className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <Text className='text-gray-700 leading-6'>{badge.instruction}</Text>
          </View>
        </Animated.View>

        {/* Age Range */}
        {(badge.minAge || badge.maxAge) && (
          <Animated.View entering={FadeInDown.delay(300)} className='mb-6'>
            <Text className='text-xl font-semibold text-gray-800 mb-3'>Age Range</Text>
            <View className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
              <View className='flex-row items-center'>
                <Icon name='calendar' iconStyle='solid' size={16} color='#3B82F6' />
                <Text className='text-gray-700 ml-3'>
                  {badge.minAge && badge.maxAge
                    ? `${badge.minAge} - ${badge.maxAge} months`
                    : badge.minAge
                      ? `${badge.minAge}+ months`
                      : `Up to ${badge.maxAge} months`}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Badge Info */}
        <Animated.View entering={FadeInDown.delay(400)} className='mb-8'>
          <Text className='text-xl font-semibold text-gray-800 mb-3'>Badge Information</Text>
          <View className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-gray-600'>Status</Text>
              <View className='flex-row items-center'>
                <View className={`w-2 h-2 rounded-full mr-2 ${badge.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                <Text className={`font-medium ${badge.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {badge.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>

            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-gray-600'>Type</Text>
              <Text className='text-gray-800 font-medium'>{badge.isCustom ? 'Custom Badge' : 'System Badge'}</Text>
            </View>

            <View className='flex-row items-center justify-between'>
              <Text className='text-gray-600'>Created</Text>
              <Text className='text-gray-800 font-medium'>
                {new Date(badge.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Action Button */}
      {badge.isActive && (
        <View className='p-4 bg-white border-t border-gray-200'>
          <TouchableOpacity onPress={handleAwardBadge} className='bg-blue-500 py-4 rounded-xl items-center'>
            <View className='flex-row items-center'>
              <Icon name='trophy' iconStyle='solid' size={16} color='white' />
              <Text className='text-white text-lg font-semibold ml-2'>Award This Badge</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BadgeDetailScreen;
