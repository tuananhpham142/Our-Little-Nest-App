// src/screens/Badge/components/BabyBadgeCard.tsx

import { getVerificationStatusInfo } from '@/models/BabyBadgesCollection/BabyBadgesCollectionEnum';
import { BabyBadgesCollection } from '@/models/BabyBadgesCollection/BabyBadgesCollectionModel';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface BabyBadgeCardProps {
  collection: BabyBadgesCollection;
  onPress: () => void;
}

const BabyBadgeCard: React.FC<BabyBadgeCardProps> = ({ collection, onPress }) => {
  const statusInfo = getVerificationStatusInfo(collection.verificationStatus);

  // Format date
  const completedDate = new Date(collection.completedAt);
  const formattedDate = completedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      className='bg-white rounded-3xl p-5 mx-4 mb-4 shadow-md'
      style={{
        shadowColor: statusInfo.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
      }}
    >
      <View className='flex-row items-start'>
        {/* Badge Icon with Glow */}
        <View className='relative mr-4'>
          <View
            className='w-20 h-20 rounded-2xl items-center justify-center'
            style={{
              backgroundColor: `${statusInfo.color}20`,
            }}
          >
            <Icon iconStyle='solid' name='trophy' size={36} color={statusInfo.color} />
          </View>

          {/* Verification Status Badge */}
          <View
            className='absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center'
            style={{
              backgroundColor: statusInfo.color,
              shadowColor: statusInfo.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Icon iconStyle='solid' name={statusInfo.icon as any} size={14} color='#FFFFFF' />
          </View>
        </View>

        {/* Badge Info */}
        <View className='flex-1'>
          {/* Title */}
          <Text className='text-lg font-bold text-gray-900 mb-1'>Badge Earned!</Text>

          {/* Date */}
          <View className='flex-row items-center mb-2'>
            <Icon name='calendar' size={12} color='#9CA3AF' />
            <Text className='ml-2 text-sm text-gray-600'>{formattedDate}</Text>
          </View>

          {/* Submission Note */}
          {collection.submissionNote && (
            <Text className='text-sm text-gray-700 mb-3' numberOfLines={2}>
              "{collection.submissionNote}"
            </Text>
          )}

          {/* Metadata Row */}
          <View className='flex-row items-center flex-wrap'>
            {/* Status */}
            <View
              className='flex-row items-center px-3 py-1 rounded-full mr-2 mb-2'
              style={{ backgroundColor: `${statusInfo.color}15` }}
            >
              <Icon name={statusInfo.icon as any} size={10} color={statusInfo.color} />
              <Text className='ml-1 text-xs font-semibold' style={{ color: statusInfo.color }}>
                {statusInfo.label}
              </Text>
            </View>

            {/* Media Count */}
            {collection.submissionMedia && collection.submissionMedia.length > 0 && (
              <View className='flex-row items-center px-3 py-1 rounded-full bg-purple-50 mr-2 mb-2'>
                <Icon name='images' size={10} color='#A855F7' />
                <Text className='ml-1 text-xs font-semibold text-purple-600'>
                  {collection.submissionMedia.length} {collection.submissionMedia.length === 1 ? 'photo' : 'photos'}
                </Text>
              </View>
            )}

            {/* View Details */}
            <View className='flex-row items-center px-3 py-1 rounded-full bg-amber-50 mb-2'>
              <Text className='text-xs font-semibold text-amber-600'>View Details</Text>
              <Icon iconStyle='solid' name='chevron-right' size={10} color='#F59E0B' style={{ marginLeft: 4 }} />
            </View>
          </View>
        </View>
      </View>

      {/* Media Preview */}
      {collection.submissionMedia && collection.submissionMedia.length > 0 && (
        <View className='flex-row mt-4 pt-4 border-t border-gray-100'>
          {collection.submissionMedia.slice(0, 4).map((media, index) => (
            <View key={index} className='w-16 h-16 rounded-xl mr-2 overflow-hidden'>
              <Image source={{ uri: media }} className='w-full h-full' resizeMode='cover' />
            </View>
          ))}
          {collection.submissionMedia.length > 4 && (
            <View className='w-16 h-16 rounded-xl bg-gray-100 items-center justify-center'>
              <Text className='text-sm font-bold text-gray-600'>+{collection.submissionMedia.length - 4}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BabyBadgeCard;
