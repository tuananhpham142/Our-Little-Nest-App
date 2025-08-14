import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState } from 'react';
import { Animated, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { AcceptTripIcon } from './icons/AcceptTripIcon';
import { DeliveryIcon } from './icons/DeliveryIcon';
import { EarnMoneyIcon } from './icons/EarnMoneyIcon';

const slides = [
  {
    id: 1,
    bgColor: '#6457F0',
    textColor: 'text-white',
    buttonBgColor: 'bg-white',
    buttonTextColor: 'text-[#6457F0]',
    skipButtonBg: 'bg-white/20',
    skipButtonTextColor: 'text-white',
    dotColor: '#FFFFFF',
    inactiveDotColor: 'rgba(255, 255, 255, 0.5)',
    image: DeliveryIcon,
    title1: 'Get started with',
    title2: 'Delivery',
    description: 'You can have a steady job and earn money. Welcome to the gathering of drivers!',
  },
  {
    id: 2,
    bgColor: '#FFFFFF',
    textColor: 'text-gray-800',
    buttonBgColor: 'bg-[#6457F0]',
    buttonTextColor: 'text-white',
    skipButtonBg: 'bg-gray-200/70',
    skipButtonTextColor: 'text-gray-800',
    dotColor: '#6457F0',
    inactiveDotColor: 'rgba(100, 87, 240, 0.3)',
    image: AcceptTripIcon,
    title1: 'Open Delivery app',
    title2: 'Accept & Start',
    description: 'Various trips are offered to you through the application',
  },
  {
    id: 3,
    bgColor: '#FF9B39',
    textColor: 'text-white',
    buttonBgColor: 'bg-white',
    buttonTextColor: 'text-[#FF9B39]',
    skipButtonBg: 'bg-white/20',
    skipButtonTextColor: 'text-white',
    dotColor: '#FFFFFF',
    inactiveDotColor: 'rgba(255, 255, 255, 0.5)',
    image: EarnMoneyIcon,
    title1: 'You can',
    title2: 'Earn Money',
    description: 'Earn up to €2500 per month with the highest-paying delivery app on the market.',
  },
];
interface AppIntroScreensProps {
  onDone: () => void;
}
const OnboardingSlider: React.FC<AppIntroScreensProps> = (props: AppIntroScreensProps) => {
  const { onDone } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<AppIntroSlider>(null);
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem('@app_intro_shown', 'true');
      onDone();
    } catch (error) {
      console.error('Error saving intro completion status:', error);
      onDone();
    }
  };
  const handleSkip = () => {
    sliderRef.current?.goToSlide(slides.length - 1, true);
  };

  const onSlideChange = (index: number) => {
    setCurrentIndex(index);
    Animated.timing(backgroundAnim, {
      toValue: index,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => {
    const IconComponent = item.image;
    return (
      <View className='flex-1 items-center justify-start pt-28 px-4'>
        <View className='w-full h-80 flex items-center justify-center'>
          <IconComponent />
        </View>
        <View className='mt-8 text-center items-center'>
          <Text className={`text-lg opacity-80 text-center ${item.textColor}`}>{item.title1}</Text>
          <Text className={`text-4xl font-bold mt-1 text-center ${item.textColor}`}>{item.title2}</Text>
          <Text className={`mt-4 max-w-xs mx-auto opacity-80 leading-relaxed text-center ${item.textColor}`}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderNextButton = () => {
    const currentSlide = slides[currentIndex];
    return (
      <View className={`px-8 py-3 rounded-full ${currentSlide.buttonBgColor}`}>
        <Text className={`font-bold text-sm text-center ${currentSlide.buttonTextColor}`}>Next</Text>
      </View>
    );
  };

  const renderDoneButton = () => {
    const currentSlide = slides[currentIndex];
    return (
      <View className={`px-8 py-3 rounded-full ${currentSlide.buttonBgColor}`}>
        <Text className={`font-bold text-sm ${currentSlide.buttonTextColor}`}>Let's Go</Text>
      </View>
    );
  };

  const renderSkipButton = () => {
    if (currentIndex === slides.length - 1) return null;
    const currentSlide = slides[currentIndex];
    return (
      <TouchableOpacity
        onPress={handleSkip}
        className={`absolute top-14 right-6 px-4 py-2 rounded-full ${currentSlide.skipButtonBg}`}
        style={{ zIndex: 1 }}
      >
        <Text className={`${currentSlide.skipButtonTextColor} font-medium`}>Skip</Text>
      </TouchableOpacity>
    );
  };

  const currentSlideStyle = slides[currentIndex];
  const backgroundColor = backgroundAnim.interpolate({
    inputRange: slides.map((_, i) => i),
    outputRange: slides.map((s) => s.bgColor),
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor }}>
      <SafeAreaView className='flex-1'>
        <StatusBar barStyle={currentSlideStyle.id === 2 ? 'dark-content' : 'light-content'} animated />
        {renderSkipButton()}
        <AppIntroSlider
          ref={sliderRef}
          data={slides}
          renderItem={renderItem}
          onDone={handleDone}
          onSlideChange={onSlideChange}
          renderNextButton={renderNextButton}
          renderDoneButton={renderDoneButton}
          //   bottomButton
          dotStyle={{ backgroundColor: currentSlideStyle.inactiveDotColor, width: 8, height: 8 }}
          activeDotStyle={{ backgroundColor: currentSlideStyle.dotColor, width: 24, height: 8 }}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

export default OnboardingSlider;
