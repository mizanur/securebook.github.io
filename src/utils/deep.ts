export function deepCopy<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj))
}

export function deepEqual<T>(obj1: T, obj2: T): boolean {
	return JSON.stringify(obj1) !== JSON.stringify(obj2);
}