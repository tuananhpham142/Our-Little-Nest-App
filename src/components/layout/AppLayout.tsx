// components/AppLayout.tsx
import React from 'react';
import { ActivityIndicator, ImageBackground, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from './AppHeader';
import { AppLayoutProps } from './layout.types';

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  useSafeArea = true,
  header,
  customHeader,
  scrollable = false,
  showsVerticalScrollIndicator = true,
  backgroundColor = '#FFFFFF',
  backgroundImage,
  padding = false,
  paddingHorizontal = false,
  paddingVertical = false,
  className = '',
  contentClassName = '',
  style,
  scrollViewProps = {},
  loading = false,
  error = null,
  refreshing = false,
  onRefresh,
}) => {
  const insets = useSafeAreaInsets();

  // Calculate content padding classes
  const getPaddingClasses = () => {
    const classes: string[] = [];

    if (padding) {
      classes.push('p-4');
    } else {
      if (paddingHorizontal) classes.push('px-4');
      if (paddingVertical) classes.push('py-4');
    }

    return classes.join(' ');
  };

  const contentPaddingClasses = getPaddingClasses();

  // Render loading state
  const renderLoading = () => (
    <View className='flex-1 items-center justify-center bg-white'>
      <ActivityIndicator size='large' color='#10B981' />
      <Text className='text-gray-600 mt-4 text-base'>Loading...</Text>
    </View>
  );

  // Render error state
  const renderError = () => (
    <View className='flex-1 items-center justify-center bg-white px-6'>
      <Text className='text-red-600 text-lg font-semibold mb-2'>Something went wrong</Text>
      <Text className='text-gray-600 text-center text-base'>{error}</Text>
    </View>
  );

  // Render content based on scrollable option
  const renderContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();

    if (scrollable) {
      const refreshControl = onRefresh ? (
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#10B981']} tintColor='#10B981' />
      ) : undefined;

      return (
        <ScrollView
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          refreshControl={refreshControl}
          contentContainerStyle={{ flexGrow: 1 }}
          className={`flex-1 ${contentClassName}`}
          {...scrollViewProps}
        >
          <View style={style} className={`${contentPaddingClasses} flex-1`}>
            {children}
          </View>
        </ScrollView>
      );
    }

    return (
      <View style={[style, { flex: 1 }]} className={`${contentPaddingClasses} ${contentClassName}`}>
        {children}
      </View>
    );
  };

  // Render header based on props
  const renderHeader = () => {
    if (customHeader) {
      return customHeader();
    }

    if (header) {
      return <AppHeader {...header} />;
    }

    return null;
  };

  // Main layout container
  const layoutContainer = (
    <View className={`flex-1 ${className}`} style={[{ backgroundColor, paddingTop: useSafeArea ? insets.top : 0 }]}>
      {/* Header */}
      {renderHeader()}

      {/* Content */}
      {renderContent()}
    </View>
  );

  // Wrap with background image if provided
  if (backgroundImage) {
    return (
      <ImageBackground source={{ uri: backgroundImage }} style={{ flex: 1 }} resizeMode='cover'>
        {layoutContainer}
      </ImageBackground>
    );
  }

  return layoutContainer;
};

export default AppLayout;
