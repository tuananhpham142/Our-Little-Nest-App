// screens/PregnancyJournal/CreateJournalScreen.tsx
import AppLayout from '@/components/layout/AppLayout';
import { GenderType, PregnancyJournalStatus, SharePermission } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { CreatePregnancyJournalRequest } from '@/models/PregnancyJournal/PregnancyJournalRequest';
import { PregnancyJournalFormValidation } from '@/models/PregnancyJournal/PregnancyJournalUIForm';
import { createJournal } from '@/store/slices/pregnancyJournalSlice';
import { AppDispatch } from '@/store/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

interface CreateJournalScreenProps {
  route: {
    params: {
      onSuccess?: () => void;
    };
  };
}

export const CreateJournalScreen: React.FC<CreateJournalScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { onSuccess } = route.params || {};

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
    isPublic: false,
  });

  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [tempDueDate, setTempDueDate] = useState<Date>(new Date());
  const [tempStartDate, setTempStartDate] = useState<Date>(new Date());
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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
      const request: CreatePregnancyJournalRequest = {
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
        status: PregnancyJournalStatus.ACTIVE,
        shareSettings: {
          isPublic: formData.isPublic,
          permission: SharePermission.VIEW_ONLY,
        },
      };

      await dispatch(createJournal(request)).unwrap();

      Alert.alert('Thành công', 'Đã tạo nhật ký mới!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
            onSuccess?.();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tạo nhật ký. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Start Date Picker Handlers
  const handleStartDatePickerOpen = () => {
    setTempStartDate(formData.pregnancyStartDate);
    setShowStartDatePicker(true);
  };

  const handleStartDatePickerSave = () => {
    setFormData((prev) => ({ ...prev, pregnancyStartDate: tempStartDate }));
    setShowStartDatePicker(false);
  };

  const handleStartDatePickerClose = () => {
    setShowStartDatePicker(false);
  };

  // Due Date Picker Handlers
  const handleDueDatePickerOpen = () => {
    setTempDueDate(formData.expectedDueDate);
    setShowDueDatePicker(true);
  };

  const handleDueDatePickerSave = () => {
    setFormData((prev) => ({ ...prev, expectedDueDate: tempDueDate }));
    setShowDueDatePicker(false);
  };

  const handleDueDatePickerClose = () => {
    setShowDueDatePicker(false);
  };

  const renderStartDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          visible={showStartDatePicker}
          transparent
          animationType='slide'
          onRequestClose={handleStartDatePickerClose}
        >
          <View className='flex-1 justify-end bg-black bg-opacity-50'>
            <View className='bg-white rounded-t-3xl'>
              <View className='flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-100'>
                <TouchableOpacity onPress={handleStartDatePickerClose}>
                  <Text className='text-blue-600 font-medium text-base'>Đóng</Text>
                </TouchableOpacity>

                <Text className='font-semibold text-lg text-gray-900'>Chọn ngày bắt đầu</Text>

                <TouchableOpacity onPress={handleStartDatePickerSave}>
                  <Text className='font-medium text-base text-blue-600'>Lưu</Text>
                </TouchableOpacity>
              </View>

              <View className='p-4'>
                <DateTimePicker
                  value={tempStartDate}
                  mode='date'
                  display='spinner'
                  maximumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setTempStartDate(selectedDate);
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
      showStartDatePicker && (
        <DateTimePicker
          value={tempStartDate}
          mode='date'
          display='default'
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate && event.type === 'set') {
              setFormData((prev) => ({ ...prev, pregnancyStartDate: selectedDate }));
            }
          }}
          textColor='#000000'
        />
      )
    );
  };

  const renderDueDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal visible={showDueDatePicker} transparent animationType='slide' onRequestClose={handleDueDatePickerClose}>
          <View className='flex-1 justify-end bg-black bg-opacity-50'>
            <View className='bg-white rounded-t-3xl'>
              <View className='flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-100'>
                <TouchableOpacity onPress={handleDueDatePickerClose}>
                  <Text className='text-blue-600 font-medium text-base'>Đóng</Text>
                </TouchableOpacity>

                <Text className='font-semibold text-lg text-gray-900'>Chọn ngày dự sinh</Text>

                <TouchableOpacity onPress={handleDueDatePickerSave}>
                  <Text className='font-medium text-base text-blue-600'>Lưu</Text>
                </TouchableOpacity>
              </View>

              <View className='p-4'>
                <DateTimePicker
                  value={tempDueDate}
                  mode='date'
                  display='spinner'
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setTempDueDate(selectedDate);
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
      showDueDatePicker && (
        <DateTimePicker
          value={tempDueDate}
          mode='date'
          display='default'
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDueDatePicker(false);
            if (selectedDate && event.type === 'set') {
              setFormData((prev) => ({ ...prev, expectedDueDate: selectedDate }));
            }
          }}
          textColor='#000000'
        />
      )
    );
  };

  return (
    <AppLayout>
      <View className='flex-1 bg-gray-50'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100'>
          <TouchableOpacity onPress={handleCancel}>
            <Text className='text-blue-600 font-medium text-base'>Hủy</Text>
          </TouchableOpacity>

          <Text className='font-semibold text-lg text-gray-900'>Tạo nhật ký mới</Text>

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

            <View className='flex flex-col gap-4'>
              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Tên nhật ký *</Text>
                <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <TextInput
                    className='text-base text-gray-700 font-medium'
                    placeholder='Ví dụ: Hành trình với thiên thần nhỏ'
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
            </View>
          </View>

          {/* Pregnancy Info Card */}
          <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-6'>Thông tin thai kỳ</Text>

            <View className='flex flex-col gap-2'>
              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Tuần thai hiện tại *</Text>
                <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                  <TextInput
                    className='text-base text-gray-700 font-medium'
                    placeholder='20'
                    placeholderTextColor='#9CA3AF'
                    value={formData.currentWeek}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, currentWeek: text }))}
                    keyboardType='numeric'
                  />
                </View>
              </View>

              <View>
                <Text className='text-sm font-medium text-gray-700 mb-2'>Ngày bắt đầu thai kỳ *</Text>
                <TouchableOpacity
                  className='bg-gray-50 rounded-xl px-4 py-4 flex-row items-center justify-between border border-gray-200'
                  onPress={handleStartDatePickerOpen}
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
                  onPress={handleDueDatePickerOpen}
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
          <View className='mx-4 mt-6'>
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

        {/* Date Pickers */}
        {renderStartDatePicker()}
        {renderDueDatePicker()}
      </View>
    </AppLayout>
  );
};
