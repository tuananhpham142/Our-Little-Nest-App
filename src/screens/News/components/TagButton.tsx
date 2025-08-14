// src/components/TagButton.tsx
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface TagButtonProps {
  label: string;
}

const TagButton: React.FC<TagButtonProps> = ({ label }) => {
  return (
    <TouchableOpacity className='bg-slate-100 rounded-full px-4 py-2 mr-2 mb-2'>
      <Text className='text-slate-600 font-medium text-sm'>#{label}</Text>
    </TouchableOpacity>
  );
};

export default TagButton;
