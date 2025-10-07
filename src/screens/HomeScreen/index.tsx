import AppLayout from '@/components/layout/AppLayout';
import ProfileCard from '@/components/template/ProfileCard';
import { useToast } from '@/components/Toast/useToast';
import { RootStackNavigationProp, RouteProps } from '@/types/navigation';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import TabNavigation from './TabNavigation';
import UserListItem from './UserListItem';

interface HomeScreenProps {
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToRanking?: () => void;
  onNavigateToBooster?: () => void;
}

interface UserData {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
  isOnline?: boolean;
}

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  //   onNavigateToProfile,
  onNavigateToNotifications,
  onNavigateToRanking,
  onNavigateToBooster,
}) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProps<'BadgeDetail'>>();
  const { showToast, showNotification, clearAll } = useToast();

  const [activeTab, setActiveTab] = useState('Selected');
  const [activeBottomTab, setActiveBottomTab] = useState('social');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const userProfile = {
    userName: 'Elena Thomperton',
    membershipType: 'Special membership, time left',
    coins: 45063,
  };

  const tabs: TabItem[] = [
    { id: 'Selected', label: 'Selected', count: 3 },
    { id: 'Multiplayer', label: 'Multiplayer', count: 5 },
    { id: 'card', label: 'Card' },
    { id: 'Board', label: 'Board', count: 2 },
  ];

  const friendsList: UserData[] = [
    {
      id: '1',
      name: 'Thomas Depp',
      score: 103457,
      avatarColor: '#F59E0B',
      isOnline: true,
    },
    {
      id: '2',
      name: 'Sara Jerry',
      score: 103457,
      avatarColor: '#EF4444',
      isOnline: false,
    },
    {
      id: '3',
      name: 'Elena Mark',
      score: 103457,
      avatarColor: '#8B5CF6',
      isOnline: true,
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleUserPress = (user: UserData) => {
    console.log('User pressed:', user.name);
    // Navigate to user profile or chat
  };

  const handleUserActionPress = (user: UserData) => {
    console.log('Action pressed for:', user.name);
    // Handle action (challenge, invite, etc.)
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    // Filter friends list based on tab or load different data
  };

  const _handleBottomTabPress = (tab: string) => {
    setActiveBottomTab(tab);
    // Navigate to different screens
  };

  return (
    <AppLayout>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor='#8B5CF6' />}
      >
        {/* Profile Card */}
        <ProfileCard
          userName={userProfile.userName}
          membershipType={userProfile.membershipType}
          coins={userProfile.coins}
          hasNotifications={true}
          onNotificationPress={onNavigateToNotifications}
          onRankingPress={onNavigateToRanking}
          onBoosterPress={onNavigateToBooster}
        />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabPress={handleTabPress} tabs={tabs} />

        {/* Friends List */}
        <View className=''>
          {friendsList.map((user) => (
            <UserListItem key={user.id} user={user} onPress={handleUserPress} onActionPress={handleUserActionPress} />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => {
            showToast({
              type: 'success',
              title: 'Hoàn thành!',
              message: 'Đã lưu cân nặng của bé thành công',
            });
          }}
          className={`items-center justify-center p-3 rounded-2xl active:scale-95`}
          style={{
            shadowColor: '#A855F7',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Text>Show toast</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Badges' as any)}
          className={`items-center justify-center p-3 rounded-2xl active:scale-95`}
          style={{
            shadowColor: '#A855F7',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Text>Badges Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('BabyBadges' as any, {
              babyId: '64f1a2b3c4d5e6f789abcde2',
            })
          }
          className={`items-center justify-center p-3 rounded-2xl active:scale-95`}
          style={{
            shadowColor: '#A855F7',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <Text>Baby badges</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppLayout>
  );
};

export default HomeScreen;
