// screens/PregnancyJournal/components/PregnancyCareBottomSheet.tsx
import {
  PregnancyCare,
  PregnancyCareCategory,
  PregnancyCareImportance,
  PregnancyTrimester,
} from '@/models/PregnancyCare/PregnancyCareModel';
import { pregnancyCareSelectors } from '@/store/slices/pregnancyCareSlice';
import { AppDispatch } from '@/store/store';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface PregnancyCareBottomSheetProps {
  week?: number;
}

// Fake pregnancy care data for demonstration
const FAKE_CARE_DATA: PregnancyCare[] = [
  {
    id: '1',
    title: 'Bổ sung axit folic',
    description: 'Axit folic rất quan trọng cho sự phát triển não bộ của bé',
    content: 'Axit folic giúp ngăn ngừa các dị tật ống thần kinh. Mẹ bầu nên bổ sung 400mcg axit folic mỗi ngày.',
    category: PregnancyCareCategory.NUTRITION,
    importance: PregnancyCareImportance.HIGH,
    weekStart: 1,
    weekEnd: 12,
    trimester: PregnancyTrimester.FIRST,
    tags: ['dinh dưỡng', 'vitamin', 'não bộ'],
    tips: [
      'Ăn rau xanh đậm màu như rau bina, cải bó xôi',
      'Bổ sung cam, chanh giàu folate',
      'Uống viên bổ sung theo chỉ định bác sĩ',
    ],
    recommendations: ['Tham khảo bác sĩ về liều lượng phù hợp', 'Kết hợp với vitamin B12 để hấp thụ tốt hơn'],
    externalLinks: [
      {
        title: 'Thực đơn axit folic cho mẹ bầu',
        url: 'https://example.com/axit-folic',
        description: 'Hướng dẫn chi tiết về thực đơn giàu axit folic',
      },
    ],
    isActive: true,
    viewCount: 1250,
    helpfulCount: 89,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
  {
    id: '2',
    title: 'Yoga thai sản tuần 20',
    description: 'Các bài tập yoga an toàn giúp giảm đau lưng và chuẩn bị sinh nở',
    content: 'Yoga thai sản giúp tăng cường sức khỏe, giảm stress và chuẩn bị cơ thể cho việc sinh nở.',
    category: PregnancyCareCategory.EXERCISE,
    importance: PregnancyCareImportance.MEDIUM,
    weekStart: 16,
    weekEnd: 32,
    trimester: PregnancyTrimester.SECOND,
    tags: ['yoga', 'thể dục', 'giảm đau'],
    tips: [
      'Tập với huấn luyện viên chuyên nghiệp',
      'Tránh các tư thế nằm ngửa sau tuần 20',
      'Ngừng tập nếu cảm thấy khó thở',
    ],
    warnings: ['Không tập nếu có tiền sử sảy thai', 'Tránh các động tác xoắn mạnh'],
    videoUrl: 'https://youtube.com/watch?v=example',
    isActive: true,
    viewCount: 890,
    helpfulCount: 67,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-18T00:00:00Z',
  },
  {
    id: '3',
    title: 'Quản lý ốm nghén',
    description: 'Các cách tự nhiên giúp giảm ốm nghén trong tam cá nguyệt đầu',
    content: 'Ốm nghén là hiện tượng bình thường, có thể quản lý bằng nhiều cách tự nhiên và an toàn.',
    category: PregnancyCareCategory.SYMPTOMS,
    importance: PregnancyCareImportance.HIGH,
    weekStart: 6,
    weekEnd: 14,
    trimester: PregnancyTrimester.FIRST,
    tags: ['ốm nghén', 'nôn mửa', 'tự nhiên'],
    tips: ['Ăn nhiều bữa nhỏ trong ngày', 'Uống trà gừng ấm', 'Tránh mùi hương nặng', 'Nghỉ ngơi đủ giấc'],
    warnings: ['Gặp bác sĩ nếu nôn quá 3 lần/ngày', 'Chú ý dấu hiệu mất nước'],
    isActive: true,
    viewCount: 2100,
    helpfulCount: 156,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];

export const PregnancyCareBottomSheet = forwardRef<BottomSheet, PregnancyCareBottomSheetProps>(({ week }, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector(pregnancyCareSelectors.selectCareLoadingState);
  const cares = FAKE_CARE_DATA; // In production: useSelector(pregnancyCareSelectors.selectAllCares);

  const [selectedCategory, setSelectedCategory] = useState<PregnancyCareCategory | 'all'>('all');

  // Bottom sheet configuration
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      // Reset category filter when sheet is minimized
      setSelectedCategory('all');
    }
  }, []);

  useEffect(() => {
    if (week) {
      // In production: dispatch(fetchCaresForWeek({ week }));
    }
  }, [week, dispatch]);

  const getCategoryIcon = (category: PregnancyCareCategory) => {
    const icons = {
      [PregnancyCareCategory.NUTRITION]: 'utensils',
      [PregnancyCareCategory.EXERCISE]: 'dumbbell',
      [PregnancyCareCategory.HEALTH]: 'stethoscope',
      [PregnancyCareCategory.MENTAL_HEALTH]: 'face-smile',
      [PregnancyCareCategory.PREPARATION]: 'baby',
      [PregnancyCareCategory.SYMPTOMS]: 'triangle-exclamation',
      [PregnancyCareCategory.DEVELOPMENT]: 'chart-line',
      [PregnancyCareCategory.SAFETY]: 'shield-halved',
      [PregnancyCareCategory.LIFESTYLE]: 'house',
      [PregnancyCareCategory.MEDICAL]: 'stethoscope',
    };
    return icons[category];
  };

  const getCategoryColor = (category: PregnancyCareCategory) => {
    const colors = {
      [PregnancyCareCategory.NUTRITION]: '#F59E0B',
      [PregnancyCareCategory.EXERCISE]: '#10B981',
      [PregnancyCareCategory.HEALTH]: '#EF4444',
      [PregnancyCareCategory.MENTAL_HEALTH]: '#8B5CF6',
      [PregnancyCareCategory.PREPARATION]: '#EC4899',
      [PregnancyCareCategory.SYMPTOMS]: '#F97316',
      [PregnancyCareCategory.DEVELOPMENT]: '#06B6D4',
      [PregnancyCareCategory.SAFETY]: '#84CC16',
      [PregnancyCareCategory.LIFESTYLE]: '#6366F1',
      [PregnancyCareCategory.MEDICAL]: '#DC2626',
    };
    return colors[category];
  };

  const getImportanceColor = (importance: PregnancyCareImportance) => {
    const colors = {
      [PregnancyCareImportance.LOW]: '#9CA3AF',
      [PregnancyCareImportance.MEDIUM]: '#F59E0B',
      [PregnancyCareImportance.HIGH]: '#EF4444',
      [PregnancyCareImportance.CRITICAL]: '#DC2626',
    };
    return colors[importance];
  };

  const filteredCares = selectedCategory === 'all' ? cares : cares.filter((care) => care.category === selectedCategory);

  const categories = Array.from(new Set(cares.map((care) => care.category)));

  const handleLinkPress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const handleClose = () => {
    (ref as any)?.current?.close();
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
    >
      <BottomSheetView className='flex-1 bg-white'>
        {/* Header */}
        <View className='flex-row items-center justify-between px-4 py-4 border-b border-gray-100'>
          <View className='flex-1'>
            <Text className='font-bold text-lg'>Gợi ý chăm sóc</Text>
            {week && (
              <Text className='text-gray-500 text-sm'>
                Tuần {week} - Tam cá nguyệt {week <= 12 ? 'đầu' : week <= 28 ? 'giữa' : 'cuối'}
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={handleClose}>
            <Icon iconStyle='solid' name='xmark' size={24} color='#6B7280' />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal className='border-b border-gray-100' showsHorizontalScrollIndicator={false}>
          <View className='flex-row px-4 py-3'>
            <TouchableOpacity
              onPress={() => setSelectedCategory('all')}
              className={`mr-3 px-3 py-2 rounded-full ${selectedCategory === 'all' ? 'bg-purple-600' : 'bg-gray-100'}`}
            >
              <Text className={`font-medium text-sm ${selectedCategory === 'all' ? 'text-white' : 'text-gray-600'}`}>
                Tất cả
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`mr-3 px-3 py-2 rounded-full flex-row items-center ${
                  selectedCategory === category ? 'bg-purple-600' : 'bg-gray-100'
                }`}
              >
                <Icon
                  name={getCategoryIcon(category) as any}
                  size={14}
                  color={selectedCategory === category ? 'white' : '#6B7280'}
                />
                <Text
                  className={`ml-1 font-medium text-sm ${
                    selectedCategory === category ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {category === PregnancyCareCategory.NUTRITION && 'Dinh dưỡng'}
                  {category === PregnancyCareCategory.EXERCISE && 'Vận động'}
                  {category === PregnancyCareCategory.HEALTH && 'Sức khỏe'}
                  {category === PregnancyCareCategory.SYMPTOMS && 'Triệu chứng'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Care List */}
        <BottomSheetScrollView className='flex-1 px-4'>
          {filteredCares.map((care) => (
            <View key={care.id} className='bg-gray-50 rounded-xl p-4 mb-4 mt-4'>
              {/* Header */}
              <View className='flex-row items-start justify-between mb-3'>
                <View className='flex-1 pr-3'>
                  <View className='flex-row items-center mb-1'>
                    <View
                      className='w-6 h-6 rounded-full items-center justify-center mr-2'
                      style={{ backgroundColor: getCategoryColor(care.category) }}
                    >
                      <Icon iconStyle='solid' name={getCategoryIcon(care.category) as any} size={12} color='white' />
                    </View>
                    <Text className='font-bold text-base text-gray-800'>{care.title}</Text>
                  </View>
                  <Text className='text-gray-600 text-sm leading-5'>{care.description}</Text>
                </View>

                <View className='items-end'>
                  <View
                    className='px-2 py-1 rounded-full'
                    style={{ backgroundColor: `${getImportanceColor(care.importance)}20` }}
                  >
                    <Text className='text-xs font-medium' style={{ color: getImportanceColor(care.importance) }}>
                      {care.importance === PregnancyCareImportance.HIGH && 'Quan trọng'}
                      {care.importance === PregnancyCareImportance.MEDIUM && 'Trung bình'}
                      {care.importance === PregnancyCareImportance.LOW && 'Thấp'}
                      {care.importance === PregnancyCareImportance.CRITICAL && 'Rất quan trọng'}
                    </Text>
                  </View>
                  <Text className='text-gray-400 text-xs mt-1'>
                    Tuần {care.weekStart}-{care.weekEnd}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <Text className='text-gray-700 leading-5 mb-4'>{care.content}</Text>

              {/* Tips */}
              {care.tips && care.tips.length > 0 && (
                <View className='mb-4'>
                  <Text className='font-medium text-gray-800 mb-2'>💡 Gợi ý:</Text>
                  {care.tips.map((tip, index) => (
                    <Text key={index} className='text-gray-600 text-sm leading-5 mb-1'>
                      • {tip}
                    </Text>
                  ))}
                </View>
              )}

              {/* Warnings */}
              {care.warnings && care.warnings.length > 0 && (
                <View className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4'>
                  <Text className='font-medium text-red-800 mb-2'>⚠️ Lưu ý:</Text>
                  {care.warnings.map((warning, index) => (
                    <Text key={index} className='text-red-700 text-sm leading-5 mb-1'>
                      • {warning}
                    </Text>
                  ))}
                </View>
              )}

              {/* External Links */}
              {care.externalLinks && care.externalLinks.length > 0 && (
                <View className='mb-4'>
                  <Text className='font-medium text-gray-800 mb-2'>🔗 Tài liệu tham khảo:</Text>
                  {care.externalLinks.map((link, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLinkPress(link.url)}
                      className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2'
                    >
                      <Text className='text-blue-600 font-medium text-sm'>{link.title}</Text>
                      {link.description && <Text className='text-blue-500 text-xs mt-1'>{link.description}</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Actions */}
              <View className='flex-row items-center justify-between pt-3 border-t border-gray-200'>
                <View className='flex-row items-center'>
                  <TouchableOpacity className='flex-row items-center mr-4'>
                    <Icon name='eye' size={16} color='#9CA3AF' />
                    <Text className='text-gray-500 text-sm ml-1'>{care.viewCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className='flex-row items-center'>
                    <Icon name='heart' size={16} color='#9CA3AF' />
                    <Text className='text-gray-500 text-sm ml-1'>{care.helpfulCount}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity className='flex-row items-center'>
                  <Icon iconStyle='solid' name='share' size={16} color='#8B5CF6' />
                  <Text className='text-purple-600 text-sm ml-1'>Chia sẻ</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Empty State */}
          {filteredCares.length === 0 && (
            <View className='items-center py-8'>
              <Text className='text-4xl mb-4'>🌸</Text>
              <Text className='text-gray-600 font-medium mb-2'>Chưa có gợi ý nào</Text>
              <Text className='text-gray-400 text-center'>Hiện tại chưa có gợi ý chăm sóc cho tuần này</Text>
            </View>
          )}

          <View className='h-8' />
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
});
