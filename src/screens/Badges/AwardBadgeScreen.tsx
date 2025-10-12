// src/screens/Badge/AwardBadgeScreen/index.tsx

import AppLayout from '@/components/layout/AppLayout';
import { CreateBabyBadgesCollectionRequest } from '@/models/BabyBadgesCollection/BabyBadgesCollectionRequest';
import { getBadgeCategoryInfo } from '@/models/Badge/BadgeEnum';
import { awardBadge } from '@/store/slices/babyBadgesCollectionSlice';
import { fetchBabies } from '@/store/slices/babySlice';
import { fetchBadgeById } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { RootStackNavigationProp, RouteProps } from '@/types/navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const AwardBadgeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProps<'AwardBadge'>>();
  const { badgeId } = route.params;
  const dispatch = useAppDispatch();

  const { currentBadge } = useAppSelector((state) => state.badges);
  const { isSubmitting, babyBadges } = useAppSelector((state) => state.babyBadges);
  const { babies } = useAppSelector((state) => state.baby);

  // Local state
  const [step, setStep] = useState<'selectBaby' | 'details' | 'celebration'>('selectBaby');
  const [selectedBaby, setSelectedBaby] = useState<any>(null);
  const [completedDate, setCompletedDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState('');

  // Animation values for celebration
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const starAnim1 = useRef(new Animated.Value(0)).current;
  const starAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchBabies({}));
    if (badgeId) {
      dispatch(fetchBadgeById(badgeId));
    }
  }, [dispatch, badgeId]);

  // Start celebration animations
  useEffect(() => {
    if (step === 'celebration') {
      // Badge float animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -20,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Scale animation (pop in)
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Star animations
      Animated.loop(
        Animated.timing(starAnim1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();

      Animated.loop(
        Animated.timing(starAnim2, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [step, floatAnim, scaleAnim, starAnim1, starAnim2]);

  const handleBabySelect = useCallback((baby: any) => {
    setSelectedBaby(baby);
    setStep('details');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'details') {
      setStep('selectBaby');
    } else if (step === 'celebration') {
      // Can't go back from celebration
      return;
    } else {
      navigation.goBack();
    }
  }, [step, navigation]);

  const handleDatePickerClose = useCallback(() => {
    setShowDatePicker(false);
    setTempDate(completedDate);
  }, [completedDate]);

  const handleDatePickerSave = useCallback(() => {
    setCompletedDate(tempDate);
    setShowDatePicker(false);
  }, [tempDate]);

  const handleAward = async () => {
    if (!currentBadge || !selectedBaby) return;

    const request: CreateBabyBadgesCollectionRequest = {
      babyId: selectedBaby.id,
      badgeId: currentBadge.id,
      completedAt: completedDate.toISOString(),
      submissionNote: note,
      submissionMedia: [],
    };

    try {
      await dispatch(awardBadge(request)).unwrap();
      // Show celebration step
      setStep('celebration');
    } catch (error: any) {}
  };

  const handleContinue = () => {
    navigation.navigate('BabyBadges', {
      babyId: selectedBaby.id,
      babyName: selectedBaby.name,
      babyAvatar: selectedBaby.avatar,
    });
  };

  const getAge = (baby: any) => {
    if (!baby.birthDate) return null;
    const birth = new Date(baby.birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return `${years}y ${remainingMonths}m`;
    }
    return `${months} months`;
  };

  const renderBabyItem = (baby: any) => (
    <TouchableOpacity
      key={baby.id}
      onPress={() => handleBabySelect(baby)}
      className='bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center'
      activeOpacity={0.7}
    >
      <View className='w-14 h-14 rounded-full bg-amber-100 items-center justify-center mr-3'>
        {baby.avatar ? (
          <Image source={{ uri: baby.avatar }} className='w-full h-full rounded-full' />
        ) : (
          <Icon iconStyle='solid' name='baby' size={24} color='#F59E0B' />
        )}
      </View>
      <View className='flex-1'>
        <Text className='text-base font-semibold text-gray-900'>{baby.name}</Text>
        {getAge(baby) && <Text className='text-sm text-gray-600'>{getAge(baby)}</Text>}
      </View>
      <Icon iconStyle='solid' name='chevron-right' size={16} color='#9CA3AF' />
    </TouchableOpacity>
  );

  const renderSelectBaby = () => (
    <ScrollView className='flex-1 px-5 py-6'>
      <Text className='text-sm font-semibold text-gray-600 mb-4'>Choose which baby earned this badge</Text>
      {babies.map(renderBabyItem)}
    </ScrollView>
  );

  const renderBadgeDetails = () => {
    if (!currentBadge) return null;

    const categoryInfo = getBadgeCategoryInfo(currentBadge.category);

    return (
      <AppLayout>
        <ScrollView className='flex-1'>
          {/* Badge Preview */}
          <View className='px-5 py-4'>
            <View className='bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6'>
              <View
                className='w-24 h-24 rounded-2xl items-center justify-center mx-auto mb-4'
                style={{ backgroundColor: `${categoryInfo.color}30` }}
              >
                {currentBadge.iconUrl ? (
                  <Image source={{ uri: currentBadge.iconUrl }} className='w-20 h-20' />
                ) : (
                  <Icon iconStyle='solid' name={categoryInfo.icon as any} size={48} color={categoryInfo.color} />
                )}
              </View>
              <Text className='text-2xl font-bold text-gray-900 text-center mb-2'>{currentBadge.title}</Text>
              <Text className='text-base text-gray-600 text-center'>{currentBadge.description}</Text>
            </View>
          </View>

          {/* Form Fields */}
          <View className='px-5 py-4'>
            {/* Completion Date */}
            <View className='mb-4'>
              <Text className='text-sm font-semibold text-gray-600 mb-2'>When was this completed?</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className='flex-row items-center bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100'
                activeOpacity={0.7}
              >
                <Icon iconStyle='solid' name='calendar' size={20} color='#F59E0B' />
                <Text className='flex-1 ml-3 text-base text-gray-900'>
                  {completedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <Icon iconStyle='solid' name='chevron-down' size={16} color='#9CA3AF' />
              </TouchableOpacity>
            </View>

            {/* Note */}
            <View className='mb-6'>
              <Text className='text-sm font-semibold text-gray-600 mb-2'>Add a note (optional)</Text>
              <TextInput
                className='bg-white rounded-2xl px-4 py-3 text-base text-gray-900 shadow-sm border border-gray-100 min-h-[100px]'
                placeholder='Share your thoughts about this milestone...'
                value={note}
                onChangeText={setNote}
                multiline
                textAlignVertical='top'
                placeholderTextColor='#9CA3AF'
                maxLength={500}
              />
              <Text className='text-sm text-gray-500 mt-2 text-right'>{note.length}/500</Text>
            </View>
          </View>
        </ScrollView>
      </AppLayout>
    );
  };

  const renderCelebration = () => {
    if (!currentBadge || !selectedBaby) return null;

    const categoryInfo = getBadgeCategoryInfo(currentBadge.category);
    const earnedCount = babyBadges.filter((b) => b.babyId === selectedBaby.id).length;

    return (
      <View className='flex-1' style={{ backgroundColor: '#FFF8DC' }}>
        {/* Decorative Background */}
        <View className='absolute inset-0' style={{ backgroundColor: '#FFE4B5' }}>
          {/* Animated stars */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 50,
              left: 40,
              opacity: starAnim1.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 1, 0.3],
              }),
            }}
          >
            <Icon iconStyle='solid' name='star' size={24} color='#FCD34D' />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              top: 100,
              right: 60,
              opacity: starAnim2.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.5, 1, 0.5],
              }),
            }}
          >
            <Icon iconStyle='solid' name='star' size={32} color='#FCD34D' />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 200,
              left: 60,
              opacity: starAnim1.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.4, 1, 0.4],
              }),
            }}
          >
            <Icon iconStyle='solid' name='star' size={20} color='#FCD34D' />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 250,
              right: 40,
              opacity: starAnim2.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.6, 1, 0.6],
              }),
            }}
          >
            <Icon iconStyle='solid' name='star' size={28} color='#FCD34D' />
          </Animated.View>
        </View>

        {/* Content */}
        <View className='flex-1 items-center justify-center px-6'>
          {/* Floating Badge Icon */}
          <Animated.View
            style={{
              transform: [{ translateY: floatAnim }, { scale: scaleAnim }],
              marginBottom: 40,
            }}
          >
            <View
              className='w-32 h-32 rounded-3xl items-center justify-center shadow-xl'
              style={{
                backgroundColor: categoryInfo ? `${categoryInfo.color}30` : '#FCD34D',
                shadowColor: categoryInfo?.color || '#F59E0B',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              {currentBadge.iconUrl ? (
                <Image source={{ uri: currentBadge.iconUrl }} className='w-28 h-28' resizeMode='contain' />
              ) : (
                <Icon
                  iconStyle='solid'
                  name={(categoryInfo?.icon as any) || 'trophy'}
                  size={80}
                  color={categoryInfo?.color || '#F59E0B'}
                />
              )}
            </View>
          </Animated.View>

          {/* Baby Character */}
          <View className='mb-8'>
            <View className='w-32 h-32 rounded-full bg-white items-center justify-center shadow-lg'>
              {selectedBaby.avatar ? (
                <Image source={{ uri: selectedBaby.avatar }} className='w-full h-full rounded-full' />
              ) : (
                <Icon iconStyle='solid' name='baby' size={64} color='#F59E0B' />
              )}
            </View>
          </View>

          {/* Text */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text className='text-2xl font-semibold text-center mb-2' style={{ color: '#6B7280' }}>
              Badge Unlocked
            </Text>
            <Text className='text-4xl font-bold text-center mb-6' style={{ color: '#78350F' }}>
              {currentBadge.title}!
            </Text>
          </Animated.View>

          {/* Progress Indicators */}
          <View className='flex-row items-center justify-center mb-8'>
            {Array.from({ length: Math.min(earnedCount, 4) }).map((_, index) => (
              <View
                key={`earned-${index}`}
                className='w-14 h-14 rounded-2xl bg-white items-center justify-center mx-1 shadow-md'
              >
                <Icon iconStyle='solid' name={(categoryInfo?.icon as any) || 'trophy'} size={24} color='#F59E0B' />
              </View>
            ))}
            {Array.from({
              length: Math.max(0, Math.min(4 - earnedCount, 4)),
            }).map((_, index) => (
              <View
                key={`locked-${index}`}
                className='w-14 h-14 rounded-2xl bg-white/50 items-center justify-center mx-1'
              >
                <Icon iconStyle='solid' name='question' size={24} color='#9CA3AF' />
              </View>
            ))}
          </View>

          {/* Progress Text */}
          <Text className='text-lg font-semibold mb-12' style={{ color: '#78350F' }}>
            {earnedCount} badges collected
          </Text>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            className='bg-amber-500 px-12 py-4 rounded-full shadow-lg'
            style={{
              shadowColor: '#F59E0B',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className='text-white text-lg font-bold'>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDatePicker = () => (
    <Modal visible={showDatePicker} transparent animationType='slide' onRequestClose={handleDatePickerClose}>
      <View className='flex-1 justify-end'>
        <View className='bg-white rounded-t-3xl'>
          <View className='flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-100'>
            <TouchableOpacity onPress={handleDatePickerClose}>
              <Text className='text-blue-600 font-medium text-base'>Close</Text>
            </TouchableOpacity>

            <Text className='font-semibold text-lg text-gray-900'>Select Completion Date</Text>

            <TouchableOpacity onPress={handleDatePickerSave}>
              <Text className='font-medium text-base text-blue-600'>Save</Text>
            </TouchableOpacity>
          </View>

          <View className='p-4'>
            <DateTimePicker
              value={tempDate}
              mode='date'
              display='spinner'
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setTempDate(selectedDate);
                }
              }}
              textColor='#000000'
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const getStepTitle = () => {
    switch (step) {
      case 'selectBaby':
        return 'Select Baby';
      case 'details':
        return 'Award Badge';
      case 'celebration':
        return '';
      default:
        return '';
    }
  };

  return (
    <AppLayout>
      <View className='flex-1 bg-white'>
        {/* Header - Hide on celebration */}
        {step !== 'celebration' && (
          <View className='flex-row items-center justify-between px-5 py-4 border-b border-gray-100'>
            <TouchableOpacity
              onPress={handleBack}
              className='p-1'
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon iconStyle='solid' name='chevron-left' size={24} color='#333' />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-gray-800'>{getStepTitle()}</Text>
            <View className='w-6' />
          </View>
        )}

        {/* Content */}
        {step === 'selectBaby' && renderSelectBaby()}
        {step === 'details' && renderBadgeDetails()}
        {step === 'celebration' && renderCelebration()}

        {/* Award Button - Only on details step */}
        {step === 'details' && (
          <View className='px-5 py-4 border-t border-gray-100 bg-white'>
            <TouchableOpacity
              onPress={handleAward}
              disabled={isSubmitting}
              className='py-4 items-center rounded-full bg-amber-500 disabled:opacity-50'
              activeOpacity={0.7}
            >
              {isSubmitting ? (
                <ActivityIndicator color='#FFFFFF' />
              ) : (
                <Text className='text-base font-semibold text-white'>Award Badge</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Date Picker Modal */}
        {renderDatePicker()}
      </View>
    </AppLayout>
  );
};

export default AwardBadgeScreen;
