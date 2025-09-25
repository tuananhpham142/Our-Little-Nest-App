// src/screens/Baby/CreateBabyScreen.tsx

import AppLayout from '@/components/layout/AppLayout';
import { FamilyRelationTypeEnum } from '@/models/Baby/BabyEnum';
import { BabyFormData, BabyFormErrors } from '@/models/Baby/BabyForm';
import { CreateBabyRequest } from '@/models/Baby/BabyRequest';
import { createBaby } from '@/store/slices/babySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
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

const CreateBabyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Form state
  const [formData, setFormData] = useState<BabyFormData>({
    name: '',
    nickname: '',
    birthDate: null,
    gender: '',
    weight: '',
    height: '',
    allergies: [],
    medications: [],
    notes: '',
    avatarUri: '',
  });

  const [formErrors, setFormErrors] = useState<BabyFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [creatorRelationType, setCreatorRelationType] = useState<FamilyRelationTypeEnum>(FamilyRelationTypeEnum.MOTHER);

  // Redux state
  const { isLoading } = useAppSelector((state) => state.baby);

  const validateForm = (): boolean => {
    const errors: BabyFormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Baby name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.gender) {
      errors.gender = 'Please select a gender';
    }

    if (!formData.birthDate) {
      errors.birthDate = 'Birth date is required';
    } else if (formData.birthDate > new Date()) {
      errors.birthDate = 'Birth date cannot be in the future';
    }

    if (formData.weight && (parseFloat(formData.weight) < 0.5 || parseFloat(formData.weight) > 10)) {
      errors.weight = 'Weight must be between 0.5 and 10 kg';
    }

    if (formData.height && (parseFloat(formData.height) < 20 || parseFloat(formData.height) > 100)) {
      errors.height = 'Height must be between 20 and 100 cm';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Form Incomplete', 'Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    try {
      const babyData: CreateBabyRequest = {
        name: formData.name.trim(),
        nickname: formData.nickname?.trim() || undefined,
        birthDate: formData.birthDate!,
        gender: formData.gender as 'male' | 'female',
        weight: formData.weight ? parseFloat(formData.weight) * 1000 : undefined, // Convert to grams
        height: formData.height ? parseFloat(formData.height) : undefined,
        allergies: formData.allergies,
        medications: formData.medications,
        notes: formData.notes?.trim() || undefined,
      };

      const result = await dispatch(
        createBaby({
          babyData,
          creatorRelationType,
        }),
      ).unwrap();

      Alert.alert(
        'Baby Profile Created!',
        `${formData.name}'s profile has been created successfully. You can now track their growth and development.`,
        [
          {
            text: 'View Profile',
            onPress: () => navigation.navigate('BabyProfile', { babyId: result.data.id }),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('Creation Failed', error.message || 'Failed to create baby profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const addMedication = () => {
    if (newMedication.trim() && !formData.medications.includes(newMedication.trim())) {
      setFormData((prev) => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()],
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleDatePickerOpen = () => {
    setTempDate(formData.birthDate || new Date());
    setShowDatePicker(true);
  };

  const handleDatePickerSave = () => {
    setFormData((prev) => ({ ...prev, birthDate: tempDate }));
    if (formErrors.birthDate) {
      setFormErrors((prev) => ({ ...prev, birthDate: undefined }));
    }
    setShowDatePicker(false);
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
  };

  const renderDatePicker = () => {
    return (
      <Modal visible={showDatePicker} transparent animationType='slide' onRequestClose={handleDatePickerClose}>
        <View className='flex-1 justify-end'>
          <View className='bg-white rounded-t-3xl'>
            <View className='flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-100'>
              <TouchableOpacity onPress={handleDatePickerClose}>
                <Text className='text-blue-600 font-medium text-base'>Close</Text>
              </TouchableOpacity>

              <Text className='font-semibold text-lg text-gray-900'>Select Birth Date</Text>

              <TouchableOpacity onPress={handleDatePickerSave}>
                <Text className='font-medium text-base text-blue-600'>Save</Text>
              </TouchableOpacity>
            </View>

            <View className='p-4'>
              <DateTimePicker
                value={tempDate}
                mode='date'
                positiveButton={{
                  label: 'test',
                }}
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
  };

  return (
    <AppLayout>
      <View className='flex-1 bg-gray-50'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100'>
          <TouchableOpacity onPress={handleCancel}>
            <Text className='text-blue-600 font-medium text-base'>Cancel</Text>
          </TouchableOpacity>

          <Text className='font-semibold text-lg text-gray-900'>Create Baby Profile</Text>

          <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
            <Text className={`font-medium text-base ${isSubmitting ? 'text-gray-400' : 'text-blue-600'}`}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {/* Basic Information */}
            <View className='mx-4 mt-6'>
              <Text className='text-lg font-semibold text-gray-900 mb-6'>Basic Information</Text>

              <View className='flex flex-col gap-4'>
                <View>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Baby's Name *</Text>
                  <View
                    className={`bg-gray-50 rounded-xl px-4 py-4 border ${
                      formErrors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <TextInput
                      className='text-base text-gray-700 font-medium'
                      placeholder="Enter baby's full name"
                      placeholderTextColor='#9CA3AF'
                      value={formData.name}
                      onChangeText={(text) => {
                        setFormData((prev) => ({ ...prev, name: text }));
                        if (formErrors.name) {
                          setFormErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                      autoCapitalize='words'
                    />
                  </View>
                  {formErrors.name && <Text className='text-xs text-red-500 mt-1'>{formErrors.name}</Text>}
                </View>

                <View>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Nickname</Text>
                  <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                    <TextInput
                      className='text-base text-gray-700'
                      placeholder='Any cute nickname?'
                      placeholderTextColor='#9CA3AF'
                      value={formData.nickname}
                      onChangeText={(text) => setFormData((prev) => ({ ...prev, nickname: text }))}
                      autoCapitalize='words'
                    />
                  </View>
                </View>

                <View>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Gender *</Text>
                  <View className='flex-row gap-3'>
                    <TouchableOpacity
                      onPress={() => {
                        setFormData((prev) => ({ ...prev, gender: 'male' }));
                        if (formErrors.gender) {
                          setFormErrors((prev) => ({ ...prev, gender: undefined }));
                        }
                      }}
                      className={`flex-1 p-4 rounded-xl border flex-row items-center justify-center ${
                        formData.gender === 'male' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <Icon
                        iconStyle='solid'
                        name='mars'
                        size={20}
                        color={formData.gender === 'male' ? '#3B82F6' : '#9CA3AF'}
                      />
                      <Text
                        className={`font-medium ml-2 ${formData.gender === 'male' ? 'text-blue-600' : 'text-gray-600'}`}
                      >
                        Boy
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setFormData((prev) => ({ ...prev, gender: 'female' }));
                        if (formErrors.gender) {
                          setFormErrors((prev) => ({ ...prev, gender: undefined }));
                        }
                      }}
                      className={`flex-1 p-4 rounded-xl border flex-row items-center justify-center ${
                        formData.gender === 'female' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <Icon
                        iconStyle='solid'
                        name='venus'
                        size={20}
                        color={formData.gender === 'female' ? '#EC4899' : '#9CA3AF'}
                      />
                      <Text
                        className={`font-medium ml-2 ${
                          formData.gender === 'female' ? 'text-pink-600' : 'text-gray-600'
                        }`}
                      >
                        Girl
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {formErrors.gender && <Text className='text-xs text-red-500 mt-1'>{formErrors.gender}</Text>}
                </View>
              </View>
            </View>

            {/* Birth & Physical Details */}
            <View className='mx-4 mt-6'>
              <Text className='text-lg font-semibold text-gray-900 mb-6'>Birth & Physical Details</Text>

              <View className='flex flex-col gap-4'>
                <View>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Birth Date *</Text>
                  <TouchableOpacity
                    className={`bg-gray-50 rounded-xl px-4 py-4 flex-row items-center justify-between border ${
                      formErrors.birthDate ? 'border-red-500' : 'border-gray-200'
                    }`}
                    onPress={handleDatePickerOpen}
                  >
                    <Text className='text-base text-gray-700 font-medium'>
                      {formData.birthDate ? formData.birthDate.toLocaleDateString() : 'Select birth date'}
                    </Text>
                    <Icon iconStyle='solid' name='calendar' size={18} color='#6B7280' />
                  </TouchableOpacity>
                  {formErrors.birthDate && <Text className='text-xs text-red-500 mt-1'>{formErrors.birthDate}</Text>}
                </View>

                <View className='flex-row gap-3'>
                  <View className='flex-1'>
                    <Text className='text-sm font-medium text-gray-700 mb-2'>Weight (kg)</Text>
                    <View
                      className={`bg-gray-50 rounded-xl px-4 py-4 border ${
                        formErrors.weight ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <TextInput
                        className='text-base text-gray-700 font-medium'
                        placeholder='3.2'
                        placeholderTextColor='#9CA3AF'
                        value={formData.weight}
                        onChangeText={(text) => {
                          setFormData((prev) => ({ ...prev, weight: text }));
                          if (formErrors.weight) {
                            setFormErrors((prev) => ({ ...prev, weight: undefined }));
                          }
                        }}
                        keyboardType='decimal-pad'
                      />
                    </View>
                    {formErrors.weight && <Text className='text-xs text-red-500 mt-1'>{formErrors.weight}</Text>}
                  </View>

                  <View className='flex-1'>
                    <Text className='text-sm font-medium text-gray-700 mb-2'>Height (cm)</Text>
                    <View
                      className={`bg-gray-50 rounded-xl px-4 py-4 border ${
                        formErrors.height ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <TextInput
                        className='text-base text-gray-700 font-medium'
                        placeholder='50'
                        placeholderTextColor='#9CA3AF'
                        value={formData.height}
                        onChangeText={(text) => {
                          setFormData((prev) => ({ ...prev, height: text }));
                          if (formErrors.height) {
                            setFormErrors((prev) => ({ ...prev, height: undefined }));
                          }
                        }}
                        keyboardType='numeric'
                      />
                    </View>
                    {formErrors.height && <Text className='text-xs text-red-500 mt-1'>{formErrors.height}</Text>}
                  </View>
                </View>
              </View>
            </View>

            {/* Health Information */}
            <View className='mx-4 mt-6'>
              <Text className='text-lg font-semibold text-gray-900 mb-6'>Health Information</Text>

              <View className='flex flex-col gap-4'>
                <View>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Allergies</Text>
                  <View className='flex-row gap-2 mb-2'>
                    <View className='flex-1 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200'>
                      <TextInput
                        className='text-base text-gray-700'
                        placeholder='Add an allergy'
                        placeholderTextColor='#9CA3AF'
                        value={newAllergy}
                        onChangeText={setNewAllergy}
                        onSubmitEditing={addAllergy}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={addAllergy}
                      className='bg-orange-500 px-4 py-3 rounded-xl justify-center items-center'
                    >
                      <Icon iconStyle='solid' name='plus' size={16} color='#ffffff' />
                    </TouchableOpacity>
                  </View>

                  {formData.allergies.length > 0 && (
                    <View className='flex-row flex-wrap gap-2'>
                      {formData.allergies.map((allergy, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => removeAllergy(index)}
                          className='bg-orange-100 px-3 py-1 rounded-full flex-row items-center'
                        >
                          <Text className='text-orange-800 text-sm mr-1'>{allergy}</Text>
                          <Icon iconStyle='solid' name='xmark' size={12} color='#EA580C' />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Medications</Text>
                  <View className='flex-row gap-2 mb-2'>
                    <View className='flex-1 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200'>
                      <TextInput
                        className='text-base text-gray-700'
                        placeholder='Add a medication'
                        placeholderTextColor='#9CA3AF'
                        value={newMedication}
                        onChangeText={setNewMedication}
                        onSubmitEditing={addMedication}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={addMedication}
                      className='bg-blue-500 px-4 py-3 rounded-xl justify-center items-center'
                    >
                      <Icon iconStyle='solid' name='plus' size={16} color='#ffffff' />
                    </TouchableOpacity>
                  </View>

                  {formData.medications.length > 0 && (
                    <View className='flex-row flex-wrap gap-2'>
                      {formData.medications.map((medication, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => removeMedication(index)}
                          className='bg-blue-100 px-3 py-1 rounded-full flex-row items-center'
                        >
                          <Text className='text-blue-800 text-sm mr-1'>{medication}</Text>
                          <Icon iconStyle='solid' name='xmark' size={12} color='#2563EB' />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View>
                  <Text className='text-sm font-medium text-gray-700 mb-2'>Additional Notes</Text>
                  <View className='bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
                    <TextInput
                      className='text-base text-gray-700 min-h-[80px]'
                      placeholder="Any additional notes about your baby's health or development..."
                      placeholderTextColor='#9CA3AF'
                      value={formData.notes}
                      onChangeText={(text) => setFormData((prev) => ({ ...prev, notes: text }))}
                      multiline
                      textAlignVertical='top'
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Your Relationship */}
            <View className='mx-4 mt-6 mb-8'>
              <Text className='text-lg font-semibold text-gray-900 mb-6'>Your Relationship</Text>

              <View className='flex-row flex-wrap gap-3'>
                {[
                  { key: FamilyRelationTypeEnum.MOTHER, label: 'Mother', icon: 'person-breastfeeding' },
                  { key: FamilyRelationTypeEnum.FATHER, label: 'Father', icon: 'user-tie' },
                  { key: FamilyRelationTypeEnum.GUARDIAN, label: 'Guardian', icon: 'shield-halved' },
                  { key: FamilyRelationTypeEnum.OTHER, label: 'Other', icon: 'users' },
                ].map((relation) => (
                  <TouchableOpacity
                    key={relation.key}
                    onPress={() => setCreatorRelationType(relation.key)}
                    className={`px-4 py-3 rounded-xl border flex-row items-center ${
                      creatorRelationType === relation.key
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <Icon
                      iconStyle='solid'
                      name={relation.icon as any}
                      size={16}
                      color={creatorRelationType === relation.key ? '#8B5CF6' : '#6B7280'}
                    />
                    <Text
                      className={`text-sm font-medium ml-2 ${
                        creatorRelationType === relation.key ? 'text-purple-600' : 'text-gray-600'
                      }`}
                    >
                      {relation.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Date Picker */}
        {renderDatePicker()}
      </View>
    </AppLayout>
  );
};

export default CreateBabyScreen;
