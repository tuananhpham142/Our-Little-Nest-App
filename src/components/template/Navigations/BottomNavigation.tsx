import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

interface TabItem {
  id: string;
  icon: string;
  label: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabPress }) => {
  //   const { width } = Dimensions.get('window');

  const tabs: TabItem[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'message', icon: '💬', label: 'Message' },
    { id: 'social', icon: '👥', label: 'Social' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View className='bg-white border-t border-gray-100 px-4 py-3 shadow-2xl'>
      <View className='flex-row justify-around items-center'>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            className={`items-center justify-center p-3 rounded-2xl active:scale-95 ${
              activeTab === tab.id ? 'bg-purple-500 shadow-lg' : 'bg-transparent'
            }`}
            style={
              activeTab === tab.id
                ? {
                    shadowColor: '#A855F7',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }
                : {}
            }
          >
            <Text className={`text-2xl mb-1 ${activeTab === tab.id ? 'transform scale-110' : ''}`}>{tab.icon}</Text>
            {activeTab === tab.id && <View className='w-1 h-1 bg-white rounded-full' />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomNavigation;
