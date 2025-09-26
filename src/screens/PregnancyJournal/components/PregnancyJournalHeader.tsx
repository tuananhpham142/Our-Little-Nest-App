// screens/PregnancyJournal/components/PregnancyJournalHeader.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface PregnancyJournalHeaderProps {
  onCreatePress: () => void;
  onSettingsPress: () => void;
  activeTab: 'timeline' | 'care';
  onTabChange: (tab: 'timeline' | 'care') => void;
}

export const PregnancyJournalHeader: React.FC<PregnancyJournalHeaderProps> = ({
  onCreatePress,
  onSettingsPress,
  activeTab,
  onTabChange,
}) => {
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View className='bg-white/90 backdrop-blur-md border-b border-gray-100'>
      <View className='px-4 py-3'>
        {/* Top Row */}
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-1'>
            <Text className='text-2xl font-bold text-gray-800'>Nhật ký thai kỳ</Text>
            <Text className='text-sm text-gray-500 mt-1'>{getCurrentDate()}</Text>
          </View>

          <View className='flex-row items-center flex gap-3'>
            <TouchableOpacity
              onPress={onCreatePress}
              className='w-10 h-10 bg-purple-100 rounded-full items-center justify-center'
              activeOpacity={0.7}
            >
              <Icon iconStyle='solid' name='plus' size={20} color='#8B5CF6' />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSettingsPress}
              className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center'
              activeOpacity={0.7}
            >
              <Icon iconStyle='solid' name='ellipsis-vertical' size={20} color='#6B7280' />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Selector */}
        <View className='flex-row bg-gray-100 rounded-xl p-1'>
          <TouchableOpacity
            onPress={() => onTabChange('timeline')}
            className={`flex-1 py-2 px-4 rounded-lg items-center ${
              activeTab === 'timeline' ? 'bg-white shadow-sm' : 'bg-transparent'
            }`}
            activeOpacity={0.7}
          >
            <View className='flex-row items-center'>
              <Icon
                iconStyle='solid'
                name='timeline'
                size={16}
                color={activeTab === 'timeline' ? '#8B5CF6' : '#6B7280'}
              />
              <Text className={`ml-2 font-medium ${activeTab === 'timeline' ? 'text-purple-600' : 'text-gray-600'}`}>
                Nhật ký
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onTabChange('care')}
            className={`flex-1 py-2 px-4 rounded-lg items-center ${
              activeTab === 'care' ? 'bg-white shadow-sm' : 'bg-transparent'
            }`}
            activeOpacity={0.7}
          >
            <View className='flex-row items-center'>
              <Icon
                iconStyle='solid'
                name='heart-pulse'
                size={16}
                color={activeTab === 'care' ? '#8B5CF6' : '#6B7280'}
              />
              <Text className={`ml-2 font-medium ${activeTab === 'care' ? 'text-purple-600' : 'text-gray-600'}`}>
                Chăm sóc
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
