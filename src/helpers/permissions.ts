// src/utils/helpers/permissions.ts
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

export const PermissionHelpers = {
  requestCameraPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS permissions are handled through Info.plist
  },

  requestStoragePermission: async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  },

  showPermissionAlert: (permission: string): void => {
    Alert.alert('Permission Required', `This app needs ${permission} permission to work properly.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Settings', onPress: () => Linking.openSettings() },
    ]);
  },
};
