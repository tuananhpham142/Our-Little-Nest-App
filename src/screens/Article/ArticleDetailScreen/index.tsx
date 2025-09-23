import AppLayout from '@/components/layout/AppLayout';
import { LoadingScreen } from '@/components/LoadingScreen';
import NotFound from '@/components/NotFound';
import Tag from '@/components/Tag';
import { Article } from '@/models/Article/ArticleModel';
import { TagModel } from '@/models/Tag/TagModel';
import { fetchArticleById } from '@/store/slices/articleSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { articleTimeHelpers } from '@/utils/timeUtils';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Text, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Author from './components/Author';
import Stats from './components/Stats';

interface ArticleDetailScreenProps {
  route: {
    params: {
      id: string;
    };
  };
}

// Main News Detail Screen
const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ route }) => {
  const { id } = route.params;
  // const [isBookmarked, setIsBookmarked] = useState(newsItem.isBookmarked || false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const headerHeight = 60 + insets.top;
  const imageHeight = width * 0.6;

  const dispatch = useAppDispatch();
  const { currentArticle, isLoading } = useAppSelector((state) => state.articles);

  useEffect(() => {
    // Fetch article by id
    dispatch(fetchArticleById(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // Increment view count when article is loaded
    if (currentArticle) {
      // dispatch(incrementViewCount(currentArticle.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentArticle]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTagPress = useCallback(
    (tag: TagModel) => {
      // @ts-ignore
      navigation.navigate('ArticleSearch', { initialTag: tag });
    },
    [navigation],
  );

  const handleRelatedNewsPress = useCallback(
    (item: Article) => {
      // @ts-ignore
      navigation.navigate('ArticleDetail', { id: item.id });
    },
    [navigation],
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentArticle) {
    return <NotFound />;
  }

  return (
    <AppLayout>
      <View className='flex-1 bg-white'>
        {/* Fixed Header */}

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        >
          {/* Hero Image */}
          <Animated.View style={{ transform: [{ translateY: imageTranslate }] }}>
            <Image
              source={{ uri: currentArticle.image }}
              style={{ width, height: imageHeight }}
              resizeMode='cover'
              // defaultSource={require('./assets/placeholder.png')}
            />
          </Animated.View>

          <Animated.View className='px-4 pt-4'>
            {/* Category and Source */}
            <View className='flex-row items-center mb-3'>
              <Text className='text-base text-primary-500 font-semibold'>{currentArticle.category.name}</Text>
              {/* <Text className='text-base text-grey mx-2'>•</Text>
            <Text className='text-base text-grey'>{newsItem.source}</Text> */}
            </View>

            {/* Title */}
            <Text className='text-2xl font-bold text-dark mb-3'>{currentArticle.title}</Text>

            {/* Author Info */}
            <Author
              author='Lea Castro'
              date={articleTimeHelpers.getCreatedTimeAgo(currentArticle.createdAt)}
              readTime={articleTimeHelpers.getReadingTime(currentArticle.content.length).text}
            />

            {/* Stats Bar */}
            <Stats />

            {/* Article Content */}
            <Text className='text-base text-dark leading-6 mb-4'>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: currentArticle.content,
                }}
              />
              {currentArticle.content}
            </Text>

            {/* Tags */}
            <View className='mb-6'>
              <Text className='text-lg font-semibold text-dark mb-3'>Tags</Text>
              <View className='flex-row flex-wrap'>
                {currentArticle.tags.map((tag) => (
                  <Tag key={tag.id} tag={tag.name} onPress={() => handleTagPress(tag)} />
                ))}
              </View>
            </View>

            {/* Related News */}
          </Animated.View>

          {/* <RelatedNewsSection relatedNews={relatedNews} onNewsPress={handleRelatedNewsPress} /> */}
        </Animated.ScrollView>
      </View>
    </AppLayout>
  );
};

export default memo(ArticleDetailScreen);
