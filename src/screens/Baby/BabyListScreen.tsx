// src/screens/Baby/BabyListScreen.tsx

import { LoadingWithFallback } from '@/components/template/NotFoundVariants';
import { Baby } from '@/models/Baby/BabyModel';
import { BabyService } from '@/services/baby/babyService';
import { deleteBaby, fetchBabies, setSelectedBaby } from '@/store/slices/babySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { timeAgo } from '@/utils/timeUtils';
import Icon from '@react-native-vector-icons/fontawesome6';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const BabyListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBabies, setFilteredBabies] = useState<Baby[]>([]);

  // Redux state
  const { babies, isLoading, error } = useAppSelector((state) => state.baby);
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
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load babies on focus
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchBabies({}));
    }, [dispatch]),
  );

  // Filter babies based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBabies(babies);
    } else {
      const filtered = babies.filter(
        (baby) =>
          baby.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          baby.nickname?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredBabies(filtered);
    }
  }, [babies, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchBabies({}));
    } finally {
      setRefreshing(false);
    }
  };

  const handleBabyPress = (baby: Baby) => {
    dispatch(setSelectedBaby(baby.id));
    navigation.navigate('BabyProfile', { babyId: baby.id });
  };

  const handleCreateBaby = () => {
    navigation.navigate('CreateBaby');
  };

  const handleDeleteBaby = (baby: Baby) => {
    Alert.alert(
      'Delete Baby Profile',
      `Are you sure you want to delete ${baby.name}'s profile? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteBaby(baby.id)),
        },
      ],
    );
  };

  const getCurrentUserRelation = (baby: Baby) => {
    const member = baby.familyMembers.find((m) => m.userId === user?.id);
    return member?.relationType.replace('_', ' ') || 'Family Member';
  };

  const isPrimaryCaregiver = (baby: Baby) => {
    const member = baby.familyMembers.find((m) => m.userId === user?.id);
    return member?.isPrimary || false;
  };

  const renderBabyCard = (baby: Baby, index: number) => {
    const age = BabyService.calculateAge(baby.birthDate);
    const ageDisplay = BabyService.formatAge(age);
    const relation = getCurrentUserRelation(baby);
    const isPrimary = isPrimaryCaregiver(baby);

    return (
      <Animated.View
        key={baby.id}
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, index * 10],
              }),
            },
          ],
        }}
        className='bg-white rounded-2xl mx-4 mb-4 shadow-lg overflow-hidden'
      >
        <TouchableOpacity onPress={() => handleBabyPress(baby)} activeOpacity={0.8} className='p-5'>
          <View className='flex-row items-center mb-4'>
            {/* Avatar */}
            <View className='relative mr-4'>
              {baby.avatarUrl ? (
                <Image source={{ uri: baby.avatarUrl }} className='w-16 h-16 rounded-full' />
              ) : (
                <View
                  className='w-16 h-16 rounded-full justify-center items-center'
                  style={{
                    backgroundColor: baby.gender === 'male' ? '#DBEAFE' : '#FCE7F3',
                  }}
                >
                  <Icon
                    iconStyle='solid'
                    name='baby'
                    size={24}
                    color={baby.gender === 'male' ? '#3B82F6' : '#EC4899'}
                  />
                </View>
              )}
              {isPrimary && (
                <View className='absolute -top-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 justify-center items-center'>
                  <Icon iconStyle='solid' name='crown' size={12} color='#F59E0B' />
                </View>
              )}
            </View>

            {/* Baby Info */}
            <View className='flex-1'>
              <View className='mb-1'>
                <Text className='text-xl font-bold text-gray-800 mb-1'>{baby.name}</Text>
                {baby.nickname && <Text className='text-sm text-gray-500 italic'>"{baby.nickname}"</Text>}
              </View>

              <Text className='text-lg text-blue-500 font-semibold mb-1'>{ageDisplay}</Text>

              <View className='flex-row items-center mb-1'>
                <Icon
                  iconStyle='solid'
                  name={baby.gender === 'male' ? 'mars' : 'venus'}
                  size={12}
                  color={baby.gender === 'male' ? '#3B82F6' : '#EC4899'}
                />
                <Text className='text-sm text-gray-500 ml-1'>{baby.gender === 'male' ? 'Boy' : 'Girl'}</Text>
              </View>

              <View className='flex-row items-center'>
                <Icon iconStyle='solid' name='user' size={12} color='#8B5CF6' />
                <Text className='text-xs text-purple-600 font-medium ml-1'>
                  Your {relation}
                  {isPrimary && ' • Primary Caregiver'}
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View className='items-end'>
              <TouchableOpacity
                onPress={() => navigation.navigate('Badges', { babyId: baby.id })}
                className='bg-orange-100 p-2 rounded-xl mb-2 flex-row items-center'
              >
                <Icon iconStyle='solid' name='trophy' size={12} color='#EA580C' />
                <Text className='text-orange-600 text-xs font-semibold ml-1'>Badges</Text>
              </TouchableOpacity>

              <Text className='text-xs text-gray-400'>{timeAgo(baby.updatedAt)}</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className='flex-row justify-between items-center bg-gray-50 rounded-xl p-3'>
            <View className='items-center'>
              <View className='flex-row items-center mb-1'>
                <Icon iconStyle='solid' name='users' size={12} color='#6B7280' />
                <Text className='text-xs text-gray-500 uppercase ml-1'>Family</Text>
              </View>
              <Text className='text-sm font-bold text-gray-800'>{baby.familyMembers.length}</Text>
            </View>

            {baby.weight && (
              <View className='items-center'>
                <View className='flex-row items-center mb-1'>
                  <Icon iconStyle='solid' name='weight-scale' size={12} color='#6B7280' />
                  <Text className='text-xs text-gray-500 uppercase ml-1'>Weight</Text>
                </View>
                <Text className='text-sm font-bold text-gray-800'>{(baby.weight / 1000).toFixed(1)}kg</Text>
              </View>
            )}

            {baby.height && (
              <View className='items-center'>
                <View className='flex-row items-center mb-1'>
                  <Icon iconStyle='solid' name='ruler-vertical' size={12} color='#6B7280' />
                  <Text className='text-xs text-gray-500 uppercase ml-1'>Height</Text>
                </View>
                <Text className='text-sm font-bold text-gray-800'>{baby.height}cm</Text>
              </View>
            )}

            <View className='items-center'>
              <View className='flex-row items-center mb-1'>
                <Icon iconStyle='solid' name='heart-pulse' size={12} color='#6B7280' />
                <Text className='text-xs text-gray-500 uppercase ml-1'>Health</Text>
              </View>
              <View className='flex-row'>
                {baby.allergies?.length > 0 && (
                  <View className='bg-orange-100 px-1 rounded mr-1'>
                    <Icon iconStyle='solid' name='triangle-exclamation' size={10} color='#EA580C' />
                  </View>
                )}
                {baby.medications?.length > 0 && (
                  <View className='bg-blue-100 px-1 rounded mr-1'>
                    <Icon iconStyle='solid' name='pills' size={10} color='#3B82F6' />
                  </View>
                )}
                {!baby.allergies?.length && !baby.medications?.length && (
                  <Icon iconStyle='solid' name='check' size={12} color='#10B981' />
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Footer */}
        <View className='flex-row border-t border-gray-100'>
          <TouchableOpacity
            onPress={() => navigation.navigate('BabyFamily', { babyId: baby.id })}
            className='flex-1 py-3 items-center flex-row justify-center'
          >
            <Icon iconStyle='solid' name='users' size={14} color='#3B82F6' />
            <Text className='text-blue-500 text-sm font-medium ml-1'>Family</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('EditBaby', { babyId: baby.id })}
            className='flex-1 py-3 items-center border-l border-r border-gray-100 flex-row justify-center'
          >
            <Icon iconStyle='solid' name='pen' size={14} color='#10B981' />
            <Text className='text-green-500 text-sm font-medium ml-1'>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteBaby(baby)}
            className='flex-1 py-3 items-center flex-row justify-center'
          >
            <Icon iconStyle='solid' name='trash' size={14} color='#EF4444' />
            <Text className='text-red-500 text-sm font-medium ml-1'>Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View className='flex-1 justify-center items-center px-8'>
      <Animated.View style={{ opacity: fadeAnim }} className='items-center'>
        <View className='w-24 h-24 bg-pink-100 rounded-full justify-center items-center mb-6'>
          <Icon iconStyle='solid' name='baby' size={48} color='#EC4899' />
        </View>
        <Text className='text-2xl font-bold text-gray-800 text-center mb-3'>No Babies Yet</Text>
        <Text className='text-base text-gray-500 text-center leading-6 mb-8'>
          Start your parenting journey by adding your first baby profile. Track their growth, development, and precious
          moments.
        </Text>
        <TouchableOpacity
          onPress={handleCreateBaby}
          className='bg-gradient-to-r from-pink-400 to-pink-500 px-8 py-4 rounded-3xl shadow-lg flex-row items-center'
        >
          <Icon iconStyle='solid' name='plus' size={16} color='#ffffff' />
          <Text className='text-white text-lg font-semibold ml-2'>Add Your First Baby</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const renderSearchResults = () => (
    <View className='px-4 py-2'>
      <Text className='text-sm text-gray-500 mb-3'>
        {filteredBabies.length} result{filteredBabies.length !== 1 ? 's' : ''} found
      </Text>
      {filteredBabies.map((baby, index) => renderBabyCard(baby, index))}
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-gradient-to-br from-pink-50 to-blue-50'>
      {/* Header */}
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        className='bg-white px-4 py-4 border-b border-gray-100 shadow-sm'
      >
        <View className='flex-row justify-between items-center mb-4'>
          <View>
            <Text className='text-2xl font-bold text-gray-800'>My Babies</Text>
            <Text className='text-sm text-gray-500'>
              {babies.length} precious little one{babies.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleCreateBaby}
            className='bg-pink-500 px-4 py-2 rounded-2xl shadow-lg flex-row items-center'
          >
            <Icon iconStyle='solid' name='plus' size={14} color='#ffffff' />
            <Text className='text-white text-sm font-semibold ml-1'>Add Baby</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className='bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center'>
          <Icon iconStyle='solid' name='magnifying-glass' size={16} color='#9CA3AF' />
          <TextInput
            placeholder='Search babies...'
            placeholderTextColor='#999'
            value={searchQuery}
            onChangeText={setSearchQuery}
            className='flex-1 text-base text-gray-800 ml-3'
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon iconStyle='solid' name='xmark' size={16} color='#9CA3AF' />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Content */}
      <LoadingWithFallback
        isLoading={isLoading && !refreshing}
        error={error}
        hasData={filteredBabies.length > 0 || babies.length > 0}
        emptyStateProps={{
          type: 'general',
          onRefresh: handleRefresh,
        }}
      >
        <ScrollView
          className='flex-1'
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {filteredBabies.length === 0 && searchQuery.length === 0 ? (
            renderEmptyState()
          ) : searchQuery.length > 0 ? (
            renderSearchResults()
          ) : (
            <View className='py-4'>{filteredBabies.map((baby, index) => renderBabyCard(baby, index))}</View>
          )}
        </ScrollView>
      </LoadingWithFallback>
    </SafeAreaView>
  );
};

export default BabyListScreen;
