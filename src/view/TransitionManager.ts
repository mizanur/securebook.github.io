import { TransitionManager as ITransitionManager, TransitionConfiguration, OnInterrupt } from '@interfaces/TransitionManager';
import { TransitionProgress } from '@interfaces/TransitionProgress';
import { EasingProgress } from '@interfaces/EasingProgress';
import { Wrapped } from '@interfaces/Wrapped';
import { getTimeInMS } from '@utils/time';
import { wrap, unwrap } from '@utils/wrap';
import { rememberLast } from '@utils/array';

export class TransitionManager<V,I> implements ITransitionManager<V> {
	private readonly ep: EasingProgress;
	private readonly tp: TransitionProgress<V,I>;
	private readonly tc: TransitionConfiguration<V,I>;
	private readonly state: Wrapped<V>;
	private target: Wrapped<null | V>;

	constructor(tc: TransitionConfiguration<V,I>, ep: EasingProgress, tp: TransitionProgress<V,I>, state: Wrapped<V>) {
		this.ep = ep;
		this.tp = tp;
		this.tc = tc;
		this.state = state;
		this.target = wrap(null);
	}

	start(target: V) {
		this.ep.time0 = getTimeInMS();
		this.target = wrap(target);

		if (!this.tp.isActive) {
			this.scheduleNext();
		}
	}

	private scheduleNext() {
		window.requestAnimationFrame(() => {
			const target = unwrap(this.target);

			if (target) {
				if (this.tc.getInertia) {
					this.tp.inertia = this.tc.getInertia(this.tp);
				}

				this.tp.isActive = true;
				this.tp.lastValues = [];
				this.tp.lastTimestamps = [];
				this.tp.source = this.tp.value;
				this.tp.target = target;
				this.tp.progress = 0;

				this.target = wrap(null);
			}

			this.ep.time1 = getTimeInMS();
			this.tp.progress = this.ep.progress < 1 ? this.ep.progress : 1;
			this.tp.time = this.ep.time;
			this.tp.value = this.tc.getValue(this.tp);
			this.state.value = this.tp.value;

			rememberLast(2, this.tp.lastValues, this.tp.value);
			rememberLast(2, this.tp.lastTimestamps, this.ep.time1);

			if (this.tp.progress === 1) {
				this.tp.isActive = false;
				this.tp.lastValues = [];
				this.tp.lastTimestamps = [];
				this.tp.source = this.tp.value;
				this.tp.target = this.tp.value;
				this.tp.progress = 0;
				this.tp.time = 0;
				this.ep.time0 = 0;
				this.ep.time1 = 0;
			}

			if (this.tp.isActive) {
				this.scheduleNext();
			}
		});
	}
}