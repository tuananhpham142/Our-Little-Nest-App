// components/common/EmptyState.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  emoji?: string;
  icon?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  emoji = '📖',
  icon,
  buttonText,
  onButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
}) => {
  return (
    <View className='flex-1 items-center justify-center px-8'>
      {/* Background decoration */}
      <View className='absolute inset-0 items-center justify-center opacity-5'>
        <View className='w-96 h-96 rounded-full bg-gradient-to-r from-purple-400 to-pink-400' />
      </View>

      {/* Icon/Emoji */}
      <View className='mb-6'>
        {icon ? (
          <View className='w-20 h-20 bg-gray-100 rounded-full items-center justify-center'>
            <Icon name={icon as unknown as any} size={40} color='#9CA3AF' iconStyle='solid' />
          </View>
        ) : (
          <Text className='text-6xl'>{emoji}</Text>
        )}
      </View>

      {/* Title */}
      <Text className='text-xl font-bold text-gray-800 text-center mb-3'>{title}</Text>

      {/* Subtitle */}
      <Text className='text-gray-500 text-center leading-6 mb-8'>{subtitle}</Text>

      {/* Primary Button */}
      {buttonText && onButtonPress && (
        <TouchableOpacity onPress={onButtonPress} className='mb-3' activeOpacity={0.8}>
          <LinearGradient
            colors={['#8B5CF6', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 }}
          >
            <Text className='text-white font-semibold text-center'>{buttonText}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Secondary Button */}
      {secondaryButtonText && onSecondaryButtonPress && (
        <TouchableOpacity
          onPress={onSecondaryButtonPress}
          className='px-8 py-3 bg-gray-100 rounded-xl'
          activeOpacity={0.7}
        >
          <Text className='text-gray-600 font-medium text-center'>{secondaryButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
