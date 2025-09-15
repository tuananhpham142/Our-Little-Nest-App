import AppLayout from '@/components/layout/AppLayout';
import Icon from '@react-native-vector-icons/fontawesome6';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SectionHeader, SettingItem } from './components/CommonComponents';

interface PrivacySecuritySettingsScreenProps {
  navigation?: any;
  onPrivacySettingsChange?: (settings: PrivacySecuritySettings) => void;
}

interface PrivacySecuritySettings {
  profileVisibility: boolean;
  locationSharing: boolean;
  dataCollection: boolean;
  twoFactorAuth: boolean;
  biometricAuth: boolean;
  autoLock: boolean;
  autoLockTime: number;
  showOnlineStatus: boolean;
  shareAnalytics: boolean;
  personalizationData: boolean;
  contactSync: boolean;
  phoneNumberVisibility: 'everyone' | 'contacts' | 'nobody';
  emailVisibility: 'everyone' | 'contacts' | 'nobody';
  lastSeenVisibility: 'everyone' | 'contacts' | 'nobody';
}

const PrivacySecuritySettingsScreen: React.FC<PrivacySecuritySettingsScreenProps> = ({
  navigation,
  onPrivacySettingsChange,
}) => {
  // Privacy Settings State
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [dataCollection, setDataCollection] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalizationData, setPersonalizationData] = useState(true);
  const [contactSync, setContactSync] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  // Security Settings State
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState(5); // minutes

  // Visibility Settings
  const [phoneNumberVisibility, setPhoneNumberVisibility] = useState<'everyone' | 'contacts' | 'nobody'>('contacts');
  const [emailVisibility, setEmailVisibility] = useState<'everyone' | 'contacts' | 'nobody'>('contacts');
  const [lastSeenVisibility, setLastSeenVisibility] = useState<'everyone' | 'contacts' | 'nobody'>('contacts');

  const handleSettingsChange = useCallback(() => {
    const settings: PrivacySecuritySettings = {
      profileVisibility,
      locationSharing,
      dataCollection,
      twoFactorAuth,
      biometricAuth,
      autoLock,
      autoLockTime,
      showOnlineStatus,
      shareAnalytics,
      personalizationData,
      contactSync,
      phoneNumberVisibility,
      emailVisibility,
      lastSeenVisibility,
    };
    onPrivacySettingsChange?.(settings);
  }, [
    profileVisibility,
    locationSharing,
    dataCollection,
    twoFactorAuth,
    biometricAuth,
    autoLock,
    autoLockTime,
    showOnlineStatus,
    shareAnalytics,
    personalizationData,
    contactSync,
    phoneNumberVisibility,
    emailVisibility,
    lastSeenVisibility,
    onPrivacySettingsChange,
  ]);

  const getVisibilityText = (visibility: 'everyone' | 'contacts' | 'nobody') => {
    switch (visibility) {
      case 'everyone':
        return 'Everyone';
      case 'contacts':
        return 'My Contacts';
      case 'nobody':
        return 'Nobody';
      default:
        return 'My Contacts';
    }
  };

  return (
    <AppLayout
      header={{
        title: 'Privacy & Securities',
        variant: 'simple',
        onBack: () => navigation.goBack(),
      }}
    >
      <View className='flex-1'>
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {/* Security */}
          <SectionHeader title='Security' subtitle='Protect your account and data' />

          <SettingItem
            title='Two-Factor Authentication'
            subtitle='Add an extra layer of security'
            icon='security'
            hasSwitch
            switchValue={twoFactorAuth}
            onSwitchChange={setTwoFactorAuth}
            iconColor='#10B981'
          />

          <SettingItem
            title='Biometric Authentication'
            subtitle='Use fingerprint or face recognition'
            icon='fingerprint'
            hasSwitch
            switchValue={biometricAuth}
            onSwitchChange={setBiometricAuth}
            iconColor='#10B981'
          />

          <SettingItem
            title='Auto-Lock'
            subtitle='Automatically lock the app when inactive'
            icon='lock-clock'
            hasSwitch
            switchValue={autoLock}
            onSwitchChange={setAutoLock}
            iconColor='#10B981'
          />

          {autoLock && (
            <TouchableOpacity
              className='flex-row items-center px-4 py-4 bg-white border-b border-gray-100'
              onPress={() => Alert.alert('Auto-Lock Time', 'Set auto-lock time interval')}
            >
              <View className='w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4'>
                <Icon iconStyle='solid' name='clock' size={20} color='#10B981' />
              </View>

              <View className='flex-1'>
                <Text className='text-base font-semibold text-gray-900'>Auto-Lock Time</Text>
                <Text className='text-sm text-gray-500 mt-1'>{autoLockTime} minutes</Text>
              </View>

              <Icon iconStyle='solid' name='chevron-right' size={20} color='#9CA3AF' />
            </TouchableOpacity>
          )}

          {/* Privacy */}
          <SectionHeader title='Privacy' subtitle='Control what information you share' />

          <SettingItem
            title='Profile Visibility'
            subtitle='Make your profile visible to others'
            icon='visibility'
            hasSwitch
            switchValue={profileVisibility}
            onSwitchChange={setProfileVisibility}
            iconColor='#8B5CF6'
          />

          <SettingItem
            title='Show Online Status'
            subtitle="Let others see when you're online"
            icon='circle'
            hasSwitch
            switchValue={showOnlineStatus}
            onSwitchChange={setShowOnlineStatus}
            iconColor='#8B5CF6'
          />

          <TouchableOpacity
            className='flex-row items-center px-4 py-4 bg-white border-b border-gray-100'
            onPress={() => Alert.alert('Phone Number Visibility', 'Configure who can see your phone number')}
          >
            <View className='w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4'>
              <Icon iconStyle='solid' name='phone' size={20} color='#8B5CF6' />
            </View>

            <View className='flex-1'>
              <Text className='text-base font-semibold text-gray-900'>Phone Number</Text>
              <Text className='text-sm text-gray-500 mt-1'>{getVisibilityText(phoneNumberVisibility)}</Text>
            </View>

            <Icon iconStyle='solid' name='chevron-right' size={20} color='#9CA3AF' />
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-row items-center px-4 py-4 bg-white border-b border-gray-100'
            onPress={() => Alert.alert('Email Visibility', 'Configure who can see your email')}
          >
            <View className='w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4'>
              <Icon iconStyle='solid' name='envelope' size={20} color='#8B5CF6' />
            </View>

            <View className='flex-1'>
              <Text className='text-base font-semibold text-gray-900'>Email Address</Text>
              <Text className='text-sm text-gray-500 mt-1'>{getVisibilityText(emailVisibility)}</Text>
            </View>

            <Icon iconStyle='solid' name='chevron-right' size={20} color='#9CA3AF' />
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-row items-center px-4 py-4 bg-white border-b border-gray-100'
            onPress={() => Alert.alert('Last Seen', 'Configure who can see when you were last active')}
          >
            <View className='w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4'>
              <Icon iconStyle='solid' name='calendar' size={20} color='#8B5CF6' />
            </View>

            <View className='flex-1'>
              <Text className='text-base font-semibold text-gray-900'>Last Seen</Text>
              <Text className='text-sm text-gray-500 mt-1'>{getVisibilityText(lastSeenVisibility)}</Text>
            </View>

            <Icon iconStyle='solid' name='chevron-right' size={20} color='#9CA3AF' />
          </TouchableOpacity>

          {/* Data & Location */}
          <SectionHeader title='Data & Location' subtitle='Manage your data and location sharing' />

          <SettingItem
            title='Location Sharing'
            subtitle='Share your location with the app'
            icon='location-on'
            hasSwitch
            switchValue={locationSharing}
            onSwitchChange={setLocationSharing}
            iconColor='#F59E0B'
          />

          <SettingItem
            title='Contact Sync'
            subtitle='Sync your contacts to find friends'
            icon='contacts'
            hasSwitch
            switchValue={contactSync}
            onSwitchChange={setContactSync}
            iconColor='#F59E0B'
          />

          <SettingItem
            title='Analytics & Diagnostics'
            subtitle='Help improve the app by sharing usage data'
            icon='analytics'
            hasSwitch
            switchValue={shareAnalytics}
            onSwitchChange={setShareAnalytics}
            iconColor='#F59E0B'
          />

          <SettingItem
            title='Personalization Data'
            subtitle='Use your data to personalize your experience'
            icon='tune'
            hasSwitch
            switchValue={personalizationData}
            onSwitchChange={setPersonalizationData}
            iconColor='#F59E0B'
          />

          <SettingItem
            title='Data Collection'
            subtitle='Allow data collection for analytics'
            icon='data-usage'
            hasSwitch
            switchValue={dataCollection}
            onSwitchChange={setDataCollection}
            iconColor='#F59E0B'
          />

          {/* Account Security */}
          <SectionHeader title='Account Security' />

          <SettingItem
            title='Active Sessions'
            subtitle='Manage your active login sessions'
            icon='devices'
            showArrow
            onPress={() => Alert.alert('Active Sessions', 'View and manage active sessions')}
            iconColor='#6B7280'
          />

          <SettingItem
            title='Login History'
            subtitle='View your recent login activity'
            icon='history'
            showArrow
            onPress={() => Alert.alert('Login History', 'View login history')}
            iconColor='#6B7280'
          />

          <SettingItem
            title='Security Checkup'
            subtitle='Review your security settings'
            icon='security'
            showArrow
            onPress={() => Alert.alert('Security Checkup', 'Run security checkup')}
            iconColor='#6B7280'
          />

          {/* Danger Zone */}
          <SectionHeader title='Danger Zone' />

          <SettingItem
            title='Download My Data'
            subtitle='Request a copy of your data'
            icon='download'
            showArrow
            onPress={() => Alert.alert('Download Data', 'Request data download')}
            iconColor='#EF4444'
            isWarning
          />

          <SettingItem
            title='Deactivate Account'
            subtitle='Temporarily deactivate your account'
            icon='pause-circle'
            showArrow
            onPress={() => Alert.alert('Deactivate Account', 'Are you sure you want to deactivate your account?')}
            iconColor='#EF4444'
            isWarning
          />

          <SettingItem
            title='Delete Account'
            subtitle='Permanently delete your account and data'
            icon='delete-forever'
            showArrow
            onPress={() => Alert.alert('Delete Account', 'This action cannot be undone. Are you sure?')}
            iconColor='#EF4444'
            isWarning
          />

          {/* Security Info */}
          <View className='px-4 py-6 bg-green-50 mx-4 mt-6 rounded-lg'>
            <View className='flex-row items-start'>
              <Icon iconStyle='solid' name='shield' size={20} color='#10B981' />
              <View className='flex-1 ml-3'>
                <Text className='text-sm font-medium text-green-900'>Your Data is Protected</Text>
                <Text className='text-sm text-green-700 mt-1 leading-5'>
                  We use industry-standard encryption to protect your data. Your privacy settings are applied
                  immediately and can be changed at any time.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View className='h-6' />
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default PrivacySecuritySettingsScreen;
