// screens/PregnancyJournal/components/EditJournalBottomSheet.tsx
import { GenderType, PregnancyJournalStatus } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import { UpdatePregnancyJournalRequest } from '@/models/PregnancyJournal/PregnancyJournalRequest';
import { PregnancyJournalFormValidation } from '@/models/PregnancyJournal/PregnancyJournalUIForm';
import { AppDispatch } from '@/store/store';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

interface EditJournalBottomSheetProps {
  journal: PregnancyJournal | null;
  onSuccess: () => void;
}

export const EditJournalBottomSheet = forwardRef<BottomSheet, EditJournalBottomSheetProps>(
  ({ journal, onSuccess }, ref) => {
    const dispatch = useDispatch<AppDispatch>();

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
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Bottom sheet configuration
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
      [],
    );

    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1) {
        // Sheet closed, reset errors
        setErrors([]);
      }
    }, []);

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

        Alert.alert('Thành công', 'Đã cập nhật nhật ký!');
        (ref as any)?.current?.close();
        onSuccess();
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể cập nhật nhật ký. Vui lòng thử lại.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      (ref as any)?.current?.close();
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

            <Text className='font-bold text-lg'>Chỉnh sửa nhật ký</Text>

            <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
              <Text className={`font-medium ${isSubmitting ? 'text-gray-400' : 'text-purple-600'}`}>
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

            {/* Basic Info */}
            <View className='mb-6 mt-4'>
              <Text className='text-lg font-bold mb-4'>Thông tin cơ bản</Text>

              <View className='mb-4'>
                <Text className='text-gray-700 font-medium mb-2'>Tên nhật ký *</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-3 text-base'
                  placeholder='Tên nhật ký'
                  value={formData.title}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, title: text }))}
                />
              </View>

              <View className='mb-4'>
                <Text className='text-gray-700 font-medium mb-2'>Mô tả</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-3 text-base h-20'
                  placeholder='Mô tả ngắn về nhật ký của bạn'
                  value={formData.description}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, description: text }))}
                  multiline
                  textAlignVertical='top'
                />
              </View>

              <View className='mb-4'>
                <Text className='text-gray-700 font-medium mb-2'>Trạng thái</Text>
                <View className='border border-gray-300 rounded-lg'>
                  <Picker
                    selectedValue={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <Picker.Item label='Đang hoạt động' value={PregnancyJournalStatus.ACTIVE} />
                    <Picker.Item label='Hoàn thành' value={PregnancyJournalStatus.COMPLETED} />
                    <Picker.Item label='Lưu trữ' value={PregnancyJournalStatus.ARCHIVED} />
                  </Picker>
                </View>
              </View>
            </View>

            {/* Baby Info */}
            <View className='mb-6'>
              <Text className='text-lg font-bold mb-4'>Thông tin bé yêu</Text>

              <View className='mb-4'>
                <Text className='text-gray-700 font-medium mb-2'>Biệt danh của bé</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-3 text-base'
                  placeholder='Biệt danh'
                  value={formData.babyNickname}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, babyNickname: text }))}
                />
              </View>

              <View className='mb-4'>
                <Text className='text-gray-700 font-medium mb-2'>Giới tính</Text>
                <View className='border border-gray-300 rounded-lg'>
                  <Picker
                    selectedValue={formData.babyGender}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, babyGender: value }))}
                  >
                    <Picker.Item label='Chưa biết' value={GenderType.UNKNOWN} />
                    <Picker.Item label='Bé trai' value={GenderType.MALE} />
                    <Picker.Item label='Bé gái' value={GenderType.FEMALE} />
                  </Picker>
                </View>
              </View>

              <View className='mb-4'>
                <Text className='text-gray-700 font-medium mb-2'>Tuần thai hiện tại *</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-3 text-base'
                  placeholder='Tuần thai'
                  value={formData.currentWeek}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, currentWeek: text }))}
                  keyboardType='numeric'
                />
              </View>

              <View className='flex-row space-x-3 mb-4'>
                <View className='flex-1'>
                  <Text className='text-gray-700 font-medium mb-2'>Cân nặng ước tính (g)</Text>
                  <TextInput
                    className='border border-gray-300 rounded-lg px-3 py-3 text-base'
                    placeholder='Cân nặng'
                    value={formData.estimatedWeight}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, estimatedWeight: text }))}
                    keyboardType='numeric'
                  />
                </View>

                <View className='flex-1'>
                  <Text className='text-gray-700 font-medium mb-2'>Chiều dài ước tính (cm)</Text>
                  <TextInput
                    className='border border-gray-300 rounded-lg px-3 py-3 text-base'
                    placeholder='Chiều dài'
                    value={formData.estimatedLength}
                    onChangeText={(text) => setFormData((prev) => ({ ...prev, estimatedLength: text }))}
                    keyboardType='numeric'
                  />
                </View>
              </View>
            </View>

            {/* Pregnancy Dates */}
            <View className='mb-6'>
              <Text className='text-lg font-bold mb-4'>Thông tin thai kỳ</Text>

              <View className='mb-4'>
                <Text className='text-gray-700 font-medium mb-2'>Ngày bắt đầu thai kỳ *</Text>
                <TouchableOpacity
                  className='border border-gray-300 rounded-lg px-3 py-3'
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text className='text-base'>{formData.pregnancyStartDate.toLocaleDateString('vi-VN')}</Text>
                </TouchableOpacity>
              </View>

              <View className='mb-4'>
                <Text className='text-gray-700 font-medium mb-2'>Ngày dự sinh *</Text>
                <TouchableOpacity
                  className='border border-gray-300 rounded-lg px-3 py-3'
                  onPress={() => setShowDueDatePicker(true)}
                >
                  <Text className='text-base'>{formData.expectedDueDate.toLocaleDateString('vi-VN')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Privacy Settings */}
            <View className='mb-8'>
              <Text className='text-lg font-bold mb-4'>Cài đặt riêng tư</Text>

              <TouchableOpacity
                className='flex-row items-center justify-between py-3'
                onPress={() => setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
              >
                <Text className='text-gray-700'>Công khai nhật ký</Text>
                <View className={`w-12 h-6 rounded-full ${formData.isPublic ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <View className={`w-5 h-5 rounded-full bg-white mt-0.5 ${formData.isPublic ? 'ml-6' : 'ml-0.5'}`} />
                </View>
              </TouchableOpacity>
            </View>

            <View className='h-8' />
          </BottomSheetScrollView>

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
        </BottomSheetView>
      </BottomSheet>
    );
  },
);
