export function forNum<T>(count: number, map: (index: number) => undefined | T): Array<T> {
	const arr: Array<T> = [];

	for (let i = 0; i < count; i++) {
		const mappedItem = map(i);

		if (mappedItem !== undefined) {
			arr.push(mappedItem);
		}
	}

	return arr;
}