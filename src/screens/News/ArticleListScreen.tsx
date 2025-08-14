// src/screens/ArticleListScreen.tsx
import Icon from '@react-native-vector-icons/FontAwesome6';
import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ArticleListItem from './components/ArticleListItem';

const categories = ['Latest', 'World', 'Business', 'Sports', 'Lifestyle'];
const mockArticles = [
  // ... (Add mock data here based on the design)
  {
    id: '1',
    title: 'Step back in time and experience a middle ages village in Belarus',
    category: 'World',
    time: '1m',
    imageUrl: require('../../assets/mock/nbc_1.png'),
  },
  {
    id: '2',
    title: "On the crest of a wave: Portugal's new eco holiday retreat",
    category: 'Travel',
    time: '3m',
    imageUrl: require('../../assets/mock/nbc_2.png'),
  },
  {
    id: '3',
    title: "The Minsk street that's gone from industrial centre to cultural hub",
    category: 'World',
    time: '5m',
    imageUrl: require('../../assets/mock/nbc_3.png'),
  },
];

const ArticleListScreen = ({ navigation }: any) => {
  // Use appropriate navigation prop type
  const [activeCategory, setActiveCategory] = useState('Latest');

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-row justify-between items-center p-4 border-b border-slate-200'>
        <TouchableOpacity>
          <Icon name='chevron-left' iconStyle='solid' size={20} color='#334155' />
        </TouchableOpacity>
        <Text className='text-xl font-bold text-slate-800'>NBC News</Text>
        <TouchableOpacity>
          <Icon name='magnifying-glass' iconStyle='solid' size={20} color='#334155' />
        </TouchableOpacity>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className='p-4'>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full mr-2 ${activeCategory === cat ? 'bg-blue-600' : 'bg-slate-100'}`}
            >
              <Text className={`font-semibold ${activeCategory === cat ? 'text-white' : 'text-slate-700'}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlashList
        data={mockArticles}
        renderItem={({ item, index }) => (
          <ArticleListItem
            title={item.title}
            category={item.category}
            time={item.time}
            imageUrl={item.imageUrl}
            onPress={() => navigation.navigate('ArticleDetail')}
          />
        )}
        keyExtractor={(item) => item.id}
        // estimatedItemSize={120}
        // Crucial for FlashList performance
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View className='h-px bg-slate-200 mx-4' />}
      />

      {/* <FlatList
        data={mockArticles}
        renderItem={({ item }) => (
          <ArticleListItem
            title={item.title}
            category={item.category}
            time={item.time}
            imageUrl={item.imageUrl}
            onPress={() => navigation.navigate('ArticleDetail')}
          />
        )}
        keyExtractor={(item) => item.id}
        // eslint-disable-next-line react/no-unstable-nested-components
        ItemSeparatorComponent={() => <View className='h-px bg-slate-200 mx-4' />}
      /> */}
    </SafeAreaView>
  );
};

export default ArticleListScreen;
