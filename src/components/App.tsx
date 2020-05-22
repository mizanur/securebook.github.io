import { h } from 'preact';
import WelcomePage from '@components/WelcomePage';
import { connect } from '@view/connect';
import { useContext } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';
import { ManagersContext } from '@view/ManagersContext';

function App() {
	const { authData } = useContext(StoreContext);
	const { auth } = useContext(ManagersContext);
	
	return (
		authData.data.status === "Authenticated"
			? <div>
				Logged in!<br />
				<button onClick={() => { auth.logout(); }}>Log out</button>
			</div>
			: <WelcomePage />
	);
}

export default connect(App);