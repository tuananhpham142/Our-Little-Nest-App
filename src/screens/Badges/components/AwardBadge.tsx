/* eslint-disable react-hooks/exhaustive-deps */
// src/screens/Badge/components/AwardBadgeBottomSheet.tsx

import { CreateBabyBadgesCollectionRequest } from '@/models/BabyBadgesCollection/BabyBadgesCollectionRequest';
import { getBadgeCategoryInfo } from '@/models/Badge/BadgeEnum';
import { Badge } from '@/models/Badge/BadgeModel';
import { awardBadge } from '@/store/slices/babyBadgesCollectionSlice';
import { fetchBabies } from '@/store/slices/babySlice';
import { fetchBadgeById } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { RootStackNavigationProp } from '@/types/navigation';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AwardBadgeBottomSheetProps {
  visible: boolean;
  badgeId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AwardBadgeBottomSheet = forwardRef<BottomSheet, AwardBadgeBottomSheetProps>(
  ({ visible, badgeId: initialBadgeId, onClose, onSuccess }, ref) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootStackNavigationProp>();
    const insets = useSafeAreaInsets();
    const { height: screenHeight } = useWindowDimensions();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const { badges, currentBadge } = useAppSelector((state) => state.badges);
    const { isSubmitting, babyBadges } = useAppSelector((state) => state.babyBadges);
    const { babies } = useAppSelector((state) => state.baby);

    // Local state
    const [step, setStep] = useState<'selectBaby' | 'selectBadge' | 'details'>('selectBaby');
    const [selectedBaby, setSelectedBaby] = useState<any>(null);
    // const [currentBadge, setcurrentBadge] = useState<Badge | null>(null);
    const [completedDate, setCompletedDate] = useState(new Date());
    const [tempDate, setTempDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [note, setNote] = useState('');
    const [searchText, setSearchText] = useState('');

    // Snap points with better calculation
    const snapPoints = useMemo(() => {
      const minHeight = Math.min(screenHeight * 0.85, 700);
      const maxHeight = screenHeight * 0.9;
      return [minHeight, maxHeight];
    }, [screenHeight]);

    // Spring animation config
    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      overshootClamping: true,
      stiffness: 500,
    });

    // Handle visibility
    useEffect(() => {
      if (visible && initialBadgeId) {
        Keyboard.dismiss();
        bottomSheetRef.current?.snapToIndex(0);

        // Load data
        dispatch(fetchBabies({}));
        dispatch(fetchBadgeById(initialBadgeId));

        // Pre-select badge if provided
        // if (initialBadgeId) {
        //   const badge = badges.find((b) => b.id === initialBadgeId);
        //   if (badge) {
        //     setcurrentBadge(badge);
        //     setStep('selectBaby');
        //   }
        // }
      } else {
        bottomSheetRef.current?.close();
      }
    }, [visible, dispatch, initialBadgeId, badges]);

    // Reset when closed
    const handleReset = useCallback(() => {
      setStep('selectBaby');
      setSelectedBaby(null);
      setNote('');
      setCompletedDate(new Date());
      setSearchText('');
    }, [initialBadgeId]);

    // Filter badges
    const earnedBadgeIds = selectedBaby
      ? babyBadges.filter((b) => b.babyId === selectedBaby.id).map((collection) => collection.badgeId)
      : [];
    const availableBadges = badges.filter((badge) => !earnedBadgeIds.includes(badge.id));
    const filteredBadges = searchText
      ? availableBadges.filter(
          (badge) =>
            badge.title.toLowerCase().includes(searchText.toLowerCase()) ||
            badge.description.toLowerCase().includes(searchText.toLowerCase()),
        )
      : availableBadges;

    const handleBabySelect = useCallback(
      (baby: any) => {
        setSelectedBaby(baby);
        if (initialBadgeId && currentBadge) {
          setStep('details');
        } else {
          setStep('selectBadge');
        }
      },
      [initialBadgeId, currentBadge],
    );

    const handleBadgeSelect = useCallback((badge: Badge) => {
      setStep('details');
    }, []);

    const handleBack = useCallback(() => {
      if (step === 'details') {
        if (initialBadgeId) {
          setStep('selectBaby');
        } else {
          setStep('selectBadge');
        }
      } else if (step === 'selectBadge') {
        setStep('selectBaby');
      } else {
        bottomSheetRef.current?.close();
      }
    }, [step, initialBadgeId]);

    const handleClose = useCallback(() => {
      bottomSheetRef.current?.close();
    }, []);

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
        handleClose();

        // Navigate to celebration screen
        navigation.navigate('AwardBadge', {
          badgeId: currentBadge.id,
          // babyId: selectedBaby.id,
          // babyName: selectedBaby.name,
          // babyAvatar: selectedBaby.avatar,
        });

        onSuccess();
      } catch (error: any) {
        Alert.alert('Error', error || 'Failed to award badge');
      }
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          pressBehavior='close'
          enableTouchThrough={false}
        />
      ),
      [],
    );

    const renderFooter = useCallback(
      (props: any) => {
        if (step !== 'details') return null;

        return (
          <BottomSheetFooter {...props} bottomInset={insets.bottom}>
            <View className='px-5 pt-4 pb-4 bg-white border-t border-gray-100'>
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
          </BottomSheetFooter>
        );
      },
      [step, insets.bottom, handleAward, isSubmitting],
    );

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          handleReset();
          onClose();
        }
      },
      [onClose, handleReset],
    );

    const getStepTitle = () => {
      switch (step) {
        case 'selectBaby':
          return 'Select Baby';
        case 'selectBadge':
          return 'Select Badge';
        case 'details':
          return 'Award Badge';
        default:
          return '';
      }
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

    const renderBadgeItem = (badge: Badge) => {
      const categoryInfo = getBadgeCategoryInfo(badge.category);

      return (
        <TouchableOpacity
          key={badge.id}
          onPress={() => handleBadgeSelect(badge)}
          className='bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center'
          activeOpacity={0.7}
        >
          <View
            className='w-14 h-14 rounded-xl items-center justify-center mr-3'
            style={{ backgroundColor: `${categoryInfo.color}20` }}
          >
            {badge.iconUrl ? (
              <Image source={{ uri: badge.iconUrl }} className='w-10 h-10' />
            ) : (
              <Icon iconStyle='solid' name={categoryInfo.icon as any} size={24} color={categoryInfo.color} />
            )}
          </View>
          <View className='flex-1'>
            <Text className='text-base font-semibold text-gray-900 mb-1'>{badge.title}</Text>
            <Text className='text-sm text-gray-600' numberOfLines={1}>
              {badge.description}
            </Text>
          </View>
          <Icon iconStyle='solid' name='chevron-right' size={16} color='#9CA3AF' />
        </TouchableOpacity>
      );
    };

    const renderSelectBaby = () => (
      <View className='px-5 py-4'>
        <Text className='text-sm font-semibold text-gray-600 mb-3'>Choose which baby earned this badge</Text>
        {babies.map(renderBabyItem)}
      </View>
    );

    const renderSelectBadge = () => (
      <View className='flex-1'>
        {/* Search */}
        <View className='px-5 py-4 border-b border-gray-100'>
          <View className='flex-row items-center bg-gray-100 rounded-full px-4 py-3 mb-2'>
            <Icon iconStyle='solid' name='magnifying-glass' size={16} color='#9CA3AF' />
            <TextInput
              className='flex-1 ml-3 text-base text-gray-900'
              placeholder='Search badges...'
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor='#9CA3AF'
            />
          </View>
          {selectedBaby && (
            <View className='flex-row items-center'>
              <Text className='text-sm text-gray-600'>For: </Text>
              <Text className='text-sm font-semibold text-gray-900'>{selectedBaby.name}</Text>
            </View>
          )}
        </View>

        {/* Badge List */}
        <View className='px-5 py-2'>
          {filteredBadges.length > 0 ? (
            filteredBadges.map(renderBadgeItem)
          ) : (
            <View className='items-center justify-center py-20'>
              <Icon iconStyle='solid' name='trophy' size={48} color='#D1D5DB' />
              <Text className='text-lg font-semibold text-gray-500 mt-4'>No badges available</Text>
            </View>
          )}
        </View>
      </View>
    );

    const renderBadgeDetails = () => {
      if (!currentBadge) return null;

      const categoryInfo = getBadgeCategoryInfo(currentBadge.category);

      return (
        <View className='flex-1'>
          {/* Badge Preview */}
          <View className='px-5 py-4 border-b border-gray-100'>
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
            <View className='mb-4'>
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

    if (!visible) return null;

    return (
      <>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          footerComponent={renderFooter}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
          enableOverDrag={true}
          handleIndicatorStyle={{
            backgroundColor: '#F59E0B',
            width: 40,
            height: 4,
          }}
          backgroundStyle={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
          }}
          animationConfigs={animationConfigs}
          keyboardBehavior='interactive'
          keyboardBlurBehavior='restore'
          android_keyboardInputMode='adjustResize'
        >
          {/* Header */}
          <BottomSheetView className='flex-row items-center justify-between px-5 pt-2 pb-4 border-b border-gray-100'>
            <TouchableOpacity
              onPress={handleBack}
              className='p-1 -ml-1'
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon iconStyle='solid' name='chevron-left' size={24} color='#333' />
            </TouchableOpacity>
            <Text className='text-lg font-semibold text-gray-800'>{getStepTitle()}</Text>
            <TouchableOpacity
              onPress={handleClose}
              className='p-1 -mr-1'
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon iconStyle='solid' name='x' size={24} color='#333' />
            </TouchableOpacity>
          </BottomSheetView>

          <BottomSheetScrollView
            contentContainerStyle={{
              paddingBottom: step === 'details' ? 80 : 20,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            bounces={true}
            overScrollMode='always'
          >
            {step === 'selectBaby' && renderSelectBaby()}
            {step === 'selectBadge' && renderSelectBadge()}
            {step === 'details' && renderBadgeDetails()}
          </BottomSheetScrollView>
        </BottomSheet>

        {/* Date Picker Modal */}
        {renderDatePicker()}
      </>
    );
  },
);

AwardBadgeBottomSheet.displayName = 'AwardBadgeBottomSheet';

export default AwardBadgeBottomSheet;
