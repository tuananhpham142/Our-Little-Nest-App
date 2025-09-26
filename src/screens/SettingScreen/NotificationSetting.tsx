import AppLayout from '@/components/layout/AppLayout';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { InfoCard, SectionHeader, SettingItem } from './components/CommonComponents';

interface NotificationsSettingsScreenProps {
  navigation?: any;
  onNotificationSettingsChange?: (settings: NotificationSettings) => void;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  inAppNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  newsUpdates: boolean;
  socialNotifications: boolean;
  badgeCount: boolean;
  lockScreenNotifications: boolean;
  notificationPreview: 'always' | 'when-unlocked' | 'never';
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const NotificationsSettingsScreen: React.FC<NotificationsSettingsScreenProps> = ({
  navigation,
  onNotificationSettingsChange,
}) => {
  // Notification Settings State
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  // Marketing & Updates
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [newsUpdates, setNewsUpdates] = useState(true);
  const [socialNotifications, setSocialNotifications] = useState(true);

  // Display Settings
  const [badgeCount, setBadgeCount] = useState(true);
  const [lockScreenNotifications, setLockScreenNotifications] = useState(true);
  const [notificationPreview, setNotificationPreview] = useState<'always' | 'when-unlocked' | 'never'>('when-unlocked');

  // Quiet Hours
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');

  const handleSettingsChange = useCallback(() => {
    const settings: NotificationSettings = {
      pushNotifications,
      emailNotifications,
      smsNotifications,
      soundEnabled,
      vibrationEnabled,
      inAppNotifications,
      marketingEmails,
      securityAlerts,
      newsUpdates,
      socialNotifications,
      badgeCount,
      lockScreenNotifications,
      notificationPreview,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
    };
    onNotificationSettingsChange?.(settings);
  }, [
    pushNotifications,
    emailNotifications,
    smsNotifications,
    soundEnabled,
    vibrationEnabled,
    inAppNotifications,
    marketingEmails,
    securityAlerts,
    newsUpdates,
    socialNotifications,
    badgeCount,
    lockScreenNotifications,
    notificationPreview,
    quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
    onNotificationSettingsChange,
  ]);

  return (
    <AppLayout
      header={{
        title: 'Notifications',
        variant: 'simple',
        onBack: () => navigation.goBack(),
      }}
    >
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Push Notifications */}
        <SectionHeader title='Push Notifications' subtitle='Receive notifications on your device' />

        <SettingItem
          title='Push Notifications'
          subtitle='Allow push notifications from this app'
          icon='notifications'
          hasSwitch
          switchValue={pushNotifications}
          onSwitchChange={(value) => {
            setPushNotifications(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='Sound'
          subtitle='Play notification sounds'
          icon='volume-up'
          hasSwitch
          switchValue={soundEnabled}
          onSwitchChange={(value) => {
            setSoundEnabled(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='Vibration'
          subtitle='Vibrate for notifications'
          icon='vibration'
          hasSwitch
          switchValue={vibrationEnabled}
          onSwitchChange={(value) => {
            setVibrationEnabled(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='Badge Count'
          subtitle='Show unread count on app icon'
          icon='circle-notifications'
          hasSwitch
          switchValue={badgeCount}
          onSwitchChange={(value) => {
            setBadgeCount(value);
            handleSettingsChange();
          }}
        />

        {/* Communication */}
        <SectionHeader title='Communication' subtitle='Email and SMS notifications' />

        <SettingItem
          title='Email Notifications'
          subtitle='Receive updates via email'
          icon='email'
          iconColor='#10B981'
          iconBackgroundColor='#D1FAE5'
          hasSwitch
          switchValue={emailNotifications}
          onSwitchChange={(value) => {
            setEmailNotifications(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='SMS Notifications'
          subtitle='Receive text message updates'
          icon='sms'
          iconColor='#10B981'
          iconBackgroundColor='#D1FAE5'
          hasSwitch
          switchValue={smsNotifications}
          onSwitchChange={(value) => {
            setSmsNotifications(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='In-App Notifications'
          subtitle='Show notifications while using the app'
          icon='notifications-active'
          iconColor='#10B981'
          iconBackgroundColor='#D1FAE5'
          hasSwitch
          switchValue={inAppNotifications}
          onSwitchChange={(value) => {
            setInAppNotifications(value);
            handleSettingsChange();
          }}
        />

        {/* Content Types */}
        <SectionHeader title='Content Types' subtitle='Choose what types of notifications to receive' />

        <SettingItem
          title='Security Alerts'
          subtitle='Important security and account notifications'
          icon='security'
          iconColor='#EF4444'
          iconBackgroundColor='#FEE2E2'
          hasSwitch
          switchValue={securityAlerts}
          onSwitchChange={(value) => {
            setSecurityAlerts(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='Social Notifications'
          subtitle='Likes, comments, and social interactions'
          icon='people'
          iconColor='#8B5CF6'
          iconBackgroundColor='#E9D5FF'
          hasSwitch
          switchValue={socialNotifications}
          onSwitchChange={(value) => {
            setSocialNotifications(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='News & Updates'
          subtitle='App updates and news'
          icon='newspaper'
          iconColor='#8B5CF6'
          iconBackgroundColor='#E9D5FF'
          hasSwitch
          switchValue={newsUpdates}
          onSwitchChange={(value) => {
            setNewsUpdates(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='Marketing Emails'
          subtitle='Promotional content and offers'
          icon='local-offer'
          iconColor='#F59E0B'
          iconBackgroundColor='#FEF3C7'
          hasSwitch
          switchValue={marketingEmails}
          onSwitchChange={(value) => {
            setMarketingEmails(value);
            handleSettingsChange();
          }}
        />

        {/* Display Options */}
        <SectionHeader title='Display Options' subtitle='How notifications appear on your device' />

        <SettingItem
          title='Lock Screen Notifications'
          subtitle='Show notifications on lock screen'
          icon='lock'
          iconColor='#6B7280'
          iconBackgroundColor='#F3F4F6'
          hasSwitch
          switchValue={lockScreenNotifications}
          onSwitchChange={(value) => {
            setLockScreenNotifications(value);
            handleSettingsChange();
          }}
        />

        <SettingItem
          title='Notification Preview'
          subtitle={
            notificationPreview === 'always'
              ? 'Always'
              : notificationPreview === 'when-unlocked'
                ? 'When Unlocked'
                : 'Never'
          }
          icon='preview'
          iconColor='#6B7280'
          iconBackgroundColor='#F3F4F6'
          showArrow
          onPress={() => Alert.alert('Notification Preview', 'Configure notification preview settings')}
        />

        {/* Quiet Hours */}
        <SectionHeader title='Quiet Hours' subtitle='Silence notifications during specific times' />

        <SettingItem
          title='Quiet Hours'
          subtitle='Automatically silence notifications'
          icon='do-not-disturb'
          iconColor='#8B5CF6'
          iconBackgroundColor='#E9D5FF'
          hasSwitch
          switchValue={quietHoursEnabled}
          onSwitchChange={(value) => {
            setQuietHoursEnabled(value);
            handleSettingsChange();
          }}
        />

        {quietHoursEnabled && (
          <>
            <SettingItem
              title='Start Time'
              subtitle={quietHoursStart}
              icon='schedule'
              iconColor='#8B5CF6'
              iconBackgroundColor='#E9D5FF'
              showArrow
              onPress={() => Alert.alert('Start Time', 'Set quiet hours start time')}
            />

            <SettingItem
              title='End Time'
              subtitle={quietHoursEnd}
              icon='schedule'
              iconColor='#8B5CF6'
              iconBackgroundColor='#E9D5FF'
              showArrow
              onPress={() => Alert.alert('End Time', 'Set quiet hours end time')}
            />
          </>
        )}

        {/* Advanced */}
        <SectionHeader title='Advanced' />

        <SettingItem
          title='Notification History'
          subtitle='View notification history'
          icon='history'
          iconColor='#6B7280'
          iconBackgroundColor='#F3F4F6'
          showArrow
          onPress={() => Alert.alert('History', 'Navigate to notification history')}
        />

        <SettingItem
          title='App Notifications'
          subtitle='Manage per-app notification settings'
          icon='apps'
          iconColor='#6B7280'
          iconBackgroundColor='#F3F4F6'
          showArrow
          onPress={() => Alert.alert('App Notifications', 'Navigate to app notification settings')}
        />

        <SettingItem
          title='Reset All Settings'
          subtitle='Reset all notification settings to default'
          icon='restore'
          iconColor='#EF4444'
          iconBackgroundColor='#FEE2E2'
          showArrow
          isWarning
          onPress={() => Alert.alert('Reset', 'Are you sure you want to reset all notification settings?')}
        />

        {/* Info Section */}
        <InfoCard
          icon='info'
          title='About Notifications'
          message='Security alerts cannot be disabled to ensure your account safety. Some notification settings may require app restart to take effect.'
          type='info'
        />

        {/* Bottom Spacing */}
        <View className='h-6' />
      </ScrollView>
    </AppLayout>
  );
};

export default NotificationsSettingsScreen;
