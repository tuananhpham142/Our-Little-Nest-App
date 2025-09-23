// components/FloatingBottomNavigation.tsx
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingBottomNavProps, isNavigationProps, TabItem } from './bottom-navigation.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FloatingBottomNavigation: React.FC<FloatingBottomNavProps> = (props) => {
  const insets = useSafeAreaInsets();

  // Determine if we're using React Navigation or standalone
  const isReactNavigation = isNavigationProps(props);

  // Extract relevant data based on usage type
  const getNavigationData = () => {
    if (isReactNavigation) {
      const { navigation: navProps, tabConfig, ...styleProps } = props;
      const { state, navigation } = navProps;

      // Convert React Navigation state to our tab format
      const tabs: TabItem[] = state.routes.map((route) => {
        const config = tabConfig[route.name] || {
          label: route.name,
        };

        return {
          id: route.name,
          icon: config.icon,
          activeIcon: config.activeIcon || config.icon,
          label: config.label,
          tabId: config.tabId,
        };
      });

      const activeTab = state.routes[state.index].name;
      const onTabChange = (tabId: string) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: state.routes.find((r) => r.name === tabId)?.key,
          canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
          navigation.navigate(tabId);
        }
      };

      return {
        tabs,
        activeTab,
        onTabChange,
        ...styleProps,
      };
    } else {
      // Standalone usage
      return {
        tabs: props.tabs || [],
        activeTab: props.activeTab,
        onTabChange: props.onTabChange,
        backgroundColor: props.backgroundColor,
        activeColor: props.activeColor,
        inactiveColor: props.inactiveColor,
        showLabels: props.showLabels,
        animationDuration: props.animationDuration,
        className: props.className,
      };
    }
  };

  const {
    tabs,
    activeTab,
    onTabChange,
    backgroundColor = '#1F2937',
    activeColor = '#10B981',
    inactiveColor = '#9CA3AF',
    showLabels = false,
    animationDuration = 300,
    className = '',
  } = getNavigationData();

  // Animation values for each tab
  const scaleAnimations = useRef(tabs.map(() => new Animated.Value(1))).current;

  const opacityAnimations = useRef(tabs.map(() => new Animated.Value(0.7))).current;

  // Active indicator position animation
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = (SCREEN_WIDTH - 64) / tabs.length; // 32px margin on each side

  // Update animations when activeTab changes
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

    // Animate indicator to active tab position
    Animated.timing(indicatorPosition, {
      toValue: activeIndex * indicatorWidth,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();

    // Animate all tabs
    tabs.forEach((_, index) => {
      const isActive = index === activeIndex;

      // Scale animation
      Animated.timing(scaleAnimations[index], {
        toValue: isActive ? 1.2 : 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();

      // Opacity animation
      Animated.timing(opacityAnimations[index], {
        toValue: isActive ? 1 : 0.7,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab, tabs, animationDuration, indicatorPosition, scaleAnimations, opacityAnimations, indicatorWidth]);

  // Update animation arrays when tabs change
  useEffect(() => {
    // Adjust animation arrays if tabs length changed
    while (scaleAnimations.length < tabs.length) {
      scaleAnimations.push(new Animated.Value(1));
      opacityAnimations.push(new Animated.Value(0.7));
    }
    while (scaleAnimations.length > tabs.length) {
      scaleAnimations.pop();
      opacityAnimations.pop();
    }
  }, [tabs.length, scaleAnimations, opacityAnimations]);

  const handleTabPress = (tabId: string, index: number) => {
    // Haptic feedback for better UX
    if (Platform.OS === 'ios') {
      // For iOS, you might want to add haptic feedback
      // const { impactAsync, ImpactFeedbackStyle } = require('expo-haptics');
      // impactAsync(ImpactFeedbackStyle.Light);
    }

    onTabChange(tabId);
  };

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = tab.id === activeTab;
    const iconName = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;

    return (
      <TouchableOpacity
        key={tab.id}
        onPress={() => handleTabPress(tab.id, index)}
        activeOpacity={0.7}
        testID={tab.tabId}
        className='flex-1 items-center justify-center py-2'
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnimations[index] || new Animated.Value(1) }],
            opacity: opacityAnimations[index] || new Animated.Value(0.5),
          }}
          className='items-center'
        >
          <Icon name={iconName as any} size={18} iconStyle='solid' color={isActive ? activeColor : inactiveColor} />

          {showLabels && (
            <Text
              className='text-xs mt-1'
              style={{
                color: isActive ? activeColor : inactiveColor,
                fontWeight: isActive ? '600' : '400',
              }}
            >
              {tab.label}
            </Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      className={`absolute bottom-0 left-0 right-0 ${className}`}
      style={{
        paddingBottom: insets.bottom + 16,
        paddingHorizontal: 32,
      }}
      pointerEvents='box-none'
    >
      {/* Main Navigation Container */}
      <View
        className='rounded-2xl shadow-2xl'
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background

          // Shadow for iOS
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          // Elevation for Android
          elevation: 16,
        }}
      >
        {/* Active Tab Indicator */}
        <Animated.View
          className='absolute top-0 h-1 bg-current rounded-full'
          style={{
            width: indicatorWidth * 0.6,
            left: indicatorPosition.interpolate({
              inputRange: [0, indicatorWidth],
              outputRange: [indicatorWidth * 0.2, indicatorWidth * 1.2],
            }),
            backgroundColor: activeColor,
          }}
        />

        {/* Tab Bar */}
        <View className='flex-row' style={{ height: showLabels ? 72 : 56 }}>
          {tabs.map((tab, index) => renderTab(tab, index))}
        </View>
      </View>
    </View>
  );
};

export default FloatingBottomNavigation;
