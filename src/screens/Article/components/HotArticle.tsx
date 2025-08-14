import React, { memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export interface HotArticle {
  id: string;
  title: string;
  image: string;
  source: string;
  timeAgo: string;
}

// Hot News Card Component
const HotArticleCard = memo<{
  news: HotArticle;
  onPress: () => void;
}>(({ news, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className='mr-4' activeOpacity={0.9}>
      <View className='w-64'>
        <Image
          source={{ uri: news.image }}
          className='w-full h-36 rounded-xl mb-2'
          resizeMode='cover'
          // defaultSource={require('./assets/placeholder.png')}
        />
        <Text className='text-base font-semibold text-dark mb-1' numberOfLines={2}>
          {news.title}
        </Text>
        <View className='flex-row items-center'>
          <Text className='text-sm text-grey'>{news.source}</Text>
          <Text className='text-sm text-grey mx-2'>•</Text>
          <Text className='text-sm text-grey'>{news.timeAgo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

HotArticleCard.displayName = 'HotArticleCard';

export default HotArticleCard;
