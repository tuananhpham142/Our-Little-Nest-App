// src/screens/Badge/BabyBadgeDetailScreen/index.tsx

import AppLayout from '@/components/layout/AppLayout';
import { getVerificationStatusInfo } from '@/models/BabyBadgesCollection/BabyBadgesCollectionEnum';
import { getBadgeCategoryInfo } from '@/models/Badge/BadgeEnum';
import { useAppSelector } from '@/store/store';
import { RootStackNavigationProp, RouteProps } from '@/types/navigation';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const BabyBadgeDetailScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProps<'BabyBadgeDetail'>>();
  const { collectionId, babyId } = route.params;

  const { babyBadges } = useAppSelector((state) => state.babyBadges);
  const { badges } = useAppSelector((state) => state.badges);

  // Find the collection and badge
  const collection = babyBadges.find((b) => b.id === collectionId);
  const badge = collection ? badges.find((b) => b.id === collection.badgeId) : undefined;

  if (!collection) {
    return (
      <AppLayout>
        <View className='flex-1 items-center justify-center px-8'>
          <Icon iconStyle='solid' name='triangle-exclamation' size={48} color='#EF4444' />
          <Text className='text-xl font-bold text-gray-900 mt-4 mb-2'>Badge Not Found</Text>
          <Text className='text-base text-gray-600 text-center mb-6'>This badge collection could not be found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className='bg-amber-500 px-6 py-3 rounded-full'>
            <Text className='text-white font-semibold'>Go Back</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    );
  }

  const statusInfo = getVerificationStatusInfo(collection.verificationStatus);
  const categoryInfo = badge ? getBadgeCategoryInfo(badge.category) : null;

  // Format date
  const completedDate = new Date(collection.completedAt);
  const formattedDate = completedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const { width } = Dimensions.get('window');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppLayout>
        <ScrollView className='flex-1 bg-white'>
          {/* Hero Section */}
          <View className='px-6 pt-12 pb-8' style={{ backgroundColor: `${statusInfo.color}10` }}>
            {/* Badge Icon with Status */}
            <View className='items-center mb-6'>
              <View className='relative'>
                <View
                  className='w-32 h-32 rounded-3xl items-center justify-center shadow-lg'
                  style={{
                    backgroundColor: `${statusInfo.color}30`,
                    shadowColor: statusInfo.color,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 10,
                  }}
                >
                  {categoryInfo ? (
                    <Icon iconStyle='solid' name={categoryInfo.icon as any} size={80} color={statusInfo.color} />
                  ) : (
                    <Icon iconStyle='solid' name='trophy' size={80} color={statusInfo.color} />
                  )}
                </View>

                {/* Verification Status Badge */}
                <View
                  className='absolute -top-2 -right-2 w-12 h-12 rounded-full items-center justify-center'
                  style={{
                    backgroundColor: statusInfo.color,
                    shadowColor: statusInfo.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Icon iconStyle='solid' name={statusInfo.icon as any} size={24} color='#FFFFFF' />
                </View>
              </View>
            </View>

            {/* Title */}
            <Text className='text-3xl font-bold text-gray-900 text-center mb-2'>{badge?.title || 'Badge Earned'}</Text>

            {/* Status Badge */}
            <View className='items-center mb-4'>
              <View className='px-6 py-2 rounded-full' style={{ backgroundColor: `${statusInfo.color}20` }}>
                <Text className='text-sm font-semibold' style={{ color: statusInfo.color }}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            {/* Completion Date */}
            <View className='flex-row items-center justify-center'>
              <Icon iconStyle='solid' name='calendar' size={16} color='#6B7280' />
              <Text className='ml-2 text-base text-gray-600'>Completed on {formattedDate}</Text>
            </View>
          </View>

          {/* Content */}
          <View className='px-6 py-6'>
            {/* Badge Description */}
            {badge?.description && (
              <View className='mb-8'>
                <View className='flex-row items-center mb-3'>
                  <View
                    className='w-10 h-10 rounded-full items-center justify-center mr-3'
                    style={{
                      backgroundColor: categoryInfo ? `${categoryInfo.color}15` : '#F3F4F6',
                    }}
                  >
                    <Icon iconStyle='solid' name='circle-info' size={20} color={categoryInfo?.color || '#6B7280'} />
                  </View>
                  <Text className='text-xl font-bold text-gray-900'>About This Badge</Text>
                </View>
                <Text className='text-base text-gray-700 leading-6'>{badge.description}</Text>
              </View>
            )}

            {/* Submission Note */}
            {collection.submissionNote && (
              <View className='mb-8'>
                <View className='flex-row items-center mb-3'>
                  <View className='w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3'>
                    <Icon iconStyle='solid' name='note-sticky' size={20} color='#A855F7' />
                  </View>
                  <Text className='text-xl font-bold text-gray-900'>Parent's Note</Text>
                </View>
                <View className='bg-purple-50 rounded-2xl p-5'>
                  <Text className='text-base text-gray-800 leading-6 italic'>"{collection.submissionNote}"</Text>
                </View>
              </View>
            )}

            {/* Submission Media */}
            {collection.submissionMedia && collection.submissionMedia.length > 0 && (
              <View className='mb-8'>
                <View className='flex-row items-center mb-3'>
                  <View className='w-10 h-10 rounded-full bg-pink-100 items-center justify-center mr-3'>
                    <Icon iconStyle='solid' name='images' size={20} color='#EC4899' />
                  </View>
                  <Text className='text-xl font-bold text-gray-900'>Photos & Videos</Text>
                </View>
                <View className='flex-row flex-wrap -mx-1'>
                  {collection.submissionMedia.map((media, index) => (
                    <View key={index} className='w-1/2 p-1' style={{ width: (width - 56) / 2 }}>
                      <View className='rounded-2xl overflow-hidden'>
                        <Image
                          source={{ uri: media }}
                          style={{
                            width: '100%',
                            height: (width - 56) / 2,
                          }}
                          resizeMode='cover'
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Verification Details */}
            {collection.verifiedAt && collection.verifiedBy && (
              <View className='mb-8'>
                <View className='flex-row items-center mb-3'>
                  <View
                    className='w-10 h-10 rounded-full items-center justify-center mr-3'
                    style={{ backgroundColor: `${statusInfo.color}15` }}
                  >
                    <Icon iconStyle='solid' name='shield-halved' size={20} color={statusInfo.color} />
                  </View>
                  <Text className='text-xl font-bold text-gray-900'>Verification Details</Text>
                </View>
                <View className='rounded-2xl p-5' style={{ backgroundColor: `${statusInfo.color}10` }}>
                  <View className='flex-row items-center mb-2'>
                    <Icon iconStyle='solid' name='calendar-check' size={16} color={statusInfo.color} />
                    <Text className='ml-2 text-sm text-gray-700'>
                      Verified on{' '}
                      {new Date(collection.verifiedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View className='flex-row items-center'>
                    <Icon iconStyle='solid' name='user-check' size={16} color={statusInfo.color} />
                    <Text className='ml-2 text-sm text-gray-700'>Verified by: {collection.verifiedBy}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Achievement Celebration */}
            <View className='bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 mb-6'>
              <View className='items-center'>
                <View className='w-16 h-16 bg-amber-100 rounded-full items-center justify-center mb-4'>
                  <Icon iconStyle='solid' name='trophy' size={32} color='#F59E0B' />
                </View>
                <Text className='text-xl font-bold text-amber-900 mb-2 text-center'>Amazing Achievement!</Text>
                <Text className='text-base text-amber-800 text-center'>
                  This milestone is a wonderful part of your baby's journey. Keep celebrating these special moments
                  together!
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View className='px-6 py-4 border-t border-gray-200 bg-white'>
          <TouchableOpacity onPress={() => navigation.goBack()} className='bg-gray-100 py-4 rounded-full'>
            <Text className='text-center text-base font-semibold text-gray-700'>Back to Badges</Text>
          </TouchableOpacity>
        </View>
      </AppLayout>
    </GestureHandlerRootView>
  );
};

export default BabyBadgeDetailScreen;
