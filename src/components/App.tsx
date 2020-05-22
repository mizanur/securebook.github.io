import { h } from 'preact';
import { connect } from '@view/connect';
import { useState } from '@view/useState';
import { useContext } from 'preact/hooks';
import { ManagersContext } from '@view/ManagersContext';
import { sha256 } from "js-sha256";
import Input from '@components/Input';

function App() {
	const state = useState(() => ({
		text: 'Hello World!',
		password: '123'
	}));
	
	const manager = useContext(ManagersContext);

	const encrypt = async () => {
		state.text = await manager.crypter.encrypt(state.text, sha256.array(state.password));
		state.password = '';
	};

	const decrypt = async () => {
		state.text = await manager.crypter.decrypt(state.text, sha256.array(state.password));
	};

	return <div>
		<h1>Text</h1>
		<Input type="text" value={state.text} onInput={e => {
			state.text = e.currentTarget.value; }} />
		<h1>Password</h1>
		<Input type="text" value={state.password} onInput={e => {
			state.password = e.currentTarget.value; }} /><br /><br />
		<button onClick={encrypt}>Encrypt</button><br />
		<button onClick={decrypt}>Decrypt</button>
	</div>;
}

export default connect(App);