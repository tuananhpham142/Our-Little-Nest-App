// screens/PregnancyJournal/PregnancyJournalScreen.tsx
import { EmptyState } from '@/components/template/EmptyState';
import {
  GenderType,
  MoodType,
  PregnancyJournalStatus,
  SharePermission,
} from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import { pregnancyCareSelectors } from '@/store/slices/pregnancyCareSlice';
import { pregnancyJournalSelectors, setCurrentJournal } from '@/store/slices/pregnancyJournalSlice';
import { AppDispatch } from '@/store/store';
import BottomSheet, { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CreateJournalBottomSheet } from './components/CreateJournalBottomSheet';
import { EditJournalBottomSheet } from './components/EditJournalBottomSheet';
import { EmotionEntryBottomSheet } from './components/EmotionEntryBottomSheet';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PregnancyCareBottomSheet } from './components/PregnancyCareBottomSheet';
import { PregnancyJournalHeader } from './components/PregnancyJournalHeader';
import { TimelineView } from './components/TimelineView';
import { WeekProgressCard } from './components/WeekProgressCard';

// Fake data for demonstration
const FAKE_JOURNALS: PregnancyJournal[] = [
  {
    id: '1',
    title: 'Hành trình với thiên thần nhỏ',
    description: 'Nhật ký thai kỳ đầu tiên của tôi',
    babyInfo: {
      nickname: 'Thiên thần nhỏ',
      gender: GenderType.MALE,
      expectedDueDate: '2024-08-15',
      currentWeek: 20,
      estimatedWeight: 300,
      estimatedLength: 16.4,
    },
    status: PregnancyJournalStatus.ACTIVE,
    pregnancyStartDate: '2023-12-01',
    emotionEntries: [
      {
        id: 'e1',
        date: '2024-03-15',
        content: 'Hôm nay siêu âm lần đầu! Thấy bé máy quá, tim đập rất khỏe 💓',
        mood: MoodType.HAPPY,
        isPrivate: false,
        createdBy: 'user1',
        createdAt: '2024-03-15T10:00:00Z',
      },
      {
        id: 'e2',
        date: '2024-03-20',
        content: 'Ốm nghén nhiều quá, mệt mỏi lắm 😔',
        mood: MoodType.TIRED,
        isPrivate: false,
        createdBy: 'user1',
        createdAt: '2024-03-20T14:30:00Z',
      },
    ],
    babyLetters: [
      {
        id: 'l1',
        week: 12,
        title: 'Thư tuần 12',
        content:
          'Mẹ ơi, con đã lớn bằng quả chanh rồi nè! 🍋 Con có thể cử động tay chân và đang phát triển từng ngày. Mẹ nhớ ăn đầy đủ dinh dưỡng nhé!',
        generatedAt: '2024-02-15T00:00:00Z',
        isCustom: false,
      },
      {
        id: 'l2',
        week: 20,
        title: 'Thư tuần 20',
        content:
          'Mẹ yêu, con giờ to bằng quả chuối rồi đó! 🍌 Con có thể nghe thấy tiếng mẹ nói rồi, hãy nói chuyện với con nhiều nhé!',
        generatedAt: '2024-03-21T00:00:00Z',
        isCustom: false,
      },
    ],
    shareSettings: {
      isPublic: false,
      permission: SharePermission.VIEW_ONLY,
      sharedWith: [],
    },
    createdBy: 'user1',
    isActive: true,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-03-21T00:00:00Z',
  },
];

interface PregnancyJournalScreenProps {
  navigation: any;
}

export const PregnancyJournalScreen: React.FC<PregnancyJournalScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { isLoading, isSubmitting } = useSelector(pregnancyJournalSelectors.selectJournalLoadingState);
  const myJournals = useSelector(pregnancyJournalSelectors.selectMyJournals);
  const currentJournal = useSelector(pregnancyJournalSelectors.selectCurrentJournal);
  const recommendedCares = useSelector(pregnancyCareSelectors.selectRecommendedCares);

  // Bottom sheet refs
  const createJournalRef = useRef<BottomSheet>(null);
  const editJournalRef = useRef<BottomSheet>(null);
  const emotionEntryRef = useRef<BottomSheet>(null);
  const pregnancyCareRef = useRef<BottomSheet>(null);

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<PregnancyJournal | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'care'>('timeline');

  // Use fake data for demo
  const journals = FAKE_JOURNALS; // In production: myJournals
  const activeJournal = FAKE_JOURNALS[0]; // In production: currentJournal || selectedJournal

  useFocusEffect(
    useCallback(() => {
      loadData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const loadData = async () => {
    try {
      // In production, uncomment these:
      // await dispatch(fetchMyJournals()).unwrap();

      if (activeJournal) {
        // await dispatch(fetchCaresForWeek({ week: activeJournal.babyInfo.currentWeek })).unwrap();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleJournalSelect = (journal: PregnancyJournal) => {
    setSelectedJournal(journal);
    dispatch(setCurrentJournal(journal));
  };

  const handleDeleteJournal = (journalId: string) => {
    Alert.alert('Xóa nhật ký', 'Bạn có chắc chắn muốn xóa nhật ký này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            // await dispatch(deleteJournal(journalId)).unwrap();
            Alert.alert('Thành công', 'Đã xóa nhật ký');
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa nhật ký');
          }
        },
      },
    ]);
  };

  const handleAddEmotion = () => {
    if (!activeJournal) {
      Alert.alert('Thông báo', 'Vui lòng chọn nhật ký trước');
      return;
    }
    emotionEntryRef.current?.expand();
  };

  const handleViewCare = () => {
    if (!activeJournal) {
      Alert.alert('Thông báo', 'Vui lòng chọn nhật ký trước');
      return;
    }
    pregnancyCareRef.current?.expand();
  };

  const handleCreateJournal = () => {
    createJournalRef.current?.expand();
  };

  const handleEditJournal = () => {
    if (!activeJournal) {
      Alert.alert('Thông báo', 'Vui lòng chọn nhật ký trước');
      return;
    }
    editJournalRef.current?.expand();
  };

  if (isLoading && journals.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className='flex-1 bg-gradient-to-b from-purple-100 to-pink-100 pt-16'>
          <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />

          {/* Header */}
          <PregnancyJournalHeader
            onCreatePress={handleCreateJournal}
            onSettingsPress={() => navigation.navigate('Settings')}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {journals.length === 0 ? (
            <EmptyState
              title='Chưa có nhật ký nào'
              subtitle='Hãy tạo nhật ký đầu tiên để bắt đầu hành trình thai kỳ'
              buttonText='Tạo nhật ký'
              onButtonPress={handleCreateJournal}
            />
          ) : (
            <ScrollView
              className='flex-1'
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              showsVerticalScrollIndicator={false}
            >
              {/* Week Progress Card */}
              {activeJournal && (
                <WeekProgressCard
                  journal={activeJournal}
                  onEditPress={handleEditJournal}
                  onCarePress={handleViewCare}
                />
              )}

              {/* Timeline Content */}
              {activeTab === 'timeline' && activeJournal && (
                <TimelineView
                  journal={activeJournal}
                  onEmotionPress={handleAddEmotion}
                  onDeletePress={handleDeleteJournal}
                />
              )}

              {/* Care Content */}
              {activeTab === 'care' && activeJournal && (
                <View className='px-4 pb-20'>{/* Care recommendations will be shown here */}</View>
              )}

              {/* Bottom spacing */}
              <View className='h-20' />
            </ScrollView>
          )}

          {/* Floating Action Button */}

          {/* Bottom Sheets */}
          <CreateJournalBottomSheet ref={createJournalRef} onSuccess={loadData} />

          <EditJournalBottomSheet ref={editJournalRef} journal={activeJournal} onSuccess={loadData} />

          <EmotionEntryBottomSheet ref={emotionEntryRef} journal={activeJournal} onSuccess={loadData} />

          <PregnancyCareBottomSheet ref={pregnancyCareRef} week={activeJournal?.babyInfo.currentWeek} />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
