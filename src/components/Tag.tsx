import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

// Tag Component
const Tag = memo<{ tag: string; onPress?: () => void }>(({ tag, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className='bg-primary-50 px-3 py-1 rounded-full mr-2 mb-2'
      activeOpacity={0.7}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Text className='text-sm text-primary-500'>#{tag}</Text>
    </TouchableOpacity>
  );
});

Tag.displayName = 'Tag';

export default Tag;
