export interface TransitionProgress<V, I> {
	isActive: boolean,
	lastValues: V[],
	lastTimestamps: number[],
	value: V;
	source: V;
	target: V;
	inertia: I;
	progress: number;
	time: number;
}