import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { ToastConfig, ToastType } from './Toast.types';

interface ToastItemProps {
  toast: ToastConfig;
  index: number;
  onHide: (id: string) => void;
  totalToasts: number;
}

const getToastStyle = (type: ToastType) => {
  const styles = {
    success: {
      icon: 'circle-check',
      iconColor: '#10B981',
      accentColor: '#10B981',
    },
    error: {
      icon: 'circle-xmark',
      iconColor: '#EF4444',
      accentColor: '#EF4444',
    },
    warning: {
      icon: 'triangle-exclamation',
      iconColor: '#F59E0B',
      accentColor: '#F59E0B',
    },
    info: {
      icon: 'circle-info',
      iconColor: '#3B82F6',
      accentColor: '#3B82F6',
    },
    notification: {
      icon: 'bell',
      iconColor: '#8B5CF6',
      accentColor: '#8B5CF6',
    },
  };
  return styles[type];
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return date.toLocaleDateString('vi-VN');
};

const ToastItem: React.FC<ToastItemProps> = ({ toast, index, onHide, totalToasts }) => {
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const style = getToastStyle(toast.type);

  // Calculate stacking offset and scale
  const stackOffset = index * 8;
  const stackScale = 1 - index * 0.03;

  useEffect(() => {
    // Entrance animation with spring effect
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: stackOffset,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1 - index * 0.15,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: stackScale,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }),
    ]).start();

    // Auto hide
    if (index === 0) {
      const timer = setTimeout(() => {
        hideToast();
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(toast.id);
    });
  };

  const handlePress = () => {
    if (toast.onPress) {
      toast.onPress();
    }
    hideToast();
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }, { scale }],
        opacity,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000 - index,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handlePress}
        style={{
          marginHorizontal: 12,
          marginTop: 8,
        }}
      >
        <View
          className='rounded-3xl overflow-hidden'
          style={{
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 + index * 2 },
            shadowOpacity: 0.15 - index * 0.02,
            shadowRadius: 12 + index * 2,
            elevation: 8 - index,
          }}
        >
          {/* Accent Bar */}
          <View
            style={{
              height: 3,
              backgroundColor: style.accentColor,
            }}
          />

          <View className='p-4'>
            <View className='flex-row items-start'>
              {/* Icon or Image */}
              <View className='mr-3'>
                {toast.image ? (
                  <Image
                    source={{ uri: toast.image }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                    }}
                    resizeMode='cover'
                  />
                ) : (
                  <View
                    className='items-center justify-center'
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: `${style.accentColor}15`,
                    }}
                  >
                    <Icon
                      name={toast.icon || (style.icon as any)}
                      size={22}
                      color={style.iconColor}
                      iconStyle='solid'
                    />
                  </View>
                )}
              </View>

              {/* Content */}
              <View className='flex-1 pr-2'>
                <View className='flex-row items-center justify-between mb-1'>
                  {toast.title && (
                    <Text className='font-bold text-gray-900 text-base flex-1' numberOfLines={1}>
                      {toast.title}
                    </Text>
                  )}
                  {toast.timestamp && (
                    <Text className='text-gray-400 text-xs ml-2'>{formatTimestamp(toast.timestamp)}</Text>
                  )}
                </View>
                <Text className='text-gray-600 text-sm leading-5' numberOfLines={3}>
                  {toast.message}
                </Text>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                onPress={hideToast}
                className='w-8 h-8 items-center justify-center'
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name='xmark' size={16} color='#9CA3AF' iconStyle='solid' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ToastItem;
