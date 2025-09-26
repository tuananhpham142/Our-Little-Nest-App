import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

// Tag Component
const Tag = memo<{ tag: string; onPress?: () => void }>(({ tag, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className='bg-slate-100 rounded-full px-4 py-2 mr-2 mb-2'
      activeOpacity={0.7}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Text className='text-slate-600 font-medium text-sm'>#{tag}</Text>
    </TouchableOpacity>
  );
});

Tag.displayName = 'Tag';

export default Tag;
