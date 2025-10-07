// ==================== Toast Provider ====================
// src/contexts/Toast/ToastProvider.tsx

import Icon from '@react-native-vector-icons/fontawesome6';
import React, { createContext, useCallback, useState } from 'react';
import { Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ToastConfig, ToastContextValue } from './Toast.types';
import ToastItem from './ToastItem';

export const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback((config: Omit<ToastConfig, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastConfig = {
      id,
      duration: 5000,
      timestamp: new Date(),
      ...config,
    };

    setToasts((prev) => {
      // Add new toast to the beginning (top)
      const updated = [newToast, ...prev];
      // Limit to 5 toasts maximum
      return updated.slice(0, 5);
    });
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showNotification = useCallback(
    (title: string, message: string, onPress?: () => void, image?: string) => {
      showToast({
        type: 'notification',
        title,
        message,
        duration: 5000,
        onPress,
        image,
      });
    },
    [showToast],
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, showNotification, clearAll }}>
      {children}

      {/* Toast Container - iOS Style */}
      {toasts.length > 0 && (
        <View
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? StatusBar.currentHeight || 44 : (StatusBar.currentHeight || 0) + 8,
            left: 0,
            right: 0,
            zIndex: 9999,
            pointerEvents: 'box-none',
          }}
        >
          {/* Header with Clear All Button */}
          {toasts.length > 1 && (
            <View className='flex-row justify-between items-center px-4 pb-2'>
              <Text className='text-gray-500 text-xs font-semibold'>{toasts.length} thông báo</Text>
              <TouchableOpacity
                onPress={clearAll}
                className='flex-row items-center'
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name='xmark' size={12} color='#9CA3AF' iconStyle='solid' />
                <Text className='text-gray-500 text-xs font-semibold ml-1'>Xóa tất cả</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Stacked Toasts */}
          <View style={{ position: 'relative', height: 140 + toasts.length * 8 }}>
            {toasts.map((toast, index) => (
              <ToastItem key={toast.id} toast={toast} index={index} onHide={hideToast} totalToasts={toasts.length} />
            ))}
          </View>
        </View>
      )}
    </ToastContext.Provider>
  );
};
