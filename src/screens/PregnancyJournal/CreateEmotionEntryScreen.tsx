// screens/PregnancyJournal/EmotionEntryScreen.tsx
import AppLayout from '@/components/layout/AppLayout';
import { MoodType } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import { AddEmotionEntryRequest } from '@/models/PregnancyJournal/PregnancyJournalRequest';
import { PregnancyJournalFormValidation } from '@/models/PregnancyJournal/PregnancyJournalUIForm';
import { AppDispatch } from '@/store/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

interface EmotionEntryScreenProps {
  route: {
    params: {
      journal: PregnancyJournal;
      onSuccess?: () => void;
    };
  };
}

interface MoodOption {
  type: MoodType;
  label: string;
  color: string;
  bgColor: string;
  energy: 'high' | 'medium' | 'low';
  feeling: 'negative' | 'neutral' | 'positive';
}

const MOOD_OPTIONS: MoodOption[] = [
  // High Energy - Negative
  {
    type: MoodType.WORRIED,
    label: 'Lo lắng',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    energy: 'high',
    feeling: 'negative',
  },
  {
    type: MoodType.EMOTIONAL,
    label: 'Căng thẳng',
    color: '#EA580C',
    bgColor: '#FED7AA',
    energy: 'high',
    feeling: 'negative',
  },

  // High Energy - Positive
  {
    type: MoodType.EXCITED,
    label: 'Thích thú',
    color: '#FBBF24',
    bgColor: '#FEF3C7',
    energy: 'high',
    feeling: 'positive',
  },
  {
    type: MoodType.HAPPY,
    label: 'Hạnh phúc',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    energy: 'high',
    feeling: 'positive',
  },

  // Medium Energy - Neutral
  {
    type: MoodType.NEUTRAL,
    label: 'Bình thường',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    energy: 'medium',
    feeling: 'neutral',
  },

  // Low Energy - Negative
  { type: MoodType.TIRED, label: 'Mệt mỏi', color: '#0891B2', bgColor: '#CFFAFE', energy: 'low', feeling: 'negative' },

  // Low Energy - Positive
  {
    type: 'content' as MoodType,
    label: 'Thỏa mãn',
    color: '#059669',
    bgColor: '#D1FAE5',
    energy: 'low',
    feeling: 'positive',
  },
  {
    type: 'peaceful' as MoodType,
    label: 'Bình an',
    color: '#10B981',
    bgColor: '#D1FAE5',
    energy: 'low',
    feeling: 'positive',
  },
];

export const EmotionEntryScreen: React.FC<EmotionEntryScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { journal, onSuccess } = route.params;

  const [formData, setFormData] = useState({
    date: new Date(),
    content: '',
    mood: null as MoodType | null,
    isPrivate: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      Alert.alert('Thành công', 'Đã thêm cảm xúc vào nhật ký!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
            onSuccess?.();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm cảm xúc. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleMoodSelect = (mood: MoodType) => {
    setFormData((prev) => ({
      ...prev,
      mood: prev.mood === mood ? null : mood,
    }));
  };

  const getMoodIcon = (mood: MoodOption) => {
    if (mood.energy === 'high' && mood.feeling === 'negative') return '😰';
    if (mood.energy === 'high' && mood.feeling === 'positive') return '😊';
    if (mood.energy === 'medium') return '😐';
    if (mood.energy === 'low' && mood.feeling === 'negative') return '😴';
    if (mood.energy === 'low' && mood.feeling === 'positive') return '😌';
    return '😐';
  };

  if (!journal) return null;

  return (
    <AppLayout>
      <View className='flex-1 bg-gray-50'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100'>
          <TouchableOpacity onPress={handleCancel}>
            <Text className='text-blue-600 font-medium text-base'>Hủy</Text>
          </TouchableOpacity>

          <Text className='font-semibold text-lg text-gray-900'>Thêm cảm xúc</Text>

          <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting || !formData.content.trim()}>
            <Text
              className={`font-medium text-base ${
                isSubmitting || !formData.content.trim() ? 'text-gray-400' : 'text-blue-600'
              }`}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {/* Error Messages */}
          {errors.length > 0 && (
            <View className='mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl p-4'>
              {errors.map((error, index) => (
                <Text key={index} className='text-red-600 text-sm'>
                  • {error}
                </Text>
              ))}
            </View>
          )}

          {/* Date Selection Card */}
          <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-4'>Ngày tháng</Text>

            <TouchableOpacity
              className='bg-gray-50 rounded-xl px-4 py-4 flex-row items-center justify-between border border-gray-200'
              onPress={() => setShowDatePicker(true)}
            >
              <Text className='text-base text-gray-700 font-medium'>
                {formData.date.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Icon name='calendar' size={18} color='#6B7280' />
            </TouchableOpacity>
          </View>
          {/* Mood Selection Card */}
          <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-2'>Bạn cảm thấy thế nào?</Text>
            <Text className='text-sm text-gray-500 mb-6'>Chọn cảm xúc phù hợp nhất với trạng thái hiện tại</Text>

            {/* Mood Grid */}
            <View className='flex-row flex-wrap -m-1'>
              {MOOD_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.type}
                  onPress={() => handleMoodSelect(option.type)}
                  className={`m-1 px-3 py-2 rounded-full flex-row items-center ${
                    formData.mood === option.type ? 'border-2 border-blue-500' : 'border border-gray-200'
                  }`}
                  style={{
                    backgroundColor: formData.mood === option.type ? option.bgColor : '#FFFFFF',
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    className='w-6 h-6 rounded-full items-center justify-center mr-2'
                    style={{ backgroundColor: option.color }}
                  >
                    <Text className='text-xs text-white font-bold'>{getMoodIcon(option)}</Text>
                  </View>
                  <Text
                    className={`font-medium text-sm ${
                      formData.mood === option.type ? 'text-gray-800' : 'text-gray-600'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Content Card */}
          <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-4'>Chia sẻ cảm xúc của bạn</Text>

            <View className='bg-gray-50 rounded-xl p-4 border border-gray-200'>
              <TextInput
                className='text-base text-gray-700 min-h-[120px]'
                placeholder='Hôm nay bạn cảm thấy thế nào? Hãy chia sẻ những suy nghĩ và cảm xúc của bạn...'
                placeholderTextColor='#9CA3AF'
                value={formData.content}
                onChangeText={(text) => setFormData((prev) => ({ ...prev, content: text }))}
                multiline
                textAlignVertical='top'
              />
            </View>

            <Text className='text-gray-400 text-sm mt-2 text-right'>{formData.content.length}/2000</Text>
          </View>

          {/* Privacy Settings Card */}
          <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-4'>Quyền riêng tư</Text>

            <TouchableOpacity
              className='flex-row items-center justify-between py-2'
              onPress={() => setFormData((prev) => ({ ...prev, isPrivate: !prev.isPrivate }))}
            >
              <View className='flex-1'>
                <Text className='text-base font-medium text-gray-800'>Chỉ mình tôi xem</Text>
                <Text className='text-sm text-gray-500 mt-1'>
                  {formData.isPrivate ? 'Chỉ bạn có thể xem cảm xúc này' : 'Những người được chia sẻ có thể xem'}
                </Text>
              </View>

              <View className={`w-14 h-8 rounded-full p-1 ${formData.isPrivate ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <View
                  className={`w-6 h-6 rounded-full bg-white transition-all duration-200 ${
                    formData.isPrivate ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Tips Card */}
          <View className='mx-4 mt-6 mb-8 bg-blue-50 rounded-xl p-6 border border-blue-200'>
            <View className='flex-row items-start'>
              <View className='flex-1'>
                <View className='flex items-center flex-row mb-3'>
                  <Icon name='lightbulb' size={16} color='#3B82F6' className='p-1 bg-blue-200' />
                  <Text className='text-blue-800 font-semibold ml-3'>Gợi ý viết nhật ký</Text>
                </View>
                <View className='flex flex-col gap-2'>
                  <Text className='text-blue-700 text-sm'>• Mô tả cảm xúc một cách tự nhiên và chân thật</Text>
                  <Text className='text-blue-700 text-sm'>• Chia sẻ những thay đổi về cơ thể và tâm lý</Text>
                  <Text className='text-blue-700 text-sm'>• Ghi lại những khoảnh khắc đặc biệt trong ngày</Text>
                  <Text className='text-blue-700 text-sm'>• Viết thư cho bé yêu của bạn</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

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
      </View>
    </AppLayout>
  );
};
