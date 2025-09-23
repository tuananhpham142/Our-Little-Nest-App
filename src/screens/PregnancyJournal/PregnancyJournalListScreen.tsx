// screens/PregnancyJournal/PregnancyJournalListScreen.tsx
import AppLayout from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/template/EmptyState';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import { fetchMyJournals, pregnancyJournalSelectors } from '@/store/slices/pregnancyJournalSlice';
import { AppDispatch } from '@/store/store';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import WeekProgressCard from './components/WeekProgressCard';

interface PregnancyJournalListScreenProps {
  navigation: any;
}
export const PregnancyJournalListScreen: React.FC<PregnancyJournalListScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector(pregnancyJournalSelectors.selectJournalLoadingState);
  const journals = useSelector(pregnancyJournalSelectors.selectMyJournals);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const loadData = async () => {
    try {
      await dispatch(fetchMyJournals()).unwrap();
    } catch (error) {
      console.error('Error loading journals:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleJournalPress = (journal: PregnancyJournal) => {
    navigation.navigate('PregnancyJournal', { journal });
  };

  const handleEditJournal = (journal: PregnancyJournal) => {
    navigation.navigate('EditJournal', {
      journal,
      onSuccess: loadData,
    });
  };

  const handleDeleteJournal = (journal: PregnancyJournal) => {
    Alert.alert('Xóa nhật ký', 'Bạn có chắc chắn muốn xóa nhật ký này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            // await dispatch(deleteJournal(journal.id)).unwrap();
            Alert.alert('Thành công', 'Đã xóa nhật ký');
            loadData();
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa nhật ký');
          }
        },
      },
    ]);
  };

  const handleCreateJournal = () => {
    navigation.navigate('CreateJournal', {
      onSuccess: loadData,
    });
  };

  const renderJournalItem = ({ item }: { item: PregnancyJournal }) => (
    <WeekProgressCard
      journal={item}
      onPress={() => handleJournalPress(item)}
      onEditPress={() => handleEditJournal(item)}
      onDeletePress={() => handleDeleteJournal(item)}
      onCarePress={function (): void {
        throw new Error('Function not implemented.');
      }}
    />
  );

  const renderHeader = () => (
    <View className='flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100'>
      <View className='flex-1'>
        <Text className='text-2xl font-bold text-gray-900'>Nhật ký thai kỳ</Text>
        <Text className='text-sm text-gray-500 mt-1'>{journals.length} nhật ký</Text>
      </View>

      <TouchableOpacity
        onPress={handleCreateJournal}
        className='w-12 h-12 bg-purple-600 rounded-full items-center justify-center shadow-lg'
        activeOpacity={0.8}
      >
        <Icon iconStyle='solid' name='plus' size={20} color='white' />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View className='flex-1 justify-center'>
      <EmptyState
        title='Chưa có nhật ký nào'
        subtitle='Hãy tạo nhật ký đầu tiên để bắt đầu hành trình thai kỳ'
        buttonText='Tạo nhật ký'
        onButtonPress={handleCreateJournal}
      />
    </View>
  );

  return (
    <AppLayout>
      <View className='flex-1'>
        {renderHeader()}

        {journals.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={journals}
            renderItem={renderJournalItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#8B5CF6']} tintColor='#8B5CF6' />
            }
          />
        )}
      </View>
    </AppLayout>
  );
};
