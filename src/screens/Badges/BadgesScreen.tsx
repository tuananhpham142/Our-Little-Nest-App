// src/screens/Badge/BadgesScreen/index.tsx

import AppLayout from '@/components/layout/AppLayout';
import { BadgeCategory } from '@/models/Badge/BadgeEnum';
import { Badge } from '@/models/Badge/BadgeModel';
import { searchBadges, updateFilters } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { RootStackNavigationProp, RouteProps } from '@/types/navigation';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import BadgeCard from './components/BadgeCard';
import BadgeFilterBottomSheet from './components/BadgeFilter';

const BadgesScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProps<'Badges'>>();
  const dispatch = useAppDispatch();

  const { badges, isLoading, error, pagination, filters } = useAppSelector((state) => state.badges);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const filterBottomSheetRef = useRef<BottomSheet>(null);

  const babyId = route.params?.babyId;

  // Initial fetch
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(() => {
    dispatch(
      searchBadges({
        ...filters,
        search: searchText,
        page: 1,
      }),
    );
  }, [dispatch, filters, searchText]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(
      searchBadges({
        ...filters,
        search: searchText,
        page: 1,
      }),
    ).finally(() => setRefreshing(false));
  }, [dispatch, filters, searchText]);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasNextPage && !isLoading) {
      dispatch(
        searchBadges({
          ...filters,
          page: pagination.page + 1,
        }),
      );
    }
  }, [dispatch, filters, isLoading, pagination]);

  const handleBadgePress = useCallback(
    (badge: Badge) => {
      navigation.navigate('BadgeDetail', {
        badgeId: badge.id,
        babyId,
      });
    },
    [navigation, babyId],
  );

  const handleCategoryFilter = useCallback(
    (category: BadgeCategory | 'all') => {
      dispatch(
        updateFilters({
          category: category === 'all' ? undefined : category,
          page: 1,
        }),
      );
      handleSearch();
    },
    [dispatch, handleSearch],
  );

  const renderBadgeItem = useCallback(
    ({ item }: { item: Badge }) => <BadgeCard badge={item} onPress={() => handleBadgePress(item)} />,
    [handleBadgePress],
  );

  const renderHeader = () => (
    <View className='pb-4'>
      {/* Filter Button */}
      <View className='flex-row justify-between items-center mb-3'>
        <Text className='text-xl font-bold text-gray-900'>Discover Badges</Text>
        <TouchableOpacity
          onPress={() => filterBottomSheetRef.current?.snapToIndex(0)}
          className='flex-row items-center bg-white px-4 py-2 rounded-full shadow-sm'
        >
          <Icon iconStyle='solid' name='sliders' size={16} color='#F59E0B' />
          <Text className='ml-2 text-sm font-semibold text-amber-600'>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className='flex-row items-center'>
        <Icon iconStyle='solid' name='trophy' size={16} color='#F59E0B' />
        <Text className='ml-2 text-sm text-gray-600'>{pagination.total} badges available</Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className='flex-1 items-center justify-center py-20'>
      <View className='w-24 h-24 bg-amber-100 rounded-full items-center justify-center mb-4'>
        <Icon iconStyle='solid' name='trophy' size={40} color='#F59E0B' />
      </View>
      <Text className='text-xl font-bold text-gray-900 mb-2'>No badges found</Text>
      <Text className='text-base text-gray-600 text-center px-8'>Try adjusting your search or filters</Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || badges.length === 0) return null;

    return (
      <View className='py-4'>
        <ActivityIndicator size='small' color='#F59E0B' />
      </View>
    );
  };

  if (error && badges.length === 0) {
    return (
      <AppLayout>
        <View className='flex-1 items-center justify-center px-8'>
          <View className='w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-4'>
            <Icon iconStyle='solid' name='triangle-exclamation' size={40} color='#EF4444' />
          </View>
          <Text className='text-xl font-bold text-gray-900 mb-2'>Oops! Something went wrong</Text>
          <Text className='text-base text-gray-600 text-center mb-6'>{error}</Text>
          <TouchableOpacity onPress={handleRefresh} className='bg-amber-500 px-6 py-3 rounded-full'>
            <Text className='text-white font-semibold'>Try Again</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <View className='flex-1 px-4'>
        <FlashList
          data={badges}
          masonry
          renderItem={renderBadgeItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!isLoading ? renderEmpty : null}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#F59E0B']}
              tintColor='#F59E0B'
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        {/* Filter Bottom Sheet */}
        <BadgeFilterBottomSheet ref={filterBottomSheetRef} onApply={handleSearch} />
      </View>
    </AppLayout>
  );
};

export default BadgesScreen;
