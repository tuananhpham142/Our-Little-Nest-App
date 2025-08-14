/**
 * A "modern" sleep statement.
 *
 * @param ms The number of milliseconds to wait.
 */
export const delay = (ms: number) =>
	new Promise((resolve) => {
		// eslint-disable-next-line no-promise-executor-return
		return setTimeout(resolve, ms);
	});
