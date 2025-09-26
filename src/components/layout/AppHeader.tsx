// components/AppHeader.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderProps } from './header.types';

const AppHeader: React.FC<HeaderProps> = ({
  variant,
  backgroundColor = 'transparent',
  useSafeArea = true,
  user,
  onSearch,
  onNotification,
  notificationBadge = 0,
  title,
  onBack,
  actions = [],
  greeting,
  className = '',
  titleClassName = '',
}) => {
  const insets = useSafeAreaInsets();

  const headerHeight = Platform.OS === 'ios' ? 44 : 56;
  const totalHeight = useSafeArea ? headerHeight : headerHeight + insets.top;

  const renderBadge = (count: number) => {
    if (count === 0) return null;

    return (
      <View className='absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center'>
        <Text className='text-white text-xs font-medium'>{count > 99 ? '99+' : count}</Text>
      </View>
    );
  };

  const renderHomeHeader = () => (
    <View className={`flex-row items-center justify-between px-4 ${className}`}>
      <View className='flex-1'>
        <Text className='text-gray-900 text-lg font-medium'>Hello, {user?.name}</Text>
        {user?.date && <Text className='text-gray-500 text-sm mt-0.5'>{user.date}</Text>}
      </View>

      <View className='flex-row items-center gap-4'>
        {onSearch && (
          <TouchableOpacity onPress={onSearch} className='w-10 h-10 items-center justify-center' testID='search-button'>
            <Icon iconStyle='solid' name='magnifying-glass' size={24} color='#6B7280' />
          </TouchableOpacity>
        )}

        {onNotification && (
          <TouchableOpacity
            onPress={onNotification}
            className='w-10 h-10 items-center justify-center relative'
            testID='notification-button'
          >
            <Icon iconStyle='solid' name='bell' size={24} color='#6B7280' />
            {renderBadge(notificationBadge)}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderProfileHeader = () => (
    <View className={`flex-row items-center justify-between px-4 ${className}`}>
      <View className='flex-row items-center flex-1'>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            className='w-10 h-10 items-center justify-center -ml-2 mr-2'
            testID='back-button'
          >
            <Icon iconStyle='solid' name='chevron-left' size={24} color='#374151' />
          </TouchableOpacity>
        )}

        <Text className={`text-gray-900 text-lg font-medium flex-1 ${titleClassName}`}>{title}</Text>
      </View>

      <View className='flex flex-row items-center gap-2'>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            onPress={action.onPress}
            className='w-10 h-10 items-center justify-center relative'
            testID={action.testID}
          >
            <Icon iconStyle='solid' name={action.icon as any} size={24} color='#6B7280' />
            {action.badge && renderBadge(action.badge)}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderListHeader = () => (
    <View className={`flex flex-row items-center justify-between px-4 ${className}`}>
      <View className='flex flex-row items-center flex-1'>
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            className='w-10 h-10 items-center justify-center -ml-2 mr-2'
            testID='back-button'
          >
            <Icon iconStyle='solid' name='chevron-left' size={24} color='#374151' />
          </TouchableOpacity>
        )}

        <Text className={`text-gray-900 text-lg font-semibold flex-1 text-center ${titleClassName}`}>{title}</Text>

        <View className='w-10' />
      </View>

      {actions.length > 0 && (
        <View className='flex-row items-center gap-2 absolute right-4'>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              className='w-10 h-10 items-center justify-center relative'
              testID={action.testID}
            >
              <Icon iconStyle='solid' name={action.icon as any} size={24} color='#6B7280' />
              {action.badge && renderBadge(action.badge)}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderSimpleHeader = () => (
    <View className={`flex-row items-center px-4 ${className}`}>
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          className='w-10 h-10 items-center justify-center -ml-2 mr-2'
          testID='back-button'
        >
          <Icon iconStyle='solid' name='chevron-left' size={24} color='#374151' />
        </TouchableOpacity>
      )}

      <View className='flex-1'>
        <Text className='text-gray-900 text-lg font-medium'>{greeting || title}</Text>
      </View>

      {actions.length > 0 && (
        <View className='flex-row items-center gap-2'>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              className='w-10 h-10 items-center justify-center relative'
              testID={action.testID}
            >
              <Icon iconStyle='solid' name={action.icon as any} size={24} color='#6B7280' />
              {action.badge && renderBadge(action.badge)}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderHeaderContent = () => {
    switch (variant) {
      case 'home':
        return renderHomeHeader();
      case 'profile':
        return renderProfileHeader();
      case 'list':
        return renderListHeader();
      case 'simple':
        return renderSimpleHeader();
      default:
        return renderSimpleHeader();
    }
  };

  return (
    <>
      <View
        style={{
          height: totalHeight,
          backgroundColor,
          paddingTop: useSafeArea ? 0 : insets.top,
        }}
        className='z-50'
      >
        <View style={{ height: headerHeight }} className='justify-center'>
          {renderHeaderContent()}
        </View>
      </View>
    </>
  );
};

export default AppHeader;
