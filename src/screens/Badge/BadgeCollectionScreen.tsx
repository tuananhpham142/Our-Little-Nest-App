// src/screens/Badge/BadgeCollectionScreen.tsx
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBabyBadges, useBadgeCollectionTabs } from '@/hooks/useBadgeCollection';
import { BadgeCollection } from '@/models/BadgeCollection/BadgeCollectionModel';
import {
  formatCompletionDate,
  formatVerificationStatus,
  getVerificationStatusColor,
} from '@/models/BadgeCollection/BadgeCollectionUIForm';

const { width } = Dimensions.get('window');

interface Props {
  navigation: any;
  route: {
    params: {
      babyId: string;
      babyName?: string;
    };
  };
}

const BadgeCollectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { babyId, babyName } = route.params;

  const { badges, statistics, progress, isLoading, error, refresh, loadBadges } = useBabyBadges(babyId);

  const { activeTab, setTab, filteredCollections, tabCounts } = useBadgeCollectionTabs();

  const [selectedCollection, setSelectedCollection] = useState<BadgeCollection | null>(null);
  const [detailSheetRef, setDetailSheetRef] = useState<BottomSheetModal | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(200);

  // Tab animation
  const tabIndicatorPosition = useSharedValue(0);

  const tabs = [
    { key: 'all', title: 'All', count: tabCounts.all },
    { key: 'approved', title: 'Approved', count: tabCounts.approved },
    { key: 'pending', title: 'Pending', count: tabCounts.pending },
    { key: 'rejected', title: 'Rejected', count: tabCounts.rejected },
  ];

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!progress) return 0;
    return Math.round((progress.statistics.approvedBadges / Math.max(progress.totalCollections, 1)) * 100);
  }, [progress]);

  // Group badges by month for timeline view
  const timelineData = useMemo(() => {
    if (!badges.length) return [];

    const grouped: Record<string, BadgeCollection[]> = {};
    badges.forEach((badge) => {
      const monthKey = new Date(badge.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(badge);
    });

    return Object.entries(grouped)
      .map(([month, collections]) => ({
        month,
        collections: collections.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()),
        count: collections.length,
      }))
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
  }, [badges]);

  // Animated header style
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const opacity = withTiming(scrollY.value > 100 ? 0.9 : 1);
    const translateY = withTiming(scrollY.value > 100 ? -20 : 0);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Progress circle animation
  const progressStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(`${(progressPercentage / 100) * 360}deg`, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
    };
  });

  // Handle tab change
  const handleTabChange = useCallback(
    (tabKey: string, index: number) => {
      setTab(tabKey as any);
      tabIndicatorPosition.value = withSpring(index * (width / tabs.length));
    },
    [setTab, tabIndicatorPosition, tabs.length],
  );

  // Show collection details
  const showCollectionDetails = useCallback(
    (collection: BadgeCollection) => {
      setSelectedCollection(collection);
      detailSheetRef?.present();
    },
    [detailSheetRef],
  );

  // Render statistics cards
  const renderStatsCard = (title: string, value: number | string, icon: string, color: string) => (
    <Animated.View
      entering={FadeInUp.delay(200)}
      className={`flex-1 bg-white rounded-xl p-4 mx-1 shadow-sm border border-gray-100`}
    >
      <View className='flex-row items-center justify-between'>
        <View>
          <Text className='text-2xl font-bold text-gray-800'>{value}</Text>
          <Text className='text-sm text-gray-500 mt-1'>{title}</Text>
        </View>
        <View className={`w-10 h-10 rounded-full items-center justify-center bg-${color}-100`}>
          <Icon
            name={icon as any}
            iconStyle='solid'
            size={16}
            color={`#${color === 'blue' ? '3B82F6' : color === 'green' ? '10B981' : color === 'yellow' ? 'F59E0B' : 'EF4444'}`}
          />
        </View>
      </View>
    </Animated.View>
  );

  // Render badge collection item
  const renderBadgeItem = ({ item, index }: { item: BadgeCollection; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)} className='mb-3 mx-4'>
      <TouchableOpacity
        onPress={() => showCollectionDetails(item)}
        className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'
        activeOpacity={0.8}
      >
        <View className='flex-row items-start'>
          {/* Badge Icon */}
          <View className='w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4'>
            <Icon name='medal' iconStyle='solid' size={20} color='#3B82F6' />
          </View>

          {/* Content */}
          <View className='flex-1'>
            <View className='flex-row items-start justify-between mb-2'>
              <Text className='text-lg font-semibold text-gray-800 flex-1' numberOfLines={1}>
                {item.badge?.title || 'Badge Title'}
              </Text>
              <View
                className={`px-2 py-1 rounded-full ml-2`}
                style={{ backgroundColor: getVerificationStatusColor(item.verificationStatus) + '20' }}
              >
                <Text
                  className='text-xs font-medium'
                  style={{ color: getVerificationStatusColor(item.verificationStatus) }}
                >
                  {formatVerificationStatus(item.verificationStatus)}
                </Text>
              </View>
            </View>

            <Text className='text-gray-600 mb-2' numberOfLines={2}>
              {item.badge?.description || 'Badge description'}
            </Text>

            <View className='flex-row items-center justify-between'>
              <Text className='text-sm text-gray-500'>Completed {formatCompletionDate(item.completedAt)}</Text>

              {item.submissionMedia && item.submissionMedia.length > 0 && (
                <View className='flex-row items-center'>
                  <Icon name='image' iconStyle='solid' size={12} color='#9CA3AF' />
                  <Text className='text-xs text-gray-500 ml-1'>{item.submissionMedia.length} media</Text>
                </View>
              )}
            </View>

            {item.submissionNote && (
              <View className='mt-3 bg-gray-50 p-3 rounded-lg'>
                <Text className='text-sm text-gray-600' numberOfLines={2}>
                  "{item.submissionNote}"
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  // Render timeline item
  const renderTimelineItem = ({ item }: { item: (typeof timelineData)[0] }) => (
    <View className='mb-6'>
      <View className='flex-row items-center mb-4 px-4'>
        <View className='w-4 h-4 rounded-full bg-blue-500 mr-3' />
        <Text className='text-lg font-semibold text-gray-800'>{item.month}</Text>
        <Text className='text-sm text-gray-500 ml-2'>({item.count} badges)</Text>
      </View>

      {item.collections.map((collection, index) => (
        <View key={collection.id} className='relative'>
          {index < item.collections.length - 1 && <View className='absolute left-6 top-16 w-0.5 h-20 bg-gray-200' />}
          <TouchableOpacity
            onPress={() => showCollectionDetails(collection)}
            className='flex-row items-center mb-4 px-4'
            activeOpacity={0.8}
          >
            <View className='w-8 h-8 rounded-full bg-white border-2 border-blue-500 items-center justify-center mr-4'>
              <Icon name='medal' iconStyle='solid' size={12} color='#3B82F6' />
            </View>

            <View className='flex-1 bg-white rounded-xl p-3 shadow-sm'>
              <Text className='font-semibold text-gray-800' numberOfLines={1}>
                {collection.badge?.title}
              </Text>
              <Text className='text-sm text-gray-500 mt-1'>{formatCompletionDate(collection.completedAt)}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  // Empty state
  const renderEmptyState = () => (
    <View className='flex-1 items-center justify-center py-20'>
      <Icon name='trophy' iconStyle='solid' size={64} color='#D1D5DB' />
      <Text className='text-xl font-semibold text-gray-600 mt-4 mb-2'>No badges yet</Text>
      <Text className='text-gray-500 text-center px-8 mb-6'>
        {babyName || 'This baby'} hasn't earned any badges yet. Start by awarding their first achievement!
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('AwardBadge', { babyId })}
        className='bg-blue-500 px-6 py-3 rounded-full'
      >
        <Text className='text-white font-semibold'>Award First Badge</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header with Stats */}
      <Animated.View style={animatedHeaderStyle} className='bg-white shadow-sm'>
        <View className='px-4 py-4'>
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-1'>
              <Text className='text-2xl font-bold text-gray-800'>{babyName || 'Baby'}'s Collection</Text>
              <Text className='text-gray-500 mt-1'>Track achievements and milestones</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('AwardBadge', { babyId })}
              className='bg-blue-500 px-4 py-2 rounded-full flex-row items-center'
            >
              <Icon name='plus' iconStyle='solid' size={14} color='white' />
              <Text className='text-white font-medium ml-2'>Award</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Circle and Stats */}
          {statistics && (
            <View className='flex-row items-center mb-4'>
              <View className='relative mr-6'>
                <View className='w-16 h-16 rounded-full border-4 border-gray-200'>
                  <Animated.View
                    style={[
                      progressStyle,
                      {
                        position: 'absolute',
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        borderWidth: 4,
                        borderColor: '#3B82F6',
                        borderTopColor: 'transparent',
                        borderRightColor: 'transparent',
                      },
                    ]}
                  />
                </View>
                <View className='absolute inset-0 items-center justify-center'>
                  <Text className='text-lg font-bold text-gray-800'>{progressPercentage}%</Text>
                </View>
              </View>

              <View className='flex-1 flex-row'>
                {renderStatsCard('Total', statistics.totalBadges, 'trophy', 'blue')}
                {renderStatsCard('Approved', statistics.approvedBadges, 'check', 'green')}
                {renderStatsCard('Pending', statistics.pendingBadges, 'clock', 'yellow')}
              </View>
            </View>
          )}

          {/* View Mode Toggle */}
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row bg-gray-100 rounded-full p-1'>
              {[
                { key: 'list', title: 'List', icon: 'list' },
                { key: 'timeline', title: 'Timeline', icon: 'clock' },
              ].map((mode) => (
                <TouchableOpacity
                  key={mode.key}
                  onPress={() => setViewMode(mode.key as any)}
                  className={`px-4 py-2 rounded-full flex-row items-center ${
                    viewMode === mode.key ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <Icon
                    name={mode.icon as any}
                    iconStyle='solid'
                    size={14}
                    color={viewMode === mode.key ? '#3B82F6' : '#9CA3AF'}
                  />
                  <Text className={`ml-2 font-medium ${viewMode === mode.key ? 'text-blue-500' : 'text-gray-500'}`}>
                    {mode.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tab Navigation */}
          <View className='relative'>
            <View className='flex-row bg-gray-100 rounded-full p-1'>
              {tabs.map((tab, index) => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => handleTabChange(tab.key, index)}
                  className={`flex-1 py-2 px-3 rounded-full ${activeTab === tab.key ? 'bg-white shadow-sm' : ''}`}
                >
                  <View className='flex-row items-center justify-center'>
                    <Text className={`font-medium ${activeTab === tab.key ? 'text-blue-500' : 'text-gray-500'}`}>
                      {tab.title}
                    </Text>
                    {tab.count > 0 && (
                      <View
                        className={`ml-2 px-2 py-0.5 rounded-full ${
                          activeTab === tab.key ? 'bg-blue-100' : 'bg-gray-200'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            activeTab === tab.key ? 'text-blue-600' : 'text-gray-600'
                          }`}
                        >
                          {tab.count}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Content */}
      {isLoading && badges.length === 0 ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#3B82F6' />
          <Text className='text-gray-500 mt-4'>Loading badges...</Text>
        </View>
      ) : filteredCollections.length === 0 ? (
        renderEmptyState()
      ) : viewMode === 'timeline' ? (
        <FlatList
          data={timelineData}
          renderItem={renderTimelineItem}
          keyExtractor={(item) => item.month}
          contentContainerClassName='pt-4 pb-20'
          refreshControl={<RefreshControl refreshing={isLoading && badges.length > 0} onRefresh={refresh} />}
        />
      ) : (
        <FlatList
          data={filteredCollections}
          renderItem={renderBadgeItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName='pt-4 pb-20'
          refreshControl={<RefreshControl refreshing={isLoading && badges.length > 0} onRefresh={refresh} />}
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        />
      )}

      {/* Collection Detail Bottom Sheet */}
      <BottomSheetModal
        ref={setDetailSheetRef}
        index={1}
        snapPoints={['50%', '90%']}
        backdropComponent={({ style }) => <View style={[style, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />}
      >
        {selectedCollection && (
          <CollectionDetailSheet
            collection={selectedCollection}
            onClose={() => detailSheetRef?.close()}
            onEdit={() => {
              detailSheetRef?.close();
              navigation.navigate('EditBadgeCollection', {
                collectionId: selectedCollection.id,
              });
            }}
          />
        )}
      </BottomSheetModal>
    </SafeAreaView>
  );
};

// Collection Detail Sheet Component
const CollectionDetailSheet: React.FC<{
  collection: BadgeCollection;
  onClose: () => void;
  onEdit: () => void;
}> = ({ collection, onClose, onEdit }) => {
  return (
    <ScrollView className='flex-1 p-6'>
      <View className='flex-row items-center justify-between mb-6'>
        <Text className='text-xl font-bold text-gray-800'>Badge Achievement</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name='xmark' iconStyle='solid' size={20} color='#9CA3AF' />
        </TouchableOpacity>
      </View>

      {/* Badge Info */}
      <View className='items-center mb-6'>
        <View className='w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-4'>
          <Icon name='medal' iconStyle='solid' size={32} color='#3B82F6' />
        </View>
        <Text className='text-2xl font-bold text-gray-800 text-center mb-2'>
          {collection.badge?.title || 'Badge Title'}
        </Text>
        <View
          className='px-3 py-1 rounded-full mb-4'
          style={{ backgroundColor: getVerificationStatusColor(collection.verificationStatus) + '20' }}
        >
          <Text className='font-medium' style={{ color: getVerificationStatusColor(collection.verificationStatus) }}>
            {formatVerificationStatus(collection.verificationStatus)}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View className='space-y-4'>
        <View>
          <Text className='text-lg font-semibold text-gray-800 mb-2'>Description</Text>
          <Text className='text-gray-600 leading-6'>{collection.badge?.description || 'No description available'}</Text>
        </View>

        <View>
          <Text className='text-lg font-semibold text-gray-800 mb-2'>Completed On</Text>
          <Text className='text-gray-600'>
            {new Date(collection.completedAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {collection.submissionNote && (
          <View>
            <Text className='text-lg font-semibold text-gray-800 mb-2'>Note</Text>
            <View className='bg-gray-50 p-4 rounded-xl'>
              <Text className='text-gray-600 leading-6'>{collection.submissionNote}</Text>
            </View>
          </View>
        )}

        {collection.submissionMedia && collection.submissionMedia.length > 0 && (
          <View>
            <Text className='text-lg font-semibold text-gray-800 mb-2'>Media</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {collection.submissionMedia.map((mediaUrl, index) => (
                <View key={index} className='w-24 h-24 rounded-xl bg-gray-100 mr-3 items-center justify-center'>
                  <Icon name='image' iconStyle='solid' size={20} color='#9CA3AF' />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {collection.verifiedBy && collection.verifiedAt && (
          <View>
            <Text className='text-lg font-semibold text-gray-800 mb-2'>Verification</Text>
            <Text className='text-gray-600'>Verified on {new Date(collection.verifiedAt).toLocaleDateString()}</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className='flex-row space-x-3 mt-8'>
        <TouchableOpacity onPress={onEdit} className='flex-1 bg-gray-100 py-4 rounded-xl items-center'>
          <Text className='text-gray-700 font-semibold'>Edit Details</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-1 bg-blue-500 py-4 rounded-xl items-center'>
          <Text className='text-white font-semibold'>Share Achievement</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BadgeCollectionScreen;
