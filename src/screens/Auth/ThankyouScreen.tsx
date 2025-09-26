import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native';

interface ThankYouScreenProps {
  email?: string;
  //   onGoToDashboard?: () => void;
  onResendEmail?: () => void;
}

const ThankYouScreen: React.FC<ThankYouScreenProps> = ({
  email = 'catherine.shaw@gmail.com',
  //   onGoToDashboard,
  onResendEmail,
}) => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rocketAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animations for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(rocketAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rocketAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(starAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoToDashboard = () => {
    // onGoToDashboard?.();
    navigation.navigate('Home' as never);
  };

  const handleResendEmail = () => {
    onResendEmail?.();
  };

  const rocketTranslateY = rocketAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const starScale = starAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <Animated.View className='flex-1 px-4 pt-16' style={{ opacity: fadeAnim }}>
      {/* Top Navigation Dot */}
      <View className='flex-row justify-start mb-8'>
        <View className='w-3 h-3 bg-blue-600 rounded-full' />
      </View>

      {/* Decorative Elements */}
      <View className='flex-1 justify-center items-center relative'>
        {/* Rocket */}
        <Animated.View
          className='absolute'
          style={{
            transform: [{ translateY: rocketTranslateY }],
            top: height * 0.15,
            right: width * 0.15,
          }}
        >
          <View
            className='bg-red-400 shadow-lg'
            style={{
              width: width * 0.2,
              height: width * 0.25,
              borderTopLeftRadius: width * 0.1,
              borderTopRightRadius: width * 0.1,
              borderBottomLeftRadius: width * 0.02,
              borderBottomRightRadius: width * 0.02,
            }}
          >
            {/* Rocket details */}
            <View className='absolute top-2 left-1/2 transform -translate-x-1/2'>
              <View className='w-3 h-3 bg-white rounded-full' />
            </View>
            <View className='absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-2'>
              <View className='w-2 h-6 bg-yellow-400 rounded-full' />
            </View>
          </View>
        </Animated.View>

        {/* Yellow Star */}
        <Animated.View
          className='absolute bg-yellow-400 shadow-md'
          style={{
            transform: [{ scale: starScale }],
            width: width * 0.12,
            height: width * 0.12,
            top: height * 0.08,
            left: width * 0.2,
          }}
        >
          <View className='flex-1 justify-center items-center'>
            <Text className='text-white font-bold text-lg'>★</Text>
          </View>
        </Animated.View>

        {/* Blue Circle */}
        <View
          className='absolute bg-blue-400 rounded-full shadow-sm'
          style={{
            width: width * 0.15,
            height: width * 0.15,
            bottom: height * 0.3,
            left: width * 0.1,
          }}
        />

        {/* Orange Triangle */}
        <View
          className='absolute'
          style={{
            bottom: height * 0.2,
            right: width * 0.25,
          }}
        >
          <View
            className='bg-orange-400 shadow-md'
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: width * 0.08,
              borderRightWidth: width * 0.08,
              borderBottomWidth: width * 0.12,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#FB923C',
            }}
          />
        </View>

        {/* Pink Star */}
        <Animated.View
          className='absolute bg-pink-300 shadow-sm'
          style={{
            transform: [{ scale: starScale }],
            width: width * 0.1,
            height: width * 0.1,
            bottom: height * 0.35,
            right: width * 0.15,
          }}
        >
          <View className='flex-1 justify-center items-center'>
            <Text className='text-white font-bold text-sm'>★</Text>
          </View>
        </Animated.View>
      </View>

      {/* Content */}
      <Animated.View className='pb-12' style={{ transform: [{ translateY: slideAnim }] }}>
        <Text className='text-4xl font-bold text-gray-900 text-center mb-4'>Thank you</Text>
        <Text className='text-base text-gray-600 text-center mb-2 px-4'>We sent an email to</Text>
        <Text className='text-base font-semibold text-blue-600 text-center mb-12 px-4'>{email}</Text>

        {/* Progress Indicator */}
        <View className='flex-row justify-center mb-12'>
          <View className='w-8 h-1 bg-blue-600 rounded-full mr-1' />
          <View className='w-8 h-1 bg-blue-600 rounded-full mr-1' />
          <View className='w-8 h-1 bg-blue-600 rounded-full' />
        </View>

        {/* Go to Dashboard Button */}
        <TouchableOpacity
          onPress={handleGoToDashboard}
          className='bg-blue-600 rounded-2xl py-4 mb-6 shadow-lg active:scale-95'
          style={{ shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
        >
          <Text className='text-white text-lg font-semibold text-center'>Go to Dashboard</Text>
        </TouchableOpacity>

        {/* Resend Email Link */}
        <TouchableOpacity onPress={handleResendEmail} className='py-2 active:opacity-70'>
          <Text className='text-gray-500 text-sm text-center'>
            Didn't receive an email? <Text className='text-blue-600 font-medium'>Resend</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Indicator */}
      <View className='items-center pb-4'>
        <View className='w-32 h-1 bg-gray-900 rounded-full' />
      </View>
    </Animated.View>
  );
};

export default ThankYouScreen;
