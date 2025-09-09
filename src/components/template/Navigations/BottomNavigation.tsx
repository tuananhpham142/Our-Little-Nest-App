import Icon from '@react-native-vector-icons/fontawesome6';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface BottomNavigationProps extends BottomTabBarProps {}

interface TabItem {
  id: string;
  icon: string;
  label: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = (props: BottomNavigationProps) => {
  const { navigation } = props;
  //   const { width } = Dimensions.get('window');

  const tabs: TabItem[] = [
    { id: 'Home', icon: 'house', label: 'Home' },
    { id: 'Articles', icon: 'newspaper', label: 'Message' },
    { id: 'PregnancyJournal', icon: 'timeline', label: 'PregnancyJournal' },
    { id: 'Notifications', icon: 'bell', label: 'Settings' },
    { id: 'Profile', icon: 'user', label: 'Profile' },
  ];

  const handleTabPress = (screen: any) => navigation.navigate(screen as never);

  return (
    <View className='bg-white border-t border-gray-100 px-4 py-3 shadow-2xl'>
      <View className='flex-row justify-around items-center'>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(tab.id)}
            className={`items-center justify-center p-3 rounded-2xl active:scale-95 ${
              props.state.key === tab.id ? 'bg-purple-500 shadow-lg' : 'bg-transparent'
            }`}
            style={
              props.state.key === tab.id
                ? {
                    shadowColor: '#A855F7',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }
                : {}
            }
          >
            <Text className={`text-2xl mb-1 ${props.state.key === tab.id ? 'transform scale-110' : ''}`}>
              <Icon name={tab.icon as any} iconStyle='solid' size={16} />
            </Text>
            {props.state.key === tab.id && <View className='w-1 h-1 bg-white rounded-full' />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BottomNavigation;
