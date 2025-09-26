// src/screens/Badge/BadgeFilterScreen.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BadgeCategory, BadgeDifficulty } from '@/models/Badge/BadgeEnum';
import { BadgeFilters } from '@/models/Badge/BadgeModel';
import { formatCategory, formatDifficulty, getCategoryColor } from '@/utils/badgeUtils';

interface Props {
  navigation: any;
  route: {
    params: {
      currentFilters: BadgeFilters;
      onApply: (filters: BadgeFilters) => void;
    };
  };
}

const BadgeFilterScreen: React.FC<Props> = ({ navigation, route }) => {
  const { currentFilters, onApply } = route.params;
  const [filters, setFilters] = useState<BadgeFilters>(currentFilters);

  const categories = Object.values(BadgeCategory);
  const difficulties = Object.values(BadgeDifficulty);

  const handleApplyFilters = () => {
    onApply(filters);
    navigation.goBack();
  };

  const handleClearFilters = () => {
    const clearedFilters: BadgeFilters = {
      page: 1,
      limit: 10,
    };
    setFilters(clearedFilters);
  };

  const hasActiveFilters = () => {
    return Boolean(
      filters.category ||
        filters.difficulty ||
        filters.isActive !== undefined ||
        filters.isCustom !== undefined ||
        filters.minAge ||
        filters.maxAge,
    );
  };

  const updateFilter = (key: keyof BadgeFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const renderCategoryFilter = () => (
    <Animated.View entering={FadeInDown.delay(100)} className='mb-8'>
      <Text className='text-xl font-semibold text-gray-800 mb-4'>Category</Text>
      <View className='flex-row flex-wrap'>
        <TouchableOpacity
          onPress={() => updateFilter('category', undefined)}
          className={`px-4 py-3 rounded-xl mr-3 mb-3 ${!filters.category ? 'bg-blue-500' : 'bg-gray-100'}`}
        >
          <Text className={`font-medium ${!filters.category ? 'text-white' : 'text-gray-600'}`}>All Categories</Text>
        </TouchableOpacity>

        {categories.map((category) => {
          const isSelected = filters.category === category;
          const categoryColor = getCategoryColor(category);

          return (
            <TouchableOpacity
              key={category}
              onPress={() => updateFilter('category', isSelected ? undefined : category)}
              className='px-4 py-3 rounded-xl mr-3 mb-3'
              style={{
                backgroundColor: isSelected ? categoryColor : '#F3F4F6',
              }}
            >
              <Text
                className='font-medium'
                style={{
                  color: isSelected ? 'white' : '#4B5563',
                }}
              >
                {formatCategory(category)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderDifficultyFilter = () => (
    <Animated.View entering={FadeInDown.delay(200)} className='mb-8'>
      <Text className='text-xl font-semibold text-gray-800 mb-4'>Difficulty</Text>
      <View className='flex-row flex-wrap'>
        <TouchableOpacity
          onPress={() => updateFilter('difficulty', undefined)}
          className={`px-4 py-3 rounded-xl mr-3 mb-3 ${!filters.difficulty ? 'bg-blue-500' : 'bg-gray-100'}`}
        >
          <Text className={`font-medium ${!filters.difficulty ? 'text-white' : 'text-gray-600'}`}>
            All Difficulties
          </Text>
        </TouchableOpacity>

        {difficulties.map((difficulty) => {
          const isSelected = filters.difficulty === difficulty;
          const difficultyColors = {
            [BadgeDifficulty.EASY]: '#10B981',
            [BadgeDifficulty.MEDIUM]: '#F59E0B',
            [BadgeDifficulty.HARD]: '#EF4444',
          };

          return (
            <TouchableOpacity
              key={difficulty}
              onPress={() => updateFilter('difficulty', isSelected ? undefined : difficulty)}
              className='px-4 py-3 rounded-xl mr-3 mb-3'
              style={{
                backgroundColor: isSelected ? difficultyColors[difficulty] : '#F3F4F6',
              }}
            >
              <Text
                className='font-medium'
                style={{
                  color: isSelected ? 'white' : '#4B5563',
                }}
              >
                {formatDifficulty(difficulty)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderStatusFilter = () => (
    <Animated.View entering={FadeInDown.delay(300)} className='mb-8'>
      <Text className='text-xl font-semibold text-gray-800 mb-4'>Status</Text>
      <View className='flex-row flex-wrap'>
        <TouchableOpacity
          onPress={() => updateFilter('isActive', undefined)}
          className={`px-4 py-3 rounded-xl mr-3 mb-3 ${filters.isActive === undefined ? 'bg-blue-500' : 'bg-gray-100'}`}
        >
          <Text className={`font-medium ${filters.isActive === undefined ? 'text-white' : 'text-gray-600'}`}>
            All Status
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => updateFilter('isActive', filters.isActive === true ? undefined : true)}
          className={`px-4 py-3 rounded-xl mr-3 mb-3 ${filters.isActive === true ? 'bg-green-500' : 'bg-gray-100'}`}
        >
          <View className='flex-row items-center'>
            <View className={`w-2 h-2 rounded-full mr-2 ${filters.isActive === true ? 'bg-white' : 'bg-green-500'}`} />
            <Text className={`font-medium ${filters.isActive === true ? 'text-white' : 'text-gray-600'}`}>
              Active Only
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => updateFilter('isActive', filters.isActive === false ? undefined : false)}
          className={`px-4 py-3 rounded-xl mr-3 mb-3 ${filters.isActive === false ? 'bg-gray-500' : 'bg-gray-100'}`}
        >
          <View className='flex-row items-center'>
            <View className={`w-2 h-2 rounded-full mr-2 ${filters.isActive === false ? 'bg-white' : 'bg-gray-500'}`} />
            <Text className={`font-medium ${filters.isActive === false ? 'text-white' : 'text-gray-600'}`}>
              Inactive Only
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderTypeFilter = () => (
    <Animated.View entering={FadeInDown.delay(400)} className='mb-8'>
      <Text className='text-xl font-semibold text-gray-800 mb-4'>Badge Type</Text>
      <View className='flex-row flex-wrap'>
        <TouchableOpacity
          onPress={() => updateFilter('isCustom', undefined)}
          className={`px-4 py-3 rounded-xl mr-3 mb-3 ${filters.isCustom === undefined ? 'bg-blue-500' : 'bg-gray-100'}`}
        >
          <Text className={`font-medium ${filters.isCustom === undefined ? 'text-white' : 'text-gray-600'}`}>
            All Types
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => updateFilter('isCustom', filters.isCustom === true ? undefined : true)}
          className={`px-4 py-3 rounded-xl mr-3 mb-3 ${filters.isCustom === true ? 'bg-purple-500' : 'bg-gray-100'}`}
        >
          <View className='flex-row items-center'>
            <Icon name='star' iconStyle='solid' size={12} color={filters.isCustom === true ? 'white' : '#8B5CF6'} />
            <Text className={`font-medium ml-2 ${filters.isCustom === true ? 'text-white' : 'text-gray-600'}`}>
              Custom Only
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => updateFilter('isCustom', filters.isCustom === false ? undefined : false)}
          className={`px-4 py-3 rounded-xl mr-3 mb-3 ${filters.isCustom === false ? 'bg-blue-600' : 'bg-gray-100'}`}
        >
          <View className='flex-row items-center'>
            <Icon name='shield' iconStyle='solid' size={12} color={filters.isCustom === false ? 'white' : '#2563EB'} />
            <Text className={`font-medium ml-2 ${filters.isCustom === false ? 'text-white' : 'text-gray-600'}`}>
              System Only
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderAgeRangeFilter = () => (
    <Animated.View entering={FadeInDown.delay(500)} className='mb-8'>
      <Text className='text-xl font-semibold text-gray-800 mb-4'>Age Range (Months)</Text>
      <View className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-1 mr-2'>
            <Text className='text-gray-600 mb-2'>Minimum Age</Text>
            <View className='flex-row flex-wrap'>
              {[0, 3, 6, 12, 18, 24, 36].map((age) => (
                <TouchableOpacity
                  key={age}
                  onPress={() => updateFilter('minAge', filters.minAge === age ? undefined : age)}
                  className={`px-3 py-2 rounded-lg mr-2 mb-2 ${filters.minAge === age ? 'bg-blue-500' : 'bg-gray-100'}`}
                >
                  <Text className={`text-sm font-medium ${filters.minAge === age ? 'text-white' : 'text-gray-600'}`}>
                    {age}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className='flex-1 ml-2'>
            <Text className='text-gray-600 mb-2'>Maximum Age</Text>
            <View className='flex-row flex-wrap'>
              {[6, 12, 18, 24, 36, 48, 60].map((age) => (
                <TouchableOpacity
                  key={age}
                  onPress={() => updateFilter('maxAge', filters.maxAge === age ? undefined : age)}
                  className={`px-3 py-2 rounded-lg mr-2 mb-2 ${filters.maxAge === age ? 'bg-blue-500' : 'bg-gray-100'}`}
                >
                  <Text className={`text-sm font-medium ${filters.maxAge === age ? 'text-white' : 'text-gray-600'}`}>
                    {age}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {(filters.minAge || filters.maxAge) && (
          <View className='bg-blue-50 p-3 rounded-lg'>
            <Text className='text-blue-800 text-sm'>
              Showing badges for {filters.minAge || 0} - {filters.maxAge || '60+'} months
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='px-4 py-4 bg-white shadow-sm'>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
          >
            <Icon name='xmark' iconStyle='solid' size={16} color='#374151' />
          </TouchableOpacity>

          <Text className='text-xl font-bold text-gray-800'>Filter Badges</Text>

          {hasActiveFilters() && (
            <TouchableOpacity onPress={handleClearFilters} className='px-3 py-1 bg-red-100 rounded-full'>
              <Text className='text-red-600 font-medium text-sm'>Clear</Text>
            </TouchableOpacity>
          )}
          {!hasActiveFilters() && <View className='w-10' />}
        </View>

        {hasActiveFilters() && (
          <View className='mt-3 bg-blue-50 p-3 rounded-lg'>
            <Text className='text-blue-800 text-sm'>
              {
                Object.keys(filters).filter(
                  (key) => key !== 'page' && key !== 'limit' && filters[key as keyof BadgeFilters] !== undefined,
                ).length
              }{' '}
              filter(s) active
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp}>
          <Text className='text-2xl font-bold text-gray-800 mb-6'>Find the perfect badges</Text>
        </Animated.View>

        {renderCategoryFilter()}
        {renderDifficultyFilter()}
        {renderStatusFilter()}
        {renderTypeFilter()}
        {renderAgeRangeFilter()}

        <View className='h-20' />
      </ScrollView>

      {/* Action Buttons */}
      <View className='p-4 bg-white border-t border-gray-200'>
        <View className='flex-row gap-3'>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='flex-1 bg-gray-100 py-4 rounded-xl items-center'
          >
            <Text className='text-gray-700 font-semibold text-lg'>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleApplyFilters} className='flex-1 bg-blue-500 py-4 rounded-xl items-center'>
            <View className='flex-row items-center'>
              <Icon name='filter' iconStyle='solid' size={16} color='white' />
              <Text className='text-white font-semibold text-lg ml-2'>Apply Filters</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BadgeFilterScreen;
