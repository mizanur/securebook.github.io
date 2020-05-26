export function getValues<T>(obj: { [k: string]: T }): T[] {
	const vals: T[] = [];
	for(let key in obj) {
		vals.push(obj[key]);
	}
	return vals;
}