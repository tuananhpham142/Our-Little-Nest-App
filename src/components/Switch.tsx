import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface CustomSwitchProps {
  // Core functionality
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;

  // Size variants
  size?: 'small' | 'medium' | 'large';

  // Color customization
  trackColorOn?: string;
  trackColorOff?: string;
  thumbColorOn?: string;
  thumbColorOff?: string;

  // Icon options
  showIcons?: boolean;
  iconOn?: string;
  iconOff?: string;
  iconColorOn?: string;
  iconColorOff?: string;

  // Border options
  borderWidth?: number;
  borderColorOn?: string;
  borderColorOff?: string;

  // Animation
  animationDuration?: number;

  // Style overrides
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  trackColorOn = '#3B82F6',
  trackColorOff = '#E5E7EB',
  thumbColorOn = '#FFFFFF',
  thumbColorOff = '#FFFFFF',
  showIcons = true,
  iconOn = 'check',
  iconOff = 'close',
  iconColorOn = '#3B82F6',
  iconColorOff = '#9CA3AF',
  borderWidth = 0,
  borderColorOn = 'transparent',
  borderColorOff = 'transparent',
  animationDuration = 200,
  style,
  trackStyle,
  thumbStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Size configurations
  const sizeConfig = {
    small: {
      trackWidth: 44,
      trackHeight: 24,
      thumbSize: 20,
      padding: 2,
      iconSize: 12,
    },
    medium: {
      trackWidth: 52,
      trackHeight: 28,
      thumbSize: 24,
      padding: 2,
      iconSize: 14,
    },
    large: {
      trackWidth: 60,
      trackHeight: 32,
      thumbSize: 28,
      padding: 2,
      iconSize: 16,
    },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: animationDuration,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, animationDuration]);

  const handlePress = () => {
    if (disabled) return;

    // Add press animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onValueChange(!value);
  };

  // Animated styles
  const trackBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [trackColorOff, trackColorOn],
  });

  const thumbBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [thumbColorOff, thumbColorOn],
  });

  const thumbTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [config.padding, config.trackWidth - config.thumbSize - config.padding],
  });

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [borderColorOff, borderColorOn],
  });

  const iconOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const iconRotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      accessibilityRole='switch'
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Animated.View
        style={[
          {
            width: config.trackWidth,
            height: config.trackHeight,
            borderRadius: config.trackHeight / 2,
            backgroundColor: trackBackgroundColor,
            borderWidth,
            borderColor,
            justifyContent: 'center',
            transform: [{ scale: scaleValue }],
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: config.thumbSize,
              height: config.thumbSize,
              borderRadius: config.thumbSize / 2,
              backgroundColor: thumbBackgroundColor,
              transform: [{ translateX: thumbTranslateX }],
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            },
            thumbStyle,
          ]}
        >
          {showIcons && (
            <Animated.View
              style={{
                opacity: iconOpacity,
                transform: [{ rotate: iconRotation }],
              }}
            >
              <Icon
                iconStyle='solid'
                name={value ? (iconOn as any) : (iconOff as any)}
                size={config.iconSize}
                color={value ? iconColorOn : iconColorOff}
              />
            </Animated.View>
          )}
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Preset variants for common use cases
export const SwitchVariants = {
  // iOS-style switch
  ios: {
    trackColorOn: '#34C759',
    trackColorOff: '#E5E7EB',
    thumbColorOn: '#FFFFFF',
    thumbColorOff: '#FFFFFF',
    showIcons: false,
  },

  // Material Design style
  material: {
    trackColorOn: '#3B82F6',
    trackColorOff: '#E5E7EB',
    thumbColorOn: '#FFFFFF',
    thumbColorOff: '#FFFFFF',
    showIcons: true,
    iconOn: 'check',
    iconOff: 'close',
  },

  // Success/Error style
  success: {
    trackColorOn: '#10B981',
    trackColorOff: '#EF4444',
    thumbColorOn: '#FFFFFF',
    thumbColorOff: '#FFFFFF',
    showIcons: true,
    iconOn: 'check',
    iconOff: 'close',
    iconColorOn: '#10B981',
    iconColorOff: '#EF4444',
  },

  // Dark theme style
  dark: {
    trackColorOn: '#60A5FA',
    trackColorOff: '#374151',
    thumbColorOn: '#1F2937',
    thumbColorOff: '#6B7280',
    showIcons: true,
    iconOn: 'check',
    iconOff: 'close',
    iconColorOn: '#60A5FA',
    iconColorOff: '#9CA3AF',
  },

  // Minimal style
  minimal: {
    trackColorOn: 'transparent',
    trackColorOff: 'transparent',
    thumbColorOn: '#3B82F6',
    thumbColorOff: '#E5E7EB',
    borderWidth: 2,
    borderColorOn: '#3B82F6',
    borderColorOff: '#E5E7EB',
    showIcons: false,
  },

  // Custom icon style
  customIcon: {
    trackColorOn: '#8B5CF6',
    trackColorOff: '#E5E7EB',
    thumbColorOn: '#FFFFFF',
    thumbColorOff: '#FFFFFF',
    showIcons: true,
    iconOn: 'favorite',
    iconOff: 'favorite-border',
    iconColorOn: '#8B5CF6',
    iconColorOff: '#9CA3AF',
  },

  // Security style
  security: {
    trackColorOn: '#059669',
    trackColorOff: '#DC2626',
    thumbColorOn: '#FFFFFF',
    thumbColorOff: '#FFFFFF',
    showIcons: true,
    iconOn: 'lock',
    iconOff: 'lock-open',
    iconColorOn: '#059669',
    iconColorOff: '#DC2626',
  },

  // Notification style
  notification: {
    trackColorOn: '#F59E0B',
    trackColorOff: '#6B7280',
    thumbColorOn: '#FFFFFF',
    thumbColorOff: '#FFFFFF',
    showIcons: true,
    iconOn: 'notifications',
    iconOff: 'notifications-off',
    iconColorOn: '#F59E0B',
    iconColorOff: '#6B7280',
  },
};

// Theme-aware switch component
interface ThemedSwitchProps
  extends Omit<CustomSwitchProps, 'trackColorOn' | 'trackColorOff' | 'thumbColorOn' | 'thumbColorOff'> {
  variant?: keyof typeof SwitchVariants;
  useTheme?: boolean;
}

export const ThemedSwitch: React.FC<ThemedSwitchProps> = ({ variant = 'material', useTheme = true, ...props }) => {
  // This would integrate with your theme context
  // const { colors, isDarkMode } = useTheme();

  // For now, using default colors - replace with your theme context
  const isDarkMode = false; // Replace with actual theme state

  let variantProps = SwitchVariants[variant];

  if (useTheme && isDarkMode) {
    variantProps = SwitchVariants.dark;
  }

  return <CustomSwitch {...variantProps} {...props} />;
};

// Quick access components for common cases
export const IOSSwitch: React.FC<Omit<CustomSwitchProps, keyof typeof SwitchVariants.ios>> = (props) => (
  <CustomSwitch {...SwitchVariants.ios} {...props} />
);

export const MaterialSwitch: React.FC<Omit<CustomSwitchProps, keyof typeof SwitchVariants.material>> = (props) => (
  <CustomSwitch {...SwitchVariants.material} {...props} />
);

export const SuccessSwitch: React.FC<Omit<CustomSwitchProps, keyof typeof SwitchVariants.success>> = (props) => (
  <CustomSwitch {...SwitchVariants.success} {...props} />
);

export const SecuritySwitch: React.FC<Omit<CustomSwitchProps, keyof typeof SwitchVariants.security>> = (props) => (
  <CustomSwitch {...SwitchVariants.security} {...props} />
);

export const NotificationSwitch: React.FC<Omit<CustomSwitchProps, keyof typeof SwitchVariants.notification>> = (
  props,
) => <CustomSwitch {...SwitchVariants.notification} {...props} />;

// Example usage component
export const SwitchExamples: React.FC = () => {
  const [switches, setSwitches] = React.useState({
    basic: false,
    ios: true,
    success: false,
    security: true,
    notification: false,
    custom: false,
  });

  const updateSwitch = (key: string) => (value: boolean) => {
    setSwitches((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={{ padding: 20, gap: 20 }}>
      {/* Basic Material Switch */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Basic Material Switch</Text>
        <CustomSwitch value={switches.basic} onValueChange={updateSwitch('basic')} />
      </View>

      {/* iOS Style */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>iOS Style Switch</Text>
        <IOSSwitch value={switches.ios} onValueChange={updateSwitch('ios')} />
      </View>

      {/* Success/Error */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Success/Error Switch</Text>
        <SuccessSwitch value={switches.success} onValueChange={updateSwitch('success')} />
      </View>

      {/* Security */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Security Switch</Text>
        <SecuritySwitch value={switches.security} onValueChange={updateSwitch('security')} />
      </View>

      {/* Notification */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Notification Switch</Text>
        <NotificationSwitch value={switches.notification} onValueChange={updateSwitch('notification')} />
      </View>

      {/* Custom */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text>Custom Switch</Text>
        <CustomSwitch
          value={switches.custom}
          onValueChange={updateSwitch('custom')}
          size='large'
          trackColorOn='#FF6B6B'
          trackColorOff='#DDD'
          thumbColorOn='#FFF'
          thumbColorOff='#FFF'
          iconOn='favorite'
          iconOff='favorite-border'
          iconColorOn='#FF6B6B'
          iconColorOff='#999'
        />
      </View>
    </View>
  );
};
