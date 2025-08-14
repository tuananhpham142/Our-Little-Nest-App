import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Recent Search Item
const RecentSearchItem = memo<{
  query: string;
  onPress: () => void;
  onRemove: () => void;
}>(({ query, onPress, onRemove }) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex-row items-center justify-between py-3 px-4' activeOpacity={0.7}>
      <View className='flex-row items-center flex-1'>
        <FontAwesome6 iconStyle='solid' name='clock' color={'#9c9c9c'} size={18} />
        <Text className='text-base text-dark ml-3'>{query}</Text>
      </View>
      <TouchableOpacity onPress={onRemove} className='p-1' hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <FontAwesome6 iconStyle='solid' name='x' color={'#9c9c9c'} size={18} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

RecentSearchItem.displayName = 'RecentSearchItem';

export default RecentSearchItem;
