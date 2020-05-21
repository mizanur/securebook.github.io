import { h } from 'preact';
import { connect } from "@view/connect";
import "@styles/AnimatedPlayground.scss";
import { useState } from '@view/useState';
import { createEasingProgress } from '@data/createEasingProgress';
import { easing } from '@view/easing';
import { rememberLast } from '@utils/array';
import { getTimeInMS } from '@utils/time';
import { wrap, unwrap } from '@utils/wrap';

function AnimatedPlayground() {
	const v = useState(() => wrap({
		x: 0,
		y: 0,
	}))

	const duration = 1000;

	const easingProgress = useState(() =>
		createEasingProgress({
			type: easing.easeInOutCubic,
			duration,
		})
	);

	const state = useState(() => {
		let value: any;
		let lastValues: any = [];
		let lastTimestamps: any = [];
		let isAnimating = false;

		function animate() {
			isAnimating = true;
			window.requestAnimationFrame(() => {
				isAnimating = false;
				const data = unwrap(easingProgress.data);
				const time1 = getTimeInMS();
				if (time1 - data.time0 < duration) {
					data.time1 = time1;
					animate();
				}
				else {
					data.time1 = data.time0 + duration;
				}
				easingProgress.data = wrap(data);
			});
		}

		return {
			data: wrap({
				oldValue: { x: v.value.x, y: v.value.y },
				newValue: null as any,
				inertia: { x: 0, y: 0 },
			}),

			get value() {
				console.log('value');
				const data = unwrap(this.data);
				if (!data.newValue) {
					return data.oldValue;
				}
				else {
					const p = easingProgress.progress;
					const t = easingProgress.time;
					return {
						x: data.oldValue.x * (1 - p) + data.newValue.x * p + data.inertia.x * t * (1 - p),
						y: data.oldValue.y * (1 - p) + data.newValue.y * p + data.inertia.y * t * (1 - p),
					}
				}
			},
			onValueChanged() {
				value = this.value;
				rememberLast(2, lastValues, value);
			},

			onLastTimestampsUpdate() {
				lastTimestamps = unwrap(easingProgress.data).lastTimestamps;
			},

			onNewValueChanged() {
				const deltaT = lastTimestamps.length === 2 ? lastTimestamps[1] - lastTimestamps[0] : Infinity;
				this.data = wrap({
					newValue: { x: v.value.x, y: v.value.y },
					oldValue: { x: value.x, y: value.y },
					inertia: lastValues.length === 2
						? {
							x: (lastValues[1].x - lastValues[0].x) / deltaT,
							y: (lastValues[1].y - lastValues[0].y) / deltaT
						}
						: { x: 0, y: 0 }
				});
				easingProgress.data = wrap({
					lastTimestamps: [],
					time0: getTimeInMS(),
					time1: getTimeInMS()
				});
				if (!isAnimating) {
					animate();
				}
			},
		};
	});

	return (
		<div className='AnimatedPlayground' onClick={e => {
			var rect = e.currentTarget.getBoundingClientRect();
			v.value = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			};
		}}>
			<div className='AnimatedPlayground__animatedDot' style={{
				transform: `translateX(-50%) translateY(-50%) translateX(${state.value.x}px) translateY(${state.value.y}px)`
			}}></div>
		</div>
	);
}

export default connect(AnimatedPlayground);