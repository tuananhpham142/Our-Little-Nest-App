// src/screens/SearchScreen.tsx
import Icon from '@react-native-vector-icons/FontAwesome6';
import React from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ArticleListItem from './components/ArticleListItem';
import ChannelCircle from './components/ChannelCircle';
import TagButton from './components/TagButton';

const hotNews = [
  //... (mock data for the grid)
  {
    id: '1',
    title: 'How China uses LinkedIn to recruit spies abroad',
    category: 'Politics',
    time: '1m',
    imageUrl: require('../../assets/mock/search_1.png'),
  },
  {
    id: '2',
    title: 'A chance to bond on a perilous hiking trail in Iceland',
    category: 'Health',
    time: '3m',
    imageUrl: require('../../assets/mock/search_2.png'),
  },
];
const popularTags = ['music', 'business', 'today', 'trump', 'marketing'];

const SearchScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView className='flex-1 bg-slate-50'>
      <View className='p-4 border-b border-slate-200 bg-white'>
        <View className='flex-row items-center bg-slate-100 rounded-full px-4 py-2'>
          <Icon name='magnifying-glass' iconStyle='solid' size={18} color='#94a3b8' />
          <TextInput placeholder='Search...' className='flex-1 ml-3 text-base' />
        </View>
      </View>

      <ScrollView>
        {/* Top Channels */}
        <View className='p-4 bg-white'>
          <View className='flex-row justify-between items-center mb-4'>
            <Text className='text-lg font-bold text-slate-800'>Top channels</Text>
            <TouchableOpacity>
              <Text className='font-semibold text-blue-600'>Show All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ChannelCircle name='Bloomberg' logo={require('../../assets/mock/bloomberg.png')} />
            <ChannelCircle name='CNN' logo={require('../../assets/mock/cnn.png')} />
            <ChannelCircle name='Fox News' logo={require('../../assets/mock/fox.png')} />
            <ChannelCircle name='NBC News' logo={require('../../assets/mock/nbc.png')} />
          </ScrollView>
        </View>

        {/* Popular Tags */}
        <View className='p-4 mt-2 bg-white'>
          <View className='flex-row justify-between items-center mb-4'>
            <Text className='text-lg font-bold text-slate-800'>Popular tags</Text>
            <TouchableOpacity>
              <Text className='font-semibold text-blue-600'>Show All</Text>
            </TouchableOpacity>
          </View>
          <View className='flex-row flex-wrap'>
            {popularTags.map((tag) => (
              <TagButton key={tag} label={tag} />
            ))}
          </View>
        </View>

        {/* Hot News */}
        <View className='p-2 mt-2 bg-white'>
          <View className='flex-row justify-between items-center p-2 mb-2'>
            <Text className='text-lg font-bold text-slate-800'>Hot news</Text>
            <TouchableOpacity>
              <Text className='font-semibold text-blue-600'>Show All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={hotNews}
            renderItem={({ item }) => (
              <ArticleListItem variant='grid' {...item} onPress={() => navigation.navigate('ArticleDetail')} />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false} // The parent ScrollView handles scrolling
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
