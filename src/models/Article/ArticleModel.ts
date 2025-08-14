// Types
export interface ArticleModel {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  source: string;
  category: string;
  timeAgo: string;
  readTime: string;
  isBookmarked?: boolean;
}
