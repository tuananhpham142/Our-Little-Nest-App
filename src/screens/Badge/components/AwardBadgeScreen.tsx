// src/screens/Badge/AwardBadgeScreen.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import { format, formatISO } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAwardBadge } from '@/hooks/useBadgeCollection';
import { Badge } from '@/models/Badge/BadgeModel';
import { AwardBadgeFormData, BadgeCollectionFormValidation } from '@/models/BadgeCollection/BadgeCollectionUIForm';
import { formatCategory, formatDifficulty, getCategoryColor, getCategoryIcon } from '@/utils/badgeUtils';

interface Props {
  navigation: any;
  route: {
    params: {
      babyId?: string;
      badgeId?: string;
    };
  };
}

const AwardBadgeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { babyId: defaultBabyId, badgeId: defaultBadgeId } = route.params || {};

  const { awardBadge, isSubmitting, error, clearError } = useAwardBadge();

  // Form state
  const [formData, setFormData] = useState<AwardBadgeFormData>({
    babyId: defaultBabyId || '',
    badgeId: defaultBadgeId || '',
    completedAt: new Date(),
    submissionNote: '',
    mediaFiles: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Animation values
  const formScale = useSharedValue(1);
  const submitButtonScale = useSharedValue(1);

  // Mock baby data (in real app, this would come from baby context/hook)
  const babies = useMemo(
    () => [
      { id: '1', name: 'Emma', age: 8 },
      { id: '2', name: 'Liam', age: 15 },
      { id: '3', name: 'Oliver', age: 22 },
    ],
    [],
  );

  // Get selected baby details
  const selectedBaby = useMemo(() => {
    return babies.find((b) => b.id === formData.babyId);
  }, [babies, formData.babyId]);

  // Clear errors when they occur
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Form validation
  const validateForm = useCallback(() => {
    const validation = BadgeCollectionFormValidation.validateAwardBadgeForm(formData);
    setErrors(validation.errors.map((e) => e.message));
    return validation.isValid;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      formScale.value = withSequence(
        withTiming(1.02, { duration: 100 }),
        withTiming(0.98, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
      return;
    }

    try {
      submitButtonScale.value = withSpring(0.95);

      await awardBadge({
        babyId: formData.babyId,
        badgeId: formData.badgeId,
        completedAt: formatISO(formData.completedAt),
        submissionNote: formData.submissionNote,
        submissionMedia: formData.mediaFiles.map((f) => f.uri),
      });

      // Success feedback
      submitButtonScale.value = withSpring(1);

      Alert.alert('Badge Awarded!', 'The badge has been successfully awarded and is pending verification.', [
        {
          text: 'View Collection',
          onPress: () =>
            navigation.navigate('BadgeCollection', {
              babyId: formData.babyId,
              babyName: selectedBaby?.name,
            }),
        },
        {
          text: 'Award Another',
          onPress: () => {
            setFormData({
              babyId: formData.babyId,
              badgeId: '',
              completedAt: new Date(),
              submissionNote: '',
              mediaFiles: [],
            });
            setSelectedBadge(null);
          },
        },
      ]);
    } catch (err) {
      submitButtonScale.value = withSpring(1);
      Alert.alert('Error', 'Failed to award badge. Please try again.');
    }
  }, [validateForm, awardBadge, formData, navigation, selectedBaby, formScale, submitButtonScale]);

  // Handle badge selection navigation
  const handleBadgeSelection = useCallback(() => {
    navigation.navigate('BadgeSelection', {
      selectedBabyAge: selectedBaby?.age,
      selectedBabyName: selectedBaby?.name,
      onSelectBadge: (badge: Badge) => {
        setFormData((prev) => ({ ...prev, badgeId: badge.id }));
        setSelectedBadge(badge);
      },
    });
  }, [navigation, selectedBaby]);

  // Date picker handlers
  const handleDatePickerOpen = () => {
    setTempDate(formData.completedAt as Date);
    setShowDatePicker(true);
  };

  const handleDatePickerSave = () => {
    setFormData((prev) => ({ ...prev, completedAt: tempDate }));
    setShowDatePicker(false);
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
  };

  // Animation styles
  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: formScale.value }],
  }));

  const submitButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitButtonScale.value }],
  }));

  // Render baby selector
  const renderBabySelector = () => (
    <Animated.View entering={FadeInUp.delay(100)} className='mb-6'>
      <Text className='text-lg font-semibold text-gray-800 mb-3'>Select Baby</Text>
      <View className='flex-row flex-wrap'>
        {babies.map((baby) => (
          <TouchableOpacity
            key={baby.id}
            onPress={() => setFormData((prev) => ({ ...prev, babyId: baby.id }))}
            className={`flex-row items-center px-4 py-3 rounded-xl mr-3 mb-3 ${
              formData.babyId === baby.id ? 'bg-blue-500' : 'bg-gray-100'
            }`}
          >
            <View
              className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                formData.babyId === baby.id ? 'bg-blue-400' : 'bg-gray-200'
              }`}
            >
              <Icon name='baby' iconStyle='solid' size={16} color={formData.babyId === baby.id ? 'white' : '#9CA3AF'} />
            </View>
            <View>
              <Text className={`font-semibold ${formData.babyId === baby.id ? 'text-white' : 'text-gray-800'}`}>
                {baby.name}
              </Text>
              <Text className={`text-sm ${formData.babyId === baby.id ? 'text-blue-100' : 'text-gray-500'}`}>
                {baby.age} months
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // Render badge selector
  const renderBadgeSelector = () => (
    <Animated.View entering={FadeInUp.delay(200)} className='mb-6'>
      <Text className='text-lg font-semibold text-gray-800 mb-3'>Select Badge</Text>

      {selectedBadge ? (
        <TouchableOpacity onPress={handleBadgeSelection} className='bg-white border-2 border-blue-500 rounded-xl p-4'>
          <View className='flex-row items-center'>
            <View
              className='w-12 h-12 rounded-full items-center justify-center mr-4'
              style={{ backgroundColor: getCategoryColor(selectedBadge.category) + '20' }}
            >
              <Icon
                name={getCategoryIcon(selectedBadge.category) as any}
                iconStyle='solid'
                size={20}
                color={getCategoryColor(selectedBadge.category)}
              />
            </View>
            <View className='flex-1'>
              <Text className='text-lg font-semibold text-gray-800'>{selectedBadge.title}</Text>
              <Text className='text-gray-500'>
                {formatCategory(selectedBadge.category)} • {formatDifficulty(selectedBadge.difficulty)}
              </Text>
            </View>
            <Icon name='chevron-right' iconStyle='solid' size={16} color='#3B82F6' />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleBadgeSelection}
          className='bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 items-center'
          disabled={!formData.babyId}
        >
          <Icon name='plus' iconStyle='solid' size={32} color='#9CA3AF' />
          <Text className='text-gray-600 font-medium mt-2'>Choose a Badge</Text>
          <Text className='text-gray-500 text-sm mt-1'>
            {!formData.babyId ? 'Select a baby first' : 'Find the perfect badge'}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  // Render completion date selector
  const renderDateSelector = () => (
    <Animated.View entering={FadeInUp.delay(300)} className='mb-6'>
      <Text className='text-lg font-semibold text-gray-800 mb-3'>Completion Date</Text>
      <TouchableOpacity
        onPress={handleDatePickerOpen}
        className='bg-white rounded-xl p-4 flex-row items-center justify-between border border-gray-200'
      >
        <View className='flex-row items-center'>
          <Icon name='calendar' iconStyle='solid' size={16} color='#3B82F6' />
          <Text className='text-gray-800 ml-3'>{format(formData.completedAt, 'PPPP')}</Text>
        </View>
        <Icon name='chevron-right' iconStyle='solid' size={16} color='#9CA3AF' />
      </TouchableOpacity>
    </Animated.View>
  );

  // Render note input
  const renderNoteInput = () => (
    <Animated.View entering={FadeInUp.delay(400)} className='mb-6'>
      <Text className='text-lg font-semibold text-gray-800 mb-3'>Add a Note (Optional)</Text>
      <TextInput
        value={formData.submissionNote}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, submissionNote: text }))}
        placeholder='Describe this achievement...'
        multiline
        numberOfLines={4}
        maxLength={500}
        className='bg-white rounded-xl p-4 border border-gray-200 text-gray-800'
        placeholderTextColor='#9CA3AF'
        textAlignVertical='top'
      />
      <Text className='text-gray-500 text-sm mt-2'>{formData.submissionNote.length}/500 characters</Text>
    </Animated.View>
  );

  // Render date picker modal
  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal visible={showDatePicker} transparent animationType='slide' onRequestClose={handleDatePickerClose}>
          <View className='flex-1 justify-end bg-black bg-opacity-50'>
            <View className='bg-white rounded-t-3xl'>
              <View className='flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-100'>
                <TouchableOpacity onPress={handleDatePickerClose}>
                  <Text className='text-blue-600 font-medium text-base'>Cancel</Text>
                </TouchableOpacity>

                <Text className='font-semibold text-lg text-gray-900'>Select Date</Text>

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
                  minimumDate={new Date(1900, 0, 1)}
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
    }

    // Android
    return (
      showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode='date'
          display='default'
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate && event.type === 'set') {
              setFormData((prev) => ({ ...prev, completedAt: selectedDate }));
            }
          }}
          textColor='#000000'
        />
      )
    );
  };

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

          <Text className='text-xl font-bold text-gray-800'>Award Badge</Text>

          <View className='w-10' />
        </View>
      </View>

      {/* Content */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View style={formAnimatedStyle} className='flex-1'>
          <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
            {renderBabySelector()}
            {formData.babyId && renderBadgeSelector()}
            {formData.badgeId && renderDateSelector()}
            {formData.badgeId && renderNoteInput()}

            {/* Error Messages */}
            {(errors.length > 0 || error) && (
              <Animated.View entering={FadeInDown} className='mb-6'>
                <View className='bg-red-50 border border-red-200 rounded-xl p-4'>
                  <Text className='text-red-800 font-semibold mb-2'>Please fix the following:</Text>
                  {errors.map((errorMsg, index) => (
                    <Text key={index} className='text-red-700 text-sm'>
                      • {errorMsg}
                    </Text>
                  ))}
                  {error && <Text className='text-red-700 text-sm'>• {error}</Text>}
                </View>
              </Animated.View>
            )}

            {/* Success Tips */}
            {formData.babyId && formData.badgeId && (
              <Animated.View entering={FadeInUp.delay(500)} className='mb-6'>
                <View className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
                  <Text className='text-blue-800 font-semibold mb-2'>💡 Tips for Success</Text>
                  <Text className='text-blue-700 text-sm'>
                    • Be specific in your note to help with verification{'\n'}• Choose the actual date the achievement
                    occurred{'\n'}• Consider adding photos to document the milestone
                  </Text>
                </View>
              </Animated.View>
            )}

            <View className='h-20' />
          </ScrollView>

          {/* Submit Button */}
          <View className='p-4 bg-white border-t border-gray-200'>
            <Animated.View style={submitButtonAnimatedStyle}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting || !formData.babyId || !formData.badgeId}
                className={`py-4 rounded-xl items-center ${
                  isSubmitting || !formData.babyId || !formData.badgeId ? 'bg-gray-300' : 'bg-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <ActivityIndicator color='white' />
                ) : (
                  <View className='flex-row items-center'>
                    <Icon name='trophy' iconStyle='solid' size={16} color='white' />
                    <Text className='text-white text-lg font-semibold ml-2'>Award Badge</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {renderDatePicker()}
    </SafeAreaView>
  );
};

export default AwardBadgeScreen;
