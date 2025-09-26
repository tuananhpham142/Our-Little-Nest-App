import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface UserListItemProps {
  user: UserData;
  onPress?: (user: UserData) => void;
  onActionPress?: (user: UserData) => void;
}

interface UserData {
  id: string;
  name: string;
  score: number;
  avatarColor: string;
  isOnline?: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onPress, onActionPress }) => {
  const generateAvatar = (color: string) => {
    // Simple avatar generation based on color
    const avatarStyles = {
      backgroundColor: color,
    };

    return (
      <View className='w-12 h-12 rounded-full relative overflow-hidden shadow-md' style={avatarStyles}>
        {/* Simple face illustration */}
        <View className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
          <View className='w-10 h-6 rounded-t-full' style={{ backgroundColor: `${color}dd` }} />
        </View>
        <View className='absolute top-2 left-1/2 transform -translate-x-1/2'>
          <View className='w-6 h-6 rounded-full' style={{ backgroundColor: `${color}dd` }} />
        </View>
        {/* Hair based on name */}
        <View className='absolute top-1 left-1/2 transform -translate-x-1/2'>
          <View
            className={`w-8 h-4 rounded-t-full ${
              user.name.includes('Thomas') ? 'bg-amber-800' : user.name.includes('Sara') ? 'bg-red-600' : 'bg-amber-600'
            }`}
          />
        </View>

        {/* Online indicator */}
        {user.isOnline && (
          <View className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full' />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(user)}
      className='flex-row items-center justify-between px-4 py-4 bg-white mb-3 rounded-2xl shadow-sm border border-gray-100 active:scale-98'
    >
      {/* User Info */}
      <View className='flex-row items-center flex-1'>
        {/* Avatar */}
        {generateAvatar(user.avatarColor)}

        {/* Name and Score */}
        <View className='ml-4 flex-1'>
          <Text className='text-gray-900 font-semibold text-base mb-1'>{user.name}</Text>
          <Text className='text-gray-500 text-sm'>Your score {user.score.toLocaleString()}</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity onPress={() => onActionPress?.(user)} className='bg-gray-100 rounded-full p-2 active:scale-95'>
        <Text className='text-gray-600 text-lg'>⚡</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default UserListItem;
