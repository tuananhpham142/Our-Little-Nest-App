import Header from '@/components/Header';
import { ArticleListItemSkeleton } from '@/components/Skeletons';
import { Article } from '@/models/Article/ArticleModel';
import { fetchArticles, loadMoreArticles } from '@/store/slices/articleSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import Categories from './components/Categories';
import { NewsCard } from './components/NewsCard';

interface ArticlesScreenProps {
  route?: any;
}

// Main News List Screen
const ArticlesScreen: React.FC<ArticlesScreenProps> = ({ route }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Latest');

  const dispatch = useAppDispatch();
  const { articles, isLoading, isLoadingMore, pagination } = useAppSelector((state) => state.articles);

  const navigation = useNavigation();

  const categories = useMemo(() => ['Latest', 'World', 'Business', 'Sports', 'Life', 'Technology'], []);

  // Mock data generator

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !isLoadingMore) {
      dispatch(loadMoreArticles({ page: pagination.page + 1 }));
    }
  };
  const handleFetchArticles = useCallback(async (page: number) => {
    dispatch(fetchArticles({ page, limit: pagination.limit || 10, category: selectedCategory }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load initial data
  React.useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadInitialData = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      handleFetchArticles(1);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      handleFetchArticles(pagination.page);
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewsPress = useCallback(
    (item: Article) => {
      // @ts-ignore
      navigation.navigate('ArticleDetail', { id: item.id });
    },
    [navigation],
  );

  const handleSearch = useCallback(() => {
    navigation.navigate('ArticleSearch' as never);
  }, [navigation]);

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
      <View>
        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>
      {isLoading ? (
        <ArticleListItemSkeleton />
      ) : (
        <FlashList
          data={articles}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#ff6464']}
              tintColor='#ff6464'
            />
          }
          renderItem={({ item, index }) => <NewsCard item={item} index={index} onPress={() => handleNewsPress(item)} />}
          keyExtractor={(item) => item.id}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => <View className='h-px bg-slate-200 mx-4' />}
        />
      )}
    </View>
  );
};

export default memo(ArticlesScreen);
