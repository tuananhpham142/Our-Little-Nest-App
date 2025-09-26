// src/screens/Badge/BadgeSelectionScreen.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBadgesForSelection } from '@/hooks/useBadge';
import { BadgeCategory, BadgeDifficulty } from '@/models/Badge/BadgeEnum';
import { Badge } from '@/models/Badge/BadgeModel';
import { formatCategory, formatDifficulty, getCategoryColor, getCategoryIcon } from '@/utils/badgeUtils';

interface Props {
  navigation: any;
  route: {
    params: {
      selectedBabyAge?: number;
      selectedBabyName?: string;
      onSelectBadge: (badge: Badge) => void;
    };
  };
}

const BadgeSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { selectedBabyAge, selectedBabyName, onSelectBadge } = route.params;
  const { badges, isLoading, error, loadBadges } = useBadgesForSelection();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<BadgeCategory | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<BadgeDifficulty | null>(null);

  React.useEffect(() => {
    loadBadges({
      isActive: true,
      ...(selectedBabyAge && { maxAge: selectedBabyAge + 12 }), // Show badges for current age + 1 year
    });
  }, [selectedBabyAge, loadBadges]);

  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      const matchesSearch =
        badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !filterCategory || badge.category === filterCategory;
      const matchesDifficulty = !filterDifficulty || badge.difficulty === filterDifficulty;

      // Age appropriateness check
      if (selectedBabyAge) {
        const ageAppropriate =
          (!badge.minAge || selectedBabyAge >= badge.minAge) && (!badge.maxAge || selectedBabyAge <= badge.maxAge);
        return matchesSearch && matchesCategory && matchesDifficulty && ageAppropriate;
      }

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [badges, searchQuery, filterCategory, filterDifficulty, selectedBabyAge]);

  const categories = useMemo(() => Object.values(BadgeCategory), []);
  const difficulties = useMemo(() => Object.values(BadgeDifficulty), []);

  const handleSelectBadge = useCallback(
    (badge: Badge) => {
      onSelectBadge(badge);
      navigation.goBack();
    },
    [onSelectBadge, navigation],
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterCategory(null);
    setFilterDifficulty(null);
  };

  const hasFilters = searchQuery || filterCategory || filterDifficulty;

  const renderBadgeItem = useCallback(
    ({ item, index }: { item: Badge; index: number }) => {
      const categoryColor = getCategoryColor(item.category);
      const categoryIcon = getCategoryIcon(item.category);

      return (
        <Animated.View entering={FadeInDown.delay(index * 50)}>
          <TouchableOpacity
            onPress={() => handleSelectBadge(item)}
            className='bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100'
            activeOpacity={0.8}
          >
            <View className='flex-row items-start'>
              <View
                className='w-12 h-12 rounded-full items-center justify-center mr-4'
                style={{ backgroundColor: categoryColor + '20' }}
              >
                <Icon name={categoryIcon as any} iconStyle='solid' size={20} color={categoryColor} />
              </View>

              <View className='flex-1'>
                <View className='flex-row items-start justify-between mb-2'>
                  <Text className='text-lg font-semibold text-gray-800 flex-1' numberOfLines={1}>
                    {item.title}
                  </Text>

                  {item.isCustom && (
                    <View className='bg-purple-100 px-2 py-1 rounded-full ml-2'>
                      <Text className='text-xs text-purple-600 font-medium'>Custom</Text>
                    </View>
                  )}
                </View>

                <Text className='text-gray-600 mb-3' numberOfLines={2}>
                  {item.description}
                </Text>

                <View className='flex-row items-center justify-between'>
                  <View className='flex-row items-center'>
                    <View className='px-2 py-1 rounded-full mr-2' style={{ backgroundColor: categoryColor + '20' }}>
                      <Text className='text-xs font-medium' style={{ color: categoryColor }}>
                        {formatCategory(item.category)}
                      </Text>
                    </View>

                    <View className='px-2 py-1 rounded-full bg-gray-100'>
                      <Text className='text-xs text-gray-600 font-medium'>{formatDifficulty(item.difficulty)}</Text>
                    </View>
                  </View>

                  {(item.minAge || item.maxAge) && (
                    <View className='bg-blue-50 px-2 py-1 rounded-full'>
                      <Text className='text-xs text-blue-600 font-medium'>
                        {item.minAge && item.maxAge
                          ? `${item.minAge}-${item.maxAge}m`
                          : item.minAge
                            ? `${item.minAge}m+`
                            : `<${item.maxAge}m`}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [handleSelectBadge],
  );

  const renderCategoryFilter = () => (
    <View className='mb-4'>
      <FlatList
        data={[null, ...categories]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item || 'all'}
        renderItem={({ item }) => {
          const isSelected = filterCategory === item;
          const categoryColor = item ? getCategoryColor(item) : '#3B82F6';

          return (
            <TouchableOpacity
              onPress={() => setFilterCategory(isSelected ? null : item)}
              className='px-4 py-2 rounded-full mr-2'
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
                {item ? formatCategory(item) : 'All'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const renderDifficultyFilter = () => (
    <View className='mb-4'>
      <FlatList
        data={[null, ...difficulties]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item || 'all'}
        renderItem={({ item }) => {
          const isSelected = filterDifficulty === item;
          const difficultyColors = {
            [BadgeDifficulty.EASY]: '#10B981',
            [BadgeDifficulty.MEDIUM]: '#F59E0B',
            [BadgeDifficulty.HARD]: '#EF4444',
          };
          const difficultyColor = item ? difficultyColors[item] : '#3B82F6';

          return (
            <TouchableOpacity
              onPress={() => setFilterDifficulty(isSelected ? null : item)}
              className='px-4 py-2 rounded-full mr-2'
              style={{
                backgroundColor: isSelected ? difficultyColor : '#F3F4F6',
              }}
            >
              <Text
                className='font-medium'
                style={{
                  color: isSelected ? 'white' : '#4B5563',
                }}
              >
                {item ? formatDifficulty(item) : 'All'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View className='flex-1 items-center justify-center py-20'>
      <Icon name='magnifying-glass' iconStyle='solid' size={64} color='#D1D5DB' />
      <Text className='text-xl font-semibold text-gray-600 mt-4 mb-2'>No badges found</Text>
      <Text className='text-gray-500 text-center px-8 mb-6'>
        {hasFilters
          ? 'Try adjusting your search or filters to find more badges'
          : 'No badges are available for selection at the moment'}
      </Text>
      {hasFilters && (
        <TouchableOpacity onPress={handleClearFilters} className='bg-blue-500 px-6 py-3 rounded-full'>
          <Text className='text-white font-semibold'>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size='large' color='#3B82F6' />
      <Text className='text-gray-500 mt-4'>Loading badges...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View className='flex-1 items-center justify-center px-8'>
      <Icon name='triangle-exclamation' iconStyle='solid' size={64} color='#EF4444' />
      <Text className='text-xl font-semibold text-gray-600 mt-4 mb-2'>Something went wrong</Text>
      <Text className='text-gray-500 text-center leading-6 mb-6'>{error}</Text>
      <TouchableOpacity onPress={() => loadBadges({ isActive: true })} className='bg-blue-500 px-6 py-3 rounded-full'>
        <Text className='text-white font-semibold'>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='px-4 py-4 bg-white shadow-sm'>
        <View className='flex-row items-center justify-between mb-4'>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
          >
            <Icon name='arrow-left' iconStyle='solid' size={16} color='#374151' />
          </TouchableOpacity>

          <Text className='text-xl font-bold text-gray-800'>Choose Badge</Text>

          {hasFilters && (
            <TouchableOpacity onPress={handleClearFilters} className='px-3 py-1 bg-red-100 rounded-full'>
              <Text className='text-red-600 font-medium text-sm'>Clear</Text>
            </TouchableOpacity>
          )}
          {!hasFilters && <View className='w-10' />}
        </View>

        {selectedBabyName && selectedBabyAge && (
          <Animated.View entering={FadeInUp} className='mb-4 bg-blue-50 p-3 rounded-xl'>
            <Text className='text-blue-800 text-sm'>
              Showing badges suitable for <Text className='font-semibold'>{selectedBabyName}</Text> ({selectedBabyAge}{' '}
              months old)
            </Text>
          </Animated.View>
        )}

        {/* Search */}
        <View className='bg-gray-100 rounded-full px-4 py-3 flex-row items-center mb-4'>
          <Icon name='magnifying-glass' iconStyle='solid' size={16} color='#9CA3AF' />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder='Search badges...'
            className='flex-1 ml-3 text-gray-800'
            placeholderTextColor='#9CA3AF'
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name='xmark' iconStyle='solid' size={14} color='#9CA3AF' />
            </TouchableOpacity>
          )}
        </View>

        {renderCategoryFilter()}
        {renderDifficultyFilter()}
      </View>

      {/* Content */}
      {isLoading && badges.length === 0 ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <View className='flex-1'>
          <View className='px-4 py-2 bg-white border-b border-gray-100'>
            <Text className='text-gray-600 text-sm'>
              {filteredBadges.length} badge{filteredBadges.length !== 1 ? 's' : ''} available
            </Text>
          </View>

          {filteredBadges.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredBadges}
              renderItem={renderBadgeItem}
              keyExtractor={(item) => item.id}
              contentContainerClassName='p-4'
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default BadgeSelectionScreen;
