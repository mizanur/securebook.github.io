import { TransitionProgress } from "@interfaces/TransitionProgress";

export type TransitionConfiguration<V,I> = {
	getValue(tp: TransitionProgress<V,I>): V,
	getInertia?(tp: TransitionProgress<V,I>): I,
}

export interface TransitionManager<V> {
	start(target: V);
}