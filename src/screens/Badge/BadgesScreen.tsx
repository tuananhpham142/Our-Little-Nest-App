// src/screens/Badge/BadgesScreen.tsx
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBadges } from '@/hooks/useBadge';
import { BadgeCategory, BadgeDifficulty } from '@/models/Badge/BadgeEnum';
import { Badge, BadgeFilters } from '@/models/Badge/BadgeModel';
import {
  BADGE_CONSTANTS,
  debounce,
  formatCategory,
  formatDifficulty,
  getAccessibilityLabel,
  getCategoryColor,
  getCategoryIcon,
} from '@/utils/badgeUtils';

interface Props {
  navigation: any;
}

const BadgesScreen: React.FC<Props> = ({ navigation }) => {
  const { badges, isLoading, isLoadingMore, error, pagination, filters, loadMore, setFilters, clearFilters, refresh } =
    useBadges();

  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filterSheetRef, setFilterSheetRef] = useState<BottomSheetModal | null>(null);
  const [badgeDetailRef, setBadgeDetailRef] = useState<BottomSheetModal | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const searchOpacity = useSharedValue(1);
  const searchInputRef = useRef<TextInput>(null);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setFilters({ search: query, page: 1 });
      }, BADGE_CONSTANTS.SEARCH_DEBOUNCE_MS),
    [setFilters],
  );

  // Filter categories for easy access
  const categories = Object.values(BadgeCategory);

  // Handle search with debouncing
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch],
  );

  // Handle category filter
  const handleCategoryFilter = useCallback(
    (category: BadgeCategory | undefined) => {
      setFilters({ category, page: 1 });
    },
    [setFilters],
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    clearFilters();
    searchInputRef.current?.clear();
  }, [clearFilters]);

  // Handle refresh with proper state management
  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refresh();
    } catch (error) {
      console.error('Error refreshing badges:', error);
      Alert.alert('Error', 'Failed to refresh badges. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  // Handle load more with error handling
  const handleLoadMore = useCallback(() => {
    if (!pagination.hasNextPage || isLoadingMore || isLoading) return;
    if (typeof loadMore === 'function') {
      loadMore()
        ?.then()
        .catch((error) => {
          console.error('Error loading more badges:', error);
          Alert.alert('Error', 'Failed to load more badges.');
        });
    }
  }, [loadMore, pagination.hasNextPage, isLoadingMore, isLoading]);

  // Show badge details
  const showBadgeDetails = useCallback(
    (badge: Badge) => {
      setSelectedBadge(badge);
      badgeDetailRef?.present();
    },
    [badgeDetailRef],
  );

  // Filter button animation
  const filterButtonStyle = useAnimatedStyle(() => {
    const hasFilters = filters.category || filters.difficulty || filters.search;
    return {
      backgroundColor: withSpring(hasFilters ? '#3B82F6' : '#F3F4F6'),
      transform: [{ scale: withSpring(hasFilters ? 1.05 : 1) }],
    };
  });

  // Render badge card with accessibility and performance improvements
  const renderBadgeCard = useCallback(
    ({ item, index }: { item: Badge; index: number }) => (
      <Animated.View entering={FadeInDown.delay(index * BADGE_CONSTANTS.ANIMATION.STAGGER_DELAY)} className='mb-4 mx-2'>
        <TouchableOpacity
          onPress={() => showBadgeDetails(item)}
          className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'
          activeOpacity={0.8}
          accessibilityRole='button'
          accessibilityLabel={getAccessibilityLabel(item.title, item.category, item.difficulty, item.isActive)}
        >
          <View className='flex-row items-start justify-between'>
            <View className='flex-1'>
              <View className='flex-row items-center mb-2'>
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-3`}
                  style={{ backgroundColor: getCategoryColor(item.category) + '20' }}
                >
                  <Icon
                    name={getCategoryIcon(item.category) as any}
                    iconStyle='solid'
                    size={16}
                    color={getCategoryColor(item.category)}
                  />
                </View>
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-gray-800' numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className='text-sm text-gray-500'>
                    {formatCategory(item.category)} • {formatDifficulty(item.difficulty)}
                  </Text>
                </View>
              </View>

              <Text className='text-gray-600 mb-3' numberOfLines={2}>
                {item.description}
              </Text>

              <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center'>
                  {item.minAge !== undefined && item.maxAge !== undefined && (
                    <View className='bg-gray-100 px-2 py-1 rounded-full mr-2'>
                      <Text className='text-xs text-gray-600'>
                        {item.minAge}-{item.maxAge} months
                      </Text>
                    </View>
                  )}
                  {item.isCustom && (
                    <View className='bg-purple-100 px-2 py-1 rounded-full'>
                      <Text className='text-xs text-purple-600'>Custom</Text>
                    </View>
                  )}
                </View>

                <View
                  className={`w-3 h-3 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                  accessibilityLabel={item.isActive ? 'Active badge' : 'Inactive badge'}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    ),
    [showBadgeDetails],
  );

  // Render category filter chip with memoization
  const renderCategoryChip = useCallback(
    (category: BadgeCategory) => {
      const isSelected = filters.category === category;
      return (
        <TouchableOpacity
          key={category}
          onPress={() => handleCategoryFilter(isSelected ? undefined : category)}
          className={`px-4 py-2 rounded-full mr-2 ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}
          accessibilityRole='button'
          accessibilityLabel={`${isSelected ? 'Remove' : 'Apply'} ${formatCategory(category)} filter`}
        >
          <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
            {formatCategory(category)}
          </Text>
        </TouchableOpacity>
      );
    },
    [filters.category, handleCategoryFilter],
  );

  // Loading footer with better UX
  const renderLoadingFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View className='py-4 items-center'>
        <ActivityIndicator size='small' color={BADGE_CONSTANTS.COLORS.PRIMARY} />
        <Text className='text-gray-500 mt-2 text-sm'>Loading more badges...</Text>
      </View>
    );
  }, [isLoadingMore]);

  // Enhanced empty state
  const renderEmptyState = useCallback(() => {
    const hasFilters = filters.search || filters.category || filters.difficulty;

    return (
      <View className='flex-1 items-center justify-center py-20 px-8'>
        <Icon name='medal' iconStyle='solid' size={64} color='#D1D5DB' />
        <Text className='text-xl font-semibold text-gray-600 mt-4 mb-2 text-center'>
          {hasFilters ? 'No matching badges' : 'No badges available'}
        </Text>
        <Text className='text-gray-500 text-center leading-6 mb-6'>
          {hasFilters
            ? 'Try adjusting your search terms or filters to find more badges'
            : 'Create your first badge to get started with tracking achievements'}
        </Text>
        {hasFilters ? (
          <TouchableOpacity
            onPress={handleClearFilters}
            className='bg-blue-500 px-6 py-3 rounded-full'
            accessibilityRole='button'
            accessibilityLabel='Clear all filters'
          >
            <Text className='text-white font-semibold'>Clear Filters</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateBadge')}
            className='bg-blue-500 px-6 py-3 rounded-full'
            accessibilityRole='button'
            accessibilityLabel='Create your first badge'
          >
            <Text className='text-white font-semibold'>Create Badge</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [filters, handleClearFilters, navigation]);

  // Error state component
  const renderErrorState = useCallback(() => {
    if (!error) return null;

    return (
      <View className='flex-1 items-center justify-center py-20 px-8'>
        <Icon name='triangle-exclamation' iconStyle='solid' size={64} color='#EF4444' />
        <Text className='text-xl font-semibold text-gray-600 mt-4 mb-2 text-center'>Something went wrong</Text>
        <Text className='text-gray-500 text-center leading-6 mb-6'>{error}</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          className='bg-blue-500 px-6 py-3 rounded-full'
          accessibilityRole='button'
          accessibilityLabel='Try again'
        >
          <Text className='text-white font-semibold'>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }, [error, handleRefresh]);

  // Keyboard dismiss handler
  const handleScrollBegin = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView className='flex-1 bg-gray-50'>
        {/* Header */}
        <View className='px-4 py-2 bg-white shadow-sm'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-2xl font-bold text-gray-800'>Badges</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateBadge')}
              className='bg-blue-500 px-4 py-2 rounded-full flex-row items-center'
            >
              <Icon name='plus' iconStyle='solid' size={14} color='white' />
              <Text className='text-white font-medium ml-2'>Create</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className='flex-row items-center mb-4'>
            <View className='flex-1 bg-gray-100 rounded-full px-4 py-3 flex-row items-center mr-3'>
              <Icon name='magnifying-glass' iconStyle='solid' size={16} color='#9CA3AF' />
              <TextInput
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder='Search badges...'
                className='flex-1 ml-3 text-gray-800'
                placeholderTextColor='#9CA3AF'
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                  <Icon name='xmark' iconStyle='solid' size={14} color='#9CA3AF' />
                </TouchableOpacity>
              )}
            </View>

            <Animated.View style={filterButtonStyle}>
              <TouchableOpacity
                onPress={() => filterSheetRef?.present()}
                className='w-12 h-12 rounded-full items-center justify-center'
              >
                <Icon
                  name='filter'
                  iconStyle='solid'
                  size={16}
                  color={filters.category || filters.difficulty || filters.search ? 'white' : '#9CA3AF'}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Category Filter Chips */}
          <FlatList
            data={categories}
            renderItem={({ item }) => renderCategoryChip(item)}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName='pb-2'
          />
        </View>

        {/* Badges List */}
        {isLoading && badges.length === 0 ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color='#3B82F6' />
            <Text className='text-gray-500 mt-4'>Loading badges...</Text>
          </View>
        ) : (
          <FlatList
            data={badges}
            renderItem={renderBadgeCard}
            keyExtractor={(item) => item.id}
            contentContainerClassName='pt-4 pb-20'
            refreshControl={<RefreshControl refreshing={isLoading && badges.length > 0} onRefresh={refresh} />}
            onEndReached={pagination.hasNextPage ? loadMore : undefined}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderLoadingFooter}
            ListEmptyComponent={!isLoading ? renderEmptyState : null}
          />
        )}

        {/* Filter Bottom Sheet */}
        <BottomSheetModal
          ref={setFilterSheetRef}
          index={1}
          snapPoints={['25%', '80%']}
          backdropComponent={({ style }) => <View style={[style, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />}
        >
          <FilterBottomSheet filters={filters} onApplyFilters={setFilters} onClose={() => filterSheetRef?.close()} />
        </BottomSheetModal>

        {/* Badge Detail Bottom Sheet */}
        <BottomSheetModal
          ref={setBadgeDetailRef}
          index={1}
          snapPoints={['50%', '90%']}
          backdropComponent={({ style }) => <View style={[style, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />}
        >
          {selectedBadge && (
            <BadgeDetailSheet
              badge={selectedBadge}
              onClose={() => badgeDetailRef?.close()}
              onAward={() => {
                badgeDetailRef?.close();
                navigation.navigate('AwardBadge', { badgeId: selectedBadge.id });
              }}
            />
          )}
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

// Helper Components
const FilterBottomSheet: React.FC<{
  filters: BadgeFilters;
  onApplyFilters: (filters: Partial<BadgeFilters>) => void;
  onClose: () => void;
}> = ({ filters, onApplyFilters, onClose }) => {
  const [tempFilters, setTempFilters] = useState<BadgeFilters>(filters);

  return (
    <View className='flex-1 p-6'>
      <View className='flex-row items-center justify-between mb-6'>
        <Text className='text-xl font-bold text-gray-800'>Filter Badges</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name='xmark' iconStyle='solid' size={20} color='#9CA3AF' />
        </TouchableOpacity>
      </View>

      {/* Difficulty Filter */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-gray-800 mb-3'>Difficulty</Text>
        <View className='flex-row flex-wrap'>
          {Object.values(BadgeDifficulty).map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              onPress={() =>
                setTempFilters({
                  ...tempFilters,
                  difficulty: tempFilters.difficulty === difficulty ? undefined : difficulty,
                })
              }
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                tempFilters.difficulty === difficulty ? 'bg-blue-500' : 'bg-gray-100'
              }`}
            >
              <Text className={`font-medium ${tempFilters.difficulty === difficulty ? 'text-white' : 'text-gray-600'}`}>
                {formatDifficulty(difficulty)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Status Filter */}
      <View className='mb-6'>
        <Text className='text-lg font-semibold text-gray-800 mb-3'>Status</Text>
        <View className='flex-row'>
          <TouchableOpacity
            onPress={() =>
              setTempFilters({
                ...tempFilters,
                isActive: tempFilters.isActive === true ? undefined : true,
              })
            }
            className={`px-4 py-2 rounded-full mr-2 ${tempFilters.isActive === true ? 'bg-green-500' : 'bg-gray-100'}`}
          >
            <Text className={`font-medium ${tempFilters.isActive === true ? 'text-white' : 'text-gray-600'}`}>
              Active Only
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setTempFilters({
                ...tempFilters,
                isCustom: tempFilters.isCustom === true ? undefined : true,
              })
            }
            className={`px-4 py-2 rounded-full ${tempFilters.isCustom === true ? 'bg-purple-500' : 'bg-gray-100'}`}
          >
            <Text className={`font-medium ${tempFilters.isCustom === true ? 'text-white' : 'text-gray-600'}`}>
              Custom Only
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        onPress={() => {
          onApplyFilters(tempFilters);
          onClose();
        }}
        className='bg-blue-500 py-4 rounded-xl items-center'
      >
        <Text className='text-white text-lg font-semibold'>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const BadgeDetailSheet: React.FC<{
  badge: Badge;
  onClose: () => void;
  onAward: () => void;
}> = ({ badge, onClose, onAward }) => {
  return (
    <View className='flex-1 p-6'>
      <View className='flex-row items-center justify-between mb-6'>
        <Text className='text-xl font-bold text-gray-800'>Badge Details</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name='xmark' iconStyle='solid' size={20} color='#9CA3AF' />
        </TouchableOpacity>
      </View>

      <View className='items-center mb-6'>
        <View
          className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
            badge.category === BadgeCategory.MILESTONE
              ? 'bg-yellow-100'
              : badge.category === BadgeCategory.DAILY_LIFE
                ? 'bg-blue-100'
                : badge.category === BadgeCategory.SOCIAL
                  ? 'bg-green-100'
                  : badge.category === BadgeCategory.PHYSICAL
                    ? 'bg-red-100'
                    : badge.category === BadgeCategory.COGNITIVE
                      ? 'bg-purple-100'
                      : 'bg-gray-100'
          }`}
        >
          <Icon
            name={getCategoryIcon(badge.category) as any}
            iconStyle='solid'
            size={32}
            color={getCategoryColor(badge.category)}
          />
        </View>
        <Text className='text-2xl font-bold text-gray-800 text-center mb-2'>{badge.title}</Text>
        <View className='flex-row items-center'>
          <Text className='text-gray-500 mr-2'>{formatCategory(badge.category)}</Text>
          <Text className='text-gray-400'>•</Text>
          <Text className='text-gray-500 ml-2'>{formatDifficulty(badge.difficulty)}</Text>
        </View>
      </View>

      <View className='mb-6'>
        <Text className='text-lg font-semibold text-gray-800 mb-2'>Description</Text>
        <Text className='text-gray-600 leading-6'>{badge.description}</Text>
      </View>

      <View className='mb-6'>
        <Text className='text-lg font-semibold text-gray-800 mb-2'>How to Achieve</Text>
        <Text className='text-gray-600 leading-6'>{badge.instruction}</Text>
      </View>

      {(badge.minAge || badge.maxAge) && (
        <View className='mb-6'>
          <Text className='text-lg font-semibold text-gray-800 mb-2'>Age Range</Text>
          <Text className='text-gray-600'>
            {badge.minAge && badge.maxAge
              ? `${badge.minAge} - ${badge.maxAge} months`
              : badge.minAge
                ? `${badge.minAge}+ months`
                : `Up to ${badge.maxAge} months`}
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={onAward} className='bg-blue-500 py-4 rounded-xl items-center mt-auto'>
        <Text className='text-white text-lg font-semibold'>Award This Badge</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BadgesScreen;
