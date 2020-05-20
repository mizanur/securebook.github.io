import { h } from 'preact';
import MainView from "@components/MainView";
import { useState } from 'preact/hooks';

export default function App() {
	const [isShown, setIsShown] = useState(true);
	return <div>
		<button onClick={() => setIsShown(!isShown)}>{isShown ? 'Hide App' : 'Show App'}</button>
		{isShown ? <MainView /> : <h1>App is gone!</h1>}
	</div>
}