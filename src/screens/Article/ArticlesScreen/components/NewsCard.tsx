import { Article } from '@/models/Article/ArticleModel';
import { articleTimeHelpers } from '@/utils/timeUtils';
import React, { memo, useCallback, useRef } from 'react';
import { Animated, Image, InteractionManager, Text, TouchableOpacity, View } from 'react-native';

// Memoized NewsCard Component
export const NewsCard = memo<{
  item: Article;
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
      <TouchableOpacity onPress={onPress} className='bg-white flex-row items-start p-2'>
        <Image src={item.image} className='w-24 h-24 rounded-lg bg-slate-200' />
        <View className='flex-1 ml-4'>
          <Text className='text-base font-bold text-slate-800 leading-snug' numberOfLines={3}>
            {item.title}
          </Text>
          <Text className='text-sm font-medium text-primary mt-2'>{item.category.name}</Text>
          <View className='flex-row items-center mt-2 justify-between'>
            <View className='flex-row items-center'>
              <Text className='text-xs font-normal text-info'>
                {articleTimeHelpers.getReadingTime(item.content.length).text}
              </Text>
              <Text className='text-xs text-dark mx-1'>•</Text>
              <Text className='text-xs text-dark'>{articleTimeHelpers.getCreatedTimeAgo(item.createdAt)} ago</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity
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
        
            </View>
          </View>
        </View>
      </TouchableOpacity> */}
    </Animated.View>
  );
});

NewsCard.displayName = 'NewsCard';
