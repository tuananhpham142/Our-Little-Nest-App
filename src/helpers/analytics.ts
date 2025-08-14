// src/utils/helpers/analytics.ts
export class AnalyticsHelper {
  private static isEnabled = !__DEV__;

  static logEvent(eventName: string, parameters?: { [key: string]: any }): void {
    if (!this.isEnabled) return;

    try {
      // Replace with your analytics service
      // Example: Firebase Analytics, Mixpanel, etc.
      console.log('Analytics Event:', eventName, parameters);

      // analytics().logEvent(eventName, parameters);
    } catch (error) {
      console.warn('Analytics logging failed:', error);
    }
  }

  static logScreenView(screenName: string, screenClass?: string): void {
    this.logEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenClass,
    });
  }

  static logLogin(method: string): void {
    this.logEvent('login', { method });
  }

  static logSignUp(method: string): void {
    this.logEvent('sign_up', { method });
  }

  static logPurchase(value: number, currency: string, itemId?: string): void {
    this.logEvent('purchase', {
      value,
      currency,
      item_id: itemId,
    });
  }

  static setUserProperties(properties: { [key: string]: any }): void {
    if (!this.isEnabled) return;

    try {
      // analytics().setUserProperties(properties);
      console.log('User Properties Set:', properties);
    } catch (error) {
      console.warn('Setting user properties failed:', error);
    }
  }

  static setUserId(userId: string): void {
    if (!this.isEnabled) return;

    try {
      // analytics().setUserId(userId);
      console.log('User ID Set:', userId);
    } catch (error) {
      console.warn('Setting user ID failed:', error);
    }
  }
}
