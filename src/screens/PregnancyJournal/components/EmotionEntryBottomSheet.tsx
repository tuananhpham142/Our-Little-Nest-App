// screens/PregnancyJournal/components/EmotionEntryBottomSheet.tsx
import { MoodType } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import { AddEmotionEntryRequest } from '@/models/PregnancyJournal/PregnancyJournalRequest';
import { PregnancyJournalFormValidation } from '@/models/PregnancyJournal/PregnancyJournalUIForm';
import { AppDispatch } from '@/store/store';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';

interface EmotionEntryBottomSheetProps {
  journal: PregnancyJournal | null;
  onSuccess: () => void;
}

interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { type: MoodType.HAPPY, label: 'Hạnh phúc', emoji: '😊', color: '#F59E0B' },
  { type: MoodType.EXCITED, label: 'Thích thú', emoji: '🤗', color: '#8B5CF6' },
  { type: MoodType.WORRIED, label: 'Lo lắng', emoji: '😟', color: '#EF4444' },
  { type: MoodType.TIRED, label: 'Mệt mỏi', emoji: '😴', color: '#6B7280' },
  { type: MoodType.EMOTIONAL, label: 'Xúc động', emoji: '🥺', color: '#EC4899' },
  { type: MoodType.NEUTRAL, label: 'Bình thường', emoji: '😐', color: '#10B981' },
];

export const EmotionEntryBottomSheet = forwardRef<BottomSheet, EmotionEntryBottomSheetProps>(
  ({ journal, onSuccess }, ref) => {
    const dispatch = useDispatch<AppDispatch>();

    const [formData, setFormData] = useState({
      date: new Date(),
      content: '',
      mood: null as MoodType | null,
      isPrivate: false,
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bottom sheet configuration
    const snapPoints = useMemo(() => ['25%', '70%', '90%'], []);

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
      [],
    );

    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        // Sheet closed, reset form
        resetForm();
      }
    }, []);

    const handleSubmit = async () => {
      if (!journal) return;

      // Validate form
      const contentError = PregnancyJournalFormValidation.validateEmotionContent(formData.content);

      const validationErrors: string[] = [];
      if (contentError) validationErrors.push(contentError);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);

      try {
        const request: AddEmotionEntryRequest = {
          date: formData.date.toISOString().split('T')[0],
          content: formData.content,
          mood: formData.mood || undefined,
          isPrivate: formData.isPrivate,
        };

        // In production: await dispatch(addEmotionEntry({ journalId: journal.id, data: request })).unwrap();
        // For demo, just simulate success
        await new Promise((resolve) => setTimeout(resolve, 1000));

        Alert.alert('Thành công', 'Đã thêm cảm xúc vào nhật ký!');
        (ref as any)?.current?.close();
        onSuccess();
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể thêm cảm xúc. Vui lòng thử lại.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const resetForm = () => {
      setFormData({
        date: new Date(),
        content: '',
        mood: null,
        isPrivate: false,
      });
      setErrors([]);
    };

    const handleClose = () => {
      (ref as any)?.current?.close();
    };

    const handleMoodSelect = (mood: MoodType) => {
      setFormData((prev) => ({
        ...prev,
        mood: prev.mood === mood ? null : mood,
      }));
    };

    if (!journal) return null;

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        keyboardBehavior='interactive'
        keyboardBlurBehavior='restore'
      >
        <BottomSheetView className='flex-1 bg-white'>
          {/* Header */}
          <View className='flex-row items-center justify-between px-4 py-4 border-b border-gray-100'>
            <TouchableOpacity onPress={handleClose}>
              <Text className='text-gray-600 font-medium'>Hủy</Text>
            </TouchableOpacity>

            <Text className='font-bold text-lg'>Thêm cảm xúc</Text>

            <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting || !formData.content.trim()}>
              <Text
                className={`font-medium ${
                  isSubmitting || !formData.content.trim() ? 'text-gray-400' : 'text-purple-600'
                }`}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </Text>
            </TouchableOpacity>
          </View>

          <BottomSheetScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
            {/* Error Messages */}
            {errors.length > 0 && (
              <View className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4 mt-4'>
                {errors.map((error, index) => (
                  <Text key={index} className='text-red-600 text-sm'>
                    • {error}
                  </Text>
                ))}
              </View>
            )}

            {/* Date Selection */}
            <View className='mb-6 mt-4'>
              <Text className='text-lg font-bold mb-4'>Ngày tháng</Text>

              <TouchableOpacity
                className='border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between'
                onPress={() => setShowDatePicker(true)}
              >
                <Text className='text-base'>
                  {formData.date.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <Icon name='calendar' size={20} color='#6B7280' />
              </TouchableOpacity>
            </View>

            {/* Mood Selection */}
            <View className='mb-6'>
              <Text className='text-lg font-bold mb-4'>Tâm trạng hôm nay</Text>

              <View className='flex-row flex-wrap -m-1'>
                {MOOD_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.type}
                    onPress={() => handleMoodSelect(option.type)}
                    className={`m-1 px-4 py-3 rounded-xl border-2 flex-row items-center ${
                      formData.mood === option.type ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className='text-lg mr-2'>{option.emoji}</Text>
                    <Text
                      className={`font-medium ${formData.mood === option.type ? 'text-purple-700' : 'text-gray-700'}`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Content */}
            <View className='mb-6'>
              <Text className='text-lg font-bold mb-4'>Chia sẻ cảm xúc của bạn</Text>

              <TextInput
                className='border border-gray-300 rounded-lg px-3 py-3 text-base'
                placeholder='Hôm nay bạn cảm thấy thế nào? Hãy chia sẻ những suy nghĩ và cảm xúc của bạn...'
                value={formData.content}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, content: text }))}
                multiline
                textAlignVertical='top'
                style={{ minHeight: 120 }}
              />

              <Text className='text-gray-400 text-sm mt-2'>{formData.content.length}/2000 ký tự</Text>
            </View>

            {/* Privacy Settings */}
            <View className='mb-6'>
              <Text className='text-lg font-bold mb-4'>Quyền riêng tư</Text>

              <TouchableOpacity
                className='flex-row items-center justify-between py-3'
                onPress={() => setFormData((prev) => ({ ...prev, isPrivate: !prev.isPrivate }))}
              >
                <View className='flex-1'>
                  <Text className='text-gray-700 font-medium'>Chỉ mình tôi xem</Text>
                  <Text className='text-gray-500 text-sm'>
                    {formData.isPrivate ? 'Chỉ bạn có thể xem cảm xúc này' : 'Những người được chia sẻ có thể xem'}
                  </Text>
                </View>

                <View className={`w-12 h-6 rounded-full ${formData.isPrivate ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ${formData.isPrivate ? 'ml-6' : 'ml-0.5'}`} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Tips */}
            <View className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8'>
              <View className='flex-row items-start'>
                <Icon name='lightbulb' size={20} color='#3B82F6' className='mr-2 mt-0.5' />
                <View className='flex-1'>
                  <Text className='text-blue-800 font-medium mb-2'>Gợi ý viết nhật ký</Text>
                  <Text className='text-blue-700 text-sm leading-5'>
                    • Mô tả cảm xúc của bạn một cách tự nhiên{'\n'}• Chia sẻ những thay đổi cơ thể{'\n'}• Ghi lại những
                    khoảnh khắc đặc biệt{'\n'}• Viết thư cho bé yêu của bạn
                  </Text>
                </View>
              </View>
            </View>

            <View className='h-8' />
          </BottomSheetScrollView>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode='date'
              display='default'
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData((prev) => ({ ...prev, date: selectedDate }));
                }
              }}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);
