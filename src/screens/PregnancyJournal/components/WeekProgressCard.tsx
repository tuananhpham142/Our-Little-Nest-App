// screens/PregnancyJournal/components/WeekProgressCard.tsx
import { GenderType } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface WeekProgressCardProps {
  journal: PregnancyJournal;
  onEditPress: () => void;
  onCarePress: () => void;
}

export const WeekProgressCard: React.FC<WeekProgressCardProps> = ({ journal, onEditPress, onCarePress }) => {
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

  return (
    <View className='px-4 mb-6 mt-2'>
      <LinearGradient
        colors={['#F3E8FF', '#E879F9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 16, overflow: 'hidden' }}
      >
        <View className='p-6'>
          {/* Header */}
          <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center'>
              <Text className='text-2xl mr-2'>{getBabyIcon(babyInfo.gender as GenderType)}</Text>
              <View>
                <Text className='text-lg font-bold text-white'>{babyInfo.nickname || 'Bé yêu'}</Text>
                <Text className='text-purple-100 text-sm'>{getWeekDescription(babyInfo.currentWeek)}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onEditPress}
              className='w-8 h-8 bg-white/20 rounded-full items-center justify-center'
              activeOpacity={0.7}
            >
              <Icon iconStyle='solid' name='pen' size={16} color='white' />
            </TouchableOpacity>
          </View>

          {/* Week Progress */}
          <View className='mb-4'>
            <View className='flex-row items-center justify-between mb-2'>
              <Text className='text-white font-medium'>Tuần {babyInfo.currentWeek}/40</Text>
              <Text className='text-purple-100 text-sm'>{Math.round(progressPercentage)}%</Text>
            </View>

            <View className='h-2 bg-white/20 rounded-full'>
              <View className='h-full bg-white rounded-full' style={{ width: `${progressPercentage}%` }} />
            </View>
          </View>

          {/* Baby Info */}
          <View className='flex-row justify-between mb-4'>
            <View className='bg-white/15 rounded-xl p-3 flex-1 mr-2'>
              <Text className='text-purple-100 text-xs mb-1'>Kích thước</Text>
              <View className='flex-row items-center'>
                <Text className='text-lg mr-1'>{sizeInfo.emoji}</Text>
                <Text className='text-white font-medium text-sm'>{sizeInfo.item}</Text>
              </View>
            </View>

            <View className='bg-white/15 rounded-xl p-3 flex-1 mx-1'>
              <Text className='text-purple-100 text-xs mb-1'>Cân nặng</Text>
              <Text className='text-white font-medium'>{babyInfo.estimatedWeight}g</Text>
            </View>

            <View className='bg-white/15 rounded-xl p-3 flex-1 ml-2'>
              <Text className='text-purple-100 text-xs mb-1'>Chiều dài</Text>
              <Text className='text-white font-medium'>{babyInfo.estimatedLength}cm</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className='flex-row space-x-3'>
            <TouchableOpacity
              onPress={onCarePress}
              className='flex-1 bg-white/20 rounded-xl py-3 items-center justify-center flex-row'
              activeOpacity={0.7}
            >
              <Icon name='heart' size={16} color='white' />
              <Text className='text-white font-medium ml-2'>Gợi ý chăm sóc</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className='bg-white/20 rounded-xl py-3 px-4 items-center justify-center'
              activeOpacity={0.7}
            >
              <Icon iconStyle='solid' name='share' size={16} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};
