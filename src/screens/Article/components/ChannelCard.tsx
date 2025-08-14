import React, { memo, useRef } from 'react';
import { Animated, InteractionManager, Text, TouchableOpacity, View } from 'react-native';

export interface Channel {
  id: string;
  name: string;
  logo: string;
  color: string;
}
// Channel Card Component
const ChannelCard = memo<{
  channel: Channel;
  onPress: () => void;
  index: number;
}>(({ channel, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 30,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });
  }, [scaleAnim, index]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={onPress} className='items-center mr-4' activeOpacity={0.7}>
        <View
          className='w-16 h-16 rounded-full items-center justify-center mb-2'
          style={{ backgroundColor: channel.color }}
        >
          <Text className='text-white font-bold text-lg'>{channel.name.substring(0, 2).toUpperCase()}</Text>
        </View>
        <Text className='text-sm text-dark' numberOfLines={1}>
          {channel.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

ChannelCard.displayName = 'ChannelCard';
export default ChannelCard;
