// src/services/storage/AsyncStorageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
  /**
   * Store data
   */
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to store item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve data
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove data
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all data
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
      throw error;
    }
  }

  /**
   * Get all keys
   */
  static async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  /**
   * Get multiple items
   */
  static async getMultiple(keys: string[]): Promise<{ [key: string]: any }> {
    try {
      const items = await AsyncStorage.multiGet(keys);
      const result: { [key: string]: any } = {};

      items.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Failed to get multiple items:', error);
      return {};
    }
  }
}
