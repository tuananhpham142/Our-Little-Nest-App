import { LoadingScreen } from '@/components/LoadingScreen';
import NotFound from '@/components/NotFound';
import Tag from '@/components/Tag';
import { Article } from '@/models/Article/ArticleModel';
import { TagModel } from '@/models/Tag/TagModel';
import { fetchArticleById, incrementViewCount } from '@/store/slices/articleSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { articleTimeHelpers } from '@/utils/timeUtils';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
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
  const contentFadeIn = useRef(new Animated.Value(0)).current;
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
  }, [dispatch, id]);

  useEffect(() => {
    // Increment view count when article is loaded
    if (currentArticle) {
      dispatch(incrementViewCount(currentArticle.id));
    }
  }, [currentArticle, dispatch]);

  React.useEffect(() => {
    Animated.timing(contentFadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [contentFadeIn]);

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
    <View className='flex-1 bg-white'>
      {/* Fixed Header */}
      <Animated.View
        className='flex-1 pt-16'
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
            {currentArticle.title}
          </Text>
        </View>
      </Animated.View>

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

        <Animated.View style={{ opacity: contentFadeIn }} className='px-4 pt-4'>
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
  );
};

export default memo(ArticleDetailScreen);
