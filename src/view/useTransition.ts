import { useState } from "@view/useState";
import { EasingProgress } from "@interfaces/EasingProgress";
import { TransitionConfiguration } from "@interfaces/TransitionManager";
import { wrap, unwrap } from "@utils/wrap";
import { useEffectOnce } from "@view/useEffectOnce";
import { connectObject } from "typeconnect";
import { createTransitionProgress } from "@data/createTransitionProgress";
import { TransitionManager } from "@view/TransitionManager";
import { TransitionManager as ITransitionManager } from "@interfaces/TransitionManager";

export function useTransition<V,I>(createEP: () => EasingProgress, createTarget: () => V, createTC: () => TransitionConfiguration<V,I>): V {
	const state = useState(() => wrap(createTarget()));

	useEffectOnce(() => {
		const ep = createEP();
		const tc = createTC();
		const tp = createTransitionProgress<V,I>(unwrap(state), null as any);
		const tm: ITransitionManager<V> = new TransitionManager(tc, ep, tp, state);
		const val = connectObject({
			isStopped: false,
			onTarget() {
				if (!this.isStopped) {
					const target = createTarget();
					tm.start(target);
				}
			}
		});
		return () => {
			val.isStopped = true;
		}
	});

	return unwrap(state);
}