// src/components/ArticleListItem.tsx
import Icon from '@react-native-vector-icons/FontAwesome6';
import React from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

interface ArticleListItemProps {
  imageUrl: ImageSourcePropType;
  category: string;
  title: string;
  time: string;
  onPress: () => void;
  variant?: 'list' | 'grid';
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({
  imageUrl,
  category,
  title,
  time,
  onPress,
  variant = 'list',
}) => {
  if (variant === 'grid') {
    return (
      <TouchableOpacity onPress={onPress} className='w-1/2 p-2'>
        <View className='bg-white rounded-lg overflow-hidden'>
          <Image source={imageUrl} className='w-full h-28' />
          <View className='p-3'>
            <Text className='text-sm font-bold text-slate-800' numberOfLines={3}>
              {title}
            </Text>
            <View className='flex-row items-center mt-2'>
              <Text className='text-xs font-semibold text-blue-600'>{category}</Text>
              <Text className='text-xs text-slate-500 mx-1'>•</Text>
              <Text className='text-xs text-slate-500'>{time} ago</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} className='flex-row items-center p-4'>
      <Image source={imageUrl} className='w-24 h-24 rounded-lg bg-slate-200' />
      <View className='flex-1 ml-4'>
        <Text className='text-base font-bold text-slate-800 leading-snug' numberOfLines={3}>
          {title}
        </Text>
        <View className='flex-row items-center mt-2 justify-between'>
          <View className='flex-row items-center'>
            <Text className='text-xs font-semibold text-blue-600'>{category}</Text>
            <Text className='text-xs text-slate-500 mx-1'>•</Text>
            <Text className='text-xs text-slate-500'>{time} ago</Text>
          </View>
          <Icon name='ellipsis' iconStyle='solid' size={16} color='#64748b' />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ArticleListItem;
