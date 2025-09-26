// screens/PregnancyJournal/components/TimelineItem.tsx
import { MoodType } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TimelineEntry {
  id: string;
  type: 'emotion' | 'letter' | 'milestone';
  date: string;
  title: string;
  content: string;
  mood?: MoodType;
  week?: number;
  color: string;
  icon: string;
}

interface TimelineItemProps {
  entry: TimelineEntry;
  isLast: boolean;
  onPress: () => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ entry, isLast, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  const getTimeString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string, icon: string) => {
    if (type === 'emotion') return icon;
    if (type === 'letter') return 'mail';
    if (type === 'milestone') return 'trophy';
    return 'chatbubble';
  };

  const getTypeBackground = (type: string) => {
    if (type === 'emotion') return 'bg-blue-50';
    if (type === 'letter') return 'bg-green-50';
    if (type === 'milestone') return 'bg-purple-50';
    return 'bg-gray-50';
  };

  const renderIcon = (iconName: string, color: string) => {
    const iconMap: { [key: string]: any } = {
      happy: 'face-smile',
      star: 'star',
      sad: 'face-frown',
      bed: 'bed',
      heart: 'heart',
      'remove-circle': 'circle-minus',
      mail: 'envelope',
      trophy: 'trophy',
      chatbubble: 'comment',
    };

    return <Icon iconStyle='solid' name={iconMap[iconName] || 'comment'} size={16} color='white' />;
  };

  return (
    <View className='flex-row mb-4'>
      {/* Timeline Line and Dot */}
      <View className='items-center mr-4'>
        {/* Dot */}
        <View
          className='w-8 h-8 rounded-full items-center justify-center z-10'
          style={{ backgroundColor: entry.color }}
        >
          {renderIcon(entry.icon, 'white')}
        </View>

        {/* Line */}
        {!isLast && <View className='w-0.5 bg-gray-200 flex-1 mt-2' />}
      </View>

      {/* Content Card */}
      <TouchableOpacity
        onPress={onPress}
        className={`flex-1 ${getTypeBackground(entry.type)} rounded-xl p-4 mb-2`}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View className='flex-row items-center justify-between mb-2'>
          <View className='flex-row items-center'>
            <Text className='font-bold text-gray-800 text-base'>{entry.title}</Text>
            {entry.week && (
              <View className='bg-gray-200 px-2 py-0.5 rounded-full ml-2'>
                <Text className='text-xs text-gray-600'>Tuần {entry.week}</Text>
              </View>
            )}
          </View>

          <View className='items-end'>
            <Text className='text-xs text-gray-500'>{formatDate(entry.date)}</Text>
            <Text className='text-xs text-gray-400'>{getTimeString(entry.date)}</Text>
          </View>
        </View>

        {/* Content */}
        <Text className='text-gray-700 leading-5'>{entry.content}</Text>

        {/* Type Badge */}
        <View className='flex-row justify-between items-center mt-3'>
          <View className='flex-row items-center'>
            <View className='w-2 h-2 rounded-full mr-2' style={{ backgroundColor: entry.color }} />
            <Text className='text-xs text-gray-500'>
              {entry.type === 'emotion' && 'Cảm xúc'}
              {entry.type === 'letter' && 'Thư từ bé'}
              {entry.type === 'milestone' && 'Mốc quan trọng'}
            </Text>
          </View>

          {entry.type === 'emotion' && (
            <TouchableOpacity className='p-1'>
              <Icon iconStyle='solid' name='ellipsis' size={16} color='#9CA3AF' />
            </TouchableOpacity>
          )}
        </View>

        {/* Actions for emotion entries */}
        {entry.type === 'emotion' && (
          <View className='flex-row mt-3 pt-3 border-t border-gray-200'>
            <TouchableOpacity className='flex-row items-center mr-4'>
              <Icon name='heart' size={14} color='#9CA3AF' />
              <Text className='text-xs text-gray-500 ml-1'>Thích</Text>
            </TouchableOpacity>

            <TouchableOpacity className='flex-row items-center'>
              <Icon name='comment' size={14} color='#9CA3AF' />
              <Text className='text-xs text-gray-500 ml-1'>Bình luận</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
