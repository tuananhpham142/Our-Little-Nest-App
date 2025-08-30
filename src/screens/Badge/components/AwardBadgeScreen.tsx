// src/screens/Badge/AwardBadgeScreen.tsx
import { useBadges } from '@/hooks/useBadge';
import { useAwardBadge } from '@/hooks/useBadgeCollection';
import { BadgeCategory, BadgeDifficulty } from '@/models/Badge/BadgeEnum';
import { Badge } from '@/models/Badge/BadgeModel';
import { AwardBadgeFormData, BadgeCollectionFormValidation } from '@/models/BadgeCollection/BadgeCollectionUIForm';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from '@react-native-vector-icons/fontawesome6';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
interface Props {
  navigation: any;
  route: {
    params: {
      babyId?: string;
      badgeId?: string;
    };
  };
}

const AwardBadgeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { babyId: defaultBabyId, badgeId: defaultBadgeId } = route.params || {};

  const { awardBadge, isSubmitting, error, clearError } = useAwardBadge();
  const { badges, loadBadges, isLoading } = useBadges();

  // Form state
  const [formData, setFormData] = useState<AwardBadgeFormData>({
    babyId: defaultBabyId || '',
    badgeId: defaultBadgeId || '',
    completedAt: new Date(),
    submissionNote: '',
    mediaFiles: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [badgeSheetRef, setBadgeSheetRef] = useState<BottomSheetModal | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Animation values
  const formScale = useSharedValue(1);
  const submitButtonScale = useSharedValue(1);

  // Load badges on mount
  useEffect(() => {
    if (badges.length === 0) {
      loadBadges({ isActive: true });
    }
  }, [badges.length, loadBadges]);

  // Find and set selected badge
  useEffect(() => {
    if (formData.badgeId && badges.length > 0) {
      const badge = badges.find((b) => b.id === formData.badgeId);
      setSelectedBadge(badge || null);
    }
  }, [formData.badgeId, badges]);

  // Mock baby data (in real app, this would come from baby context/hook)
  const babies = useMemo(
    () => [
      { id: '1', name: 'Emma', age: 8 },
      { id: '2', name: 'Liam', age: 15 },
      { id: '3', name: 'Oliver', age: 22 },
    ],
    [],
  );

  // Filter badges based on selected baby's age
  const availableBadges = useMemo(() => {
    const selectedBaby = babies.find((b) => b.id === formData.babyId);
    if (!selectedBaby) return badges.filter((b) => b.isActive);

    return badges.filter((badge) => {
      if (!badge.isActive) return false;
      if (badge.minAge && selectedBaby.age < badge.minAge) return false;
      if (badge.maxAge && selectedBaby.age > badge.maxAge) return false;
      return true;
    });
  }, [badges, formData.babyId, babies]);

  // Form validation
  const validateForm = useCallback(() => {
    const validation = BadgeCollectionFormValidation.validateAwardBadgeForm(formData);
    setErrors(validation.errors.map((e) => e.message));
    return validation.isValid;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      formScale.value = withSequence(
        withTiming(1.02, { duration: 100 }),
        withTiming(0.98, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
      return;
    }

    try {
      submitButtonScale.value = withSpring(0.95);

      await awardBadge({
        babyId: formData.babyId,
        badgeId: formData.badgeId,
        completedAt: dayjs(formData.completedAt).toISOString(),
        submissionNote: formData.submissionNote,
        submissionMedia: formData.mediaFiles.map((f) => f.uri),
      });

      // Success feedback
      submitButtonScale.value = withSpring(1);
      Alert.alert('Badge Awarded!', 'The badge has been successfully awarded and is pending verification.', [
        {
          text: 'View Collection',
          onPress: () => navigation.navigate('BadgeCollection', { babyId: formData.babyId }),
        },
        {
          text: 'Award Another',
          onPress: () => {
            setFormData({
              babyId: formData.babyId,
              badgeId: '',
              completedAt: new Date(),
              submissionNote: '',
              mediaFiles: [],
            });
            setSelectedBadge(null);
          },
        },
      ]);
    } catch (err) {
      submitButtonScale.value = withSpring(1);
      Alert.alert('Error', 'Failed to award badge. Please try again.');
    }
  }, [validateForm, awardBadge, formData, navigation, formScale, submitButtonScale]);

  // Handle badge selection
  const handleBadgeSelect = useCallback(
    (badge: Badge) => {
      setFormData((prev) => ({ ...prev, badgeId: badge.id }));
      setSelectedBadge(badge);
      badgeSheetRef?.close();
    },
    [badgeSheetRef],
  );

  // Animation styles
  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: formScale.value }],
  }));

  const submitButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitButtonScale.value }],
  }));

  // Render baby selector
  const renderBabySelector = () => (
    <Animated.View entering={FadeInUp.delay(100)} className='mb-6'>
      <Text className='text-lg font-semibold text-gray-800 mb-3'>Select Baby</Text>
      <View className='flex-row flex-wrap'>
        {babies.map((baby) => (
          <TouchableOpacity
            key={baby.id}
            onPress={() => setFormData((prev) => ({ ...prev, babyId: baby.id }))}
            className={`flex-row items-center px-4 py-3 rounded-xl mr-3 mb-3 ${
              formData.babyId === baby.id ? 'bg-blue-500' : 'bg-gray-100'
            }`}
          >
            <View
              className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                formData.babyId === baby.id ? 'bg-blue-400' : 'bg-gray-200'
              }`}
            >
              <Icon name='baby' iconStyle='solid' size={16} color={formData.babyId === baby.id ? 'white' : '#9CA3AF'} />
            </View>
            <View>
              <Text className={`font-semibold ${formData.babyId === baby.id ? 'text-white' : 'text-gray-800'}`}>
                {baby.name}
              </Text>
              <Text className={`text-sm ${formData.babyId === baby.id ? 'text-blue-100' : 'text-gray-500'}`}>
                {baby.age} months
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // Render badge selector
  const renderBadgeSelector = () => (
    <Animated.View entering={FadeInUp.delay(200)} className='mb-6'>
      <Text className='text-lg font-semibold text-gray-800 mb-3'>Select Badge</Text>

      {selectedBadge ? (
        <TouchableOpacity
          onPress={() => badgeSheetRef?.present()}
          className='bg-white border-2 border-blue-500 rounded-xl p-4'
        >
          <View className='flex-row items-center'>
            <View className='w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4'>
              <Icon name={getCategoryIcon(selectedBadge.category) as any} iconStyle='solid' size={20} color='#3B82F6' />
            </View>
            <View className='flex-1'>
              <Text className='text-lg font-semibold text-gray-800'>{selectedBadge.title}</Text>
              <Text className='text-gray-500'>
                {formatCategory(selectedBadge.category)} • {formatDifficulty(selectedBadge.difficulty)}
              </Text>
            </View>
            <Icon name='chevron-right' iconStyle='solid' size={16} color='#3B82F6' />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => badgeSheetRef?.present()}
          className='bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 items-center'
        >
          <Icon name='plus' iconStyle='solid' size={32} color='#9CA3AF' />
          <Text className='text-gray-600 font-medium mt-2'>Choose a Badge</Text>
          <Text className='text-gray-500 text-sm mt-1'>{availableBadges.length} badges available</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  // Render completion date selector
  const renderDateSelector = () => (
    <Animated.View entering={FadeInUp.delay(300)} className='mb-6'>
      <Text className='text-lg font-semibold text-gray-800 mb-3'>Completion Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className='bg-white rounded-xl p-4 flex-row items-center justify-between border border-gray-200'
      >
        <View className='flex-row items-center'>
          <Icon name='calendar' iconStyle='solid' size={16} color='#3B82F6' />
          <Text className='text-gray-800 ml-3'>{dayjs(formData.completedAt).format('LL')}</Text>
        </View>
        <Icon name='chevron-right' iconStyle='solid' size={16} color='#9CA3AF' />
      </TouchableOpacity>
    </Animated.View>
  );

  // Render note input
  const renderNoteInput = () => (
    <Animated.View entering={FadeInUp.delay(400)} className='mb-6'>
      <Text className='text-lg font-semibold text-gray-800 mb-3'>Add a Note (Optional)</Text>
      <TextInput
        value={formData.submissionNote}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, submissionNote: text }))}
        placeholder='Describe this achievement...'
        multiline
        numberOfLines={4}
        className='bg-white rounded-xl p-4 border border-gray-200 text-gray-800'
        placeholderTextColor='#9CA3AF'
        textAlignVertical='top'
      />
      <Text className='text-gray-500 text-sm mt-2'>{formData.submissionNote.length}/500 characters</Text>
    </Animated.View>
  );

  return (
    <BottomSheetModalProvider>
      <SafeAreaView className='flex-1 bg-gray-50'>
        {/* Header */}
        <View className='px-4 py-4 bg-white shadow-sm'>
          <View className='flex-row items-center justify-between'>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className='w-10 h-10 rounded-full items-center justify-center bg-gray-100'
            >
              <Icon name='arrow-left' iconStyle='solid' size={16} color='#374151' />
            </TouchableOpacity>

            <Text className='text-xl font-bold text-gray-800'>Award Badge</Text>

            <View className='w-10' />
          </View>
        </View>

        {/* Content */}
        <Animated.View style={formAnimatedStyle} className='flex-1'>
          <ScrollView className='flex-1 p-4' showsVerticalScrollIndicator={false}>
            {renderBabySelector()}
            {formData.babyId && renderBadgeSelector()}
            {formData.badgeId && renderDateSelector()}
            {formData.badgeId && renderNoteInput()}

            {/* Error Messages */}
            {errors.length > 0 && (
              <Animated.View entering={FadeInDown} className='mb-6'>
                <View className='bg-red-50 border border-red-200 rounded-xl p-4'>
                  <Text className='text-red-800 font-semibold mb-2'>Please fix the following:</Text>
                  {errors.map((error, index) => (
                    <Text key={index} className='text-red-700 text-sm'>
                      • {error}
                    </Text>
                  ))}
                </View>
              </Animated.View>
            )}
          </ScrollView>

          {/* Submit Button */}
          <View className='p-4 bg-white border-t border-gray-200'>
            <Animated.View style={submitButtonAnimatedStyle}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting || !formData.babyId || !formData.badgeId}
                className={`py-4 rounded-xl items-center ${
                  isSubmitting || !formData.babyId || !formData.badgeId ? 'bg-gray-300' : 'bg-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <ActivityIndicator color='white' />
                ) : (
                  <Text className='text-white text-lg font-semibold'>Award Badge</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Date Picker Modal */}

        <DateTimePicker
          value={
            (typeof formData.completedAt === 'string' ? new Date(formData.completedAt) : formData.completedAt) ||
            new Date()
          }
          mode='date'
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowDatePicker(false);
            setFormData((prev) => ({ ...prev, completedAt: date as Date }));
          }}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />

        {/* Badge Selection Bottom Sheet */}
        <BottomSheetModal
          ref={setBadgeSheetRef}
          index={1}
          snapPoints={['50%', '90%']}
          backdropComponent={({ style }) => <View style={[style, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />}
        >
          <BadgeSelectionSheet
            badges={availableBadges}
            selectedBabyAge={babies.find((b) => b.id === formData.babyId)?.age}
            onSelect={handleBadgeSelect}
            onClose={() => badgeSheetRef?.close()}
            isLoading={isLoading}
          />
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

// Badge Selection Sheet Component
const BadgeSelectionSheet: React.FC<{
  badges: Badge[];
  selectedBabyAge?: number;
  onSelect: (badge: Badge) => void;
  onClose: () => void;
  isLoading: boolean;
}> = ({ badges, selectedBabyAge, onSelect, onClose, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<BadgeCategory | null>(null);

  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      const matchesSearch =
        badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || badge.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [badges, searchQuery, filterCategory]);

  const categories = useMemo(() => Object.values(BadgeCategory), []);

  return (
    <View className='flex-1 p-4'>
      {/* Header */}
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-xl font-bold text-gray-800'>Choose Badge</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name='xmark' iconStyle='solid' size={20} color='#9CA3AF' />
        </TouchableOpacity>
      </View>

      {selectedBabyAge && (
        <View className='mb-4 bg-blue-50 p-3 rounded-xl'>
          <Text className='text-blue-800 text-sm'>Showing badges suitable for {selectedBabyAge} months old</Text>
        </View>
      )}

      {/* Search */}
      <View className='bg-gray-100 rounded-full px-4 py-3 flex-row items-center mb-4'>
        <Icon name='magnifying-glass' iconStyle='solid' size={16} color='#9CA3AF' />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder='Search badges...'
          className='flex-1 ml-3 text-gray-800'
          placeholderTextColor='#9CA3AF'
        />
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-4'>
        <TouchableOpacity
          onPress={() => setFilterCategory(null)}
          className={`px-4 py-2 rounded-full mr-2 ${!filterCategory ? 'bg-blue-500' : 'bg-gray-100'}`}
        >
          <Text className={`font-medium ${!filterCategory ? 'text-white' : 'text-gray-600'}`}>All</Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setFilterCategory(filterCategory === category ? null : category)}
            className={`px-4 py-2 rounded-full mr-2 ${filterCategory === category ? 'bg-blue-500' : 'bg-gray-100'}`}
          >
            <Text className={`font-medium ${filterCategory === category ? 'text-white' : 'text-gray-600'}`}>
              {formatCategory(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Badges List */}
      {isLoading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#3B82F6' />
          <Text className='text-gray-500 mt-4'>Loading badges...</Text>
        </View>
      ) : (
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {filteredBadges.map((badge, index) => (
            <Animated.View key={badge.id} entering={FadeInDown.delay(index * 50)}>
              <TouchableOpacity
                onPress={() => onSelect(badge)}
                className='bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100'
                activeOpacity={0.8}
              >
                <View className='flex-row items-start'>
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                      badge.category === BadgeCategory.MILESTONE
                        ? 'bg-yellow-100'
                        : badge.category === BadgeCategory.DAILY_LIFE
                          ? 'bg-blue-100'
                          : badge.category === BadgeCategory.SOCIAL
                            ? 'bg-green-100'
                            : badge.category === BadgeCategory.PHYSICAL
                              ? 'bg-red-100'
                              : badge.category === BadgeCategory.COGNITIVE
                                ? 'bg-purple-100'
                                : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      name={getCategoryIcon(badge.category) as any}
                      iconStyle='solid'
                      size={16}
                      color={getCategoryColor(badge.category)}
                    />
                  </View>

                  <View className='flex-1'>
                    <Text className='text-lg font-semibold text-gray-800 mb-1'>{badge.title}</Text>
                    <Text className='text-gray-600 mb-2' numberOfLines={2}>
                      {badge.description}
                    </Text>
                    <View className='flex-row items-center'>
                      <Text className='text-sm text-gray-500 mr-2'>{formatDifficulty(badge.difficulty)}</Text>
                      {badge.minAge && badge.maxAge && (
                        <>
                          <Text className='text-gray-400'>•</Text>
                          <Text className='text-sm text-gray-500 ml-2'>
                            {badge.minAge}-{badge.maxAge} months
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {filteredBadges.length === 0 && (
            <View className='items-center justify-center py-20'>
              <Icon name='magnifying-glass' iconStyle='solid' size={48} color='#D1D5DB' />
              <Text className='text-xl font-semibold text-gray-600 mt-4 mb-2'>No badges found</Text>
              <Text className='text-gray-500 text-center'>Try adjusting your search or category filter</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

// Helper functions (reused from BadgesScreen)
const getCategoryIcon = (category: BadgeCategory): string => {
  const iconMap = {
    [BadgeCategory.MILESTONE]: 'trophy',
    [BadgeCategory.DAILY_LIFE]: 'house',
    [BadgeCategory.SOCIAL]: 'users',
    [BadgeCategory.PHYSICAL]: 'dumbbell',
    [BadgeCategory.COGNITIVE]: 'brain',
    [BadgeCategory.CUSTOM]: 'star',
  };
  return iconMap[category] || 'medal';
};

const getCategoryColor = (category: BadgeCategory): string => {
  const colorMap = {
    [BadgeCategory.MILESTONE]: '#F59E0B',
    [BadgeCategory.DAILY_LIFE]: '#3B82F6',
    [BadgeCategory.SOCIAL]: '#10B981',
    [BadgeCategory.PHYSICAL]: '#EF4444',
    [BadgeCategory.COGNITIVE]: '#8B5CF6',
    [BadgeCategory.CUSTOM]: '#6B7280',
  };
  return colorMap[category] || '#9CA3AF';
};

const formatCategory = (category: BadgeCategory): string => {
  const formatMap = {
    [BadgeCategory.MILESTONE]: 'Milestone',
    [BadgeCategory.DAILY_LIFE]: 'Daily Life',
    [BadgeCategory.SOCIAL]: 'Social',
    [BadgeCategory.PHYSICAL]: 'Physical',
    [BadgeCategory.COGNITIVE]: 'Cognitive',
    [BadgeCategory.CUSTOM]: 'Custom',
  };
  return formatMap[category] || category;
};

const formatDifficulty = (difficulty: BadgeDifficulty): string => {
  const formatMap = {
    [BadgeDifficulty.EASY]: 'Easy',
    [BadgeDifficulty.MEDIUM]: 'Medium',
    [BadgeDifficulty.HARD]: 'Hard',
  };
  return formatMap[difficulty] || difficulty;
};

export default AwardBadgeScreen;
