export type Spy = ((...args: any[]) => any) & {
	calls: any[]
};

export function createSpy() {
	const spy: Spy = function(...args) {
		spy.calls.push(args);
	}
	spy.calls = [];
	return spy;
}