// src/screens/Badge/components/BadgeFilterBottomSheet.tsx

import {
  BADGE_CATEGORY_LABELS,
  BADGE_DIFFICULTY_LABELS,
  BadgeCategory,
  BadgeDifficulty,
} from '@/models/Badge/BadgeEnum';
import { updateFilters } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface BadgeFilterBottomSheetProps {
  onApply: () => void;
}

const BadgeFilterBottomSheet = forwardRef<BottomSheet, BadgeFilterBottomSheetProps>(({ onApply }, ref) => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.badges);

  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>(filters.category || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<BadgeDifficulty | 'all'>(filters.difficulty || 'all');
  const [showCustom, setShowCustom] = useState<boolean>(filters.isCustom ?? false);
  const [showActive, setShowActive] = useState<boolean>(filters.isActive ?? true);

  const snapPoints = useMemo(() => ['85%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  const handleClose = useCallback(() => {
    if (typeof ref === 'object' && ref?.current) {
      ref.current.close();
    }
  }, [ref]);

  const handleApply = useCallback(() => {
    dispatch(
      updateFilters({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
        isCustom: showCustom ? true : undefined,
        isActive: showActive,
        page: 1,
      }),
    );
    onApply();
    handleClose();
  }, [dispatch, selectedCategory, selectedDifficulty, showCustom, showActive, onApply, handleClose]);

  const handleReset = useCallback(() => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setShowCustom(false);
    setShowActive(true);
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#FFFFFF' }}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
    >
      {/* Header */}
      <View className='flex-row items-center justify-between px-6 pb-4 border-b border-gray-200'>
        <Text className='text-xl font-bold text-gray-900'>Filters</Text>
        <TouchableOpacity onPress={handleClose} className='p-2'>
          <Icon iconStyle='solid' name='xmark' size={20} color='#6B7280' />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView className='flex-1 px-6 py-4'>
        {/* Category Filter */}
        <View className='mb-6'>
          <Text className='text-base font-semibold text-gray-900 mb-3'>Category</Text>
          <View className='flex-row flex-wrap'>
            <TouchableOpacity
              onPress={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                selectedCategory === 'all' ? 'bg-amber-500' : 'bg-gray-100'
              }`}
            >
              <Text className={`text-sm font-semibold ${selectedCategory === 'all' ? 'text-white' : 'text-gray-700'}`}>
                All
              </Text>
            </TouchableOpacity>
            {Object.values(BadgeCategory).map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                  selectedCategory === category ? 'bg-amber-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${selectedCategory === category ? 'text-white' : 'text-gray-700'}`}
                >
                  {BADGE_CATEGORY_LABELS[category]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Filter */}
        <View className='mb-6'>
          <Text className='text-base font-semibold text-gray-900 mb-3'>Difficulty</Text>
          <View className='flex-row flex-wrap'>
            <TouchableOpacity
              onPress={() => setSelectedDifficulty('all')}
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                selectedDifficulty === 'all' ? 'bg-amber-500' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${selectedDifficulty === 'all' ? 'text-white' : 'text-gray-700'}`}
              >
                All
              </Text>
            </TouchableOpacity>
            {Object.values(BadgeDifficulty).map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                onPress={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                  selectedDifficulty === difficulty ? 'bg-amber-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    selectedDifficulty === difficulty ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {BADGE_DIFFICULTY_LABELS[difficulty]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Toggle Filters */}
        <View className='mb-6'>
          <Text className='text-base font-semibold text-gray-900 mb-3'>Options</Text>

          <TouchableOpacity
            onPress={() => setShowActive(!showActive)}
            className='flex-row items-center justify-between py-3 border-b border-gray-100'
          >
            <Text className='text-base text-gray-900'>Active badges only</Text>
            <View className={`w-12 h-6 rounded-full ${showActive ? 'bg-amber-500' : 'bg-gray-300'}`}>
              <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ${showActive ? 'ml-6' : 'ml-0.5'}`} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowCustom(!showCustom)}
            className='flex-row items-center justify-between py-3'
          >
            <Text className='text-base text-gray-900'>Custom badges only</Text>
            <View className={`w-12 h-6 rounded-full ${showCustom ? 'bg-amber-500' : 'bg-gray-300'}`}>
              <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ${showCustom ? 'ml-6' : 'ml-0.5'}`} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Extra spacing for scroll */}
        <View className='h-20' />
      </BottomSheetScrollView>

      {/* Footer */}
      <View className='flex-row px-6 py-4 border-t border-gray-200 bg-white'>
        <TouchableOpacity onPress={handleReset} className='flex-1 py-3 rounded-full bg-gray-100 mr-2'>
          <Text className='text-center text-base font-semibold text-gray-700'>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleApply} className='flex-1 py-3 rounded-full bg-amber-500 ml-2'>
          <Text className='text-center text-base font-semibold text-white'>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
});

BadgeFilterBottomSheet.displayName = 'BadgeFilterBottomSheet';

export default BadgeFilterBottomSheet;
