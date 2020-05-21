import { h } from 'preact';
import MainView from "@components/MainView";
import { useState } from '@view/useState';
import { connect } from '@view/connect';

function App() {
	const state = useState(() => ({ isShown: true }));
	return <div>
		<button onClick={() => (state.isShown = !state.isShown)}>{state.isShown ? 'Hide App' : 'Show App'}</button>
		{state.isShown ? <MainView /> : <h1>App is gone!</h1>}
	</div>
}

export default connect(App);