import { CategoryItem } from '@/models/Category/CategoryModel';
import React, { memo, useRef } from 'react';
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

// Category Card Component
const CategoryCard = memo<{
  item: CategoryItem;
  onPress: () => void;
  large?: boolean;
  index: number;
}>(({ item, onPress, large = false, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: Math.min(index * 50, 200),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: Math.min(index * 50, 200),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, index]);

  const { width } = Dimensions.get('window');
  const cardWidth = large ? width - 32 : (width - 48) / 2;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
        width: cardWidth,
        marginRight: large ? 0 : 8,
        marginBottom: 12,
      }}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image
          source={{ uri: item.image }}
          className={`w-full ${large ? 'h-40' : 'h-28'} rounded-lg mb-2`}
          resizeMode='cover'
          // defaultSource={require('./assets/placeholder.png')}
        />
        <Text className='text-sm font-semibold text-dark mb-1' numberOfLines={2}>
          {item.name}
        </Text>
        <View className='flex-row items-center'>
          {item.name && (
            <>
              <Text className='text-xs text-primary-500'>{item.name}</Text>
              <Text className='text-xs text-grey mx-1'>•</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
