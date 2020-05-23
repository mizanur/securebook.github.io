import { h } from 'preact';
import Welcome from '@components/Welcome';
import SecureBook from '@components/SecureBook';
import { connect } from '@view/connect';
import { useContext } from 'preact/hooks';
import { StoreContext } from '@view/StoreContext';

function App() {
	const { authData } = useContext(StoreContext);
	
	return (
		authData.data.status !== "Authenticated"
			? <Welcome />
			: <SecureBook />
	);
}

export default connect(App);