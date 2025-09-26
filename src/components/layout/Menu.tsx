import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

interface MenuScreenProps {
  isVisible: boolean;
  onClose: () => void;
  navigation?: any;
}

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  badge?: number;
  onPress: () => void;
  color?: string;
  isDanger?: boolean;
}

interface UserInfo {
  name: string;
  email: string;
  avatar: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

const MenuScreen: React.FC<MenuScreenProps> = ({ isVisible, onClose, navigation }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [currentUser] = useState<UserInfo>({
    name: 'Julian Hart',
    email: 'julianhartdesign@mail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=julian',
    stats: {
      posts: 71,
      followers: 251,
      following: 407,
    },
  });

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ['25%', '80%'], []);

  // Handle sheet changes
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  // Custom backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.7} />
    ),
    [],
  );

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: 'market',
      title: 'Market',
      icon: 'storefront',
      onPress: () => handleMenuPress('Market'),
    },
    {
      id: 'categories',
      title: 'Categories',
      icon: 'category',
      onPress: () => handleMenuPress('Categories'),
    },
    {
      id: 'cart',
      title: 'My Cart',
      icon: 'shopping-cart',
      badge: 3,
      onPress: () => handleMenuPress('Cart'),
    },
    {
      id: 'wishlist',
      title: 'Wish List',
      icon: 'favorite',
      badge: 12,
      onPress: () => handleMenuPress('Wishlist'),
    },
    {
      id: 'feed',
      title: 'Feed',
      icon: 'dynamic-feed',
      onPress: () => handleMenuPress('Feed'),
    },
    {
      id: 'messages',
      title: 'Messages',
      icon: 'message',
      badge: 5,
      onPress: () => handleMenuPress('Messages'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      badge: 8,
      onPress: () => handleMenuPress('Notifications'),
    },
    {
      id: 'gallery',
      title: 'Gallery',
      icon: 'photo-library',
      onPress: () => handleMenuPress('Gallery'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      onPress: () => handleMenuPress('Settings'),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'logout',
      isDanger: true,
      onPress: () => handleLogout(),
    },
  ];

  // Handle menu item press
  const handleMenuPress = (screen: string) => {
    onClose();
    setTimeout(() => {
      if (navigation) {
        navigation.navigate(screen);
      } else {
        Alert.alert('Navigation', `Navigate to ${screen} screen`);
      }
    }, 300);
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          onClose();
          // Add logout logic here
          Alert.alert('Success', 'Logged out successfully');
        },
      },
    ]);
  };

  // Handle hardware back button on Android
  useEffect(() => {
    const backAction = () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isVisible, onClose]);

  // Open/close bottom sheet based on visibility
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Format number for display
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  // Render user profile section
  const renderUserProfile = () => (
    <LinearGradient colors={['#3B82F6', '#1D4ED8']} className='mx-4 rounded-2xl p-6 mb-6'>
      <View className='flex-row items-center'>
        <Image source={{ uri: currentUser.avatar }} className='w-16 h-16 rounded-full border-3 border-white' />
        <View className='flex-1 ml-4'>
          <Text className='text-white text-lg font-bold'>{currentUser.name}</Text>
          <Text className='text-white/80 text-sm mt-1'>{currentUser.email}</Text>
        </View>
        <TouchableOpacity
          className='w-8 h-8 bg-white/20 rounded-full items-center justify-center'
          onPress={() => handleMenuPress('Profile')}
        >
          <Icon iconStyle='solid' name='chevron-right' size={20} color='white' />
        </TouchableOpacity>
      </View>

      {/* User Stats */}
      <View className='flex-row justify-around mt-6 pt-4 border-t border-white/20'>
        <View className='items-center'>
          <Text className='text-white text-lg font-bold'>{currentUser.stats.posts}</Text>
          <Text className='text-white/80 text-xs mt-1'>Posts</Text>
        </View>
        <View className='items-center'>
          <Text className='text-white text-lg font-bold'>{formatNumber(currentUser.stats.followers)}</Text>
          <Text className='text-white/80 text-xs mt-1'>Followers</Text>
        </View>
        <View className='items-center'>
          <Text className='text-white text-lg font-bold'>{formatNumber(currentUser.stats.following)}</Text>
          <Text className='text-white/80 text-xs mt-1'>Following</Text>
        </View>
      </View>
    </LinearGradient>
  );

  // Render menu item
  const renderMenuItem = (item: MenuItem, index: number) => (
    <TouchableOpacity
      key={item.id}
      className='flex-row items-center px-6 py-4 border-b border-gray-100'
      onPress={item.onPress}
      style={{ opacity: 1 }}
    >
      <View
        className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
          item.isDanger ? 'bg-red-100' : 'bg-blue-100'
        }`}
      >
        <Icon iconStyle='solid' name={item.icon as any} size={24} color={item.isDanger ? '#EF4444' : '#3B82F6'} />
      </View>

      <View className='flex-1'>
        <Text className={`text-base font-semibold ${item.isDanger ? 'text-red-600' : 'text-gray-900'}`}>
          {item.title}
        </Text>
      </View>

      {item.badge && (
        <View className='w-6 h-6 bg-red-500 rounded-full items-center justify-center mr-2'>
          <Text className='text-white text-xs font-bold'>{item.badge > 99 ? '99+' : item.badge}</Text>
        </View>
      )}

      <Icon iconStyle='solid' name='chevron-right' size={20} color='#9CA3AF' />
    </TouchableOpacity>
  );

  if (!isVisible) {
    return null;
  }

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleIndicatorStyle={{
          backgroundColor: '#D1D5DB',
          width: 40,
        }}
        backgroundStyle={{
          backgroundColor: '#F9FAFB',
        }}
      >
        <BottomSheetView className='flex-1'>
          {/* Header */}
          <View className='flex-row items-center justify-between px-6 py-4 border-b border-gray-200'>
            <Text className='text-xl font-bold text-gray-900'>Menu</Text>
            <TouchableOpacity
              onPress={onClose}
              className='w-8 h-8 bg-gray-200 rounded-full items-center justify-center'
            >
              <Icon iconStyle='solid' name='x' size={20} color='#374151' />
            </TouchableOpacity>
          </View>

          {/* User Profile Section */}
          {renderUserProfile()}

          {/* Menu Items */}
          <View className='flex-1'>{menuItems.map((item, index) => renderMenuItem(item, index))}</View>

          {/* Version Info */}
          <View className='px-6 py-4 border-t border-gray-200'>
            <Text className='text-center text-sm text-gray-500'>Version 1.0.0</Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default MenuScreen;
