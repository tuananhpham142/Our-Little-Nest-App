import { CustomSwitch } from '@/components/Switch';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// ===== CUSTOM HEADER COMPONENT =====
// interface CustomHeaderProps {
//   title: string;
//   navigation?: any;
//   showBackButton?: boolean;
//   rightButtonText?: string;
//   rightButtonIcon?: string;
//   onRightButtonPress?: () => void;
//   backgroundColor?: string;
//   textColor?: string;
//   borderColor?: string;
// }

// export const CustomHeader: React.FC<CustomHeaderProps> = ({
//   title,
//   navigation,
//   showBackButton = true,
//   rightButtonText,
//   rightButtonIcon,
//   onRightButtonPress,
//   backgroundColor = '#FFFFFF',
//   textColor = '#374151',
//   borderColor = '#E5E7EB',
// }) => (
//   <SafeAreaView style={{ backgroundColor }}>
//     <View
//       className='flex-row items-center justify-between px-4 py-3 border-b'
//       style={{ borderBottomColor: borderColor }}
//     >
//       {showBackButton ? (
//         <TouchableOpacity onPress={() => navigation?.goBack()} className='w-10 h-10 items-center justify-center'>
//           <Icon iconStyle='solid' name='chevron-left' size={24} color={textColor} />
//         </TouchableOpacity>
//       ) : (
//         <View className='w-10 h-10' />
//       )}

//       <Text className='text-lg font-semibold' style={{ color: textColor }}>
//         {title}
//       </Text>

//       {rightButtonText || rightButtonIcon ? (
//         <TouchableOpacity onPress={onRightButtonPress} className='px-3 py-1'>
//           {rightButtonIcon ? (
//             <Icon iconStyle='solid' name={rightButtonIcon as any} size={20} color='#3B82F6' />
//           ) : (
//             <Text className='text-blue-500 font-medium'>{rightButtonText}</Text>
//           )}
//         </TouchableOpacity>
//       ) : (
//         <View className='w-10 h-10' />
//       )}
//     </View>
//   </SafeAreaView>
// );

// ===== SECTION HEADER COMPONENT =====
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  backgroundColor = '#F9FAFB',
  textColor = '#6B7280',
}) => (
  <View className='px-4 py-3' style={{ backgroundColor }}>
    <Text className='text-sm font-semibold uppercase tracking-wide' style={{ color: textColor }}>
      {title}
    </Text>
    {subtitle && (
      <Text className='text-xs mt-1' style={{ color: textColor }}>
        {subtitle}
      </Text>
    )}
  </View>
);

// ===== SETTING ITEM COMPONENT =====
interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  rightText?: string;
  showArrow?: boolean;
  iconColor?: string;
  iconBackgroundColor?: string;
  isWarning?: boolean;
  isDisabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  icon,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  rightText,
  showArrow = false,
  iconColor = '#3B82F6',
  iconBackgroundColor,
  isWarning = false,
  isDisabled = false,
  textColor = '#1F2937',
  borderColor = '#F3F4F6',
}) => {
  const getIconBackgroundColor = () => {
    if (iconBackgroundColor) return iconBackgroundColor;
    if (isWarning) return '#FEE2E2';
    return '#DBEAFE';
  };

  const getTextColor = () => {
    if (isWarning) return '#DC2626';
    return textColor;
  };

  return (
    <TouchableOpacity
      className='flex-row justify-start items-center px-4 py-4 border-b '
      style={{
        borderBottomColor: borderColor,
        opacity: isDisabled ? 0.6 : 1,
      }}
      onPress={onPress}
      disabled={hasSwitch || isDisabled}
    >
      <View
        className='w-10 h-10 rounded-full items-center justify-center mr-4'
        style={{ backgroundColor: getIconBackgroundColor() }}
      >
        <Icon iconStyle='solid' name={icon as any} size={20} color={iconColor} />
      </View>

      <View className='flex-1'>
        <Text className='text-base font-semibold' style={{ color: getTextColor() }}>
          {title}
        </Text>
        {subtitle && (
          <Text className='text-sm mt-1' style={{ color: '#6B7280' }}>
            {subtitle}
          </Text>
        )}
      </View>

      <View>
        {hasSwitch && (
          <CustomSwitch value={switchValue} onValueChange={onSwitchChange ? onSwitchChange : () => {}} />
          // <Switch
          //   className='pe-2'
          //   value={switchValue}
          //   onValueChange={onSwitchChange}
          //   trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
          //   thumbColor={switchValue ? '#3B82F6' : '#F3F4F6'}
          //   disabled={isDisabled}
          // />
        )}

        {rightText && <Text className='text-sm text-gray-500'>{rightText}</Text>}

        {showArrow && <Icon iconStyle='solid' name='chevron-right' size={20} color='#9CA3AF' />}
      </View>
    </TouchableOpacity>
  );
};

// ===== ADDITIONAL UTILITY COMPONENTS =====

// Loading Setting Item
interface LoadingSettingItemProps {
  title?: string;
  hasIcon?: boolean;
  hasSwitch?: boolean;
}

export const LoadingSettingItem: React.FC<LoadingSettingItemProps> = ({
  title = 'Loading...',
  hasIcon = true,
  hasSwitch = false,
}) => (
  <View className='flex-row items-center px-4 py-4 bg-white border-b border-gray-100'>
    {hasIcon && <View className='w-10 h-10 bg-gray-200 rounded-full mr-4 animate-pulse' />}

    <View className='flex-1'>
      <View className='h-4 bg-gray-200 rounded w-3/4 animate-pulse' />
      <View className='h-3 bg-gray-100 rounded w-1/2 mt-2 animate-pulse' />
    </View>

    {hasSwitch && <View className='w-12 h-6 bg-gray-200 rounded-full animate-pulse' />}
  </View>
);

// Empty State Component
interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, actionText, onActionPress }) => (
  <View className='flex-1 items-center justify-center py-12 px-6'>
    <Icon iconStyle='solid' name={icon as any} size={64} color='#9CA3AF' />
    <Text className='text-xl font-semibold text-gray-700 mt-4 text-center'>{title}</Text>
    {subtitle && <Text className='text-gray-500 text-center mt-2 leading-6'>{subtitle}</Text>}
    {actionText && onActionPress && (
      <TouchableOpacity className='bg-blue-500 px-6 py-3 rounded-lg mt-6' onPress={onActionPress}>
        <Text className='text-white font-semibold'>{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Info Card Component
interface InfoCardProps {
  icon: string;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  onPress?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({ icon, title, message, type = 'info', onPress }) => {
  const getColors = () => {
    switch (type) {
      case 'warning':
        return { bg: 'bg-yellow-50', icon: '#F59E0B', title: 'text-yellow-900', text: 'text-yellow-700' };
      case 'success':
        return { bg: 'bg-green-50', icon: '#10B981', title: 'text-green-900', text: 'text-green-700' };
      case 'error':
        return { bg: 'bg-red-50', icon: '#EF4444', title: 'text-red-900', text: 'text-red-700' };
      default:
        return { bg: 'bg-blue-50', icon: '#3B82F6', title: 'text-blue-900', text: 'text-blue-700' };
    }
  };

  const colors = getColors();

  const CardContent = () => (
    <View className={`px-4 py-6 mx-4 mt-6 rounded-lg ${colors.bg}`}>
      <View className='flex-row items-start'>
        <Icon iconStyle='solid' name={icon as any} size={20} color={colors.icon} />
        <View className='flex-1 ml-3'>
          <Text className={`text-sm font-medium ${colors.title}`}>{title}</Text>
          <Text className={`text-sm mt-1 leading-5 ${colors.text}`}>{message}</Text>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};
