import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ProfileCardProps {
  userName: string;
  membershipType: string;
  coins: number;
  hasNotifications?: boolean;
  onNotificationPress?: () => void;
  onRankingPress?: () => void;
  onBoosterPress?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  membershipType,
  coins,
  hasNotifications = true,
  onNotificationPress,
  onRankingPress,
  onBoosterPress,
}) => {
  const { width: _width } = Dimensions.get('window');

  return (
    <View className='mb-6 px-4'>
      {/* Main Profile Card - Separate from avatar with space */}
      <LinearGradient
        colors={['#BFDBFE', '#E0E7FF', '#F3E8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          borderRadius: 32,
        }}
      >
        <View className='p-3 rounded-lg'>
          <View className='items-center mb-4 relative z-10'>
            <View
              className='w-24 h-24 bg-white rounded-full shadow-xl overflow-hidden border-4 border-white'
              style={{
                shadowColor: '#F97316',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              }}
            >
              {/* Simple avatar illustration */}
              <View className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
                <View className='w-16 h-10 bg-orange-600 rounded-t-full' />
              </View>
              <View className='absolute top-3 left-1/2 transform -translate-x-1/2'>
                <View className='w-10 h-10 bg-orange-600 rounded-full' />
              </View>
              {/* Hair */}
              <View className='absolute top-1 left-1/2 transform -translate-x-1/2'>
                <View className='w-14 h-8 bg-red-600 rounded-t-full' />
              </View>
            </View>
          </View>
          {/* User Info - Centered */}
          <View className='items-center mb-8'>
            <Text className='text-gray-900 text-2xl font-bold mb-2'>{userName}</Text>
            <Text className='text-gray-600 text-sm text-center'>{membershipType}</Text>
          </View>

          {/* Action Buttons - Matching exact design */}
          <View className='flex-row justify-center gap-x-4 px-4'>
            {/* Ranking Button */}
            <TouchableOpacity
              onPress={onRankingPress}
              className='bg-blue-100 rounded-2xl px-4 py-3 items-center w-1/2 shadow-sm'
              style={{
                shadowColor: '#60A5FA',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text className='text-gray-700 font-semibold text-sm'>Ranking</Text>
              <Text className='text-gray-500 text-sm'>Track progress</Text>
            </TouchableOpacity>

            {/* Booster Button */}
            <TouchableOpacity
              onPress={onBoosterPress}
              className='bg-pink-100 rounded-2xl px-4 py-3 items-center w-1/2 shadow-sm'
              style={{
                shadowColor: '#EC4899',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Text className='text-gray-700 font-semibold text-sm'>Booster</Text>
              <Text className='text-gray-500 text-sm'>Power up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ProfileCard;
