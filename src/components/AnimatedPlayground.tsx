import { h } from 'preact';
import { connect } from "@view/connect";
import "@styles/AnimatedPlayground.scss";

function AnimatedPlayground() {
	return (
		<div className='AnimatedPlayground'>
			<div className='AnimatedPlayground__animatedDot'></div>
		</div>
	);
}

export default connect(AnimatedPlayground);