import AppLayout from '@/components/layout/AppLayout';
import Icon from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SectionHeader, SettingItem } from './components/CommonComponents';

interface SettingsScreenProps {
  navigation?: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  // Notification Settings State

  // Privacy Settings State

  const handleProfilePress = () => {
    // Navigate to profile screen
    navigation?.navigate('Profile');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This would open the password change screen');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'This would open the privacy policy screen');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'This would open the terms of service screen');
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'Are you sure you want to delete your account? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive' },
    ]);
  };

  return (
    <AppLayout paddingVertical>
      <ScrollView className='flex-1 bg-gray-50'>
        {/* Profile Section */}
        <SectionHeader title='Profile' />

        <TouchableOpacity
          className='flex-row items-center px-4 py-4 bg-white border-b border-gray-100'
          onPress={handleProfilePress}
        >
          <Image
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=user' }}
            className='w-12 h-12 rounded-full mr-4'
          />
          <View className='flex-1'>
            <Text className='text-base font-semibold text-gray-900'>Creative Jeff</Text>
            <Text className='text-sm text-gray-500'>creativejeff@gmail.com</Text>
          </View>
          <Icon iconStyle='solid' name='chevron-right' size={20} color='#9CA3AF' />
        </TouchableOpacity>

        <SettingItem
          title='Edit Profile'
          subtitle='Update your personal information'
          icon='person'
          showArrow
          onPress={() => Alert.alert('Edit Profile', 'Navigate to edit profile screen')}
        />

        <SettingItem
          title='Account Settings'
          subtitle='Manage your account preferences'
          icon='settings'
          showArrow
          onPress={() => Alert.alert('Account Settings', 'Navigate to account settings')}
        />

        {/* Languages Settings */}
        <SettingItem
          title='Languages'
          subtitle='Choose your languages appearance'
          icon='language'
          onPress={() => navigation.navigate('LanguageSettings')}
        />

        {/* Notification Settings */}
        <SettingItem
          title='Notifications'
          subtitle='Receive notifications on your device'
          icon='notifications'
          onPress={() => navigation.navigate('NotificationsSettings')}
        />

        {/* Privacy & Security */}
        <SectionHeader title='Privacy & Security' />

        <SettingItem
          title='Privacy & Security'
          subtitle='Make your profile visible to others'
          icon='visibility'
          onPress={() => navigation.navigate('PrivacySecuritySettings')}
        />

        <SettingItem
          title='Privacy Policy'
          subtitle='Read our privacy policy'
          icon='policy'
          showArrow
          onPress={handlePrivacyPolicy}
        />

        <SettingItem
          title='Terms of Service'
          subtitle='Read our terms of service'
          icon='gavel'
          showArrow
          onPress={handleTermsOfService}
        />

        {/* Danger Zone */}
        <SectionHeader title='Danger Zone' />

        <TouchableOpacity
          className='flex-row items-center px-4 py-4 bg-white border-b border-gray-100'
          onPress={handleDeleteAccount}
        >
          <View className='w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4'>
            <Icon iconStyle='solid' name='trash' size={20} color='#EF4444' />
          </View>

          <View className='flex-1'>
            <Text className='text-base font-semibold text-red-600'>Delete Account</Text>
            <Text className='text-sm text-gray-500 mt-1'>Permanently delete your account and data</Text>
          </View>

          <Icon iconStyle='solid' name='chevron-right' size={20} color='#9CA3AF' />
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View className='h-6' />
      </ScrollView>
    </AppLayout>
  );
};

export default SettingsScreen;
