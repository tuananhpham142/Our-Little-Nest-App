import Header from '@/components/Header';
import { ArticleModel } from '@/models/Article/ArticleModel';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, View } from 'react-native';
import Categories from './components/Categories';
import { NewsCard } from './components/NewsCard';

interface ArticlesScreenProps {
  route?: any;
}

// Main News List Screen
const ArticlesScreen: React.FC<ArticlesScreenProps> = ({ route }) => {
  const [news, setNews] = useState<ArticleModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Latest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation();

  const categories = useMemo(() => ['Latest', 'World', 'Business', 'Sports', 'Life', 'Technology'], []);

  // Mock data generator
  const generateMockNews = useCallback(
    (pageNum: number): ArticleModel[] => {
      const mockTitles = [
        'Step back in time and experience a middle ages village in Belarus',
        "On the crest of a wave: Portugal's new eco holiday retreat",
        "The Minsk street that's gone from industrial centre to cultural hub",
        'Russian leave: fun places to stay on four routes to the Russia',
        'Optimism may hold secret to longer life, study suggests',
        "I craved stability and wasn't getting it from modelling",
      ];

      const mockSources = ['World', 'Travel', 'Lifestyle', 'Business', 'Technology'];

      return Array.from({ length: 10 }, (_, i) => ({
        id: `${pageNum}-${i}`,
        title: mockTitles[i % mockTitles.length],
        excerpt:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        image: `https://picsum.photos/400/300?random=${pageNum}${i}`,
        source: mockSources[i % mockSources.length],
        category: selectedCategory === 'Latest' ? mockSources[i % mockSources.length] : selectedCategory,
        timeAgo: `${Math.floor(Math.random() * 24) + 1}h ago`,
        readTime: `${Math.floor(Math.random() * 10) + 2} min read`,
        isBookmarked: Math.random() > 0.7,
      }));
    },
    [selectedCategory],
  );

  // Load initial data
  React.useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setHasMore(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = generateMockNews(1);
      setNews(data);
      setPage(1);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  }, [generateMockNews]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const data = generateMockNews(1);
      setNews(data);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setRefreshing(false);
    }
  }, [generateMockNews]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || page >= 5) return;

    setLoadingMore(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newPage = page + 1;
      const newData = generateMockNews(newPage);
      setNews((prev) => [...prev, ...newData]);
      setPage(newPage);
      if (newPage >= 5) setHasMore(false);
    } catch (error) {
      console.error('Error loading more news:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, hasMore, generateMockNews]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View className='py-4'>
        <ActivityIndicator size='small' color='#ff6464' />
      </View>
    );
  }, [loadingMore]);

  const handleNewsPress = useCallback(
    (item: ArticleModel) => {
      // @ts-ignore
      navigation.navigate('ArticleDetail', { newsItem: item });
    },
    [navigation],
  );

  const handleSearch = useCallback(() => {
    navigation.navigate('ArticleSearch' as never);
  }, [navigation]);

  const renderItem: ListRenderItem<ArticleModel> = useCallback(
    ({ item, index }) => <NewsCard item={item} index={index} onPress={() => handleNewsPress(item)} />,
    [handleNewsPress],
  );

  const keyExtractor = useCallback((item: ArticleModel) => item.id, []);

  const channelName = route?.params?.channel || 'News';

  return (
    <View className='flex-1 bg-grey-light'>
      <View className='pt-16 bg-white'>
        <Header
          title={channelName}
          onBack={route?.params?.channel ? () => navigation.goBack() : undefined}
          onSearch={handleSearch}
        />
      </View>
      <Categories categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {loading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#ff6464' />
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#ff6464']}
              tintColor='#ff6464'
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={21}
          initialNumToRender={10}
          getItemLayout={(data, index) => ({
            length: 116,
            offset: 116 * index,
            index,
          })}
        />
      )}
    </View>
  );
};

export default memo(ArticlesScreen);
