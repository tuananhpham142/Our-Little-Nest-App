// src/screens/ArticleDetailScreen.tsx
import Icon from '@react-native-vector-icons/FontAwesome6';
import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import TagButton from './components/TagButton';

const ArticleDetailScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-row justify-between items-center p-4'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name='chevron-left' iconStyle='solid' size={20} color='#334155' />
        </TouchableOpacity>
        <View className='flex-row items-center'>
          <TouchableOpacity className='mr-6'>
            <Icon name='bookmark' iconStyle='solid' size={20} color='#334155' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name='share-nodes' iconStyle='solid' size={20} color='#334155' />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className='px-4'>
        <Text className='text-3xl font-bold text-slate-900 leading-tight'>
          Consumers hit by online and phone problems as deadline looms
        </Text>
        <View className='flex-row my-4'>
          <Text className='text-sm text-slate-500'>
            By <Text className='font-semibold text-slate-700'>Cristofer Philips</Text> and{' '}
            <Text className='font-semibold text-slate-700'>Michele Salehi</Text>
          </Text>
        </View>

        <Image source={require('../../assets/mock/fox_main.png')} className='w-full h-56 rounded-lg my-2' />

        <Text className='text-sm font-semibold text-blue-600 mt-4'>
          Business <Text className='text-slate-400 font-normal'>• 1m ago</Text>
        </Text>
        <Text className='text-xl font-bold text-slate-800 mt-2'>Santander apologises for IT glitch</Text>
        <Text className='text-base text-slate-600 mt-2 leading-relaxed'>
          Consumers making last-minute claims for mis-sold payment protection insurance have had to deal with crashing
          websites.
        </Text>

        <Text className='text-xl font-bold text-slate-800 mt-6'>The final deadline for making a claim</Text>
        <Text className='text-base text-slate-600 mt-2 leading-relaxed'>
          While the final deadline for making a claim is 11:59pm on Thursday, several banks have had problems with their
          websites...
        </Text>

        <View className='bg-slate-50 border-l-4 border-blue-600 p-4 my-6'>
          <Text className='text-lg font-semibold text-slate-800 italic'>
            "That huge demand is causing even major bank systems to crack."
          </Text>
          <Text className='text-sm text-slate-500 mt-2'>— Inko Aluko, London, 2006</Text>
        </View>

        <Text className='text-base text-slate-600 leading-relaxed'>
          Customers of several banks have reported hearing tones. The bank replied: "This is due to the high call
          volumes. Please try again later."
        </Text>

        <View className='flex-row flex-wrap mt-8'>
          <TagButton label='error' />
          <TagButton label='phone' />
          <TagButton label='bank' />
          <TagButton label='internet' />
          <TagButton label='it' />
        </View>
        <View className='h-20' />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleDetailScreen;
