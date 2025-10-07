// src/screens/Badge/components/AwardBadgeBottomSheet.tsx

import { CreateBabyBadgesCollectionRequest } from '@/models/BabyBadgesCollection/BabyBadgesCollectionRequest';
import { getBadgeCategoryInfo } from '@/models/Badge/BadgeEnum';
import { Badge } from '@/models/Badge/BadgeModel';
import { awardBadge } from '@/store/slices/babyBadgesCollectionSlice';
import { searchBadges } from '@/store/slices/badgeSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AwardBadgeBottomSheetProps {
  babyId: string;
  onSuccess: () => void;
}

const AwardBadgeBottomSheet = forwardRef<BottomSheet, AwardBadgeBottomSheetProps>(({ babyId, onSuccess }, ref) => {
  const dispatch = useAppDispatch();
  const { badges } = useAppSelector((state) => state.badges);
  const { isSubmitting, babyBadges } = useAppSelector((state) => state.babyBadges);

  const [step, setStep] = useState<'select' | 'details'>('select');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [completedDate, setCompletedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState('');
  const [searchText, setSearchText] = useState('');

  const snapPoints = useMemo(() => ['90%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  // Load badges when sheet opens
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index >= 0) {
        dispatch(searchBadges({ isActive: true, limit: 100 }));
      } else {
        // Reset when closed
        setStep('select');
        setSelectedBadge(null);
        setNote('');
        setCompletedDate(new Date());
        setSearchText('');
      }
    },
    [dispatch],
  );

  // Filter out already earned badges
  const earnedBadgeIds = babyBadges.map((collection) => collection.badgeId);
  const availableBadges = badges.filter((badge) => !earnedBadgeIds.includes(badge.id));

  // Filter by search
  const filteredBadges = searchText
    ? availableBadges.filter(
        (badge) =>
          badge.title.toLowerCase().includes(searchText.toLowerCase()) ||
          badge.description.toLowerCase().includes(searchText.toLowerCase()),
      )
    : availableBadges;

  const handleBadgeSelect = useCallback((badge: Badge) => {
    setSelectedBadge(badge);
    setStep('details');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'details') {
      setStep('select');
    } else if (typeof ref === 'object' && ref?.current) {
      ref.current.close();
    }
  }, [step, ref]);

  const handleClose = useCallback(() => {
    if (typeof ref === 'object' && ref?.current) {
      ref.current.close();
    }
  }, [ref]);

  const handleAward = async () => {
    if (!selectedBadge) return;

    const request: CreateBabyBadgesCollectionRequest = {
      babyId,
      badgeId: selectedBadge.id,
      completedAt: completedDate.toISOString(),
      submissionNote: note,
      submissionMedia: [],
    };

    try {
      await dispatch(awardBadge(request)).unwrap();
      Alert.alert('Success!', 'Badge awarded successfully!', [
        {
          text: 'OK',
          onPress: () => {
            handleClose();
            onSuccess();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to award badge');
    }
  };

  const renderBadgeItem = (badge: Badge) => {
    const categoryInfo = getBadgeCategoryInfo(badge.category);

    return (
      <TouchableOpacity
        key={badge.id}
        onPress={() => handleBadgeSelect(badge)}
        className='bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center'
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

  const renderSelectBadge = () => (
    <View className='flex-1'>
      {/* Search */}
      <View className='px-6 pt-4 pb-3'>
        <View className='flex-row items-center bg-gray-100 rounded-full px-4 py-3'>
          <Icon iconStyle='solid' name='magnifying-glass' size={16} color='#9CA3AF' />
          <TextInput
            className='flex-1 ml-3 text-base text-gray-900'
            placeholder='Search badges...'
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor='#9CA3AF'
          />
        </View>
      </View>

      {/* Badge List */}
      <BottomSheetScrollView className='flex-1 px-6'>
        {filteredBadges.length > 0 ? (
          <>
            {filteredBadges.map(renderBadgeItem)}
            {/* Extra spacing */}
            <View className='h-20' />
          </>
        ) : (
          <View className='flex-1 items-center justify-center py-20'>
            <Icon iconStyle='solid' name='trophy' size={48} color='#D1D5DB' />
            <Text className='text-lg font-semibold text-gray-500 mt-4'>No badges available</Text>
          </View>
        )}
      </BottomSheetScrollView>
    </View>
  );

  const renderBadgeDetails = () => {
    if (!selectedBadge) return null;

    const categoryInfo = getBadgeCategoryInfo(selectedBadge.category);

    return (
      <>
        <BottomSheetScrollView className='flex-1 px-6 py-4'>
          {/* Selected Badge Preview */}
          <View className='bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 mb-6'>
            <View
              className='w-24 h-24 rounded-2xl items-center justify-center mx-auto mb-4'
              style={{ backgroundColor: `${categoryInfo.color}30` }}
            >
              {selectedBadge.iconUrl ? (
                <Image source={{ uri: selectedBadge.iconUrl }} className='w-20 h-20' />
              ) : (
                <Icon iconStyle='solid' name={categoryInfo.icon as any} size={48} color={categoryInfo.color} />
              )}
            </View>
            <Text className='text-2xl font-bold text-gray-900 text-center mb-2'>{selectedBadge.title}</Text>
            <Text className='text-base text-gray-600 text-center'>{selectedBadge.description}</Text>
          </View>

          {/* Completion Date */}
          <View className='mb-6'>
            <Text className='text-base font-semibold text-gray-900 mb-3'>When was this completed?</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className='flex-row items-center bg-white rounded-2xl px-4 py-4 shadow-sm'
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
            <Text className='text-base font-semibold text-gray-900 mb-3'>Add a note (optional)</Text>
            <TextInput
              className='bg-white rounded-2xl px-4 py-3 text-base text-gray-900 shadow-sm min-h-[100px]'
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

          {/* Extra spacing */}
          <View className='h-20' />

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={completedDate}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setCompletedDate(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}
        </BottomSheetScrollView>

        {/* Footer - Award Button */}
        <View className='px-6 py-4 border-t border-gray-200 bg-white'>
          <TouchableOpacity
            onPress={handleAward}
            disabled={isSubmitting}
            className='bg-amber-500 py-4 rounded-full items-center disabled:opacity-50'
          >
            {isSubmitting ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text className='text-base font-semibold text-white'>Award Badge</Text>
            )}
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#FFFFFF' }}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
      onChange={handleSheetChanges}
    >
      {/* Header */}
      <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-200'>
        <TouchableOpacity onPress={handleBack} className='p-2'>
          <Icon iconStyle='solid' name='chevron-left' size={20} color='#6B7280' />
        </TouchableOpacity>
        <Text className='text-xl font-bold text-gray-900'>{step === 'select' ? 'Select Badge' : 'Award Badge'}</Text>
        <TouchableOpacity onPress={handleClose} className='p-2'>
          <Icon iconStyle='solid' name='xmark' size={20} color='#6B7280' />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {step === 'select' ? renderSelectBadge() : renderBadgeDetails()}
    </BottomSheet>
  );
});

AwardBadgeBottomSheet.displayName = 'AwardBadgeBottomSheet';

export default AwardBadgeBottomSheet;
