import { TransitionProgress } from "@interfaces/TransitionProgress";

export function createTransitionProgress<V,I>(value: V, inertia: I): TransitionProgress<V,I> {
	return {
		isActive: false,
		lastValues: [],
		lastTimestamps: [],
		value,
		source: value,
		target: value,
		inertia,
		progress: 0,
		time: 0,
	};
}