// src/screens/Badge/BadgeDetailScreen/index.tsx

import AppLayout from '@/components/layout/AppLayout';
import { LoadingScreen } from '@/components/LoadingScreen';
import { getBadgeCategoryInfo, getBadgeDifficultyInfo } from '@/models/Badge/BadgeEnum';
import { fetchBadgeById } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { RootStackNavigationProp, RouteProps } from '@/types/navigation';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const BadgeDetailScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProps<'BadgeDetail'>>();
  const { badgeId, babyId } = route.params;
  const dispatch = useAppDispatch();

  const { currentBadge, isLoading, error } = useAppSelector((state) => state.badges);

  useEffect(() => {
    dispatch(fetchBadgeById(badgeId));
  }, [dispatch, badgeId]);

  if (isLoading || !currentBadge) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <AppLayout>
        <View className='flex-1 items-center justify-center px-8'>
          <Icon iconStyle='solid' name='triangle-exclamation' size={48} color='#EF4444' />
          <Text className='text-xl font-bold text-gray-900 mt-4 mb-2'>Error Loading Badge</Text>
          <Text className='text-base text-gray-600 text-center'>{error}</Text>
        </View>
      </AppLayout>
    );
  }

  const categoryInfo = getBadgeCategoryInfo(currentBadge.category);
  const difficultyInfo = getBadgeDifficultyInfo(currentBadge.difficulty);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppLayout>
        <ScrollView className='flex-1 bg-white'>
          {/* Compact Hero Section */}
          <View className='items-center py-6 px-4'>
            {/* Badge Icon */}
            <View
              className='w-28 h-28 rounded-3xl items-center justify-center mb-4 shadow-lg'
              style={{
                backgroundColor: `${categoryInfo.color}30`,
                shadowColor: categoryInfo.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {currentBadge.iconUrl ? (
                <Image source={{ uri: currentBadge.iconUrl }} className='w-24 h-24' resizeMode='contain' />
              ) : (
                <Icon iconStyle='solid' name={categoryInfo.icon as any} size={60} color={categoryInfo.color} />
              )}
            </View>

            {/* Title */}
            <Text className='text-2xl font-bold text-gray-900 text-center mb-3'>{currentBadge.title}</Text>

            {/* Badges Row */}
            <View className='flex-row items-center justify-center flex-wrap'>
              {/* Category */}
              <View
                className='flex-row items-center px-3 py-1.5 rounded-full mr-2 mb-2'
                style={{ backgroundColor: `${categoryInfo.color}20` }}
              >
                <Icon iconStyle='solid' name={categoryInfo.icon as any} size={12} color={categoryInfo.color} />
                <Text className='ml-1.5 text-xs font-semibold' style={{ color: categoryInfo.color }}>
                  {categoryInfo.label}
                </Text>
              </View>

              {/* Difficulty */}
              <View
                className='flex-row items-center px-3 py-1.5 rounded-full mb-2'
                style={{ backgroundColor: `${difficultyInfo.color}20` }}
              >
                {Array.from({ length: difficultyInfo.stars }).map((_, index) => (
                  <Icon
                    iconStyle='solid'
                    key={index}
                    name='star'
                    size={10}
                    color={difficultyInfo.color}
                    style={{ marginRight: 2 }}
                  />
                ))}
                <Text className='ml-1 text-xs font-semibold' style={{ color: difficultyInfo.color }}>
                  {difficultyInfo.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View className='px-4 pb-4'>
            {/* Description */}
            <View className='mb-4'>
              <Text className='text-base font-bold text-gray-900 mb-2'>About</Text>
              <Text className='text-sm text-gray-700 leading-5'>{currentBadge.description}</Text>
            </View>

            {/* Instructions */}
            <View className='mb-4'>
              <Text className='text-base font-bold text-gray-900 mb-2'>How to Earn</Text>
              <Text className='text-sm text-gray-700 leading-5'>{currentBadge.instruction}</Text>
            </View>

            {/* Age Range */}
            {currentBadge.minAge !== undefined && currentBadge.maxAge !== undefined && (
              <View className='mb-4'>
                <Text className='text-base font-bold text-gray-900 mb-2'>Recommended Age</Text>
                <View className='flex-row items-center'>
                  <View className='flex-1 bg-blue-50 rounded-xl p-3 mr-2'>
                    <Text className='text-xs text-gray-600 mb-1'>Min Age</Text>
                    <Text className='text-lg font-bold text-blue-600'>
                      {Math.floor(currentBadge.minAge / 12)}y {currentBadge.minAge % 12}m
                    </Text>
                  </View>
                  <View className='flex-1 bg-blue-50 rounded-xl p-3 ml-2'>
                    <Text className='text-xs text-gray-600 mb-1'>Max Age</Text>
                    <Text className='text-lg font-bold text-blue-600'>
                      {Math.floor(currentBadge.maxAge / 12)}y {currentBadge.maxAge % 12}m
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Tips Section */}
            <View className='bg-amber-50 rounded-2xl p-4'>
              <View className='flex-row items-center mb-2'>
                <Icon iconStyle='solid' name='lightbulb' size={16} color='#F59E0B' />
                <Text className='ml-2 text-sm font-bold text-amber-900'>Tips</Text>
              </View>
              <Text className='text-sm text-amber-800 leading-5'>
                Document this moment with photos or videos! Share your baby's achievement with family members.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Collect Badge Button - Always show */}
        <View className='px-4 py-6 border-t border-gray-200 bg-white'>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AwardBadge', { badgeId: badgeId });
            }}
            className='bg-amber-500 py-3 rounded-full flex-row items-center justify-center shadow-lg'
            style={{
              shadowColor: '#F59E0B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Icon iconStyle='solid' name='trophy' size={18} color='#FFFFFF' />
            <Text className='ml-2 text-sm font-bold text-white'>Collect Badge</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    </GestureHandlerRootView>
  );
};

export default BadgeDetailScreen;
