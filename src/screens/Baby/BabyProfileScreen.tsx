// src/screens/Baby/BabyProfileScreen.tsx

import { LoadingWithFallback } from '@/components/template/NotFoundVariants';
import { Baby } from '@/models/Baby/BabyModel';
import { BabyService } from '@/services/baby/babyService';
import { deleteBaby, fetchBabyById } from '@/store/slices/babySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatArticleDate } from '@/utils/timeUtils';
import Icon from '@react-native-vector-icons/fontawesome6';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
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

const { width } = Dimensions.get('window');

interface BabyProfileScreenProps {
  route: {
    params: {
      babyId: string;
    };
  };
}

const BabyProfileScreen: React.FC<BabyProfileScreenProps> = ({ route }) => {
  const { babyId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'health' | 'family' | 'milestones'>('overview');

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

  const getCurrentUserRelation = () => {
    if (!currentBaby) return null;
    return currentBaby.familyMembers.find((m) => m.userId === user?.id);
  };

  const handleEdit = () => {
    navigation.navigate('EditBaby', { babyId });
  };

  const handleDelete = () => {
    if (!currentBaby) return;

    Alert.alert(
      'Delete Baby Profile',
      `Are you sure you want to delete ${currentBaby.name}'s profile? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteBaby(currentBaby.id));
            navigation.goBack();
          },
        },
      ],
    );
  };

  const renderHeader = (baby: Baby) => {
    const ageDetails = calculateAgeDetails(baby);
    const currentRelation = getCurrentUserRelation();

    return (
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        className='bg-gradient-to-br from-pink-400 to-pink-500 px-4 py-6 rounded-b-3xl'
      >
        <View className='flex-row justify-between items-start mb-4'>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className='bg-white bg-opacity-20 p-2 rounded-full flex-row items-center justify-center'
          >
            <Icon iconStyle='solid' name='chevron-left' size={20} color='#ffffff' />
          </TouchableOpacity>

          <View className='flex-row'>
            <TouchableOpacity
              onPress={() => navigation.navigate('Badges', { babyId })}
              className='bg-white bg-opacity-20 p-2 rounded-full mr-2 flex-row items-center justify-center'
            >
              <Icon iconStyle='solid' name='trophy' size={18} color='#ffffff' />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEdit}
              className='bg-white bg-opacity-20 p-2 rounded-full flex-row items-center justify-center'
            >
              <Icon iconStyle='solid' name='pen' size={18} color='#ffffff' />
            </TouchableOpacity>
          </View>
        </View>

        <View className='items-center'>
          {/* Avatar */}
          <View className='relative mb-4'>
            {baby.avatarUrl ? (
              <Image source={{ uri: baby.avatarUrl }} className='w-24 h-24 rounded-full border-4 border-white' />
            ) : (
              <View
                className='w-24 h-24 rounded-full border-4 border-white justify-center items-center'
                style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
              >
                <Icon iconStyle='solid' name='baby' size={32} color='#ffffff' />
              </View>
            )}
            {currentRelation?.isPrimary && (
              <View className='absolute -top-1 -right-1 bg-yellow-400 rounded-full w-8 h-8 justify-center items-center'>
                <Icon iconStyle='solid' name='crown' size={16} color='#F59E0B' />
              </View>
            )}
          </View>

          {/* Baby Info */}
          <Text className='text-2xl font-bold text-white mb-1'>{baby.name}</Text>
          {baby.nickname && <Text className='text-lg text-white text-opacity-90 italic mb-2'>"{baby.nickname}"</Text>}

          <View className='bg-white bg-opacity-20 px-4 py-2 rounded-2xl mb-4'>
            <Text className='text-white text-lg font-semibold'>{BabyService.formatAge(ageDetails.months)} old</Text>
          </View>

          {/* Quick Stats */}
          <View className='flex-row justify-around w-full'>
            <View className='items-center'>
              <Text className='text-2xl font-bold text-white'>{ageDetails.days}</Text>
              <Text className='text-white text-opacity-80 text-sm'>days</Text>
            </View>
            <View className='items-center'>
              <Text className='text-2xl font-bold text-white'>{ageDetails.weeks}</Text>
              <Text className='text-white text-opacity-80 text-sm'>weeks</Text>
            </View>
            <View className='items-center'>
              <Text className='text-2xl font-bold text-white'>{baby.familyMembers.length}</Text>
              <Text className='text-white text-opacity-80 text-sm'>family</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderTabSelector = () => (
    <View className='bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden'>
      <View className='flex-row'>
        {[
          { key: 'overview', label: 'Overview', icon: 'chart-line' },
          { key: 'health', label: 'Health', icon: 'heart-pulse' },
          { key: 'family', label: 'Family', icon: 'users' },
          { key: 'milestones', label: 'Growth', icon: 'seedling' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key as any)}
            className={`flex-1 py-3 items-center ${selectedTab === tab.key ? 'bg-pink-500' : 'bg-white'}`}
          >
            <Icon
              iconStyle='solid'
              name={tab.icon as any}
              size={18}
              color={selectedTab === tab.key ? '#ffffff' : '#6B7280'}
            />
            <Text className={`text-xs font-medium mt-1 ${selectedTab === tab.key ? 'text-white' : 'text-gray-600'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderOverviewTab = (baby: Baby) => (
    <View className='px-4 mt-4'>
      {/* Basic Info Card */}
      <Animated.View style={{ opacity: fadeAnim }} className='bg-white rounded-2xl p-4 mb-4 shadow-sm'>
        <View className='flex-row items-center mb-3'>
          <Icon iconStyle='solid' name='circle-info' size={20} color='#3B82F6' />
          <Text className='text-lg font-bold text-gray-800 ml-2'>Basic Information</Text>
        </View>

        <View className='mb-3'>
          <View className='flex-row justify-between mb-3'>
            <Text className='text-gray-500'>Birth Date</Text>
            <Text className='font-semibold text-gray-800'>{formatArticleDate(baby.birthDate, { format: 'long' })}</Text>
          </View>

          <View className='flex-row justify-between mb-3'>
            <Text className='text-gray-500'>Gender</Text>
            <View className='flex-row items-center'>
              <Icon
                iconStyle='solid'
                name={baby.gender === 'male' ? 'mars' : 'venus'}
                size={16}
                color={baby.gender === 'male' ? '#3B82F6' : '#EC4899'}
              />
              <Text className='font-semibold text-gray-800 ml-1'>{baby.gender === 'male' ? 'Boy' : 'Girl'}</Text>
            </View>
          </View>

          <View className='flex-row justify-between'>
            <Text className='text-gray-500'>Your Relationship</Text>
            <View className='flex-row items-center'>
              <Icon iconStyle='solid' name='user' size={16} color='#8B5CF6' />
              <Text className='font-semibold text-purple-600 ml-1'>
                {getCurrentUserRelation()?.relationType.replace('_', ' ') || 'Family Member'}
                {getCurrentUserRelation()?.isPrimary && ' (Primary)'}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Physical Stats Card */}
      {(baby.weight || baby.height) && (
        <Animated.View style={{ opacity: fadeAnim }} className='bg-white rounded-2xl p-4 mb-4 shadow-sm'>
          <View className='flex-row items-center mb-3'>
            <Icon iconStyle='solid' name='ruler' size={20} color='#10B981' />
            <Text className='text-lg font-bold text-gray-800 ml-2'>Physical Stats</Text>
          </View>

          <View className='flex-row justify-around'>
            {baby.weight && (
              <View className='items-center bg-blue-50 p-4 rounded-xl'>
                <Icon iconStyle='solid' name='weight-scale' size={24} color='#3B82F6' />
                <Text className='text-lg font-bold text-blue-600 mt-2'>{(baby.weight / 1000).toFixed(1)}kg</Text>
                <Text className='text-sm text-gray-500'>Weight</Text>
              </View>
            )}

            {baby.height && (
              <View className='items-center bg-green-50 p-4 rounded-xl'>
                <Icon iconStyle='solid' name='ruler-vertical' size={24} color='#10B981' />
                <Text className='text-lg font-bold text-green-600 mt-2'>{baby.height}cm</Text>
                <Text className='text-sm text-gray-500'>Height</Text>
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {/* Quick Actions */}
      <View className='flex-row flex-wrap mb-4'>
        <View className='mr-2 mb-2'>
          <TouchableOpacity
            onPress={() => navigation.navigate('BabyFamily', { babyId })}
            className='bg-blue-500 px-4 py-2 rounded-2xl flex-row items-center'
          >
            <Icon iconStyle='solid' name='users' size={16} color='#ffffff' />
            <Text className='text-white font-semibold ml-2'>View Family</Text>
          </TouchableOpacity>
        </View>

        <View className='mb-2'>
          <TouchableOpacity
            onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
            className='bg-green-500 px-4 py-2 rounded-2xl flex-row items-center'
          >
            <Icon iconStyle='solid' name='user-plus' size={16} color='#ffffff' />
            <Text className='text-white font-semibold ml-2'>Invite Member</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHealthTab = (baby: Baby) => (
    <View className='px-4 mt-4'>
      {/* Health Status */}
      <Animated.View style={{ opacity: fadeAnim }} className='bg-white rounded-2xl p-4 mb-4 shadow-sm'>
        <View className='flex-row items-center mb-3'>
          <Icon iconStyle='solid' name='chart-simple' size={20} color='#EF4444' />
          <Text className='text-lg font-bold text-gray-800 ml-2'>Health Overview</Text>
        </View>

        <View className='flex-row justify-around'>
          <View className='items-center bg-orange-50 p-4 rounded-xl'>
            <Icon iconStyle='solid' name='triangle-exclamation' size={24} color='#EA580C' />
            <Text className='text-lg font-bold text-orange-600 mt-2'>{baby.allergies?.length || 0}</Text>
            <Text className='text-sm text-gray-500'>Allergies</Text>
          </View>

          <View className='items-center bg-blue-50 p-4 rounded-xl'>
            <Icon iconStyle='solid' name='pills' size={24} color='#3B82F6' />
            <Text className='text-lg font-bold text-blue-600 mt-2'>{baby.medications?.length || 0}</Text>
            <Text className='text-sm text-gray-500'>Medications</Text>
          </View>
        </View>
      </Animated.View>

      {/* Allergies */}
      {baby.allergies && baby.allergies.length > 0 && (
        <View className='bg-orange-50 rounded-2xl p-4 mb-4 border-l-4 border-orange-500'>
          <View className='flex-row items-center mb-2'>
            <Icon iconStyle='solid' name='triangle-exclamation' size={20} color='#EA580C' />
            <Text className='text-lg font-bold text-orange-800 ml-2'>Allergies ({baby.allergies.length})</Text>
          </View>
          <View className='flex-row flex-wrap'>
            {baby.allergies.map((allergy, index) => (
              <View key={index} className='bg-white px-3 py-1 rounded-full mr-2 mb-2'>
                <Text className='text-sm text-orange-800 font-medium'>{allergy}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Medications */}
      {baby.medications && baby.medications.length > 0 && (
        <View className='bg-blue-50 rounded-2xl p-4 mb-4 border-l-4 border-blue-500'>
          <View className='flex-row items-center mb-2'>
            <Icon iconStyle='solid' name='pills' size={20} color='#3B82F6' />
            <Text className='text-lg font-bold text-blue-800 ml-2'>Medications ({baby.medications.length})</Text>
          </View>
          <View className='flex-row flex-wrap'>
            {baby.medications.map((medication, index) => (
              <View key={index} className='bg-white px-3 py-1 rounded-full mr-2 mb-2'>
                <Text className='text-sm text-blue-800 font-medium'>{medication}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Notes */}
      {baby.notes && (
        <View className='bg-gray-50 rounded-2xl p-4 mb-4'>
          <View className='flex-row items-center mb-2'>
            <Icon iconStyle='solid' name='note-sticky' size={20} color='#6B7280' />
            <Text className='text-lg font-bold text-gray-800 ml-2'>Notes</Text>
          </View>
          <Text className='text-gray-600 leading-5'>{baby.notes}</Text>
        </View>
      )}
    </View>
  );

  const renderFamilyTab = (baby: Baby) => (
    <View className='px-4 mt-4'>
      <View className='bg-white rounded-2xl p-4 shadow-sm'>
        <View className='flex-row justify-between items-center mb-4'>
          <View className='flex-row items-center'>
            <Icon iconStyle='solid' name='users' size={20} color='#8B5CF6' />
            <Text className='text-lg font-bold text-gray-800 ml-2'>Family Members ({baby.familyMembers.length})</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ManageFamilyMember', { babyId })}
            className='bg-blue-500 px-3 py-1 rounded-xl flex-row items-center'
          >
            <Icon iconStyle='solid' name='gear' size={12} color='#ffffff' />
            <Text className='text-white text-sm font-semibold ml-1'>Manage</Text>
          </TouchableOpacity>
        </View>

        {baby.familyMembers.map((member, index) => (
          <View key={member.userId} className='flex-row items-center py-3 border-b border-gray-100'>
            <View className='w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-3'>
              <Icon iconStyle='solid' name='user' size={16} color='#3B82F6' />
            </View>

            <View className='flex-1'>
              <Text className='font-semibold text-gray-800'>{member.displayName || 'Family Member'}</Text>
              <View className='flex-row items-center'>
                <Text className='text-sm text-gray-500'>{member.relationType.replace('_', ' ')}</Text>
                {member.isPrimary && (
                  <View className='flex-row items-center ml-2'>
                    <Icon iconStyle='solid' name='crown' size={12} color='#F59E0B' />
                    <Text className='text-sm text-orange-500 ml-1'>Primary Caregiver</Text>
                  </View>
                )}
              </View>
            </View>

            <Text className='text-xs text-blue-500'>{member.permissions.length} permissions</Text>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
          className='bg-green-50 p-3 rounded-xl mt-3 items-center flex-row justify-center'
        >
          <Icon iconStyle='solid' name='user-plus' size={16} color='#10B981' />
          <Text className='text-green-600 font-semibold ml-2'>Invite Family Member</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMilestonesTab = (baby: Baby) => {
    const ageDetails = calculateAgeDetails(baby);
    const progressValue = Math.min(ageDetails.months / 24, 1);

    return (
      <View className='px-4 mt-4'>
        {/* Growth Progress */}
        <Animated.View style={{ opacity: fadeAnim }} className='bg-white rounded-2xl p-4 mb-4 shadow-sm'>
          <View className='flex-row items-center mb-3'>
            <Icon iconStyle='solid' name='seedling' size={20} color='#10B981' />
            <Text className='text-lg font-bold text-gray-800 ml-2'>Development Progress</Text>
          </View>

          <View className='items-center mb-4'>
            <Text className='text-4xl font-bold text-blue-500 mb-1'>{ageDetails.months}</Text>
            <Text className='text-gray-500 uppercase tracking-wide'>months old</Text>
          </View>

          <View className='mb-4'>
            <Text className='text-sm text-gray-500 mb-2 text-center'>Growth Timeline (0-24 months)</Text>
            <View className='h-2 bg-blue-100 rounded-full overflow-hidden'>
              <Animated.View
                className='h-full bg-blue-500 rounded-full'
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

          <View className='bg-purple-50 p-3 rounded-xl items-center flex-row justify-center'>
            <Icon
              iconStyle='solid'
              name={ageDetails.isNewborn ? 'baby' : ageDetails.isInfant ? 'baby-carriage' : 'child'}
              size={20}
              color='#8B5CF6'
            />
            <Text className='text-purple-600 font-bold ml-2'>
              {ageDetails.isNewborn
                ? 'Newborn Stage'
                : ageDetails.isInfant
                  ? 'Infant Stage'
                  : ageDetails.isToddler
                    ? 'Toddler Stage'
                    : 'Child Stage'}
            </Text>
          </View>
        </Animated.View>

        {/* Upcoming Milestones */}
        <View className='bg-white rounded-2xl p-4 shadow-sm'>
          <View className='flex-row items-center mb-3'>
            <Icon iconStyle='solid' name='bullseye' size={20} color='#F59E0B' />
            <Text className='text-lg font-bold text-gray-800 ml-2'>Upcoming Milestones</Text>
          </View>

          <View className='items-center py-8'>
            <Icon iconStyle='solid' name='clock' size={48} color='#D1D5DB' />
            <Text className='text-gray-500 text-center mt-4'>Milestone tracking coming soon!</Text>
          </View>
        </View>
      </View>
    );
  };

  if (!currentBaby) {
    return (
      <LoadingWithFallback
        isLoading={isLoading}
        error={error}
        hasData={false}
        emptyStateProps={{
          type: 'general',
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader(currentBaby)}
        {renderTabSelector()}

        {selectedTab === 'overview' && renderOverviewTab(currentBaby)}
        {selectedTab === 'health' && renderHealthTab(currentBaby)}
        {selectedTab === 'family' && renderFamilyTab(currentBaby)}
        {selectedTab === 'milestones' && renderMilestonesTab(currentBaby)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BabyProfileScreen;
