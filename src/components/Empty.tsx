// src/components/common/Empty.tsx
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Text, View } from 'react-native';

interface EmptyProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const Empty: React.FC<EmptyProps> = ({ title = 'No data', subtitle, icon, action }) => {
  const { colors } = useTheme();

  return (
    <View className='flex-1 justify-center items-center p-8'>
      {icon && <View className='mb-4'>{icon}</View>}

      <Text className='text-lg font-semibold text-center mb-2' style={{ color: colors.textSecondary }}>
        {title}
      </Text>

      {subtitle && (
        <Text className='text-sm text-center mb-6' style={{ color: colors.textSecondary }}>
          {subtitle}
        </Text>
      )}

      {action}
    </View>
  );
};
