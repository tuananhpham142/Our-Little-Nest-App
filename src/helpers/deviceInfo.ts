// src/utils/helpers/deviceInfo.ts
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const DeviceInfoHelpers = {
  getDeviceId: async (): Promise<string> => {
    return await DeviceInfo.getUniqueId();
  },

  getDeviceInfo: async () => {
    const [deviceId, brand, model, systemVersion, appVersion, buildNumber, bundleId, deviceName, isEmulator, hasNotch] =
      await Promise.all([
        DeviceInfo.getUniqueId(),
        DeviceInfo.getBrand(),
        DeviceInfo.getModel(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getVersion(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getBundleId(),
        DeviceInfo.getDeviceName(),
        DeviceInfo.isEmulator(),
        DeviceInfo.hasNotch(),
      ]);

    return {
      deviceId,
      brand,
      model,
      systemVersion,
      appVersion,
      buildNumber,
      bundleId,
      deviceName,
      isEmulator,
      hasNotch,
      platform: Platform.OS,
      platformVersion: Platform.Version,
    };
  },

  isTablet: async (): Promise<boolean> => {
    return await DeviceInfo.isTablet();
  },

  hasNotch: async (): Promise<boolean> => {
    return await DeviceInfo.hasNotch();
  },

  getBatteryLevel: (): Promise<number> => {
    return DeviceInfo.getBatteryLevel();
  },

  getFreeDiskStorage: (): Promise<number> => {
    return DeviceInfo.getFreeDiskStorage();
  },

  getTotalMemory: (): Promise<number> => {
    return DeviceInfo.getTotalMemory();
  },

  getUsedMemory: (): Promise<number> => {
    return DeviceInfo.getUsedMemory();
  },
};
