// screens/PregnancyJournal/components/TimelineView.tsx
import { MoodType } from '@/models/PregnancyJournal/PregnancyJournalEnum';
import { PregnancyJournal } from '@/models/PregnancyJournal/PregnancyJournalModel';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TimelineItem } from './TimelineItem';

interface TimelineViewProps {
  journal: PregnancyJournal;
  onEmotionPress: () => void;
  onDeletePress: (journalId: string) => void;
}

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

export const TimelineView: React.FC<TimelineViewProps> = ({ journal, onEmotionPress, onDeletePress }) => {
  // Combine and sort timeline entries
  const getTimelineEntries = (): TimelineEntry[] => {
    const entries: TimelineEntry[] = [];

    // Add emotion entries
    journal.emotionEntries.forEach((emotion) => {
      entries.push({
        id: emotion.id,
        type: 'emotion',
        date: emotion.date,
        title: getMoodTitle(emotion.mood),
        content: emotion.content,
        mood: emotion.mood,
        color: getMoodColor(emotion.mood),
        icon: getMoodIcon(emotion.mood),
      });
    });

    // Add baby letters
    journal.babyLetters.forEach((letter) => {
      const letterDate = new Date(journal.pregnancyStartDate);
      letterDate.setDate(letterDate.getDate() + letter.week * 7);

      entries.push({
        id: letter.id,
        type: 'letter',
        date: letterDate.toISOString().split('T')[0],
        title: letter.title,
        content: letter.content,
        week: letter.week,
        color: '#10B981',
        icon: 'mail',
      });
    });

    // Add milestones
    // const milestones = generateMilestones(journal);
    // entries.push(...milestones);

    // Sort by date (newest first)
    return (
      entries
        // .sort((a, b) => b.week - a.week)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const getMoodTitle = (mood?: MoodType): string => {
    const titles = {
      happy: 'Hạnh phúc',
      excited: 'Thích thú',
      worried: 'Lo lắng',
      tired: 'Mệt mỏi',
      emotional: 'Xúc động',
      neutral: 'Bình thường',
    };
    return mood ? titles[mood] : 'Cảm xúc';
  };

  const getMoodColor = (mood?: MoodType): string => {
    const colors = {
      happy: '#F59E0B',
      excited: '#8B5CF6',
      worried: '#EF4444',
      tired: '#6B7280',
      emotional: '#EC4899',
      neutral: '#10B981',
    };
    return mood ? colors[mood] : '#10B981';
  };

  const getMoodIcon = (mood?: MoodType): string => {
    const icons = {
      happy: 'happy',
      excited: 'star',
      worried: 'sad',
      tired: 'bed',
      emotional: 'heart',
      neutral: 'remove-circle',
    };
    return mood ? icons[mood] : 'chatbubble';
  };

  // const generateMilestones = (journal: PregnancyJournal): TimelineEntry[] => {
  //   const milestones: TimelineEntry[] = [];
  //   const startDate = new Date(journal.pregnancyStartDate);

  //   // Key pregnancy milestones
  //   const milestoneWeeks = [
  //     { week: 4, title: 'Bắt đầu hành trình', content: 'Thai kỳ chính thức bắt đầu! 🎉' },
  //     { week: 12, title: 'Vượt qua tam cá nguyệt đầu', content: 'Đã hoàn thành giai đoạn đầu quan trọng! 💪' },
  //     { week: 20, title: 'Giữa chặng đường', content: 'Đã đi được nửa chặng đường rồi! 🎯' },
  //     { week: 28, title: 'Bước vào tam cá nguyệt cuối', content: 'Chuẩn bị đón bé yêu thôi! 👶' },
  //   ];

  //   milestoneWeeks.forEach((milestone) => {
  //     if (milestone.week <= journal.babyInfo.currentWeek) {
  //       const milestoneDate = new Date(startDate);
  //       milestoneDate.setDate(milestoneDate.getDate() + milestone.week * 7);

  //       milestones.push({
  //         id: `milestone_${milestone.week}`,
  //         type: 'milestone',
  //         date: milestoneDate.toISOString().split('T')[0],
  //         title: milestone.title,
  //         content: milestone.content,
  //         week: milestone.week,
  //         color: '#8B5CF6',
  //         icon: 'trophy',
  //       });
  //     }
  //   });

  //   return milestones;
  // };

  const timelineEntries = getTimelineEntries();

  return (
    <View className='px-4'>
      {/* Timeline Header */}
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-lg font-bold text-gray-800'>Hành trình của bạn</Text>
        <TouchableOpacity
          onPress={onEmotionPress}
          className='bg-purple-100 px-3 py-1.5 rounded-full flex-row items-center'
          activeOpacity={0.7}
        >
          <Icon iconStyle='solid' name='plus' size={14} color='#8B5CF6' />
          <Text className='text-purple-600 font-medium ml-1 text-sm'>Thêm cảm xúc</Text>
        </TouchableOpacity>
      </View>

      {/* Timeline Items */}
      <View className='relative'>
        {timelineEntries.map((entry, index) => (
          <TimelineItem
            key={entry.id}
            entry={entry}
            isLast={index === timelineEntries.length - 1}
            onPress={() => {
              // Handle timeline item press
            }}
          />
        ))}
      </View>

      {/* Empty state */}
      {timelineEntries.length === 0 && (
        <View className='bg-gray-50 rounded-xl p-8 items-center'>
          <Text className='text-4xl mb-4'>📖</Text>
          <Text className='text-gray-600 font-medium mb-2'>Chưa có gì trong timeline</Text>
          <Text className='text-gray-400 text-center mb-4'>Hãy bắt đầu ghi lại những cảm xúc đầu tiên của bạn</Text>
          <TouchableOpacity onPress={onEmotionPress} className='bg-purple-600 px-4 py-2 rounded-lg' activeOpacity={0.8}>
            <Text className='text-white font-medium'>Viết nhật ký đầu tiên</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
