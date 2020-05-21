import { EasingType } from "@interfaces/Easing";
import { EasingProgress } from "@interfaces/EasingProgress";

export function createEasingProgress(type: EasingType, duration: number): EasingProgress {
	return {
		time0: 0,

		time1: 0,

		get time() {
			return this.time1 - this.time0;
		},

		get progress() {
			return type(this.time / duration);
		}
	};
}