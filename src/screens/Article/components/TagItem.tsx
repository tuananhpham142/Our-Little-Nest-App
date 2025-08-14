import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Tag Item Component
const TagItem = memo<{
  tag: string;
  trending?: boolean;
  onPress: () => void;
}>(({ tag, trending, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 mb-2 ${trending ? 'bg-primary-50' : 'bg-grey-light'}`}
      activeOpacity={0.7}
    >
      <View className='flex-row items-center'>
        {trending && <FontAwesome6 iconStyle='solid' name='arrow-trend-up' color={'#ff6464'} size={18} />}
        <Text className={`text-sm ${trending ? 'text-primary-500' : 'text-dark'}`}>#{tag}</Text>
      </View>
    </TouchableOpacity>
  );
});

TagItem.displayName = 'TagItem';

export default TagItem;
