// components/common/LoadingSpinner.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Đang tải...',
  size = 'medium',
  color = '#8B5CF6',
  fullScreen = true,
}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { iconSize: 20, containerSize: 40 };
      case 'large':
        return { iconSize: 40, containerSize: 80 };
      default:
        return { iconSize: 30, containerSize: 60 };
    }
  };

  const { iconSize, containerSize } = getSizeProps();

  useEffect(() => {
    // Rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    rotateAnimation.start();
    pulseAnimation.start();

    return () => {
      rotateAnimation.stop();
      pulseAnimation.stop();
    };
  }, [rotateValue, pulseValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!fullScreen) {
    return (
      <View className='items-center justify-center'>
        {/* Background decoration */}
        <Animated.View
          style={{
            transform: [{ scale: pulseValue }],
            opacity: 0.3,
          }}
        >
          <View
            className='rounded-full bg-purple-200'
            style={{
              width: containerSize * 1.5,
              height: containerSize * 1.5,
            }}
          />
        </Animated.View>

        {/* Main spinner */}
        <Animated.View
          className='absolute items-center justify-center'
          style={{
            transform: [{ rotate }],
          }}
        >
          <LinearGradient
            colors={['#8B5CF6', '#D946EF', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className='rounded-full items-center justify-center'
            style={{
              width: containerSize,
              height: containerSize,
            }}
          >
            <View
              className='bg-white rounded-full items-center justify-center'
              style={{
                width: containerSize - 8,
                height: containerSize - 8,
              }}
            >
              <Icon iconStyle='solid' name='heart' size={iconSize} color={color} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Loading dots */}
        <View className='flex-row mt-6 flex gap-1'>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              className='w-2 h-2 bg-purple-400 rounded-full'
              style={{
                opacity: pulseValue,
                transform: [
                  {
                    scale: Animated.add(pulseValue, Animated.multiply(Animated.add(rotateValue, index * 0.33), 0.3)),
                  },
                ],
              }}
            />
          ))}
        </View>

        {/* Message */}
        {message && (
          <Animated.Text className='text-gray-600 font-medium mt-4 text-center' style={{ opacity: pulseValue }}>
            {message}
          </Animated.Text>
        )}
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white items-center justify-center'>
      {/* Background gradient */}
      <View className='absolute inset-0'>
        <LinearGradient
          colors={['#FAFAFA', '#F3E8FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>

      <View className='items-center justify-center'>
        {/* Background decoration */}
        <Animated.View
          style={{
            transform: [{ scale: pulseValue }],
            opacity: 0.3,
          }}
        >
          <View
            className='rounded-full bg-purple-200'
            style={{
              width: containerSize * 1.5,
              height: containerSize * 1.5,
            }}
          />
        </Animated.View>

        {/* Main spinner */}
        <Animated.View
          className='absolute items-center justify-center'
          style={{
            transform: [{ rotate }],
          }}
        >
          <LinearGradient
            colors={['#8B5CF6', '#D946EF', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className='rounded-full items-center justify-center'
            style={{
              width: containerSize,
              height: containerSize,
            }}
          >
            <View
              className='bg-white rounded-full items-center justify-center'
              style={{
                width: containerSize - 8,
                height: containerSize - 8,
              }}
            >
              <Icon iconStyle='solid' name='heart' size={iconSize} color={color} />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Loading dots */}
        <View className='flex-row mt-6 flex gap-1'>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              className='w-2 h-2 bg-purple-400 rounded-full'
              style={{
                opacity: pulseValue,
                transform: [
                  {
                    scale: Animated.add(pulseValue, Animated.multiply(Animated.add(rotateValue, index * 0.33), 0.3)),
                  },
                ],
              }}
            />
          ))}
        </View>

        {/* Message */}
        {message && (
          <Animated.Text className='text-gray-600 font-medium mt-4 text-center' style={{ opacity: pulseValue }}>
            {message}
          </Animated.Text>
        )}
      </View>

      {/* Pregnancy-themed decorations */}
      <View className='absolute top-20 right-10 opacity-10'>
        <Text className='text-6xl'>🤱</Text>
      </View>

      <View className='absolute bottom-32 left-8 opacity-10'>
        <Text className='text-5xl'>👶</Text>
      </View>

      <View className='absolute top-1/3 left-6 opacity-10'>
        <Text className='text-4xl'>💕</Text>
      </View>
    </View>
  );
};
