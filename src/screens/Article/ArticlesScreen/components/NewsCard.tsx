import { ArticleModel } from '@/models/Article/ArticleModel';
import React, { memo, useCallback, useRef } from 'react';
import { Animated, Image, InteractionManager, Platform, Text, TouchableOpacity, View } from 'react-native';

// Memoized NewsCard Component
export const NewsCard = memo<{
  item: ArticleModel;
  onPress: () => void;
  index: number;
}>(({ item, onPress, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: Math.min(index * 50, 200),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          delay: Math.min(index * 50, 200),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [fadeAnim, translateY, index]);

  const handleBookmark = useCallback((e: any) => {
    e.stopPropagation();
    // Handle bookmark action
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        className='bg-white mb-3 mx-6 rounded-xl overflow-hidden'
        activeOpacity={0.9}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.2,
          shadowRadius: 4,
          elevation: Platform.OS === 'android' ? 3 : 0,
        }}
      >
        <View className='flex-row'>
          <Image
            source={{ uri: item.image }}
            className='w-24 h-28'
            resizeMode='cover'
            // defaultSource={require('./assets/placeholder.png')}
          />
          <View className='flex-1 p-3'>
            <View className='flex-row items-center mb-1'>
              <Text className='text-xs text-primary-500 font-medium'>{item.category}</Text>
              <Text className='text-xs text-grey mx-1'>•</Text>
              <Text className='text-xs text-grey'>{item.timeAgo}</Text>
            </View>
            <Text className='text-sm font-semibold text-dark mb-1' numberOfLines={2}>
              {item.title}
            </Text>
            <Text className='text-xs text-grey mb-2' numberOfLines={2}>
              {item.excerpt}
            </Text>
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center'>
                <Text className='text-xs text-grey'>{item.source}</Text>
                <Text className='text-xs text-grey mx-1'>•</Text>
                <Text className='text-xs text-grey'>{item.readTime}</Text>
              </View>
              {/* <TouchableOpacity onPress={handleBookmark} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Bookmark
                  size={14}
                  color={item.isBookmarked ? '#ff6464' : '#9c9c9c'}
                  fill={item.isBookmarked ? '#ff6464' : 'none'}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

NewsCard.displayName = 'NewsCard';
