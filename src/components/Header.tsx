import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { memo, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

const Header = memo<{
  title: string;
  onBack?: () => void;
  onSearch?: () => void;
}>(({ title, onBack, onSearch }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className='bg-white px-4 py-2 flex-row items-center justify-between border-b border-grey-light'
    >
      <View className='flex-row items-center flex-1'>
        {onBack && (
          <TouchableOpacity onPress={onBack} className='mr-3' hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <FontAwesome6 iconStyle='solid' name='chevron-left' size={24} />
          </TouchableOpacity>
        )}
        <Text className='text-xl font-bold text-dark'>{title}</Text>
      </View>
      {onSearch && (
        <TouchableOpacity onPress={onSearch} className='p-2' hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <FontAwesome6 iconStyle='solid' name='magnifying-glass' size={24} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

Header.displayName = 'Header';

export default Header;
