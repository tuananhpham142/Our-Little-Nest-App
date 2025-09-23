// screens/PregnancyJournal/components/WeekProgressCard.tsx
import { GenderType } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface WeekProgressCardProps {
  journal: PregnancyJournal;
  onPress: () => void;
  onEditPress: () => void;
  onDeletePress?: () => void;
  onCarePress: () => void;
}

const WeekProgressCard: React.FC<WeekProgressCardProps> = ({
  journal,
  onPress,
  onEditPress,
  onDeletePress,
  onCarePress,
}) => {
  const { babyInfo } = journal;
  const progressPercentage = (babyInfo.currentWeek / 40) * 100;

  const getBabyIcon = (gender: GenderType) => {
    switch (gender) {
      case 'male':
        return '👶🏻';
      case 'female':
        return '👧🏻';
      default:
        return '🤱';
    }
  };

  const getWeekDescription = (week: number) => {
    if (week <= 12) return 'Tam cá nguyệt đầu';
    if (week <= 28) return 'Tam cá nguyệt giữa';
    return 'Tam cá nguyệt cuối';
  };

  const getSizeComparison = (week: number) => {
    const sizes = {
      4: { item: 'hạt đậu', emoji: '🫘' },
      8: { item: 'quả việt quất', emoji: '🫐' },
      12: { item: 'quả chanh', emoji: '🍋' },
      16: { item: 'quả bơ', emoji: '🥑' },
      20: { item: 'quả chuối', emoji: '🍌' },
      24: { item: 'bắp ngô', emoji: '🌽' },
      28: { item: 'quả dưa hấu nhỏ', emoji: '🍉' },
      32: { item: 'quả dừa', emoji: '🥥' },
      36: { item: 'quả dưa', emoji: '🍈' },
      40: { item: 'quả bí ngô', emoji: '🎃' },
    };

    const nearestWeek = Object.keys(sizes)
      .map(Number)
      .reduce((prev, curr) => (Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev));

    return sizes[nearestWeek as keyof typeof sizes];
  };

  const sizeInfo = getSizeComparison(babyInfo.currentWeek);

  // Get theme colors based on trimester
  const getThemeColors = (week: number) => {
    if (week <= 12)
      return {
        primary: '#8B5CF6',
        secondary: '#A855F7',
        background: '#F3E8FF',
        accent: '#DDD6FE',
      };
    if (week <= 28)
      return {
        primary: '#EC4899',
        secondary: '#F472B6',
        background: '#FDF2F8',
        accent: '#FBCFE8',
      };
    return {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      background: '#FEF3C7',
      accent: '#FDE68A',
    };
  };

  const colors = getThemeColors(babyInfo.currentWeek);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} className='mx-4 mb-3'>
      <View
        className={`bg-white rounded-2xl p-4`}
        style={{
          // Shadow for iOS
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          // Elevation for Android
          elevation: 4,
        }}
      >
        {/* Header */}
        <View className='flex-row items-center justify-between mb-4'>
          <View className='flex-row items-center flex-1'>
            <View
              className='w-12 h-12 rounded-full items-center justify-center mr-4'
              style={{ backgroundColor: colors.accent }}
            >
              <Text className='text-xl'>{getBabyIcon(babyInfo.gender as GenderType)}</Text>
            </View>
            <View className='flex-1'>
              <Text className='text-gray-900 font-bold text-lg' numberOfLines={1}>
                {babyInfo.nickname || 'Bé yêu'}
              </Text>
              <Text className='text-gray-600 text-sm mt-1'>{getWeekDescription(babyInfo.currentWeek)}</Text>
            </View>
          </View>

          {/* Status Badge */}
          <View className='px-3 py-1 rounded-full' style={{ backgroundColor: colors.accent }}>
            <Text className='text-xs font-medium' style={{ color: colors.primary }}>
              {journal.status === 'active' ? 'Hoạt động' : journal.status === 'completed' ? 'Hoàn thành' : 'Lưu trữ'}
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <View className='flex-row items-center mb-4'>
          <Text className='text-gray-700 font-semibold text-base mr-3'>Tuần {babyInfo.currentWeek}/40</Text>
          <View className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-3'>
            <View
              className='h-full rounded-full'
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: colors.primary,
              }}
            />
          </View>
          <Text className='text-gray-600 text-sm font-medium'>{Math.round(progressPercentage)}%</Text>
        </View>

        {/* Baby Stats */}
        <View className='flex-row justify-between mb-4'>
          <View className='bg-gray-50 rounded-xl p-3 flex-1 mr-2 border border-gray-200'>
            <Text className='text-gray-500 text-xs font-medium mb-2'>Kích thước</Text>
            <View className='flex-row items-center'>
              <Text className='text-base mr-2'>{sizeInfo.emoji}</Text>
              <Text className='text-gray-800 font-semibold text-sm flex-1' numberOfLines={1}>
                {sizeInfo.item}
              </Text>
            </View>
          </View>

          <View className='bg-gray-50 rounded-xl p-3 flex-1 mx-1 border border-gray-200'>
            <Text className='text-gray-500 text-xs font-medium mb-2'>Cân nặng</Text>
            <Text className='text-gray-800 font-bold text-base'>
              {babyInfo.estimatedWeight || '--'}
              <Text className='text-sm font-normal text-gray-600'>g</Text>
            </Text>
          </View>

          <View className='bg-gray-50 rounded-xl p-3 flex-1 ml-2 border border-gray-200'>
            <Text className='text-gray-500 text-xs font-medium mb-2'>Chiều dài</Text>
            <Text className='text-gray-800 font-bold text-base'>
              {babyInfo.estimatedLength || '--'}
              <Text className='text-sm font-normal text-gray-600'>cm</Text>
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className='flex-row gap-3'>
          <TouchableOpacity
            onPress={onCarePress}
            className='flex-1 bg-gray-50 rounded-xl py-3 px-4 flex-row items-center justify-center border border-gray-200'
            activeOpacity={0.8}
          >
            <Icon iconStyle='solid' name='heart-pulse' size={16} color={colors.primary} />
            <Text className='font-semibold ml-2 text-base' style={{ color: colors.primary }}>
              Gợi ý chăm sóc
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onEditPress}
            className='w-12 h-12 bg-gray-50 rounded-xl items-center justify-center border border-gray-200'
            activeOpacity={0.7}
          >
            <Icon iconStyle='solid' name='pen' size={16} color={colors.primary} />
          </TouchableOpacity>
          {onDeletePress && (
            <TouchableOpacity
              onPress={onDeletePress}
              className='w-12 h-12 bg-gray-50 rounded-xl items-center justify-center border border-gray-200'
              activeOpacity={0.7}
            >
              <Icon iconStyle='solid' name='trash' size={16} color='#EF4444' />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WeekProgressCard;
