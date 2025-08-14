// src/components/common/Modal.tsx
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { Dimensions, Modal as RNModal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  transparent?: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  animationType = 'slide',
  transparent = true,
}) => {
  const { colors } = useTheme();

  return (
    <RNModal visible={visible} animationType={animationType} transparent={transparent} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className='flex-1 justify-end bg-black/50'>
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: screenHeight * 0.9,
              }}
            >
              {/* Header */}
              <View
                className='flex-row justify-between items-center p-4 border-b'
                style={{ borderBottomColor: colors.border }}
              >
                {title && (
                  <Text className='text-lg font-semibold' style={{ color: colors.text }}>
                    {title}
                  </Text>
                )}

                {showCloseButton && (
                  <TouchableOpacity onPress={onClose} className='p-2'>
                    <Text style={{ fontSize: 18, color: colors.textSecondary }}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Content */}
              <View className='p-4'>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};
