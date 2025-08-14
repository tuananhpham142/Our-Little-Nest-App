import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChannelCard, { Channel } from '../components/ChannelCard';
import HotArticleCard, { HotArticle } from '../components/HotArticle';
import RecentSearchItem from '../components/RecentSearchItem';
import TagItem from '../components/TagItem';

interface SearchScreenProps {
  route?: {
    params?: {
      initialTag?: string;
    };
  };
}

interface TagData {
  tag: string;
  trending: boolean;
}

// Main Search Screen
const SearchScreen: React.FC<SearchScreenProps> = ({ route }) => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState(route?.params?.initialTag || '');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  React.useEffect(() => {
    loadRecentSearches();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Auto-focus on search input
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height),
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0),
    );

    return () => {
      clearTimeout(timer);
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fadeAnim]);

  const loadRecentSearches = useCallback(async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  const saveRecentSearches = useCallback(async (searches: string[]) => {
    try {
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  }, []);

  const channels: Channel[] = useMemo(
    () => [
      { id: '1', name: 'Bloomberg', logo: '', color: '#000000' },
      { id: '2', name: 'CNN', logo: '', color: '#CC0000' },
      { id: '3', name: 'Fox News', logo: '', color: '#003366' },
      { id: '4', name: 'NBC News', logo: '', color: '#F37021' },
      { id: '5', name: 'BBC', logo: '', color: '#BB1919' },
    ],
    [],
  );

  const popularTags: TagData[] = useMemo(
    () => [
      { tag: 'music', trending: true },
      { tag: 'business', trending: false },
      { tag: 'marketing', trending: false },
      { tag: 'mba', trending: false },
      { tag: 'today', trending: true },
      { tag: 'trump', trending: true },
      { tag: 'rock', trending: false },
      { tag: 'sports', trending: false },
      { tag: 'bloomberg', trending: false },
    ],
    [],
  );

  const hotNews: HotArticle[] = useMemo(
    () => [
      {
        id: '1',
        title: 'How China uses LinkedIn to recruit spies abroad',
        image: 'https://picsum.photos/400/300?random=20',
        source: 'Politics',
        timeAgo: '1h ago',
      },
      {
        id: '2',
        title: 'A chance to bond on a perilous hiking trail in Iceland',
        image: 'https://picsum.photos/400/300?random=21',
        source: 'Travel',
        timeAgo: '3h ago',
      },
      {
        id: '3',
        title: 'Why tourists are flocking to the Black Sea',
        image: 'https://picsum.photos/400/300?random=22',
        source: 'Travel',
        timeAgo: '6h ago',
      },
    ],
    [],
  );

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      const updatedSearches = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery).slice(0, 4)];
      setRecentSearches(updatedSearches);
      saveRecentSearches(updatedSearches);
      Keyboard.dismiss();
      // @ts-ignore
      navigation.navigate('Articles', { searchQuery });
    }
  }, [searchQuery, recentSearches, navigation, saveRecentSearches]);

  const handleChannelPress = useCallback(
    (channel: Channel) => {
      // @ts-ignore
      navigation.navigate('ArticleChannel', { channelName: channel.name });
    },
    [navigation],
  );

  const handleTagPress = useCallback(
    (tag: string) => {
      setSearchQuery(tag);
      // @ts-ignore
      navigation.navigate('Articles', { searchQuery: tag });
    },
    [navigation],
  );

  const handleHotNewsPress = useCallback(
    (news: HotArticle) => {
      // @ts-ignore
      navigation.navigate('ArticleDetail', {
        newsItem: {
          id: news.id,
          title: news.title,
          excerpt: 'Lorem ipsum dolor sit amet...',
          image: news.image,
          source: news.source,
          category: news.source,
          timeAgo: news.timeAgo,
          readTime: '5 min',
        },
      });
    },
    [navigation],
  );

  const handleRecentSearchPress = useCallback(
    (query: string) => {
      setSearchQuery(query);
      // @ts-ignore
      navigation.navigate('Articles', { searchQuery: query });
    },
    [navigation],
  );

  const handleRemoveRecentSearch = useCallback(
    (query: string) => {
      const updated = recentSearches.filter((s) => s !== query);
      setRecentSearches(updated);
      saveRecentSearches(updated);
    },
    [recentSearches, saveRecentSearches],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const handleClearAllRecent = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, [saveRecentSearches]);

  const renderChannel: ListRenderItem<Channel> = useCallback(
    ({ item, index }) => <ChannelCard channel={item} index={index} onPress={() => handleChannelPress(item)} />,
    [handleChannelPress],
  );

  const renderHotNews: ListRenderItem<HotArticle> = useCallback(
    ({ item }) => <HotArticleCard news={item} onPress={() => handleHotNewsPress(item)} />,
    [handleHotNewsPress],
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className='flex-1'>
        {/* Header with Search */}
        <View className='px-4 py-3 border-b border-grey-light'>
          <View className='flex-row items-center'>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className='mr-3'
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome6 iconStyle='solid' name='chevron-left' size={20} />
            </TouchableOpacity>
            <View className='flex-1 flex-row items-center bg-grey-light rounded-full px-4 py-2'>
              <FontAwesome6 iconStyle='solid' name='magnifying-glass' size={20} />
              <TextInput
                ref={searchInputRef}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder='Search...'
                placeholderTextColor='#9c9c9c'
                className='flex-1 ml-2 text-base text-dark'
                returnKeyType='search'
                onSubmitEditing={handleSearch}
                autoCapitalize='none'
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <FontAwesome6 iconStyle='solid' name='x' size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ paddingBottom: keyboardHeight }}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && !searchQuery && (
              <View className='mt-4'>
                <View className='flex-row items-center justify-between px-4 mb-2'>
                  <Text className='text-lg font-semibold text-dark'>Recent</Text>
                  <TouchableOpacity onPress={handleClearAllRecent}>
                    <Text className='text-sm text-primary-500'>Clear All</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((query) => (
                  <RecentSearchItem
                    key={query}
                    query={query}
                    onPress={() => handleRecentSearchPress(query)}
                    onRemove={() => handleRemoveRecentSearch(query)}
                  />
                ))}
              </View>
            )}

            {/* Top Channels */}
            <View className='mt-6'>
              <View className='flex-row items-center justify-between px-4 mb-3'>
                <Text className='text-lg font-semibold text-dark'>Top channels</Text>
                <TouchableOpacity>
                  <Text className='text-sm text-primary-500'>Show All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={channels}
                keyExtractor={(item) => item.id}
                renderItem={renderChannel}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                removeClippedSubviews={true}
              />
            </View>

            {/* Popular Tags */}
            <View className='mt-6'>
              <View className='flex-row items-center justify-between px-4 mb-3'>
                <Text className='text-lg font-semibold text-dark'>Popular tags</Text>
                <TouchableOpacity>
                  <Text className='text-sm text-primary-500'>Show All</Text>
                </TouchableOpacity>
              </View>
              <View className='px-4'>
                <View className='flex-row flex-wrap'>
                  {popularTags.map((item) => (
                    <TagItem
                      key={item.tag}
                      tag={item.tag}
                      trending={item.trending}
                      onPress={() => handleTagPress(item.tag)}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* Hot News */}
            <View className='mt-6 mb-6'>
              <View className='flex-row items-center justify-between px-4 mb-3'>
                <Text className='text-lg font-semibold text-dark'>Hot news</Text>
                <TouchableOpacity>
                  <Text className='text-sm text-primary-500'>Show All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={hotNews}
                keyExtractor={(item) => item.id}
                renderItem={renderHotNews}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                removeClippedSubviews={true}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default memo(SearchScreen);
