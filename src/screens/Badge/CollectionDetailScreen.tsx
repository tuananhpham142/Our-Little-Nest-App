// src/screens/Badge/CollectionDetailScreen.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBadgeCollectionDetail } from '@/hooks/useBadgeCollection';
import { BadgeCategory } from '@/models/Badge/BadgeEnum';
import {
    formatCompletionDate,
    formatVerificationStatus,
    getVerificationStatusColor,
} from '@/models/BadgeCollection/BadgeCollectionUIForm';
import { formatCategory, getCategoryColor, getCategoryIcon } from '@/utils/badgeUtils';

interface Props {
  navigation: any;
  route: {
    params: {
      collectionId: string;
    };
  };
}

const CollectionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { collectionId } = route.params;
  const { collection, isLoading, error, loadCollectionDetail } = useBadgeCollectionDetail();

  useEffect(() => {
    if (collectionId) {
      loadCollectionDetail(collectionId);
    }
  }, [collectionId, loadCollectionDetail]);

  const handleEditCollection = () => {
    if (collection?.verificationStatus === 'approved') {
      Alert.alert('Cannot Edit', 'Approved badge collections cannot be edited');
      return;
    }

    navigation.navigate('EditBadgeCollection', {
      collectionId: collection?.id,
    });
  };

  const handleShareAchievement = async () => {
    if (!collection?.badge) return;

    try {
      const message = `🏆 ${collection.baby?.name || 'Baby'} just earned the "${collection.badge.title}" badge!\n\n${collection.badge.description}\n\nCompleted on ${formatCompletionDate(collection.completedAt)}`;

      await Share.share({
        message,
        title: 'Baby Achievement!',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDeleteCollection = () => {
    if (collection?.verificationStatus === 'approved') {
      Alert.alert('Cannot Delete', 'Approved badge collections cannot be deleted');
      return;
    }

    Alert.alert(
      'Delete Achievement',
      'Are you sure you want to delete this badge achievement? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle delete logic here
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#3B82F6' />
          <Text className='text-gray-500 mt-4'>Loading achievement details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !collection) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='px-4 py-4 bg-white shadow-sm'>
          <View className='flex-row items-center justify-between'>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
            >
              <Icon name='arrow-left' iconStyle='solid' size={16} color='#374151' />
            </TouchableOpacity>
            <Text className='text-xl font-bold text-gray-800'>Achievement Details</Text>
            <View className='w-10' />
          </View>
        </View>

        <View className='flex-1 items-center justify-center px-8'>
          <Icon name='triangle-exclamation' iconStyle='solid' size={64} color='#EF4444' />
          <Text className='text-xl font-semibold text-gray-600 mt-4 mb-2 text-center'>
            {error || 'Achievement not found'}
          </Text>
          <Text className='text-gray-500 text-center leading-6 mb-6'>
            Unable to load achievement details. Please try again.
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} className='bg-blue-500 px-6 py-3 rounded-full'>
            <Text className='text-white font-semibold'>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryColor = getCategoryColor(collection.badge?.category || BadgeCategory.CUSTOM);
  const categoryIcon = getCategoryIcon(collection.badge?.category || BadgeCategory.CUSTOM);

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='px-4 py-4 bg-white shadow-sm'>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
          >
            <Icon name='arrow-left' iconStyle='solid' size={16} color='#374151' />
          </TouchableOpacity>

          <Text className='text-xl font-bold text-gray-800'>Achievement</Text>

          <TouchableOpacity
            onPress={handleShareAchievement}
            className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
          >
            <Icon name='share' iconStyle='solid' size={16} color='#374151' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
        {/* Achievement Header */}
        <Animated.View entering={FadeInUp} className='items-center mb-8'>
          <View
            className='w-24 h-24 rounded-full items-center justify-center mb-4'
            style={{ backgroundColor: categoryColor + '20' }}
          >
            <Icon name={categoryIcon as any} iconStyle='solid' size={40} color={categoryColor} />
          </View>

          <Text className='text-3xl font-bold text-gray-800 text-center mb-2'>
            {collection.badge?.title || 'Badge Achievement'}
          </Text>

          <View className='flex-row items-center mb-4'>
            <View className='px-3 py-1 rounded-full mr-2' style={{ backgroundColor: categoryColor + '20' }}>
              <Text className='font-medium' style={{ color: categoryColor }}>
                {formatCategory(collection.badge?.category || BadgeCategory.CUSTOM)}
              </Text>
            </View>

            <View
              className='px-3 py-1 rounded-full'
              style={{ backgroundColor: getVerificationStatusColor(collection.verificationStatus as any) + '20' }}
            >
              <Text
                className='font-medium'
                style={{ color: getVerificationStatusColor(collection.verificationStatus as any) }}
              >
                {formatVerificationStatus(collection.verificationStatus as any)}
              </Text>
            </View>
          </View>

          <Text className='text-gray-600 text-lg'>Achieved by {collection.baby?.name || 'Baby'}</Text>
        </Animated.View>

        {/* Badge Description */}
        <Animated.View entering={FadeInDown.delay(100)} className='mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-3'>About This Badge</Text>
          <View className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <Text className='text-gray-700 leading-6'>
              {collection.badge?.description || 'No description available'}
            </Text>
          </View>
        </Animated.View>

        {/* Achievement Details */}
        <Animated.View entering={FadeInDown.delay(200)} className='mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-3'>Achievement Details</Text>
          <View className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-gray-600'>Completed On</Text>
              <Text className='text-gray-800 font-medium'>
                {new Date(collection.completedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            <View className='flex-row items-center justify-between mb-3'>
              <Text className='text-gray-600'>Status</Text>
              <View className='flex-row items-center'>
                <View
                  className='w-2 h-2 rounded-full mr-2'
                  style={{ backgroundColor: getVerificationStatusColor(collection.verificationStatus as any) }}
                />
                <Text
                  className='font-medium'
                  style={{ color: getVerificationStatusColor(collection.verificationStatus as any) }}
                >
                  {formatVerificationStatus(collection.verificationStatus as any)}
                </Text>
              </View>
            </View>

            {collection.verifiedBy && collection.verifiedAt && (
              <View className='flex-row items-center justify-between'>
                <Text className='text-gray-600'>Verified On</Text>
                <Text className='text-gray-800 font-medium'>
                  {new Date(collection.verifiedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Submission Note */}
        {collection.submissionNote && (
          <Animated.View entering={FadeInDown.delay(300)} className='mb-6'>
            <Text className='text-xl font-semibold text-gray-800 mb-3'>Achievement Note</Text>
            <View className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
              <Text className='text-gray-700 leading-6 italic'>"{collection.submissionNote}"</Text>
            </View>
          </Animated.View>
        )}

        {/* Media Gallery */}
        {collection.submissionMedia && collection.submissionMedia.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400)} className='mb-8'>
            <Text className='text-xl font-semibold text-gray-800 mb-3'>
              Achievement Photos ({collection.submissionMedia.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className='flex-row'>
                {collection.submissionMedia.map((mediaUrl, index) => (
                  <TouchableOpacity
                    key={index}
                    className='w-32 h-32 rounded-xl bg-gray-100 mr-3 items-center justify-center overflow-hidden'
                    onPress={() => {
                      // Handle image preview
                      navigation.navigate('ImageViewer', {
                        images: collection.submissionMedia,
                        initialIndex: index,
                      });
                    }}
                  >
                    {mediaUrl.includes('http') ? (
                      <Image source={{ uri: mediaUrl }} className='w-full h-full' resizeMode='cover' />
                    ) : (
                      <Icon name='image' iconStyle='solid' size={24} color='#9CA3AF' />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View className='p-4 bg-white border-t border-gray-200'>
        <View className='flex-row gap-3'>
          {collection.verificationStatus !== 'approved' && (
            <TouchableOpacity
              onPress={handleEditCollection}
              className='flex-1 bg-gray-100 py-4 rounded-xl items-center'
            >
              <View className='flex-row items-center'>
                <Icon name='pen-to-square' iconStyle='solid' size={14} color='#374151' />
                <Text className='text-gray-700 font-semibold ml-2'>Edit</Text>
              </View>
            </TouchableOpacity>
          )}

          {collection.verificationStatus !== 'approved' && (
            <TouchableOpacity
              onPress={handleDeleteCollection}
              className='flex-1 bg-red-100 py-4 rounded-xl items-center'
            >
              <View className='flex-row items-center'>
                <Icon name='trash' iconStyle='solid' size={14} color='#EF4444' />
                <Text className='text-red-600 font-semibold ml-2'>Delete</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleShareAchievement}
            className='flex-1 bg-blue-500 py-4 rounded-xl items-center'
          >
            <View className='flex-row items-center'>
              <Icon name='share' iconStyle='solid' size={14} color='white' />
              <Text className='text-white font-semibold ml-2'>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CollectionDetailScreen;
