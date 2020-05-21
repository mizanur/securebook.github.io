import { h, Fragment } from 'preact';
import { connect } from "@view/connect";
import "@styles/AnimatedPlayground.scss";
import { useState } from '@view/useState';

function AnimatedPlayground() {
	const value = useState(() => ({
		x: 0,
		y: 0,
	}))

	return (
		<div className='AnimatedPlayground' onClick={e => {
			var rect = e.currentTarget.getBoundingClientRect();
			value.x = e.clientX - rect.left;
			value.y = e.clientY - rect.top;
		}}>
			<div className='AnimatedPlayground__animatedDot' style={{
				transform: `translateX(-50%) translateY(-50%) translateX(${value.x}px) translateY(${value.y}px)`
			}}></div>
		</div>
	);
}

export default connect(AnimatedPlayground);