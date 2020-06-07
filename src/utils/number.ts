export function cap(min: number, max: number, n: number): number {
	return (
		n > max ? max :
		n < min ? min : n
	);
}