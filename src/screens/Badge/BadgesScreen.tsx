// src/screens/Badge/BadgesScreen.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppLayout from '@/components/layout/AppLayout';
import { useBadges } from '@/hooks/useBadge';
import { BadgeCategory } from '@/models/Badge/BadgeEnum';
import { Badge, BadgeFilters } from '@/models/Badge/BadgeModel';
import { BADGE_CONSTANTS, debounce, formatCategory, getCategoryColor } from '@/utils/badgeUtils';
import { BadgeCard } from './components/SharedBadgeComponents';

interface Props {
  navigation: any;
}

const BadgesScreen: React.FC<Props> = ({ navigation }) => {
  const {
    badges,
    isLoading,
    isLoadingMore,
    error,
    pagination,
    filters,
    loadBadges,
    loadMoreBadges,
    setFilters,
    clearFilters,
    refreshBadges,
  } = useBadges();

  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    if (badges.length === 0 && !isLoading) {
      loadBadges();
    }
  }, [badges.length, isLoading, loadBadges]);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setFilters({ search: query, page: 1 });
      }, BADGE_CONSTANTS.SEARCH_DEBOUNCE_MS),
    [setFilters],
  );

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
  }, [clearFilters]);

  // Handle refresh with proper state management
  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshBadges();
    } catch (error) {
      console.error('Error refreshing badges:', error);
      Alert.alert('Error', 'Failed to refresh badges. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshBadges]);

  // Handle load more with error handling
  const handleLoadMore = useCallback(() => {
    if (!pagination.hasNextPage || isLoadingMore || isLoading) return;

    loadMoreBadges()?.catch((error: any) => {
      console.error('Error loading more badges:', error);
      Alert.alert('Error', 'Failed to load more badges.');
    });
  }, [loadMoreBadges, pagination.hasNextPage, isLoadingMore, isLoading]);

  // Show badge details
  const handleBadgePress = useCallback(
    (badge: Badge) => {
      navigation.navigate('BadgeDetail', { badgeId: badge.id });
    },
    [navigation],
  );

  // Handle filter navigation
  const handleShowFilters = useCallback(() => {
    navigation.navigate('BadgeFilter', {
      currentFilters: filters,
      onApply: (newFilters: BadgeFilters) => {
        setFilters(newFilters);
      },
    });
  }, [navigation, filters, setFilters]);

  // Filter button animation
  const filterButtonStyle = useAnimatedStyle(() => {
    const hasFilters = Boolean(filters.category || filters.difficulty || filters.search);
    return {
      backgroundColor: withSpring(hasFilters ? '#3B82F6' : '#F3F4F6'),
      transform: [{ scale: withSpring(hasFilters ? 1.05 : 1) }],
    };
  });

  // Render category filter chips
  const renderCategoryChips = useCallback(() => {
    const categories = Object.values(BadgeCategory);

    return (
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerClassName='pb-2'
        renderItem={({ item: category }) => {
          const isSelected = filters.category === category;
          const categoryColor = getCategoryColor(category);

          return (
            <TouchableOpacity
              onPress={() => handleCategoryFilter(isSelected ? undefined : category)}
              className='px-4 py-2 rounded-full mr-2'
              style={{
                backgroundColor: isSelected ? categoryColor : categoryColor + '20',
              }}
              accessibilityRole='button'
              accessibilityLabel={`${isSelected ? 'Remove' : 'Apply'} ${formatCategory(category)} filter`}
            >
              <Text className='text-sm font-medium' style={{ color: isSelected ? 'white' : categoryColor }}>
                {formatCategory(category)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  }, [filters.category, handleCategoryFilter]);

  // Render badge card
  const renderBadgeCard = useCallback(
    ({ item, index }: { item: Badge; index: number }) => (
      <BadgeCard
        badge={item}
        onPress={() => handleBadgePress(item)}
        animationDelay={index * BADGE_CONSTANTS.ANIMATION.STAGGER_DELAY}
        showStatus={true}
        compact={false}
      />
    ),
    [handleBadgePress],
  );

  // Loading footer
  const renderLoadingFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View className='py-4 items-center'>
        <ActivityIndicator size='small' color={BADGE_CONSTANTS.COLORS.PRIMARY} />
        <Text className='text-gray-500 mt-2 text-sm'>Loading more badges...</Text>
      </View>
    );
  }, [isLoadingMore]);

  // Empty state
  const renderEmptyState = useCallback(() => {
    const hasFilters = Boolean(filters.search || filters.category || filters.difficulty);

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

  // Error state
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

  if (error && badges.length === 0) {
    return (
      <AppLayout>
        <SafeAreaView className='flex-1'>{renderErrorState()}</SafeAreaView>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <SafeAreaView className='flex-1'>
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
                returnKeyType='search'
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                  <Icon name='xmark' iconStyle='solid' size={14} color='#9CA3AF' />
                </TouchableOpacity>
              )}
            </View>

            <Animated.View style={filterButtonStyle}>
              <TouchableOpacity
                onPress={handleShowFilters}
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
          {renderCategoryChips()}
        </View>

        {/* Content */}
        {isLoading && badges.length === 0 ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color='#3B82F6' />
            <Text className='text-gray-500 mt-4'>Loading badges...</Text>
          </View>
        ) : badges.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={badges}
            renderItem={renderBadgeCard}
            keyExtractor={(item) => item.id}
            contentContainerClassName='pt-4 pb-20 px-2'
            numColumns={1}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#3B82F6']}
                tintColor='#3B82F6'
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            onScrollBeginDrag={handleScrollBegin}
            ListFooterComponent={renderLoadingFooter}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            windowSize={10}
            getItemLayout={undefined} // Let FlatList calculate automatically for variable heights
          />
        )}
      </SafeAreaView>
    </AppLayout>
  );
};

export default BadgesScreen;
