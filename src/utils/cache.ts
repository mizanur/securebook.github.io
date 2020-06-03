export type Cache<T> = {
	getItem(key: string): T | undefined,
	storeItem(key: string, item: T): void,
}

export function createCache<T>(cacheSize: number): Cache<T> {
	const cache: { [k: string]: T } = {};
	const cacheKeys: string[] = Array(cacheSize);
	let currentCacheId: number = 0;
	return {
		getItem(key: string) {
			return cache[key];
		},
		storeItem(key: string, item: T) {
			if (currentCacheId >= cacheSize) {
				delete cacheKeys[cacheKeys[0]];
				cacheKeys.splice(0, 1);
			}
			else {
				currentCacheId++;
			}
			cache[key] = item;
			cacheKeys[currentCacheId] = key;
		}
	}
}