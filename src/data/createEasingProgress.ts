import { EasingType } from "@interfaces/Easing";
import { EasingProgress } from "@interfaces/EasingProgress";
import { rememberLast } from "@utils/array";
import { wrap, unwrap } from "@utils/wrap";

export function createEasingProgress({ type, duration }: {type: EasingType, duration: number}): EasingProgress {
	return {
		data: wrap({
			time0: 0,
			time1: 0,
			lastTimestamps: []
		}),

		get time() {
			const data = unwrap(this.data);
			return data.time1 - data.time0;
		},

		get progress() {
			return type(this.time / duration);
		},

		updateLastTimestamps() {
			const data = unwrap(this.data);
			rememberLast(2, data.lastTimestamps, data.time1);
		}
	};
}