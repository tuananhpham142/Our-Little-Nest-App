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
        key={item}
        onPress={() => onSelectCategory(item)}
        className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === item ? 'bg-blue-600' : 'bg-slate-100'}`}
      >
        <Text className={`font-semibold ${selectedCategory === item ? 'text-white' : 'text-slate-700'}`}>{item}</Text>
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
