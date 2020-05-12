export function withPush<T>(arr: Array<T>, value: T): Array<T> {
	return [...arr, value];
}

export function withRemovedItem<T>(arr: Array<T>, index: number): Array<T> {
	const newArr = [...arr];
	newArr.splice(index, 1);
	return newArr;
}

export function withSetItem<T>(arr: Array<T>, index: number, value: T): Array<T> {
	const newArr = [...arr];
	newArr[index] = value;
	return newArr;
}