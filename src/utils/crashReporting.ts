export const initCrashReporting = () => {};

export enum ErrorType {
	FATAL = 'Fatal',
	HANDLED = 'Handled',
}

export const reportCrash = (error: Error, type: ErrorType = ErrorType.FATAL) => {
	if (__DEV__) {
		// Log to console and Reactotron in development
		const message = error.message || 'Unknown';
		console.error(error);
		// eslint-disable-next-line no-console
		console.log(message, type);
	} else {
		// handle error report for production
	}
};
