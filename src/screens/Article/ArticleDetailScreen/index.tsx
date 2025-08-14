import Tag from '@/components/Tag';
import { ArticleModel } from '@/models/Article/ArticleModel';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Platform, Share, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Author from './components/Author';
import RelatedNewsSection from './components/RelatedNewsSection';
import Stats from './components/Stats';

interface ArticleDetailScreenProps {
  route: {
    params: {
      newsItem: ArticleModel;
    };
  };
}

// Main News Detail Screen
const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ route }) => {
  const { newsItem } = route.params;
  const [isBookmarked, setIsBookmarked] = useState(newsItem.isBookmarked || false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const contentFadeIn = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const headerHeight = 60 + insets.top;
  const imageHeight = width * 0.6;

  React.useEffect(() => {
    Animated.timing(contentFadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [contentFadeIn]);

  const handleShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: `Check out this article: ${newsItem.title}`,
        title: newsItem.title,
        url: Platform.OS === 'ios' ? `https://news.app/article/${newsItem.id}` : undefined,
      });

      if (result.action === Share.sharedAction) {
        // Track share analytics
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to share article');
    }
  }, [newsItem]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked((prev) => !prev);
    // Save bookmark state
  }, []);

  const handleTagPress = useCallback(
    (tag: string) => {
      // @ts-ignore
      navigation.navigate('ArticleSearch', { initialTag: tag });
    },
    [navigation],
  );

  const handleRelatedNewsPress = useCallback(
    (item: ArticleModel) => {
      // @ts-ignore
      navigation.navigate('ArticleDetail', { newsItem: item });
    },
    [navigation],
  );

  // Mock content
  const articleContent = useMemo(
    () => `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
  `,
    [],
  );

  const tags = useMemo(() => ['apps', 'facebook', 'kids', 'tech', 'safety'], []);

  const relatedNews: ArticleModel[] = useMemo(
    () => [
      {
        id: 'related1',
        title: 'How the girls and boys created a new subculture',
        excerpt: 'A deep dive into the emerging youth culture...',
        image: 'https://picsum.photos/400/300?random=10',
        source: 'Tech',
        category: 'Technology',
        timeAgo: '2h ago',
        readTime: '5 min',
      },
      {
        id: 'related2',
        title: 'The first step toward solutions is to admit problems',
        excerpt: 'Understanding the challenges we face...',
        image: 'https://picsum.photos/400/300?random=11',
        source: 'Opinion',
        category: 'Technology',
        timeAgo: '4h ago',
        readTime: '3 min',
      },
    ],
    [],
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, imageHeight - headerHeight],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, imageHeight],
    outputRange: [0, -imageHeight / 3],
    extrapolate: 'clamp',
  });

  return (
    <View className='flex-1'>
      {/* Fixed Header */}
      <Animated.View
        className='flex-1 px-6 pt-16'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: 'white',
          opacity: headerOpacity,
          paddingTop: insets.top,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <View className='flex-row items-center justify-between px-4 py-3'>
          <TouchableOpacity onPress={handleBack} className='p-2' hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <FontAwesome6 iconStyle='solid' name='chevron-left' size={24} />
          </TouchableOpacity>
          <Text className='text-base font-semibold text-dark flex-1 mx-3' numberOfLines={1}>
            {newsItem.title}
          </Text>
          <View className='flex-row items-center'>
            <TouchableOpacity
              onPress={handleShare}
              className='p-2'
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome6 iconStyle='solid' name='share' size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Floating Header */}
      <View className='absolute top-0 left-0 right-0 z-10' style={{ paddingTop: insets.top }}>
        <View className='flex-row items-center justify-between px-4 py-3'>
          <TouchableOpacity
            onPress={handleBack}
            className='bg-white/90 p-2 rounded-full'
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <FontAwesome6 iconStyle='solid' name='chevron-left' size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <Animated.View style={{ transform: [{ translateY: imageTranslate }] }}>
          <Image
            source={{ uri: newsItem.image }}
            style={{ width, height: imageHeight }}
            resizeMode='cover'
            // defaultSource={require('./assets/placeholder.png')}
          />
        </Animated.View>

        <Animated.View style={{ opacity: contentFadeIn }} className='px-4 pt-4'>
          {/* Category and Source */}
          <View className='flex-row items-center mb-3'>
            <Text className='text-base text-primary-500 font-semibold'>{newsItem.category}</Text>
            <Text className='text-base text-grey mx-2'>•</Text>
            <Text className='text-base text-grey'>{newsItem.source}</Text>
          </View>

          {/* Title */}
          <Text className='text-2xl font-bold text-dark mb-3'>{newsItem.title}</Text>

          {/* Author Info */}
          <Author author='Lea Castro' date={newsItem.timeAgo} readTime={newsItem.readTime} />

          {/* Stats Bar */}
          <Stats />

          {/* Article Content */}
          <Text className='text-base text-dark leading-6 mb-4'>{articleContent}</Text>

          {/* Tags */}
          <View className='mb-6'>
            <Text className='text-lg font-semibold text-dark mb-3'>Tags</Text>
            <View className='flex-row flex-wrap'>
              {tags.map((tag) => (
                <Tag key={tag} tag={tag} onPress={() => handleTagPress(tag)} />
              ))}
            </View>
          </View>

          {/* Related News */}
          <RelatedNewsSection relatedNews={relatedNews} onNewsPress={handleRelatedNewsPress} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default memo(ArticleDetailScreen);
