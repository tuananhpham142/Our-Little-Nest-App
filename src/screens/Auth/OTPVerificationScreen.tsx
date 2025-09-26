import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
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

interface OTPVerificationProps {
  phoneNumber?: string;
  onVerifyOTP?: (otp: string) => void;
  onResendOTP?: () => void;
  onEditPhoneNumber?: () => void;
}

const OTPVerificationScreen: React.FC<OTPVerificationProps> = ({
  phoneNumber = '9745xxxxxx',
  onVerifyOTP,
  onResendOTP,
  onEditPhoneNumber,
}) => {
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');
  const [otp, setOTP] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Timer for resend functionality
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto verify when all 4 digits are entered
    if (otp.every((digit) => digit !== '')) {
      handleVerifyOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleOTPChange = (value: string, index: number) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto focus next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      onVerifyOTP?.(otpString);
      navigation.navigate('CompleteProfile' as never);
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      setOTP(['', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (canResend) {
      onResendOTP?.();
      setTimer(30);
      setCanResend(false);
      setOTP(['', '', '', '']);
      otpRefs.current[0]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1 px-4 pt-16'>
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
            <View className='flex-row justify-center flex gap-1 mt-1'>
              <View className='w-2 h-10 bg-gray-800 rounded-b-lg' />
              <View className='w-2 h-10 bg-gray-800 rounded-b-lg' />
            </View>
            {/* Feet */}
            <View className='flex-row justify-center flex gap-1 -mt-2'>
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
        <View className='mb-6'>
          <Text className='text-3xl font-bold text-gray-900 text-center mb-3'>Verify account</Text>
          <View className='flex-row items-center justify-center'>
            <Text className='text-gray-500 text-base'>Enter OTP sent to {phoneNumber}</Text>
            <TouchableOpacity onPress={onEditPhoneNumber} className='ml-2 p-1'>
              <Text className='text-blue-600 text-lg'>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OTP Input Boxes */}
        <View className='flex-row justify-center gap-4 mb-4'>
          {otp.map((digit, index) => (
            <View
              key={index}
              className='w-18 h-18 bg-white rounded-lg border-2 border-gray-200 justify-center items-center shadow-sm'
            >
              <TextInput
                ref={(ref) => {
                  otpRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(value) => handleOTPChange(value.slice(-1), index)}
                keyboardType='numeric'
                autoFocus
                onSubmitEditing={handleVerifyOTP}
                maxLength={1}
                className='text-xl font-bold text-gray-900 text-center w-full h-full'
                style={{ textAlignVertical: 'center' }}
                showSoftInputOnFocus={false}
              />
              {digit === '' && <Text className='absolute text-2xl text-gray-200'>-</Text>}
            </View>
          ))}
        </View>

        {/* Resend Link */}
        <TouchableOpacity onPress={handleResend} disabled={!canResend} className='mb-8 py-2'>
          <Text className={`text-center font-medium ${canResend ? 'text-blue-600' : 'text-gray-400'}`}>
            {canResend ? 'Resend' : `Resend in ${timer}s`}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTPVerificationScreen;
