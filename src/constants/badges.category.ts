// Updated BadgeCategory Usage Examples

import {
    BadgeCategory,
    BadgeDifficulty,
    getBadgeCategoryInfo,
    getCategoryList
} from '@/models/Badge/BadgeEnum';

// Example: Creating badges with the new categories
const feedingBadge = {
  title: 'First Solid Food',
  description: 'Baby tried their first solid food',
  category: BadgeCategory.FEEDING,
  difficulty: BadgeDifficulty.EASY,
};

const sleepingBadge = {
  title: 'Sleep Through the Night',
  description: 'Baby slept for 8 hours straight',
  category: BadgeCategory.SLEEPING,
  difficulty: BadgeDifficulty.MEDIUM,
};

const healthBadge = {
  title: 'First Vaccination',
  description: 'Baby received their first vaccination',
  category: BadgeCategory.HEALTH,
  difficulty: BadgeDifficulty.EASY,
};

const safetyBadge = {
  title: 'Childproofed Room',
  description: "Successfully childproofed baby's room",
  category: BadgeCategory.SAFETY,
  difficulty: BadgeDifficulty.MEDIUM,
};

const creativityBadge = {
  title: 'First Art Creation',
  description: 'Baby created their first finger painting',
  category: BadgeCategory.CREATIVITY,
  difficulty: BadgeDifficulty.EASY,
};

const musicBadge = {
  title: 'Musical Response',
  description: 'Baby danced or moved to music',
  category: BadgeCategory.MUSIC,
  difficulty: BadgeDifficulty.EASY,
};

const natureBadge = {
  title: 'First Nature Walk',
  description: 'Baby enjoyed their first outdoor nature walk',
  category: BadgeCategory.NATURE,
  difficulty: BadgeDifficulty.EASY,
};

const familyBadge = {
  title: 'Family Photo',
  description: 'Baby participated in their first family photo',
  category: BadgeCategory.FAMILY,
  difficulty: BadgeDifficulty.EASY,
};

const culturalBadge = {
  title: 'Cultural Celebration',
  description: 'Baby participated in a cultural celebration',
  category: BadgeCategory.CULTURAL,
  difficulty: BadgeDifficulty.MEDIUM,
};

const seasonalBadge = {
  title: 'First Halloween',
  description: 'Baby celebrated their first Halloween',
  category: BadgeCategory.SEASONAL,
  difficulty: BadgeDifficulty.EASY,
};

// Example: Getting category information
const feedingCategoryInfo = getBadgeCategoryInfo(BadgeCategory.FEEDING);
console.log(feedingCategoryInfo);
// Output: { label: 'Feeding', color: '#F97316', icon: 'coffee' }

// Example: Getting all categories for a dropdown/picker
const allCategories = getCategoryList();
console.log(allCategories);
/* Output:
[
  { value: 'milestone', label: 'Milestone', icon: 'star', color: '#F59E0B' },
  { value: 'daily_life', label: 'Daily Life', icon: 'home', color: '#10B981' },
  { value: 'social', label: 'Social', icon: 'users', color: '#EC4899' },
  { value: 'physical', label: 'Physical', icon: 'activity', color: '#EF4444' },
  { value: 'cognitive', label: 'Cognitive', icon: 'brain', color: '#8B5CF6' },
  { value: 'motor_skills', label: 'Motor Skills', icon: 'move', color: '#3B82F6' },
  { value: 'emotional', label: 'Emotional', icon: 'heart', color: '#06B6D4' },
  { value: 'language', label: 'Language', icon: 'message-circle', color: '#84CC16' },
  { value: 'feeding', label: 'Feeding', icon: 'coffee', color: '#F97316' },
  { value: 'sleeping', label: 'Sleeping', icon: 'moon', color: '#6366F1' },
  { value: 'health', label: 'Health', icon: 'shield', color: '#059669' },
  { value: 'safety', label: 'Safety', icon: 'alert-triangle', color: '#DC2626' },
  { value: 'play', label: 'Play', icon: 'smile', color: '#F472B6' },
  { value: 'creativity', label: 'Creativity', icon: 'palette', color: '#A855F7' },
  { value: 'music', label: 'Music', icon: 'music', color: '#14B8A6' },
  { value: 'nature', label: 'Nature', icon: 'leaf', color: '#65A30D' },
  { value: 'family', label: 'Family', icon: 'heart', color: '#D97706' },
  { value: 'cultural', label: 'Cultural', icon: 'globe', color: '#7C3AED' },
  { value: 'seasonal', label: 'Seasonal', icon: 'calendar', color: '#0891B2' },
  { value: 'custom', label: 'Custom', icon: 'settings', color: '#6B7280' }
]
*/

// Example: Using in React Native component
// const CategoryPicker = () => {
//   const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | ''>('');

//   return (
//     <Picker
//       selectedValue={selectedCategory}
//       onValueChange={(value) => setSelectedCategory(value)}
//     >
//       <Picker.Item label="Select Category" value="" />
//       {getCategoryList().map((category) => (
//         <Picker.Item
//           key={category.value}
//           label={category.label}
//           value={category.value}
//         />
//       ))}
//     </Picker>
//   );
// };

// Example: Filtering badges by category
// const filterBadgesByCategory = (badges: Badge[], category: BadgeCategory) => {
//   return badges.filter((badge) => badge.category === category);
// };

// Get all feeding-related badges
// const feedingBadges = filterBadgesByCategory(allBadges, BadgeCategory.FEEDING);

// Get all health-related badges
// const healthBadges = filterBadgesByCategory(allBadges, BadgeCategory.HEALTH);

// Example: Category-based styling in components
// const CategoryBadge = ({ category }: { category: BadgeCategory }) => {
//   const categoryInfo = getBadgeCategoryInfo(category);

//   return (
//     <View style={[
//       styles.categoryBadge,
//       { backgroundColor: categoryInfo.color }
//     ]}>
//       <Icon name={categoryInfo.icon} size={16} color="white" />
//       <Text style={styles.categoryText}>{categoryInfo.label}</Text>
//     </View>
//   );
// };

// Example: Grouping badges by category for display
// const groupBadgesByCategory = (badges: Badge[]) => {
//   return badges.reduce(
//     (groups, badge) => {
//       const category = badge.category;
//       if (!groups[category]) {
//         groups[category] = [];
//       }
//       groups[category].push(badge);
//       return groups;
//     },
//     {} as Record<BadgeCategory, Badge[]>,
//   );
// };

// Example: Category validation
// const isValidCategory = (category: string): category is BadgeCategory => {
//   return Object.values(BadgeCategory).includes(category as BadgeCategory);
// };

// Example: Category-specific badge recommendations
// const getCategorySpecificRecommendations = (category: BadgeCategory, babyAge: number) => {
//   const categorySpecificLogic = {
//     [BadgeCategory.FEEDING]: () => {
//       if (babyAge < 6) return ['first_bottle', 'feeding_schedule'];
//       return ['solid_foods', 'self_feeding'];
//     },
//     [BadgeCategory.SLEEPING]: () => {
//       if (babyAge < 3) return ['sleep_patterns', 'night_feeding'];
//       return ['sleep_training', 'bedtime_routine'];
//     },
//     [BadgeCategory.HEALTH]: () => {
//       return ['checkups', 'vaccinations', 'growth_tracking'];
//     },
//     // Add more category-specific logic as needed
//   };

//   return categorySpecificLogic[category]?.() || [];
// };
