// src/screens/Baby/BabyInfoScreen.tsx

import { LoadingWithFallback } from '@/components/template/NotFoundVariants';
import { Baby } from '@/models/Baby/BabyModel';
import { BabyService } from '@/services/baby/babyService';
import { fetchBabyById } from '@/store/slices/babySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatArticleDate, timeAgo } from '@/utils/timeUtils';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface BabyInfoScreenProps {
  route: {
    params: {
      babyId: string;
    };
  };
}

const BabyInfoScreen: React.FC<BabyInfoScreenProps> = ({ route }) => {
  const { babyId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInfoTab, setSelectedInfoTab] = useState<'details' | 'health' | 'family'>('details');

  // Redux state
  const { currentBaby, isLoading, error } = useAppSelector((state) => state.baby);
  const { user } = useAppSelector((state) => state.auth);

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load baby data
  useEffect(() => {
    if (babyId) {
      dispatch(fetchBabyById(babyId));
    }
  }, [dispatch, babyId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchBabyById(babyId));
    } finally {
      setRefreshing(false);
    }
  };

  const calculateAgeDetails = (baby: Baby) => {
    const now = new Date();
    const birth = new Date(baby.birthDate);
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = BabyService.calculateAge(baby.birthDate);
    const diffYears = Math.floor(diffMonths / 12);

    return {
      days: diffDays,
      weeks: diffWeeks,
      months: diffMonths,
      years: diffYears,
      isNewborn: diffDays <= 28,
      isInfant: diffMonths <= 12,
      isToddler: diffMonths > 12 && diffMonths <= 36,
    };
  };

  const getGrowthPercentile = (weight: number, height: number, ageInMonths: number, gender: string) => {
    // Simplified growth percentile calculation (should use WHO growth charts)
    const weightPercentile = Math.floor(Math.random() * 100); // Mock data
    const heightPercentile = Math.floor(Math.random() * 100); // Mock data
    return { weightPercentile, heightPercentile };
  };

  const renderAgeProgress = (baby: Baby) => {
    const ageDetails = calculateAgeDetails(baby);
    const progressValue = Math.min(ageDetails.months / 24, 1); // Progress up to 2 years

    return (
      <Animated.View
        className='bg-white rounded-2xl p-5 mb-4 shadow-lg'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text className='text-lg font-bold text-gray-800 mb-4'>Development Progress</Text>

        <View className='items-center mb-5'>
          <View className='items-center mb-4'>
            <Text className='text-5xl font-bold text-blue-500'>{ageDetails.months}</Text>
            <Text className='text-base text-gray-500 uppercase tracking-wide'>months old</Text>
          </View>

          <View className='flex-row justify-around w-full'>
            <View className='items-center'>
              <Text className='text-xl font-bold text-gray-800'>{ageDetails.days}</Text>
              <Text className='text-xs text-gray-500 uppercase'>days</Text>
            </View>
            <View className='items-center'>
              <Text className='text-xl font-bold text-gray-800'>{ageDetails.weeks}</Text>
              <Text className='text-xs text-gray-500 uppercase'>weeks</Text>
            </View>
            {ageDetails.years > 0 && (
              <View className='items-center'>
                <Text className='text-xl font-bold text-gray-800'>{ageDetails.years}</Text>
                <Text className='text-xs text-gray-500 uppercase'>years</Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        <View className='mb-4'>
          <Text className='text-sm text-gray-500 mb-2 text-center'>Growth Timeline (0-24 months)</Text>
          <View className='h-2 bg-blue-100 rounded-sm overflow-hidden'>
            <Animated.View
              className='h-full bg-blue-500 rounded-sm'
              style={{
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${progressValue * 100}%`],
                }),
              }}
            />
          </View>
          <View className='flex-row justify-between mt-1'>
            <Text className='text-xs text-gray-400'>Birth</Text>
            <Text className='text-xs text-gray-400'>2 Years</Text>
          </View>
        </View>

        {/* Development Stage */}
        <View className='flex-row justify-center items-center bg-purple-50 py-3 px-4 rounded-xl'>
          <Text className='text-sm text-gray-500 mr-2'>Current Stage:</Text>
          <Text className='text-base font-bold text-purple-600'>
            {ageDetails.isNewborn
              ? '👶 Newborn'
              : ageDetails.isInfant
                ? '🍼 Infant'
                : ageDetails.isToddler
                  ? '🚼 Toddler'
                  : '👦👧 Child'}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderBasicInfo = (baby: Baby) => {
    const birthDate = formatArticleDate(baby.birthDate, { format: 'long' });
    const createdTime = timeAgo(baby.createdAt);
    const updatedTime = timeAgo(baby.updatedAt);

    return (
      <Animated.View
        className='bg-white rounded-2xl p-5 mb-4 shadow-lg'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text className='text-lg font-bold text-gray-800 mb-4'>Basic Information</Text>

        <View className='mb-4'>
          <View className='mb-4 pb-4 border-b border-gray-100'>
            <Text className='text-xs text-gray-500 uppercase mb-1 tracking-wider'>Full Name</Text>
            <Text className='text-base font-semibold text-gray-800'>{baby.name}</Text>
            {baby.nickname && <Text className='text-sm text-gray-500 italic mt-0.5'>Nickname: "{baby.nickname}"</Text>}
          </View>

          <View className='mb-4 pb-4 border-b border-gray-100'>
            <Text className='text-xs text-gray-500 uppercase mb-1 tracking-wider'>Birth Date</Text>
            <Text className='text-base font-semibold text-gray-800'>{birthDate}</Text>
          </View>

          <View className='mb-4 pb-4 border-b border-gray-100'>
            <Text className='text-xs text-gray-500 uppercase mb-1 tracking-wider'>Gender</Text>
            <Text className='text-base font-semibold text-gray-800'>
              {baby.gender === 'male' ? '♂️ Boy' : '♀️ Girl'}
            </Text>
          </View>
        </View>

        <View className='border-t border-gray-100 pt-4'>
          <Text className='text-xs text-gray-400 mb-1'>Profile created {createdTime}</Text>
          <Text className='text-xs text-gray-400'>Last updated {updatedTime}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderPhysicalStats = (baby: Baby) => {
    if (!baby.weight && !baby.height) return null;

    const ageDetails = calculateAgeDetails(baby);
    const { weightPercentile, heightPercentile } = getGrowthPercentile(
      baby.weight || 0,
      baby.height || 0,
      ageDetails.months,
      baby.gender,
    );

    return (
      <Animated.View
        className='bg-white rounded-2xl p-5 mb-4 shadow-lg'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text className='text-lg font-bold text-gray-800 mb-4'>Physical Development</Text>

        <View className='mb-4'>
          {baby.weight && (
            <View className='flex-row items-center bg-gray-50 p-4 rounded-xl mb-3'>
              <View className='mr-4'>
                <Text className='text-2xl'>⚖️</Text>
              </View>
              <View className='flex-1'>
                <Text className='text-xs text-gray-500 uppercase mb-0.5'>Weight</Text>
                <Text className='text-xl font-bold text-gray-800 mb-0.5'>{(baby.weight / 1000).toFixed(1)} kg</Text>
                <Text className='text-xs text-green-500 font-medium'>{weightPercentile}th percentile</Text>
              </View>
            </View>
          )}

          {baby.height && (
            <View className='flex-row items-center bg-gray-50 p-4 rounded-xl mb-3'>
              <View className='mr-4'>
                <Text className='text-2xl'>📏</Text>
              </View>
              <View className='flex-1'>
                <Text className='text-xs text-gray-500 uppercase mb-0.5'>Height</Text>
                <Text className='text-xl font-bold text-gray-800 mb-0.5'>{baby.height} cm</Text>
                <Text className='text-xs text-green-500 font-medium'>{heightPercentile}th percentile</Text>
              </View>
            </View>
          )}
        </View>

        {/* Growth Chart Button */}
        <TouchableOpacity
          className='bg-green-50 py-3 px-4 rounded-xl items-center'
          onPress={() => navigation.navigate('BabyHealth', { babyId })}
        >
          <Text className='text-green-500 text-sm font-semibold'>📊 View Growth Chart</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHealthInfo = (baby: Baby) => {
    const hasHealthInfo = baby.allergies?.length > 0 || baby.medications?.length > 0 || baby.notes;

    if (!hasHealthInfo) {
      return (
        <Animated.View
          className='bg-white rounded-2xl p-5 mb-4 shadow-lg'
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className='text-lg font-bold text-gray-800 mb-4'>Health Information</Text>
          <View className='items-center py-6'>
            <Text className='text-5xl mb-3'>🏥</Text>
            <Text className='text-sm text-gray-500 text-center mb-4'>No health information recorded yet</Text>
            <TouchableOpacity
              className='bg-green-500 px-4 py-2 rounded-2xl'
              onPress={() => navigation.navigate('BabyHealth', { babyId })}
            >
              <Text className='text-white text-sm font-semibold'>Add Health Info</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        className='bg-white rounded-2xl p-5 mb-4 shadow-lg'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Text className='text-lg font-bold text-gray-800 mb-4'>Health Information</Text>

        {baby.allergies && baby.allergies.length > 0 && (
          <View className='bg-yellow-50 p-4 rounded-xl mb-3 border-l-4 border-orange-500'>
            <View className='mb-3'>
              <Text className='text-base font-bold text-orange-800'>⚠️ Allergies ({baby.allergies.length})</Text>
            </View>
            <View className='flex-row flex-wrap'>
              {baby.allergies.map((allergy, index) => (
                <View key={index} className='bg-white px-3 py-1.5 rounded-2xl mr-2 mb-2'>
                  <Text className='text-sm text-gray-800 font-medium'>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {baby.medications && baby.medications.length > 0 && (
          <View className='bg-yellow-50 p-4 rounded-xl mb-3 border-l-4 border-orange-500'>
            <View className='mb-3'>
              <Text className='text-base font-bold text-orange-800'>💊 Medications ({baby.medications.length})</Text>
            </View>
            <View className='flex-row flex-wrap'>
              {baby.medications.map((medication, index) => (
                <View key={index} className='bg-white px-3 py-1.5 rounded-2xl mr-2 mb-2'>
                  <Text className='text-sm text-gray-800 font-medium'>{medication}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {baby.notes && (
          <View className='bg-yellow-50 p-4 rounded-xl mb-3 border-l-4 border-orange-500'>
            <View className='mb-3'>
              <Text className='text-base font-bold text-orange-800'>📝 Notes</Text>
            </View>
            <Text className='text-sm text-gray-500 leading-5'>{baby.notes}</Text>
          </View>
        )}

        <TouchableOpacity
          className='bg-blue-50 py-3 px-4 rounded-xl items-center'
          onPress={() => navigation.navigate('BabyHealth', { babyId })}
        >
          <Text className='text-blue-500 text-sm font-semibold'>✏️ Edit Health Information</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFamilyPreview = (baby: Baby) => {
    const primaryCaregivers = baby.familyMembers.filter((member) => member.isPrimary);
    const otherMembers = baby.familyMembers.filter((member) => !member.isPrimary);

    return (
      <Animated.View
        className='bg-white rounded-2xl p-5 mb-4 shadow-lg'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View className='flex-row justify-between items-center mb-4'>
          <Text className='text-lg font-bold text-gray-800'>Family Members ({baby.familyMembers.length})</Text>
          <TouchableOpacity
            className='bg-blue-50 px-3 py-1.5 rounded-xl'
            onPress={() => navigation.navigate('BabyTabs', { babyId, initialTab: 'Family' })}
          >
            <Text className='text-blue-500 text-xs font-semibold'>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Caregivers */}
        {primaryCaregivers.length > 0 && (
          <View className='mb-4'>
            <Text className='text-sm font-bold text-gray-500 mb-2 uppercase'>👑 Primary Caregivers</Text>
            {primaryCaregivers.map((member, index) => (
              <View
                key={member.userId}
                className='flex-row justify-between items-center py-3 px-4 bg-gray-50 rounded-xl mb-2'
              >
                <View className='flex-1'>
                  <Text className='text-base font-semibold text-gray-800 mb-0.5'>
                    {member.displayName || 'Family Member'}
                  </Text>
                  <Text className='text-xs text-gray-500 capitalize'>{member.relationType.replace('_', ' ')}</Text>
                </View>
                <View className='flex-row'>
                  <View className='bg-yellow-400 px-2 py-1 rounded-lg'>
                    <Text className='text-xs font-bold text-yellow-800'>Primary</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Other Family Members */}
        {otherMembers.length > 0 && (
          <View className='mb-4'>
            <Text className='text-sm font-bold text-gray-500 mb-2 uppercase'>👨‍👩‍👧‍👦 Other Family Members</Text>
            {otherMembers.slice(0, 3).map((member, index) => (
              <View
                key={member.userId}
                className='flex-row justify-between items-center py-3 px-4 bg-gray-50 rounded-xl mb-2'
              >
                <View className='flex-1'>
                  <Text className='text-base font-semibold text-gray-800 mb-0.5'>
                    {member.displayName || 'Family Member'}
                  </Text>
                  <Text className='text-xs text-gray-500 capitalize'>{member.relationType.replace('_', ' ')}</Text>
                </View>
              </View>
            ))}
            {otherMembers.length > 3 && (
              <Text className='text-sm text-gray-500 text-center italic'>
                +{otherMembers.length - 3} more family members
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          className='bg-green-50 py-3 px-4 rounded-xl items-center mt-2'
          onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
        >
          <Text className='text-green-500 text-sm font-semibold'>👥 Invite Family Member</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!currentBaby) {
    return (
      <LoadingWithFallback
        isLoading={isLoading}
        error={error}
        hasData={false}
        emptyStateProps={{
          type: 'articles',
          onRefresh: handleRefresh,
        }}
      >
        <View />
      </LoadingWithFallback>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <ScrollView
        className='flex-1'
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Baby Avatar and Name */}
        <Animated.View
          className='bg-white p-5 flex-row justify-between items-center border-b border-gray-200'
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View className='flex-row items-center flex-1'>
            <View className='mr-4'>
              {currentBaby.avatarUrl ? (
                <Image source={{ uri: currentBaby.avatarUrl }} className='w-16 h-16 rounded-full' />
              ) : (
                <View
                  className='w-16 h-16 rounded-full justify-center items-center'
                  style={{ backgroundColor: currentBaby.gender === 'male' ? '#4FC3F7' : '#F8BBD9' }}
                >
                  <Text className='text-3xl'>{currentBaby.gender === 'male' ? '👶🏻' : '👶🏻'}</Text>
                </View>
              )}
            </View>
            <View className='flex-1'>
              <Text className='text-2xl font-bold text-gray-800'>{currentBaby.name}</Text>
              {currentBaby.nickname && (
                <Text className='text-base text-gray-500 italic mb-1'>"{currentBaby.nickname}"</Text>
              )}
              <Text className='text-lg text-blue-500 font-semibold'>
                {BabyService.formatAge(BabyService.calculateAge(currentBaby.birthDate))}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className='bg-blue-500 px-4 py-2 rounded-2xl'
            onPress={() => navigation.navigate('EditBaby', { babyId })}
          >
            <Text className='text-white text-sm font-semibold'>✏️ Edit</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Content Sections */}
        <View className='p-4'>
          {renderAgeProgress(currentBaby)}
          {renderBasicInfo(currentBaby)}
          {renderPhysicalStats(currentBaby)}
          {renderHealthInfo(currentBaby)}
          {renderFamilyPreview(currentBaby)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BabyInfoScreen;
