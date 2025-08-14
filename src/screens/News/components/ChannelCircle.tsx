// src/components/ChannelCircle.tsx
import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

interface ChannelCircleProps {
  name: string;
  logo: ImageSourcePropType;
}

const ChannelCircle: React.FC<ChannelCircleProps> = ({ name, logo }) => {
  return (
    <TouchableOpacity className='items-center mr-4'>
      <View className='w-16 h-16 rounded-full bg-white border border-slate-200 justify-center items-center shadow-sm'>
        <Image source={logo} className='w-12 h-12' resizeMode='contain' />
      </View>
      <Text className='mt-2 text-xs font-semibold text-slate-700'>{name}</Text>
    </TouchableOpacity>
  );
};

export default ChannelCircle;
