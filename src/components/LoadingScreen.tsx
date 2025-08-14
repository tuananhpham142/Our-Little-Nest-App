// src/components/common/LoadingScreen.tsx
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export const LoadingScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View className='flex-1 justify-center items-center' style={{ backgroundColor: colors.background }}>
      <ActivityIndicator size='large' color={colors.primary} />
      <Text className='mt-4 text-lg' style={{ color: colors.text }}>
        Loading...
      </Text>
    </View>
  );
};
