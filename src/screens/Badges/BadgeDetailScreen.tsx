// src/screens/Badge/BadgeDetailScreen/index.tsx

import AppLayout from '@/components/layout/AppLayout';
import { LoadingScreen } from '@/components/LoadingScreen';
import { getBadgeCategoryInfo, getBadgeDifficultyInfo } from '@/models/Badge/BadgeEnum';
import { fetchBadgeById } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { RootStackNavigationProp, RouteProps } from '@/types/navigation';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AwardBadgeBottomSheet from './components/AwardBadge';

const BadgeDetailScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProps<'BadgeDetail'>>();
  const { badgeId, babyId } = route.params;
  const dispatch = useAppDispatch();

  const { currentBadge, isLoading, error } = useAppSelector((state) => state.badges);
  const awardBottomSheetRef = useRef<BottomSheet>(null);

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
          {/* Hero Section */}
          <View className='px-6 pt-12 pb-8' style={{ backgroundColor: `${categoryInfo.color}10` }}>
            {/* Badge Icon */}
            <View
              className='w-32 h-32 rounded-3xl items-center justify-center mx-auto mb-6 shadow-lg'
              style={{
                backgroundColor: `${categoryInfo.color}30`,
                shadowColor: categoryInfo.color,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 10,
              }}
            >
              {currentBadge.iconUrl ? (
                <Image source={{ uri: currentBadge.iconUrl }} className='w-28 h-28' resizeMode='contain' />
              ) : (
                <Icon iconStyle='solid' name={categoryInfo.icon as any} size={80} color={categoryInfo.color} />
              )}
            </View>

            {/* Title */}
            <Text className='text-3xl font-bold text-gray-900 text-center mb-2'>{currentBadge.title}</Text>

            {/* Badges Row */}
            <View className='flex-row items-center justify-center flex-wrap mt-4'>
              {/* Category */}
              <View
                className='flex-row items-center px-4 py-2 rounded-full mr-2 mb-2'
                style={{ backgroundColor: `${categoryInfo.color}20` }}
              >
                <Icon iconStyle='solid' name={categoryInfo.icon as any} size={14} color={categoryInfo.color} />
                <Text className='ml-2 text-sm font-semibold' style={{ color: categoryInfo.color }}>
                  {categoryInfo.label}
                </Text>
              </View>

              {/* Difficulty */}
              <View
                className='flex-row items-center px-4 py-2 rounded-full mr-2 mb-2'
                style={{ backgroundColor: `${difficultyInfo.color}20` }}
              >
                {Array.from({ length: difficultyInfo.stars }).map((_, index) => (
                  <Icon
                    iconStyle='solid'
                    key={index}
                    name='star'
                    size={12}
                    color={difficultyInfo.color}
                    style={{ marginRight: 2 }}
                  />
                ))}
                <Text className='ml-1 text-sm font-semibold' style={{ color: difficultyInfo.color }}>
                  {difficultyInfo.label}
                </Text>
              </View>

              {/* Custom Badge */}
              {currentBadge.isCustom && (
                <View className='flex-row items-center px-4 py-2 rounded-full bg-purple-100 mb-2'>
                  <Icon iconStyle='solid' name='wand-magic-sparkles' size={14} color='#A855F7' />
                  <Text className='ml-2 text-sm font-semibold text-purple-600'>Custom</Text>
                </View>
              )}
            </View>
          </View>

          {/* Content */}
          <View className='px-6 py-6'>
            {/* Description */}
            <View className='mb-8'>
              <View className='flex-row items-center mb-3'>
                <View
                  className='w-10 h-10 rounded-full items-center justify-center mr-3'
                  style={{ backgroundColor: `${categoryInfo.color}15` }}
                >
                  <Icon iconStyle='solid' name='circle-info' size={20} color={categoryInfo.color} />
                </View>
                <Text className='text-xl font-bold text-gray-900'>About This Badge</Text>
              </View>
              <Text className='text-base text-gray-700 leading-6'>{currentBadge.description}</Text>
            </View>

            {/* Instructions */}
            <View className='mb-8'>
              <View className='flex-row items-center mb-3'>
                <View
                  className='w-10 h-10 rounded-full items-center justify-center mr-3'
                  style={{ backgroundColor: `${categoryInfo.color}15` }}
                >
                  <Icon iconStyle='solid' name='list-check' size={20} color={categoryInfo.color} />
                </View>
                <Text className='text-xl font-bold text-gray-900'>How to Earn</Text>
              </View>
              <Text className='text-base text-gray-700 leading-6'>{currentBadge.instruction}</Text>
            </View>

            {/* Age Range */}
            {currentBadge.minAge !== undefined && currentBadge.maxAge !== undefined && (
              <View className='mb-8'>
                <View className='flex-row items-center mb-3'>
                  <View
                    className='w-10 h-10 rounded-full items-center justify-center mr-3'
                    style={{ backgroundColor: '#DBEAFE' }}
                  >
                    <Icon iconStyle='solid' name='baby' size={20} color='#3B82F6' />
                  </View>
                  <Text className='text-xl font-bold text-gray-900'>Recommended Age</Text>
                </View>
                <View className='flex-row items-center'>
                  <View className='flex-1 bg-blue-50 rounded-2xl p-4 mr-2'>
                    <Text className='text-sm text-gray-600 mb-1'>Minimum Age</Text>
                    <Text className='text-2xl font-bold text-blue-600'>
                      {Math.floor(currentBadge.minAge / 12)} years
                    </Text>
                    <Text className='text-sm text-gray-500'>{currentBadge.minAge % 12} months</Text>
                  </View>
                  <View className='flex-1 bg-blue-50 rounded-2xl p-4 ml-2'>
                    <Text className='text-sm text-gray-600 mb-1'>Maximum Age</Text>
                    <Text className='text-2xl font-bold text-blue-600'>
                      {Math.floor(currentBadge.maxAge / 12)} years
                    </Text>
                    <Text className='text-sm text-gray-500'>{currentBadge.maxAge % 12} months</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Tips Section */}
            <View className='bg-amber-50 rounded-3xl p-6 mb-6'>
              <View className='flex-row items-center mb-3'>
                <Icon iconStyle='solid' name='lightbulb' size={20} color='#F59E0B' />
                <Text className='ml-2 text-lg font-bold text-amber-900'>Tips & Suggestions</Text>
              </View>
              <Text className='text-base text-amber-800 leading-6'>
                Document this special moment with photos or videos! Share your baby's achievement with family members
                and celebrate together.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Award Button */}
        {babyId && (
          <View className='px-6 py-4 border-t border-gray-200 bg-white'>
            <TouchableOpacity
              onPress={() => awardBottomSheetRef.current?.snapToIndex(0)}
              className='bg-amber-500 py-4 rounded-full flex-row items-center justify-center shadow-lg'
              style={{
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Icon iconStyle='solid' name='trophy' size={20} color='#FFFFFF' />
              <Text className='ml-2 text-base font-semibold text-white'>Award This Badge</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Award Bottom Sheet */}
        {babyId && (
          <AwardBadgeBottomSheet
            ref={awardBottomSheetRef}
            babyId={babyId}
            onSuccess={() => {
              navigation.goBack();
            }}
          />
        )}
      </AppLayout>
    </GestureHandlerRootView>
  );
};

export default BadgeDetailScreen;
