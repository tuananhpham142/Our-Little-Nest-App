// src/screens/Badge/BabyBadgesScreen/index.tsx

import AppLayout from '@/components/layout/AppLayout';
import { BabyBadgesCollection } from '@/models/BabyBadgesCollection/BabyBadgesCollectionModel';
import { Badge } from '@/models/Badge/BadgeModel';
import { fetchBabyBadges } from '@/store/slices/babyBadgesCollectionSlice';
import { searchBadges } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { RootStackNavigationProp, RouteProps } from '@/types/navigation';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AwardBadgeBottomSheet from './components/AwardBadge';
import BabyBadgeCard from './components/BabyBadgeCard';

const BabyBadgesScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProps<'BabyBadges'>>();
  const { babyId, babyName, babyAvatar } = route.params;
  const dispatch = useAppDispatch();

  const { babyBadges, isLoading, error } = useAppSelector((state) => state.babyBadges);
  const { badges: allBadges } = useAppSelector((state) => state.badges);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'earned' | 'available'>('earned');
  const awardBottomSheetRef = useRef<BottomSheet>(null);

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
    (collection: BabyBadgesCollection) => {
      navigation.navigate('BabyBadgeDetail', {
        collectionId: collection.id,
        babyId,
      });
    },
    [navigation, babyId],
  );

  const handleAvailableBadgePress = useCallback(
    (badge: Badge) => {
      navigation.navigate('BadgeDetail', {
        badgeId: badge.id,
        babyId,
      });
    },
    [navigation, babyId],
  );

  // Filter available badges (not yet earned)
  const earnedBadgeIds = babyBadges.map((collection) => collection.badgeId);
  const availableBadges = allBadges.filter((badge) => !earnedBadgeIds.includes(badge.id));

  const renderHeader = () => (
    <View className='bg-gradient-to-br from-amber-100 to-orange-100 px-4 pb-6'>
      {/* Baby Info Card */}
      <View className='bg-white rounded-3xl p-5 shadow-lg mb-4'>
        <View className='flex-row items-center mb-4'>
          <View className='w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 items-center justify-center mr-4'>
            {babyAvatar ? (
              <Image source={{ uri: babyAvatar }} className='w-full h-full rounded-full' />
            ) : (
              <Icon iconStyle='solid' name='baby' size={32} color='#EC4899' />
            )}
          </View>
          <View className='flex-1'>
            <Text className='text-2xl font-bold text-gray-900 mb-1'>{babyName || 'Baby'}'s Badges</Text>
            <View className='flex-row items-center'>
              <Icon iconStyle='solid' name='trophy' size={14} color='#F59E0B' />
              <Text className='ml-2 text-sm font-semibold text-amber-600'>{babyBadges.length} badges earned</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className='flex-row justify-around pt-4 border-t border-gray-100'>
          <View className='items-center'>
            <Text className='text-2xl font-bold text-amber-600'>{babyBadges.length}</Text>
            <Text className='text-xs text-gray-600 mt-1'>Earned</Text>
          </View>
          <View className='w-px bg-gray-200' />
          <View className='items-center'>
            <Text className='text-2xl font-bold text-blue-600'>{availableBadges.length}</Text>
            <Text className='text-xs text-gray-600 mt-1'>Available</Text>
          </View>
          <View className='w-px bg-gray-200' />
          <View className='items-center'>
            <Text className='text-2xl font-bold text-green-600'>
              {Math.round((babyBadges.length / (babyBadges.length + availableBadges.length)) * 100)}%
            </Text>
            <Text className='text-xs text-gray-600 mt-1'>Progress</Text>
          </View>
        </View>
      </View>

      {/* Tab Switcher */}
      <View className='flex-row bg-white rounded-full p-1 shadow-sm'>
        <TouchableOpacity
          onPress={() => setSelectedTab('earned')}
          className={`flex-1 py-3 rounded-full ${selectedTab === 'earned' ? 'bg-amber-500' : 'bg-transparent'}`}
        >
          <Text className={`text-center font-semibold ${selectedTab === 'earned' ? 'text-white' : 'text-gray-600'}`}>
            Earned ({babyBadges.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('available')}
          className={`flex-1 py-3 rounded-full ${selectedTab === 'available' ? 'bg-amber-500' : 'bg-transparent'}`}
        >
          <Text className={`text-center font-semibold ${selectedTab === 'available' ? 'text-white' : 'text-gray-600'}`}>
            Available ({availableBadges.length})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEarnedBadge = useCallback(
    ({ item }: { item: BabyBadgesCollection }) => (
      <BabyBadgeCard collection={item} onPress={() => handleBadgePress(item)} />
    ),
    [handleBadgePress],
  );

  const renderAvailableBadge = useCallback(
    ({ item }: { item: Badge }) => (
      <TouchableOpacity
        onPress={() => handleAvailableBadgePress(item)}
        className='bg-white rounded-2xl p-4 mb-3 mx-4 shadow-sm flex-row items-center'
      >
        <View className='w-16 h-16 rounded-full bg-gray-100 items-center justify-center mr-4'>
          {item.iconUrl ? (
            <Image source={{ uri: item.iconUrl }} className='w-12 h-12' />
          ) : (
            <Icon iconStyle='solid' name='trophy' size={28} color='#9CA3AF' />
          )}
        </View>
        <View className='flex-1'>
          <Text className='text-base font-semibold text-gray-900 mb-1'>{item.title}</Text>
          <Text className='text-sm text-gray-600' numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Icon iconStyle='solid' name='chevron-right' size={16} color='#9CA3AF' />
      </TouchableOpacity>
    ),
    [handleAvailableBadgePress],
  );

  const renderEmpty = () => (
    <View className='flex-1 items-center justify-center py-20 px-8'>
      <View className='w-24 h-24 bg-amber-100 rounded-full items-center justify-center mb-4'>
        <Icon
          iconStyle='solid'
          name={selectedTab === 'earned' ? 'trophy' : ('sparkles' as any)}
          size={40}
          color='#F59E0B'
        />
      </View>
      <Text className='text-xl font-bold text-gray-900 mb-2 text-center'>
        {selectedTab === 'earned' ? 'No badges earned yet' : 'All badges earned!'}
      </Text>
      <Text className='text-base text-gray-600 text-center mb-6'>
        {selectedTab === 'earned'
          ? 'Start earning badges by completing milestones and activities'
          : 'Amazing! Your baby has earned all available badges!'}
      </Text>
      {selectedTab === 'earned' && (
        <TouchableOpacity
          onPress={() => awardBottomSheetRef.current?.snapToIndex(0)}
          className='bg-amber-500 px-6 py-3 rounded-full'
        >
          <Text className='text-white font-semibold'>Award First Badge</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
        <View className='flex-1 bg-white'>
          <FlashList
            //@ts-ignore
            data={selectedTab === 'earned' ? babyBadges : availableBadges}
            //@ts-ignore
            renderItem={selectedTab === 'earned' ? renderEarnedBadge : renderAvailableBadge}
            keyExtractor={(item) => item.id}
            estimatedItemSize={120}
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
            contentContainerStyle={{ paddingBottom: 80 }}
          />

          {/* Floating Action Button */}
          <TouchableOpacity
            onPress={() => awardBottomSheetRef.current?.snapToIndex(0)}
            className='absolute bottom-6 right-6 w-16 h-16 bg-amber-500 rounded-full items-center justify-center shadow-lg'
            style={{
              shadowColor: '#F59E0B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Icon iconStyle='solid' name='plus' size={24} color='#FFFFFF' />
          </TouchableOpacity>

          {/* Award Badge Bottom Sheet */}
          <AwardBadgeBottomSheet ref={awardBottomSheetRef} babyId={babyId} onSuccess={handleRefresh} />
        </View>
      </AppLayout>
    </GestureHandlerRootView>
  );
};

export default BabyBadgesScreen;
