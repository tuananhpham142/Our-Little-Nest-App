import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React, { memo, useCallback, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

// Stats Bar Component
const Stats = memo(() => {
  const [liked, setLiked] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLike = useCallback(() => {
    setLiked((prev) => !prev);
    if (!liked) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(fadeAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [liked, fadeAnim]);

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className='flex-row items-center justify-around py-3 border-y border-grey-light mb-4'
    >
      <View className='flex-row items-center'>
        <FontAwesome6 iconStyle='solid' name='eye' size={18} />
        <Text className='text-sm text-grey ml-2'>2.4k views</Text>
      </View>
      <TouchableOpacity
        className='flex-row items-center'
        onPress={handleLike}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Animated.View style={{ transform: [{ scale: fadeAnim }] }}>
          <FontAwesome6 iconStyle='solid' name='thumbs-up' color={liked ? '#ff6464' : '#9c9c9c'} size={18} />
        </Animated.View>
        <Text className={`text-sm ml-2 ${liked ? 'text-primary-500' : 'text-grey'}`}>{liked ? '343' : '342'}</Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-row items-center' hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <FontAwesome6 iconStyle='solid' name='message' color={'#9c9c9c'} size={18} />
        <Text className='text-sm text-grey ml-2'>89</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

Stats.displayName = 'Stats';

export default Stats;
