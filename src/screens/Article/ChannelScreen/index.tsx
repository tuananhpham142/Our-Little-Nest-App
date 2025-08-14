import { CategoryItem } from '@/models/Category/CategoryModel';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import ChannelHeader from './components/ChannelHeader';
import SectionHeader from './components/SectionHeader';

interface ChannelScreenProps {
  route: {
    params: {
      channelName: string;
      channelLogo?: string;
    };
  };
}

interface CategorySection {
  title: string;
  showAll?: boolean;
  items: CategoryItem[];
}

// Main Channel Screen
const ChannelScreen: React.FC<ChannelScreenProps> = ({ route }) => {
  const { channelName, channelLogo } = route.params;
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearch = useCallback(() => {
    navigation.navigate('ArticleSearch' as never);
  }, [navigation]);

  const handleSubscribe = useCallback(() => {
    setIsSubscribed((prev) => !prev);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const handleItemPress = useCallback(
    (item: CategoryItem) => {
      //@ts-ignore
      navigation.navigate('ArticleDetail', {
        newsItem: {
          id: item.id,
          title: item.title,
          excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          image: item.image,
          source: channelName,
          category: item.category || 'General',
          timeAgo: item.timeAgo,
          readTime: '5 min',
        },
      });
    },
    [navigation, channelName],
  );

  const handleShowAll = useCallback(
    (category: string) => {
      //@ts-ignore
      navigation.navigate('Articles', { channel: channelName, category });
    },
    [navigation, channelName],
  );

  // Mock data for different sections
  const sections: CategorySection[] = useMemo(
    () => [
      {
        title: 'World',
        items: [
          {
            id: 'w1',
            title: 'Tim denounced for firing Hong Kong staff',
            image: 'https://picsum.photos/400/300?random=30',
            timeAgo: '1h ago',
          },
          {
            id: 'w2',
            title: 'Understanding US Catholics belief in the Eucharist',
            image: 'https://picsum.photos/400/300?random=31',
            timeAgo: '3h ago',
          },
        ],
      },
      {
        title: 'Lifestyle',
        items: [
          {
            id: 'l1',
            title: 'Indoor plant sales boom, design trends 2024',
            image: 'https://picsum.photos/400/300?random=32',
            timeAgo: '2h ago',
          },
          {
            id: 'l2',
            title: 'Fashion fixes in pictures for the week ahead',
            image: 'https://picsum.photos/400/300?random=33',
            timeAgo: '4h ago',
          },
        ],
      },
      {
        title: 'Technology',
        items: [
          {
            id: 't1',
            title: "Google's smart facial-recognition video doorbell",
            image: 'https://picsum.photos/400/300?random=34',
            timeAgo: '1h ago',
          },
          {
            id: 't2',
            title: 'Tech gift guide: 10 ideas for last-minute presents',
            image: 'https://picsum.photos/400/300?random=35',
            timeAgo: '5h ago',
          },
        ],
      },
    ],
    [],
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-60, 0],
    extrapolate: 'clamp',
  });

  return (
    <View className='flex-1 bg-white'>
      {/* Fixed Header */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: 'white',
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslate }],
          paddingTop: 64,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <View className='flex-row items-center justify-between px-6 py-3 border-b border-grey-light'>
          <TouchableOpacity
            onPress={handleBack}
            className='mr-3'
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome6 name='chevron-left' iconStyle='solid' size={18} color='#4E4E4E' />
          </TouchableOpacity>
          <Text className='text-lg font-bold text-dark flex-1'>{channelName}</Text>
          <TouchableOpacity onPress={handleSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <FontAwesome6 name='magnifying-glass' iconStyle='solid' size={18} color='#4E4E4E' />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Header */}
      <View className='pt-16'>
        <View className='px-6 py-3 flex-row items-center justify-between border-b border-grey-light'>
          <TouchableOpacity
            onPress={handleBack}
            className='mr-3'
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome6 name='chevron-left' iconStyle='solid' size={20} color='#4E4E4E' />
          </TouchableOpacity>
          <Text className='text-lg font-bold text-dark flex-1'>Channel</Text>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#ff6464']} tintColor='#ff6464' />
        }
      >
        {/* Channel Header */}
        <ChannelHeader channelName={channelName} isSubscribed={isSubscribed} onSubscribe={handleSubscribe} />

        {loading ? (
          <View className='flex-1 items-center justify-center py-20'>
            <ActivityIndicator size='large' color='#ff6464' />
          </View>
        ) : (
          <View className='px-6 py-4'>
            {sections.map((section) => (
              <View key={section.title} className='mb-5'>
                <SectionHeader title={section.title} onShowAll={() => handleShowAll(section.title)} />
                <View className='flex-row flex-wrap justify-between'>
                  {section.items.map((item, index) => (
                    <CategoryCard key={item.id} item={item} index={index} onPress={() => handleItemPress(item)} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default memo(ChannelScreen);
