import ProfileCard from '@/components/template/ProfileCard';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
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
  const navigation = useNavigation();

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
    <View className='flex-1 pt-16'>
      {/* Scrollable Content */}
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
        <View className='pb-6'>
          {friendsList.map((user) => (
            <UserListItem key={user.id} user={user} onPress={handleUserPress} onActionPress={handleUserActionPress} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
