// screens/PregnancyJournal/EditJournalScreen.tsx
import AppLayout from '@/components/layout/AppLayout';
import { GenderType, PregnancyJournalStatus } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import { UpdatePregnancyJournalRequest } from '@/models/PregnancyJournal/PregnancyJournalRequest';
import { PregnancyJournalFormValidation } from '@/models/PregnancyJournal/PregnancyJournalUIForm';
import { AppDispatch } from '@/store/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

interface EditJournalScreenProps {
  route: {
    params: {
      journal: PregnancyJournal;
      onSuccess?: () => void;
    };
  };
}

const StatusOptions = [
  { label: 'Đang hoạt động', value: PregnancyJournalStatus.ACTIVE },
  { label: 'Hoàn thành', value: PregnancyJournalStatus.COMPLETED },
  { label: 'Lưu trữ', value: PregnancyJournalStatus.ARCHIVED },
];

const GenderOptions = [
  { label: 'Chưa biết', value: GenderType.UNKNOWN },
  { label: 'Bé trai', value: GenderType.MALE },
  { label: 'Bé gái', value: GenderType.FEMALE },
];

export const EditJournalScreen: React.FC<EditJournalScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { journal, onSuccess } = route.params;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    babyNickname: '',
    babyGender: GenderType.UNKNOWN,
    expectedDueDate: new Date(),
    pregnancyStartDate: new Date(),
    currentWeek: '1',
    estimatedWeight: '',
    estimatedLength: '',
    status: PregnancyJournalStatus.ACTIVE,
    isPublic: false,
  });

  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when journal changes
  useEffect(() => {
    if (journal) {
      setFormData({
        title: journal.title,
        description: journal.description || '',
        babyNickname: journal.babyInfo.nickname || '',
        babyGender: journal.babyInfo.gender || GenderType.UNKNOWN,
        expectedDueDate: new Date(journal.babyInfo.expectedDueDate),
        pregnancyStartDate: new Date(journal.pregnancyStartDate),
        currentWeek: journal.babyInfo.currentWeek.toString(),
        estimatedWeight: journal.babyInfo.estimatedWeight?.toString() || '',
        estimatedLength: journal.babyInfo.estimatedLength?.toString() || '',
        status: journal.status,
        isPublic: journal.shareSettings.isPublic,
      });
      setErrors([]);
    }
  }, [journal]);

  const handleSubmit = async () => {
    if (!journal) return;

    // Validate form
    const titleError = PregnancyJournalFormValidation.validateTitle(formData.title);
    const descError = PregnancyJournalFormValidation.validateDescription(formData.description);
    const weekError = PregnancyJournalFormValidation.validateCurrentWeek(formData.currentWeek);
    const dueDateError = PregnancyJournalFormValidation.validateDueDate(
      formData.expectedDueDate,
      formData.pregnancyStartDate,
    );

    const validationErrors: string[] = [];
    if (titleError) validationErrors.push(titleError);
    if (descError) validationErrors.push(descError);
    if (weekError) validationErrors.push(weekError);
    if (dueDateError) validationErrors.push(dueDateError);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const request: UpdatePregnancyJournalRequest = {
        title: formData.title,
        description: formData.description,
        babyInfo: {
          nickname: formData.babyNickname,
          gender: formData.babyGender,
          expectedDueDate: formData.expectedDueDate.toISOString(),
          currentWeek: parseInt(formData.currentWeek),
          estimatedWeight: formData.estimatedWeight ? parseFloat(formData.estimatedWeight) : undefined,
          estimatedLength: formData.estimatedLength ? parseFloat(formData.estimatedLength) : undefined,
        },
        pregnancyStartDate: formData.pregnancyStartDate.toISOString(),
        status: formData.status,
        shareSettings: {
          isPublic: formData.isPublic,
          permission: journal.shareSettings.permission,
        },
      };

      // In production: await dispatch(updateJournal({ id: journal.id, data: request })).unwrap();
      // For demo, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Thành công', 'Đã cập nhật nhật ký!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
            onSuccess?.();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật nhật ký. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const getStatusLabel = (status: PregnancyJournalStatus) => {
    return StatusOptions.find((option) => option.value === status)?.label || 'Đang hoạt động';
  };

  const getGenderLabel = (gender: GenderType) => {
    return GenderOptions.find((option) => option.value === gender)?.label || 'Chưa biết';
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

          <Text className='font-semibold text-lg text-gray-900'>Chỉnh sửa nhật ký</Text>

          <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
            <Text className={`font-medium text-base ${isSubmitting ? 'text-gray-400' : 'text-blue-600'}`}>
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

          {/* Basic Info Card */}
          <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-6'>Thông tin cơ bản</Text>

            <View className='flex flex-col gap-5s'>
              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Tên nhật ký *</Text>
                <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <TextInput
                    className='text-base text-gray-700 font-medium'
                    placeholder='Tên nhật ký'
                    placeholderTextColor='#9CA3AF'
                    value={formData.title}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
                  />
                </View>
              </View>

              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Mô tả</Text>
                <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <TextInput
                    className='text-base text-gray-700 min-h-[80px]'
                    placeholder='Mô tả ngắn về nhật ký của bạn'
                    placeholderTextColor='#9CA3AF'
                    value={formData.description}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
                    multiline
                    textAlignVertical='top'
                  />
                </View>
              </View>

              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Trạng thái</Text>
                <TouchableOpacity
                  className='bg-gray-50 rounded-xl px-4 py-4 flex-row items-center justify-between border border-gray-200'
                  onPress={() => setShowStatusPicker(true)}
                >
                  <Text className='text-base text-gray-700 font-medium'>{getStatusLabel(formData.status)}</Text>
                  <Icon iconStyle='solid' name='chevron-down' size={16} color='#6B7280' />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Baby Info Card */}
          <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-6'>Thông tin bé yêu</Text>

            <View className='flex flex-col gap-5s'>
              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Biệt danh của bé</Text>
                <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <TextInput
                    className='text-base text-gray-700 font-medium'
                    placeholder='Biệt danh'
                    placeholderTextColor='#9CA3AF'
                    value={formData.babyNickname}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, babyNickname: text }))}
                  />
                </View>
              </View>

              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Giới tính</Text>
                <TouchableOpacity
                  className='bg-gray-50 rounded-xl px-4 py-4 flex-row items-center justify-between border border-gray-200'
                  onPress={() => setShowGenderPicker(true)}
                >
                  <Text className='text-base text-gray-700 font-medium'>{getGenderLabel(formData.babyGender)}</Text>
                  <Icon iconStyle='solid' name='chevron-down' size={16} color='#6B7280' />
                </TouchableOpacity>
              </View>

              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Tuần thai hiện tại *</Text>
                <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <TextInput
                    className='text-base text-gray-700 font-medium'
                    placeholder='Tuần thai'
                    placeholderTextColor='#9CA3AF'
                    value={formData.currentWeek}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, currentWeek: text }))}
                    keyboardType='numeric'
                  />
                </View>
              </View>

              <View className='flex-row flex gap-3'>
                <View className='flex-1'>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Cân nặng ước tính (g)</Text>
                  <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                    <TextInput
                      className='text-base text-gray-700 font-medium'
                      placeholder='300'
                      placeholderTextColor='#9CA3AF'
                      value={formData.estimatedWeight}
                      onChangeText={(text) => setFormData((prev) => ({ ...prev, estimatedWeight: text }))}
                      keyboardType='numeric'
                    />
                  </View>
                </View>

                <View className='flex-1'>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Chiều dài ước tính (cm)</Text>
                  <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                    <TextInput
                      className='text-base text-gray-700 font-medium'
                      placeholder='16.4'
                      placeholderTextColor='#9CA3AF'
                      value={formData.estimatedLength}
                      onChangeText={(text) => setFormData((prev) => ({ ...prev, estimatedLength: text }))}
                      keyboardType='numeric'
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Pregnancy Dates Card */}
          <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-6'>Thông tin thai kỳ</Text>

            <View className='flex flex-col gap-5s'>
              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Ngày bắt đầu thai kỳ *</Text>
                <TouchableOpacity
                  className='bg-gray-50 rounded-xl px-4 py-4 flex-row items-center justify-between border border-gray-200'
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text className='text-base text-gray-700 font-medium'>
                    {formData.pregnancyStartDate.toLocaleDateString('vi-VN')}
                  </Text>
                  <Icon name='calendar' size={18} color='#6B7280' />
                </TouchableOpacity>
              </View>

              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Ngày dự sinh *</Text>
                <TouchableOpacity
                  className='bg-gray-50 rounded-xl px-4 py-4 flex-row items-center justify-between border border-gray-200'
                  onPress={() => setShowDueDatePicker(true)}
                >
                  <Text className='text-base text-gray-700 font-medium'>
                    {formData.expectedDueDate.toLocaleDateString('vi-VN')}
                  </Text>
                  <Icon name='calendar' size={18} color='#6B7280' />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Privacy Settings Card */}
          <View className='mx-6 mt-6 mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
            <Text className='text-lg font-semibold text-gray-900 mb-6'>Cài đặt riêng tư</Text>

            <TouchableOpacity
              className='flex-row items-center justify-between py-2'
              onPress={() => setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
            >
              <View className='flex-1'>
                <Text className='text-base font-medium text-gray-800'>Công khai nhật ký</Text>
                <Text className='text-sm text-gray-500 mt-1'>Cho phép người khác tìm thấy và xem nhật ký của bạn</Text>
              </View>

              <View className={`w-14 h-8 rounded-full p-1 ${formData.isPublic ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <View
                  className={`w-6 h-6 rounded-full bg-white transition-all duration-200 ${
                    formData.isPublic ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Status Picker Modal */}
        {showStatusPicker && (
          <View className='absolute inset-0 bg-black/50 justify-end'>
            <View className='bg-white rounded-t-3xl p-6'>
              <Text className='text-lg font-semibold text-gray-900 mb-4'>Chọn trạng thái</Text>
              {StatusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className='py-4 border-b border-gray-100'
                  onPress={() => {
                    setFormData((prev) => ({ ...prev, status: option.value }));
                    setShowStatusPicker(false);
                  }}
                >
                  <Text className='text-base text-gray-700'>{option.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity className='mt-4 py-3 bg-gray-100 rounded-xl' onPress={() => setShowStatusPicker(false)}>
                <Text className='text-center text-gray-600 font-medium'>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Gender Picker Modal */}
        {showGenderPicker && (
          <View className='absolute inset-0 bg-black/50 justify-end'>
            <View className='bg-white rounded-t-3xl p-6'>
              <Text className='text-lg font-semibold text-gray-900 mb-4'>Chọn giới tính</Text>
              {GenderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className='py-4 border-b border-gray-100'
                  onPress={() => {
                    setFormData((prev) => ({ ...prev, babyGender: option.value }));
                    setShowGenderPicker(false);
                  }}
                >
                  <Text className='text-base text-gray-700'>{option.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity className='mt-4 py-3 bg-gray-100 rounded-xl' onPress={() => setShowGenderPicker(false)}>
                <Text className='text-center text-gray-600 font-medium'>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={formData.pregnancyStartDate}
            mode='date'
            display='default'
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setFormData((prev) => ({ ...prev, pregnancyStartDate: selectedDate }));
              }
            }}
          />
        )}

        {showDueDatePicker && (
          <DateTimePicker
            value={formData.expectedDueDate}
            mode='date'
            display='default'
            onChange={(event, selectedDate) => {
              setShowDueDatePicker(false);
              if (selectedDate) {
                setFormData((prev) => ({ ...prev, expectedDueDate: selectedDate }));
              }
            }}
          />
        )}
      </View>
    </AppLayout>
  );
};
