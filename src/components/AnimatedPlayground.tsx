import { h } from 'preact';
import { connect } from "@view/connect";
import "@styles/AnimatedPlayground.scss";
import { useState } from '@view/useState';
import { createEasingProgress } from '@data/createEasingProgress';
import { easing } from '@view/easing';
import { wrap } from '@utils/wrap';
import { useTransition } from '@view/useTransition';
import { getInterpolationWithInertia, getInertia } from '@utils/transition';

type XY = { x: number, y: number };

function AnimatedPlayground() {
	const v = useState(() => wrap({
		x: 0,
		y: 0,
	}))

	const state = useTransition<XY,XY>(
		() => createEasingProgress(easing.easeInOutCubic, 1000),
		() => ({ x: v.value.x, y: v.value.y }),
		() => ({
			getInertia: tp => (
				tp.lastValues.length === 2 && tp.lastTimestamps.length === 2 ? {
					x: getInertia(tp.lastValues[1].x, tp.lastValues[0].x, tp.lastTimestamps[1], tp.lastTimestamps[0]),
					y: getInertia(tp.lastValues[1].y, tp.lastValues[0].y, tp.lastTimestamps[1], tp.lastTimestamps[0]),
				} : {
					x: 0,
					y: 0,
				}
			),
			getValue: tp => ({
				x: getInterpolationWithInertia(tp.progress, tp.source.x, tp.target.x, tp.inertia.x, tp.time),
				y: getInterpolationWithInertia(tp.progress, tp.source.y, tp.target.y, tp.inertia.y, tp.time),
			})
		})
	);

	return (
		<div className='AnimatedPlayground' onClick={e => {
			var rect = e.currentTarget.getBoundingClientRect();
			v.value = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			};
		}}>
			<div className='AnimatedPlayground__animatedDot' style={{
				transform: `translateX(-50%) translateY(-50%) translateX(${state.x}px) translateY(${state.y}px)`
			}}></div>
		</div>
	);
}

export default connect(AnimatedPlayground);