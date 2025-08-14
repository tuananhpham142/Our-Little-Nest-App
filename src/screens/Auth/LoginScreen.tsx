import AppleIcon from '@/assets/icons/AppleIcon';
import FacebookIcon from '@/assets/icons/FacebookIcon';
import GoogleIcon from '@/assets/icons/GoogleIcon';
import ZaloIcon from '@/assets/icons/ZaloIcon';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// import { useNavigation } from '@react-navigation/native';

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginScreenProps {
  onSignIn?: (formData: SignInFormData) => void;
  onFacebookLogin?: () => void;
  onAppleLogin?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSignIn, onFacebookLogin, onAppleLogin }) => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<SignInFormData>({
    email: 'catherine.shaw@gmail.com',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof SignInFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      onSignIn?.(formData);
      navigation.navigate('Home' as never);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleNavigateSignup = async () => {
    navigation.navigate('Register' as never);
  };

  const handleSocialLogin = (provider: 'facebook' | 'apple' | 'google' | 'zalo') => {
    if (provider === 'facebook') {
      onFacebookLogin?.();
    } else {
      onAppleLogin?.();
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
          {/* Top Navigation Dot */}
          <View className='flex-row justify-between mb-8'>
            <View className='w-10 h-10 bg-blue-600 rounded-full' />
            <TouchableOpacity
              onPress={handleNavigateSignup}
              className='px-4 py-2 bg-gray-100 rounded-full active:opacity-70'
            >
              <Text className='text-blue-600 font-medium'>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View className='mb-8'>
            <Text className='text-4xl font-bold text-gray-900 mb-2'>Sign in</Text>
            <Text className='text-gray-600 text-base'>Enter your details to proceed further</Text>
          </View>

          {/* Form */}
          <View className='mb-8'>
            {/* Email Input */}
            <View className='mb-6'>
              <Text className='text-gray-700 font-medium mb-2'>Email</Text>
              <View className='bg-gray-50 rounded-xl border border-gray-200'>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  placeholder='Enter your email'
                  placeholderTextColor='#9CA3AF'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                  className='px-4 py-4 text-gray-900 text-base'
                />
                <View className='absolute right-4 top-4'>
                  <View className='w-5 h-5 bg-gray-400 rounded' />
                </View>
              </View>
            </View>

            {/* Password Input */}
            <View className='mb-6'>
              <Text className='text-gray-700 font-medium mb-2'>Password</Text>
              <View className='bg-gray-50 rounded-xl border border-gray-200'>
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  placeholder='Enter your password'
                  placeholderTextColor='#9CA3AF'
                  secureTextEntry={!showPassword}
                  className='px-4 py-4 text-gray-900 text-base'
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className='absolute right-4 top-4'>
                  <View className='w-5 h-5 bg-gray-400 rounded' />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me */}
            <TouchableOpacity
              onPress={() => handleInputChange('rememberMe', !formData.rememberMe)}
              className='flex-row items-center mb-8 active:opacity-70'
            >
              <View
                className={`w-5 h-5 rounded mr-3 border-2 items-center justify-center ${
                  formData.rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}
              >
                {formData.rememberMe && <Text className='text-white text-xs'>✓</Text>}
              </View>
              <Text className='text-gray-700 font-medium'>Remember me</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isLoading}
              className={`rounded-2xl py-4 mb-6 shadow-lg active:scale-95 ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
              style={{
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <Text className='text-white text-lg font-semibold text-center'>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <Text className='text-center text-gray-500 mb-6'>Or sign in with</Text>

            {/* Social Login Buttons */}
            <View className='flex flex-row gap-4 justify-center'>
              <TouchableOpacity
                onPress={() => handleSocialLogin('facebook')}
                className='flex-row items-center justify-center bg-gray-50 rounded-2xl py-4 px-4 border border-gray-200 active:scale-95'
              >
                <FacebookIcon />
                {/* <View className='w-5 h-5 bg-blue-600 rounded mr-3' /> */}
                {/* <Text className='text-gray-700 font-medium ml-3'>Sign Up with Facebook</Text> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSocialLogin('apple')}
                className='flex-row items-center justify-center bg-gray-50 rounded-2xl py-4 px-4 border border-gray-200 active:scale-95'
              >
                <AppleIcon />
                {/* <Text className='text-gray-700 font-medium ml-3'>Sign Up with Apple</Text> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSocialLogin('google')}
                className='flex-row items-center justify-center bg-gray-50 rounded-2xl py-4 px-4 border border-gray-200 active:scale-95'
              >
                <GoogleIcon />
                {/* <Text className='text-gray-700 font-medium ml-3'>Sign Up with Google</Text> */}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSocialLogin('zalo')}
                className='flex-row items-center justify-center bg-gray-50 rounded-2xl py-4 px-4 border border-gray-200 active:scale-95'
              >
                <ZaloIcon />
                {/* <Text className='text-gray-700 font-medium ml-3'>Sign Up with Zalo</Text> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
