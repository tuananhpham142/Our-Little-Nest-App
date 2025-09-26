import { Article } from '@/models/Article/ArticleModel';
import { NewsCard } from '@/screens/Article/ArticlesScreen/components/NewsCard';
import { memo } from 'react';
import { Text, View } from 'react-native';

// Related News Section
const RelatedNewsSection = memo<{
  relatedNews: Article[];
  onNewsPress: (item: Article) => void;
}>(({ relatedNews, onNewsPress }) => {
  return (
    <View className='mt-6'>
      <Text className='text-lg font-bold text-dark mb-4 px-4'>Similar News</Text>
      {relatedNews.map((item, index) => (
        <NewsCard key={item.id} item={item} index={index} onPress={() => onNewsPress(item)} />
      ))}
    </View>
  );
});

RelatedNewsSection.displayName = 'RelatedNewsSection';

export default RelatedNewsSection;
