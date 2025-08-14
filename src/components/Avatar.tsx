// src/components/common/Avatar.tsx
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 40, onPress }) => {
  const { colors } = useTheme();

  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  const content = uri ? (
    <Image source={{ uri }} style={avatarStyle} resizeMode='cover' />
  ) : (
    <View style={avatarStyle}>
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: size * 0.4,
          fontWeight: '600',
        }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
};
