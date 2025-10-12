import { FlashList } from '@shopify/flash-list'; // src/screens/Badge/BabyBadgesScreen/index.tsx

import AppLayout from '@/components/layout/AppLayout';
import { Badge } from '@/models/Badge/BadgeModel';
import { fetchBabyBadges } from '@/store/slices/babyBadgesCollectionSlice';
import { searchBadges } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { RootStackNavigationProp, RouteProps } from '@/types/navigation';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BadgeCard from './components/BadgeCard';

const BabyBadgesScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProps<'BabyBadges'>>();
  const { babyId, babyName, babyAvatar } = route.params;
  const dispatch = useAppDispatch();

  const { babyBadges, isLoading, error } = useAppSelector((state) => state.babyBadges);
  const { badges: allBadges } = useAppSelector((state) => state.badges);

  const [refreshing, setRefreshing] = useState(false);
  const awardBottomSheetRef = useRef<BottomSheet>(null);

  const { width } = Dimensions.get('window');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [babyId]);

  const loadData = useCallback(() => {
    dispatch(fetchBabyBadges(babyId));
    dispatch(searchBadges({ isActive: true, limit: 100 }));
  }, [dispatch, babyId]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 500);
  }, [loadData]);

  const handleBadgePress = useCallback(
    (badge: Badge, isEarned: boolean) => {
      if (isEarned) {
        const collection = babyBadges.find((c) => c.badgeId === badge.id);
        if (collection) {
          navigation.navigate('BabyBadgeDetail', {
            collectionId: collection.id,
            babyId,
          });
        }
      } else {
        navigation.navigate('BadgeDetail', {
          badgeId: badge.id,
          babyId,
        });
      }
    },
    [navigation, babyId, babyBadges],
  );

  const renderBadgeItem = useCallback(
    ({ item }: { item: Badge & { isEarned: boolean } }) => (
      <BadgeCard badge={item} isEarned={item.isEarned} onPress={() => handleBadgePress(item, item.isEarned)} />
    ),
    [handleBadgePress],
  );

  const renderEmpty = () => (
    <View className='py-20 items-center'>
      <Icon iconStyle='solid' name='trophy' size={48} color='#D1D5DB' />
      <Text className='text-lg font-semibold text-gray-500 mt-4'>No badges available</Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Character Display Area */}
      <View
        className='items-center justify-center py-8'
        style={{
          backgroundColor: '#FFE4B5',
          minHeight: 280,
        }}
      >
        {/* Baby Avatar/Character */}
        <View className='items-center mb-4'>
          <View className='w-40 h-40 rounded-full bg-white items-center justify-center shadow-lg mb-4'>
            {babyAvatar ? (
              <Image source={{ uri: babyAvatar }} className='w-full h-full rounded-full' />
            ) : (
              <Icon iconStyle='solid' name='baby' size={80} color='#F59E0B' />
            )}
          </View>
          <Text className='text-2xl font-bold' style={{ color: '#78350F' }}>
            {babyName || 'Baby'}'s Collection
          </Text>
        </View>

        {/* Progress Stats */}
        <View className='flex-row items-center bg-white rounded-full px-6 py-3 shadow-md'>
          <Icon iconStyle='solid' name='trophy' size={20} color='#F59E0B' />
          <Text className='ml-2 text-lg font-bold' style={{ color: '#78350F' }}>
            {earnedBadgeIds.length} / {allBadges.length} Badges
          </Text>
        </View>
      </View>

      {/* Category Tabs */}
      <View className='px-4 pt-6 pb-4'>
        <View className='flex-1 bg-amber-400 rounded-full py-4'>
          <Text className='text-center text-white font-semibold'>All Badges</Text>
        </View>
      </View>
    </>
  );

  // Get earned badge IDs
  const earnedBadgeIds = babyBadges.map((collection) => collection.badgeId);

  // Merge all badges with earned status
  const allBadgesWithStatus = allBadges.map((badge) => ({
    ...badge,
    isEarned: earnedBadgeIds.includes(badge.id),
  }));

  if (error && babyBadges.length === 0) {
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppLayout>
        <View className='flex-1' style={{ backgroundColor: '#FFF8DC' }}>
          <FlashList
            data={allBadgesWithStatus}
            renderItem={renderBadgeItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            masonry
            showsVerticalScrollIndicator={false}
            // estimatedItemSize={90}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={!isLoading ? renderEmpty : null}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#F59E0B']}
                tintColor='#F59E0B'
              />
            }
            contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
          />

          {/* Floating Action Button */}
          {/* <View className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent pt-8 pb-6 px-6'>
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
              <Icon iconStyle='solid' name='plus' size={20} color='#FFFFFF' />
              <Text className='ml-2 text-base font-bold text-white'>Award New Badge</Text>
            </TouchableOpacity>
          </View> */}

          {/* Award Badge Bottom Sheet */}
          {/* <AwardBadgeBottomSheet
            ref={awardBottomSheetRef}
            onSuccess={handleRefresh}
            visible={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
          /> */}
        </View>
      </AppLayout>
    </GestureHandlerRootView>
  );
};

export default BabyBadgesScreen;
