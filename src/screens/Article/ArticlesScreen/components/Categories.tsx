import { FlashList } from '@shopify/flash-list';
import { memo, useCallback, useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Category Tabs Component
const Categories = memo<{
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}>(({ categories, selectedCategory, onSelectCategory }) => {
  const scrollViewRef = useRef(null);

  const renderCategory = useCallback(
    ({ item }: { item: string }) => (
      <TouchableOpacity
        onPress={() => onSelectCategory(item)}
        className={`px-4 py-2 rounded-full mr-3 ${selectedCategory === item ? 'bg-primary-500' : 'bg-grey-light'}`}
      >
        <Text className={`text-base font-medium ${selectedCategory === item ? 'text-white' : 'text-grey'}`}>
          {item}
        </Text>
      </TouchableOpacity>
    ),
    [selectedCategory, onSelectCategory],
  );

  return (
    <View className='bg-white'>
      <FlashList
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        renderItem={renderCategory}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        removeClippedSubviews={true}
        // maxToRenderPerBatch={10}
        maxItemsInRecyclePool={10}

        // windowSize={10}
      />
    </View>
  );
});

Categories.displayName = 'Categories';

export default Categories;
