// src/utils/helpers/errorHandler.ts
export class ErrorHandler {
  static logError(error: Error, context?: string): void {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (__DEV__) {
      console.error('Error logged:', errorInfo);
    }

    // In production, you might want to send to crash reporting service
    // Example: Crashlytics, Sentry, etc.
    // crashlytics().recordError(error);
  }

  static handleApiError(error: any): string {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return data.message || 'Bad request';
        case 401:
          return 'Unauthorized. Please login again.';
        case 403:
          return 'Access forbidden';
        case 404:
          return 'Resource not found';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return data.message || 'An error occurred';
      }
    } else if (error.request) {
      // Network error
      return 'Network error. Please check your connection.';
    } else {
      // Other error
      return error.message || 'An unexpected error occurred';
    }
  }

  static createErrorBoundaryError(error: Error, errorInfo: any) {
    return {
      error: {
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      timestamp: new Date().toISOString(),
    };
  }
}
