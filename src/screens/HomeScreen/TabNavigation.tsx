import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface TabNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  tabs: TabItem[];
}

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabPress, tabs }) => {
  return (
    <View className='mb-6'>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
        <View className='flex-row gap-x-3'>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabPress(tab.id)}
              className={`px-4 py-3 rounded-2xl border-2 active:scale-95 ${
                activeTab === tab.id ? 'bg-gray-800 border-gray-800 shadow-lg' : 'bg-white border-gray-200 shadow-sm'
              }`}
              style={
                activeTab === tab.id
                  ? {
                      shadowColor: '#1F2937',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                    }
                  : {}
              }
            >
              <View className='flex-row items-center'>
                <Text className={`font-semibold ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}>
                  {tab.label}
                </Text>
                {tab.count && tab.count > 0 && (
                  <View
                    className={`ml-2 px-2 py-1 rounded-full min-w-[20px] items-center ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${activeTab === tab.id ? 'text-white' : 'text-gray-600'}`}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TabNavigation;
