// src/components/Skeletons.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const Shimmer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const x = useSharedValue(-1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(x.value, [0, 1], [-250, 250]) }],
  }));

  useEffect(() => {
    x.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [x]);

  return <View className='bg-slate-200 rounded-lg overflow-hidden'>{children}</View>;
};

// Individual Skeleton Placeholders
export const ArticleListItemSkeleton = () => (
  <View className='flex-row items-center p-4'>
    <View className='w-24 h-24 bg-slate-200 rounded-lg' />
    <View className='flex-1 ml-4'>
      <View className='h-4 bg-slate-200 rounded w-full mb-2' />
      <View className='h-4 bg-slate-200 rounded w-3/4 mb-4' />
      <View className='h-3 bg-slate-200 rounded w-1/2' />
    </View>
  </View>
);
// ... create other skeleton components as needed (ArticleDetailSkeleton, GridItemSkeleton etc.)
