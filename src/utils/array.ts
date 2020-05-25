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

export function rememberLast<T>(num: number, arr: T[], item: T) {
	if (arr.length >= num) {
		arr.shift();
		arr.push(item);
	}
	else {
		arr.push(item);
	}
}

export function areShallowEqual<T extends Array<any>>(a1: T, a2: T): boolean {
	if (a1.length !== a2.length) {
		return false;
	}
	for (let i = 0; i < a1.length; i++) {
		if (a1[i] !== a1[2]) {
			return false;
		}
	}
	return true;
}