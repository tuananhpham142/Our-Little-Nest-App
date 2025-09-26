import { RootState } from '@/store/store';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

interface IProps {}

const HomeHeader: FC<IProps> = (props) => {
  const navigation = useNavigation();
  const { unreadCount } = useSelector((state: RootState) => state.notifications);

  return (
    <View className='flex-row justify-end items-center mb-4'>
      {/* Coins Display */}

      {/* Notification Bell */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Notifications' as never)}
        className='bg-white/20 backdrop-blur-sm rounded-2xl p-3 active:scale-95 relative'
      >
        <Text className='text-white text-xl'>🔔</Text>
        {unreadCount > 0 && <View className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full' />}
      </TouchableOpacity>
    </View>
  );
};
export default HomeHeader;
