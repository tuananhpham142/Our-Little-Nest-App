import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface WelcomeScreenProps {}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({}) => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  const handleGetStarted = () => {
    // onGetStarted?.();
    navigation.navigate('Home' as never);
  };

  const handleSignIn = () => {
    // onSignIn?.();
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView className='flex-1 bg-gradient-to-br from-blue-50 to-purple-100'>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />

      <View className='flex-1 px-4 pt-12'>
        {/* Top Navigation Dot */}
        <View className='flex-row justify-start mb-8'>
          <View className='w-3 h-3 bg-blue-600 rounded-full' />
        </View>

        {/* Decorative Elements */}
        <View className='flex-1 justify-center items-center relative'>
          {/* Large Orange Circle */}
          <View
            className='absolute bg-orange-400 rounded-full shadow-lg'
            style={{
              width: width * 0.35,
              height: width * 0.35,
              top: height * 0.1,
              right: width * 0.1,
            }}
          />

          {/* Pink Circle with Blue Dot */}
          <View
            className='absolute bg-pink-300 rounded-full shadow-md flex justify-center items-center'
            style={{
              width: width * 0.25,
              height: width * 0.25,
              bottom: height * 0.25,
              left: width * 0.05,
            }}
          >
            <View className='w-8 h-8 bg-blue-500 rounded-full' />
          </View>

          {/* Small Blue Circle */}
          <View
            className='absolute bg-blue-400 rounded-full shadow-sm'
            style={{
              width: width * 0.15,
              height: width * 0.15,
              top: height * 0.05,
              left: width * 0.15,
            }}
          />

          {/* Small Pink Circle */}
          <View
            className='absolute bg-pink-200 rounded-full shadow-sm'
            style={{
              width: width * 0.12,
              height: width * 0.12,
              bottom: height * 0.15,
              right: width * 0.25,
            }}
          />
        </View>

        {/* Content */}
        <View className='pb-12'>
          <Text className='text-4xl font-bold text-gray-900 text-center mb-4'>Join us today</Text>
          <Text className='text-base text-gray-600 text-center mb-12 px-4'>Enter your details to proceed further</Text>

          {/* Progress Indicator */}
          <View className='flex-row justify-center mb-12'>
            <View className='w-8 h-1 bg-blue-600 rounded-full mr-1' />
            <View className='w-8 h-1 bg-gray-200 rounded-full mr-1' />
            <View className='w-8 h-1 bg-gray-200 rounded-full' />
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            className='bg-blue-600 rounded-2xl py-4 mb-6 shadow-lg active:scale-95'
            style={{
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Text className='text-white text-lg font-semibold text-center'>Get Started</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity onPress={handleSignIn} className='py-2 active:opacity-70'>
            <Text className='text-blue-600 text-base font-medium text-center'>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
