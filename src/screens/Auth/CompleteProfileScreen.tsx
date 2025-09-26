import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProfileFormData {
  name: string;
  nickname: string;
  dateOfBirth: Date | null;
  gender: 'male' | 'female' | '';
}

interface CompleteProfileScreenProps {
  onCompleteProfile?: (formData: ProfileFormData) => void;
  onNavigateBack?: () => void;
}

const CompleteProfileScreen: React.FC<CompleteProfileScreenProps> = ({ onCompleteProfile, onNavigateBack }) => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    nickname: '',
    dateOfBirth: null,
    gender: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field: keyof Omit<ProfileFormData, 'dateOfBirth'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return '';

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!formData.dateOfBirth) {
      Alert.alert('Error', 'Please select your date of birth');
      return false;
    }
    if (!formData.gender) {
      Alert.alert('Error', 'Please select your gender');
      return false;
    }
    return true;
  };

  const handleConfirmDetails = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      onCompleteProfile?.(formData);
      // navigation.navigate('Dashboard' as never);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1 px-4 pt-16'>
      <ScrollView
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <View>
          {/* Illustration */}
          <View className='items-center mb-8 relative'>
            {/* Phone mockup */}
            <View
              className='bg-blue-100 rounded-3xl border-4 border-white shadow-lg relative'
              style={{ width: width * 0.35, height: width * 0.55 }}
            >
              <View className='flex-1 bg-gray-100 rounded-2xl m-2' />
            </View>

            {/* Person illustration */}
            <View className='absolute z-10' style={{ right: width * 0.18, top: width * 0.08 }}>
              {/* Head */}
              <View className='w-14 h-14 bg-blue-500 rounded-full mb-2 relative'>
                <View className='absolute bottom-0 left-2 w-10 h-6 bg-blue-700 rounded-t-full' />
              </View>
              {/* Body */}
              <View className='w-10 h-16 bg-blue-600 rounded-t-2xl mx-auto' />
              {/* Arms */}
              <View className='absolute top-14 -left-3 w-6 h-2 bg-blue-600 rounded-full transform -rotate-45' />
              <View className='absolute top-14 -right-3 w-6 h-2 bg-blue-600 rounded-full transform rotate-45' />
              {/* Legs */}
              <View className='flex flex-row justify-center gap-1 mt-1'>
                <View className='w-2 h-10 bg-gray-800 rounded-b-lg' />
                <View className='w-2 h-10 bg-gray-800 rounded-b-lg' />
              </View>
              {/* Feet */}
              <View className='flex flex-row justify-center gap-1 -mt-2'>
                <View className='w-4 h-2 bg-yellow-500 rounded-full' />
                <View className='w-4 h-2 bg-yellow-500 rounded-full' />
              </View>
            </View>

            {/* Decorative plants */}
            <View className='absolute' style={{ left: width * 0.1, bottom: width * 0.05 }}>
              <View className='w-8 h-12 bg-green-400 rounded-t-full transform rotate-12' />
              <View className='w-6 h-8 bg-green-500 rounded-t-full transform -rotate-12 -mt-6 ml-2' />
            </View>

            <View className='absolute' style={{ right: width * 0.08, bottom: width * 0.02 }}>
              <View className='w-6 h-8 bg-green-500 rounded-t-full transform rotate-12' />
              <View className='w-4 h-6 bg-green-600 rounded-t-full transform -rotate-12 -mt-4 ml-1' />
            </View>
          </View>

          {/* Header */}
          <View className='mb-8'>
            <Text className='text-3xl font-bold text-gray-900 text-center mb-2'>About you</Text>
            <Text className='text-gray-500 text-base text-center'>Please let us know more about you</Text>
          </View>

          {/* Form Fields */}
          <View className='mb-8'>
            {/* Name Input */}
            <View className='mb-6'>
              <Text className='text-blue-500 text-sm font-medium mb-2 ml-1'>My name</Text>
              <View className='bg-white rounded-2xl border border-gray-200 shadow-sm'>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  placeholder='Nnenna Jioke'
                  placeholderTextColor='#9CA3AF'
                  className='px-4 py-4 text-gray-900 text-base'
                  autoCapitalize='words'
                />
              </View>
            </View>

            {/* Nickname Input (Optional) */}
            <View className='mb-6'>
              <Text className='text-blue-500 text-sm font-medium mb-2 ml-1'>Nickname (Optional)</Text>
              <View className='bg-white rounded-2xl border border-gray-200 shadow-sm'>
                <TextInput
                  value={formData.nickname}
                  onChangeText={(text) => handleInputChange('nickname', text)}
                  placeholder='Enter your nickname'
                  placeholderTextColor='#9CA3AF'
                  className='px-4 py-4 text-gray-900 text-base'
                />
              </View>
            </View>

            {/* Date of Birth Input */}
            <View className='mb-6'>
              <Text className='text-blue-500 text-sm font-medium mb-2 ml-1'>Wish me on</Text>
              <TouchableOpacity
                onPress={showDatePickerModal}
                className='bg-white rounded-2xl border border-gray-200 shadow-sm'
              >
                <View className='px-4 py-4'>
                  <Text className={`text-base ${formData.dateOfBirth ? 'text-gray-900' : 'text-gray-400'}`}>
                    {formatDisplayDate(formData.dateOfBirth) || '21 Nov 1990'}
                  </Text>
                </View>
                <View className='absolute right-4 top-4'>
                  <Text className='text-gray-400 text-lg'>📅</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* DatePicker Modal */}
            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth || new Date()}
                mode='date'
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}

            {/* Gender Selection */}
            <View className='mb-8'>
              <View className='flex flex-row justify-center gap-1'>
                {/* Male Option */}
                <TouchableOpacity
                  onPress={() => handleGenderSelect('male')}
                  className={`flex-1 py-4 px-4 rounded-2xl border-2 flex-row items-center justify-center active:scale-95 ${
                    formData.gender === 'male'
                      ? 'bg-blue-600 border-blue-600 shadow-lg'
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}
                  style={
                    formData.gender === 'male'
                      ? {
                          shadowColor: '#3B82F6',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                        }
                      : {}
                  }
                >
                  <Text className='text-2xl mr-3'>♂️</Text>
                  <Text
                    className={`text-lg font-semibold ${formData.gender === 'male' ? 'text-white' : 'text-gray-700'}`}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                {/* Female Option */}
                <TouchableOpacity
                  onPress={() => handleGenderSelect('female')}
                  className={`flex-1 py-4 px-4 rounded-2xl border-2 flex-row items-center justify-center active:scale-95 ${
                    formData.gender === 'female'
                      ? 'bg-pink-500 border-pink-500 shadow-lg'
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}
                  style={
                    formData.gender === 'female'
                      ? {
                          shadowColor: '#EC4899',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                        }
                      : {}
                  }
                >
                  <Text className='text-2xl mr-3'>♀️</Text>
                  <Text
                    className={`text-lg font-semibold ${formData.gender === 'female' ? 'text-white' : 'text-gray-700'}`}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Details Button */}
            <TouchableOpacity
              onPress={handleConfirmDetails}
              disabled={isLoading}
              className={`rounded-2xl py-4 shadow-lg active:scale-95 ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
              style={{
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <Text className='text-white text-lg font-semibold text-center'>
                {isLoading ? 'SAVING...' : 'CONFIRM DETAILS'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CompleteProfileScreen;
