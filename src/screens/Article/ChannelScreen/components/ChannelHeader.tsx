import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { memo, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

// Channel Header Component
const ChannelHeader = memo<{
  channelName: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
}>(({ channelName, isSubscribed, onSubscribe }) => {
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
      className='items-center py-5 border-b border-grey-light bg-white'
    >
      <View
        className='w-16 h-16 bg-black rounded-full items-center justify-center mb-2'
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text className='text-white text-xl font-bold'>{channelName.substring(0, 1)}</Text>
      </View>
      <Text className='text-xl font-bold text-dark'>{channelName}</Text>
      <Text className='text-xs text-grey mt-1'>Broadcast media • 2.5M followers</Text>

      <TouchableOpacity
        onPress={onSubscribe}
        className={`mt-3 px-5 py-1.5 rounded-full flex-row items-center ${
          isSubscribed ? 'bg-grey-light' : 'bg-primary-500'
        }`}
        activeOpacity={0.8}
      >
        {isSubscribed && (
          <FontAwesome6 size={14} name='bell' iconStyle='solid' color='#4E4E4E' style={{ marginRight: 4 }} />
        )}
        <Text className={`text-sm font-semibold ${isSubscribed ? 'text-dark' : 'text-white'}`}>
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

ChannelHeader.displayName = 'ChannelHeader';

export default ChannelHeader;
