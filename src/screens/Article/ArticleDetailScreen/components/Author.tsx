import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { memo } from 'react';
import { Image, Text, View } from 'react-native';

// Author Info Component
const Author = memo<{
  author: string;
  date: string;
  readTime: string;
}>(({ author, date, readTime }) => {
  return (
    <View className='flex-row items-center mb-4'>
      <Image
        source={{ uri: `https://i.pravatar.cc/100?u=${author}` }}
        className='w-12 h-12 rounded-full mr-3'
        // defaultSource={require('./assets/avatar-placeholder.png')}
      />
      <View className='flex-1'>
        <Text className='text-base font-semibold text-dark'>{author}</Text>
        <View className='flex-row items-center'>
          <Text className='text-sm text-grey'>{date}</Text>
          <Text className='text-sm text-grey mx-2'>•</Text>
          <FontAwesome6 iconStyle='solid' name='clock' size={14} />
          <Text className='text-sm text-grey ml-1'>{readTime}</Text>
        </View>
      </View>
    </View>
  );
});

Author.displayName = 'Author';

export default Author;
