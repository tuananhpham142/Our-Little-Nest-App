import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Section Header Component
const SectionHeader = memo<{
  title: string;
  onShowAll?: () => void;
}>(({ title, onShowAll }) => {
  return (
    <View className='flex-row items-center justify-between mb-3'>
      <Text className='text-lg font-bold text-dark'>{title}</Text>
      {onShowAll && (
        <TouchableOpacity onPress={onShowAll} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text className='text-xs text-primary-500'>Show All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
