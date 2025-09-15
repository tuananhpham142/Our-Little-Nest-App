// src/screens/Baby/BabyMainScreen.tsx

import AppLayout from '@/components/layout/AppLayout';
import NotFound from '@/components/NotFound';
import { Baby } from '@/models/Baby/BabyModel';
import { BabyService } from '@/services/baby/babyService';
import { deleteBaby, fetchBabies, fetchBabyById, setSelectedBaby } from '@/store/slices/babySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { timeAgo } from '@/utils/timeUtils';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface BabyMainScreenProps {
  route?: {
    params?: {
      babyId?: string;
    };
  };
}

const BabyMainScreen: React.FC<BabyMainScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBabyLocal, setSelectedBabyLocal] = useState<Baby | null>(null);

  // Redux state
  const { babies, currentBaby, isLoading, error, selectedBabyId } = useAppSelector((state) => state.baby);

  const { user } = useAppSelector((state) => state.auth);

  const babyId = route?.params?.babyId || selectedBabyId;
  const isDetailView = !!babyId;

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data
  useFocusEffect(
    React.useCallback(() => {
      if (isDetailView && babyId) {
        dispatch(fetchBabyById(babyId));
        dispatch(setSelectedBaby(babyId));
      } else {
        dispatch(fetchBabies({}));
      }
    }, [dispatch, isDetailView, babyId]),
  );

  // Set selected baby for detail view
  useEffect(() => {
    if (isDetailView && currentBaby) {
      setSelectedBabyLocal(currentBaby);
    } else if (!isDetailView && babies.length > 0) {
      setSelectedBabyLocal(babies[0]);
    }
  }, [isDetailView, currentBaby, babies]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (isDetailView && babyId) {
        await dispatch(fetchBabyById(babyId));
      } else {
        await dispatch(fetchBabies({}));
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleBabySelect = (baby: Baby) => {
    setSelectedBabyLocal(baby);
    dispatch(setSelectedBaby(baby.id));
    navigation.navigate('BabyTabs', { babyId, initialTab: 'Profile' });
  };

  const handleEditBaby = () => {
    if (selectedBabyLocal) {
      navigation.navigate('EditBaby', { babyId });
    }
  };

  const handleDeleteBaby = () => {
    if (selectedBabyLocal) {
      Alert.alert(
        'Delete Baby Profile',
        `Are you sure you want to delete ${selectedBabyLocal.name}'s profile? This action cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch(deleteBaby(selectedBabyLocal.id));
              if (isDetailView) {
                navigation.goBack();
              }
            },
          },
        ],
      );
    }
  };

  const handleInviteMember = () => {
    if (selectedBabyLocal) {
      navigation.navigate('InviteFamilyMember', { babyId });
    }
  };

  const getCurrentUserRelation = (baby: Baby) => {
    const member = baby.familyMembers.find((m) => m.userId === user?.id);
    return member?.relationType || 'other';
  };

  const isPrimaryCaregiver = (baby: Baby) => {
    const member = baby.familyMembers.find((m) => m.userId === user?.id);
    return member?.isPrimary || false;
  };

  const renderBabyCard = (baby: Baby, isSelected: boolean = false) => {
    const age = BabyService.calculateAge(baby.birthDate);
    const ageDisplay = BabyService.formatAge(age);
    const relation = getCurrentUserRelation(baby);
    const isPrimary = isPrimaryCaregiver(baby);

    return (
      <Animated.View
        key={baby.id}
        className={`bg-white rounded-2xl mb-4 shadow-lg overflow-hidden ${
          isSelected ? 'border-2 border-blue-500' : ''
        }`}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          shadowColor: isSelected ? '#007AFF' : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <TouchableOpacity className='flex-row p-4' onPress={() => handleBabySelect(baby)} activeOpacity={0.8}>
          {/* Avatar Section */}
          <View className='mr-4'>
            <View className='relative'>
              {baby.avatarUrl ? (
                <Image source={{ uri: baby.avatarUrl }} className='w-20 h-20 rounded-full' />
              ) : (
                <View
                  className='w-20 h-20 rounded-full justify-center items-center'
                  style={{ backgroundColor: baby.gender === 'male' ? '#4FC3F7' : '#F8BBD9' }}
                >
                  <Text className='text-4xl'>{baby.gender === 'male' ? '👶🏻' : '👶🏻'}</Text>
                </View>
              )}
              {isPrimary && (
                <View className='absolute -top-1 -right-1 bg-yellow-400 rounded-xl w-6 h-6 justify-center items-center'>
                  <Text className='text-xs'>👑</Text>
                </View>
              )}
            </View>
          </View>

          {/* Baby Info */}
          <View className='flex-1 justify-center'>
            <View className='mb-1'>
              <Text className='text-xl font-bold text-gray-800'>{baby.name}</Text>
              {baby.nickname && <Text className='text-sm text-gray-500 italic'>"{baby.nickname}"</Text>}
            </View>

            <Text className='text-base text-blue-500 font-semibold mb-0.5'>{ageDisplay}</Text>
            <Text className='text-sm text-gray-500 mb-2'>{baby.gender === 'male' ? '♂️ Boy' : '♀️ Girl'}</Text>

            <View className='flex-row flex-wrap items-center'>
              <Text className='text-xs text-purple-600 font-semibold'>Your {relation.replace('_', ' ')}</Text>
              {isPrimary && <Text className='text-xs text-orange-500 font-semibold ml-1'>• Primary Caregiver</Text>}
            </View>
          </View>

          {/* Quick Stats */}
          <View className='justify-center'>
            <View className='items-center mb-2'>
              <Text className='text-xs text-gray-500 uppercase'>Family</Text>
              <Text className='text-sm font-bold text-gray-800'>{baby.familyMembers.length}</Text>
            </View>

            {baby.weight && (
              <View className='items-center mb-2'>
                <Text className='text-xs text-gray-500 uppercase'>Weight</Text>
                <Text className='text-sm font-bold text-gray-800'>{(baby.weight / 1000).toFixed(1)}kg</Text>
              </View>
            )}

            {baby.height && (
              <View className='items-center mb-2'>
                <Text className='text-xs text-gray-500 uppercase'>Height</Text>
                <Text className='text-sm font-bold text-gray-800'>{baby.height}cm</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Health Flags */}
        {(baby.allergies?.length > 0 || baby.medications?.length > 0) && (
          <View className='flex-row px-4 pb-3 flex-wrap'>
            {baby.allergies?.length > 0 && (
              <View className='bg-orange-50 px-2 py-1 rounded-xl mr-2 mb-1'>
                <Text className='text-xs text-orange-800 font-medium'>⚠️ {baby?.allergies.length} Allergies</Text>
              </View>
            )}
            {baby.medications?.length > 0 && (
              <View className='bg-orange-50 px-2 py-1 rounded-xl mr-2 mb-1'>
                <Text className='text-xs text-orange-800 font-medium'>💊 {baby.medications.length} Medications</Text>
              </View>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  const renderSelectedBabyDetail = () => {
    if (!selectedBabyLocal) return null;

    const age = BabyService.calculateAge(selectedBabyLocal.birthDate);
    const ageDisplay = BabyService.formatAge(age);
    const birthDateDisplay = new Date(selectedBabyLocal.birthDate).toLocaleDateString();
    const createdTime = timeAgo(selectedBabyLocal.createdAt);

    return (
      <Animated.View
        className='mt-4'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Header */}
        <View className='flex-row justify-between items-center mb-6'>
          <Text className='text-2xl font-bold text-gray-800'>Baby Profile</Text>
          <View className='flex-row'>
            <TouchableOpacity className='bg-blue-500 px-3 py-1.5 rounded-2xl ml-2' onPress={handleEditBaby}>
              <Text className='text-white text-xs font-semibold'>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-blue-500 px-3 py-1.5 rounded-2xl ml-2' onPress={handleInviteMember}>
              <Text className='text-white text-xs font-semibold'>👥 Invite</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information */}
        <View className='bg-white rounded-xl p-4 mb-4 shadow-sm'>
          <Text className='text-base font-bold text-gray-800 mb-3'>Basic Information</Text>
          <View className='flex-row flex-wrap'>
            <View className='w-1/2 mb-3'>
              <Text className='text-xs text-gray-500 uppercase mb-1'>Birth Date</Text>
              <Text className='text-base font-semibold text-gray-800'>{birthDateDisplay}</Text>
            </View>
            <View className='w-1/2 mb-3'>
              <Text className='text-xs text-gray-500 uppercase mb-1'>Age</Text>
              <Text className='text-base font-semibold text-gray-800'>{ageDisplay}</Text>
            </View>
            <View className='w-1/2 mb-3'>
              <Text className='text-xs text-gray-500 uppercase mb-1'>Gender</Text>
              <Text className='text-base font-semibold text-gray-800'>
                {selectedBabyLocal.gender === 'male' ? 'Boy ♂️' : 'Girl ♀️'}
              </Text>
            </View>
          </View>
        </View>

        {/* Physical Stats */}
        {(selectedBabyLocal.weight || selectedBabyLocal.height) && (
          <View className='bg-white rounded-xl p-4 mb-4 shadow-sm'>
            <Text className='text-base font-bold text-gray-800 mb-3'>Physical Stats</Text>
            <View className='flex-row flex-wrap'>
              {selectedBabyLocal.weight && (
                <View className='w-1/2 mb-3'>
                  <Text className='text-xs text-gray-500 uppercase mb-1'>Weight</Text>
                  <Text className='text-base font-semibold text-gray-800'>
                    {(selectedBabyLocal.weight / 1000).toFixed(1)} kg
                  </Text>
                </View>
              )}
              {selectedBabyLocal.height && (
                <View className='w-1/2 mb-3'>
                  <Text className='text-xs text-gray-500 uppercase mb-1'>Height</Text>
                  <Text className='text-base font-semibold text-gray-800'>{selectedBabyLocal.height} cm</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Family Members */}
        <View className='bg-white rounded-xl p-4 mb-4 shadow-sm'>
          <Text className='text-base font-bold text-gray-800 mb-3'>
            Family Members ({selectedBabyLocal.familyMembers.length})
          </Text>
          <View className='mt-2'>
            {selectedBabyLocal.familyMembers.slice(0, 3).map((member, index) => (
              <View key={member.userId} className='flex-row justify-between items-center py-2 border-b border-gray-100'>
                <Text className='text-sm font-semibold text-gray-800'>{member.displayName || 'Family Member'}</Text>
                <Text className='text-xs text-gray-500'>
                  {member.relationType.replace('_', ' ')} {member.isPrimary ? '👑' : ''}
                </Text>
              </View>
            ))}
            {selectedBabyLocal.familyMembers.length > 3 && (
              <TouchableOpacity
                className='py-2 items-center'
                onPress={() => navigation.navigate('BabyFamily', { babyId })}
              >
                <Text className='text-sm text-blue-500 font-semibold'>
                  View All ({selectedBabyLocal.familyMembers.length - 3} more)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Notes */}
        {selectedBabyLocal.notes && (
          <View className='bg-white rounded-xl p-4 mb-4 shadow-sm'>
            <Text className='text-base font-bold text-gray-800 mb-3'>Notes</Text>
            <Text className='text-sm text-gray-500 leading-5'>{selectedBabyLocal.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View className='flex-row justify-between items-center pt-4 border-t border-gray-100'>
          <Text className='text-xs text-gray-400'>Profile created {createdTime}</Text>
          <TouchableOpacity onPress={handleDeleteBaby}>
            <Text className='text-xs text-red-500 font-semibold'>🗑️ Delete Profile</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View className='flex-1 justify-center items-center p-10'>
      <Text className='text-6xl mb-4'>👶</Text>
      <Text className='text-2xl font-bold text-gray-800 text-center mb-3'>No Babies Yet</Text>
      <Text className='text-base text-gray-500 text-center leading-6 mb-6' style={{ maxWidth: width * 0.8 }}>
        Start by adding your first baby profile to keep track of their growth and development.
      </Text>
      <TouchableOpacity
        className='bg-green-500 px-6 py-3 rounded-3xl'
        onPress={() => navigation.navigate('CreateBaby')}
      >
        <Text className='text-white text-base font-semibold'>➕ Add Your First Baby</Text>
      </TouchableOpacity>
    </View>
  );

  if (isDetailView && !currentBaby && !isLoading) {
    return (
      <NotFound
        type='general'
        title='Baby Not Found'
        message="The baby profile you're looking for doesn't exist or you don't have access to it."
        showSuggestions={true}
      />
    );
  }

  return (
    <AppLayout>
      <ScrollView
        className='flex-1'
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {isDetailView ? (
          // Detail view for single baby
          <View className='p-4'>
            {selectedBabyLocal && renderBabyCard(selectedBabyLocal, true)}
            {renderSelectedBabyDetail()}
          </View>
        ) : (
          // List view for all babies
          <View className='flex-1'>
            {babies.length === 0 ? (
              renderEmptyState()
            ) : (
              <View className='p-4'>
                {babies.map((baby) => renderBabyCard(baby, baby.id === selectedBabyLocal?.id))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </AppLayout>
  );
};

export default BabyMainScreen;
