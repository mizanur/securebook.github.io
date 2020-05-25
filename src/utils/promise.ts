export function all<T1, T2 extends Array<T1>>(...args: T2) {
	return Promise.all(args);
}