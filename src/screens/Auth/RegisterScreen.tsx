import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface RegisterFormData {
  countryCode: string;
  phoneNumber: string;
}

interface RegisterScreenProps {
  onVerifyPhone?: (formData: RegisterFormData) => void;
  onNavigateToSignIn?: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onVerifyPhone, onNavigateToSignIn }) => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const [formData, setFormData] = useState<RegisterFormData>({
    countryCode: '+91',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePhoneNumber = (): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleVerify = async () => {
    if (!validatePhoneNumber()) return;

    setIsLoading(true);
    try {
      onVerifyPhone?.(formData);
      // @ts-ignore
      navigation.navigate('OTPVerification' as never, {
        phoneNumber: `${formData.countryCode} ${formData.phoneNumber}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1 px-4 pt-16'>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <View>
          {/* Illustration */}
          <View className='items-center mb-12 relative'>
            {/* Phone mockup */}
            <View
              className='bg-blue-100 rounded-3xl border-4 border-white shadow-lg relative'
              style={{ width: width * 0.4, height: width * 0.65 }}
            >
              {/* Screen content placeholder */}
              <View className='flex-1 bg-gray-100 rounded-2xl m-2' />
            </View>

            {/* Person illustration */}
            <View className='absolute z-10' style={{ right: width * 0.15, top: width * 0.1 }}>
              {/* Head */}
              <View className='w-16 h-16 bg-blue-500 rounded-full mb-2 relative'>
                <View className='absolute bottom-0 left-3 w-10 h-8 bg-blue-700 rounded-t-full' />
              </View>
              {/* Body */}
              <View className='w-12 h-20 bg-blue-600 rounded-t-2xl mx-auto' />
              {/* Arms */}
              <View className='absolute top-16 -left-4 w-8 h-3 bg-blue-600 rounded-full transform -rotate-45' />
              <View className='absolute top-16 -right-4 w-8 h-3 bg-blue-600 rounded-full transform rotate-45' />
              {/* Legs */}
              <View className='flex-row justify-center flex gap-1 mt-1'>
                <View className='w-3 h-12 bg-gray-800 rounded-b-lg' />
                <View className='w-3 h-12 bg-gray-800 rounded-b-lg' />
              </View>
              {/* Feet */}
              <View className='flex-row justify-center flex gap-1 -mt-2'>
                <View className='w-6 h-3 bg-yellow-500 rounded-full' />
                <View className='w-6 h-3 bg-yellow-500 rounded-full' />
              </View>
            </View>

            {/* Decorative plants */}
            <View className='absolute' style={{ left: width * 0.05, bottom: width * 0.1 }}>
              <View className='w-12 h-16 bg-green-400 rounded-t-full transform rotate-12' />
              <View className='w-8 h-12 bg-green-500 rounded-t-full transform -rotate-12 -mt-8 ml-4' />
              <View className='w-6 h-8 bg-green-600 rounded-t-full transform rotate-6 -mt-6 ml-2' />
            </View>

            <View className='absolute' style={{ right: width * 0.05, bottom: width * 0.05 }}>
              <View className='w-8 h-12 bg-green-500 rounded-t-full transform rotate-12' />
              <View className='w-6 h-8 bg-green-600 rounded-t-full transform -rotate-12 -mt-6 ml-2' />
            </View>
          </View>

          {/* Header */}
          <View className='mb-8'>
            <Text className='text-3xl font-bold text-gray-900 text-center mb-2'>Glad to see you :)</Text>
          </View>

          {/* Phone Number Input */}
          <View className='mb-8'>
            <View className='flex-row bg-white rounded-2xl border border-gray-200 shadow-sm'>
              {/* Country Code */}
              <View className='flex-row items-center px-4 py-4 border-r border-gray-200'>
                <TextInput
                  value={formData.countryCode}
                  onChangeText={(text) => handleInputChange('countryCode', text)}
                  className='text-gray-900 text-base font-medium w-12'
                  keyboardType='phone-pad'
                  maxLength={4}
                />
              </View>

              {/* Phone Number */}
              <TextInput
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange('phoneNumber', text.replace(/[^0-9]/g, ''))}
                placeholder='Mobile number'
                placeholderTextColor='#9CA3AF'
                keyboardType='phone-pad'
                maxLength={10}
                className='flex-1 px-4 py-4 text-gray-900 text-base'
              />
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={isLoading}
            className={`rounded-2xl py-4 mb-8 shadow-lg active:scale-95 ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
            style={{
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Text className='text-white text-lg font-semibold text-center'>
              {isLoading ? 'VERIFYING...' : 'VERIFY'}
            </Text>
          </TouchableOpacity>

          {/* Terms and Conditions */}
          <View className='mb-8'>
            <Text className='text-sm text-gray-500 text-center'>
              By signing up, you agree to <Text className='text-blue-600 underline'>T&C</Text>
            </Text>
          </View>

          {/* Sign In Link */}
          <TouchableOpacity onPress={onNavigateToSignIn} className='py-2 active:opacity-70'>
            <Text className='text-blue-600 text-base font-medium text-center'>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
