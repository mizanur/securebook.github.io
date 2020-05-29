import { h } from 'preact';
import { connect } from "@view/connect";
import { useState, useRef, useContext } from 'preact/hooks';
import { useEffectOnce } from '@view/useEffectOnce';
import Input from '@components/Input';
import Icon from '@components/Icon';
import Dialog from '@components/Dialog';
import { StoreContext } from '@view/StoreContext';
import { ManagersContext } from '@view/ManagersContext';
import "@styles/PasswordDialog.scss";
import { keycodes } from '@utils/keycode';

function PasswordDialog() {
	const { password } = useContext(StoreContext);
	const { passwordManager } = useContext(ManagersContext);

	const [passwordValue, setPasswordValue] = useState('');
	const [isRevealed, setRevealed] = useState(false);
	const inputField = useRef<HTMLInputElement>(null);

	const useField = () => {
		useEffectOnce(() => {
			if (inputField.current) {
				inputField.current.focus();
			}
		});
	};

	const submitOnEnter = (e: KeyboardEvent) => {
		if (e.keyCode === keycodes.enter) {
			passwordManager.providePassword(passwordValue);
		}
	};

	return password.status === 'not provided' || password.status === 'incorrect'
		? <Dialog>
			<div className="PasswordDialog">
				<h1>Please enter password</h1>
				<p>
					If this is your first time using the app, choose a secure password.
					This password will be used to store all of your notes. Without knowing
					the password, nobody will be able to see your notes.
				</p>
				<h2><Icon type="warning" /> A word of caution</h2>
				<p>
					If the password is lost, all notes will be lost too. There is no way to
					recover the password, because it's not stored anywhere in any
					shape or form. In addition, it's currently impossible to change password
					once it was chosen; however, this feature is under development.
				</p>
				<div className="PasswordDialog__PasswordField">
					<Input
						iconType="vpn_key"
						type={isRevealed ? 'text' : 'password'}
						placeholder="Password"
						value={passwordValue}
						onInput={e => setPasswordValue(e.currentTarget.value)}
						className="Dialog__PasswordInputField"
						fieldRef={inputField}
						useField={useField}
						onKeyUp={submitOnEnter}
					/>
					<button
						title={isRevealed ? 'Stop revealing password' : 'Reveal password'}
						onClick={() => setRevealed(!isRevealed)}
					>
						{
							isRevealed
								? <Icon type="visibility_off" />
								: <Icon type="visibility" />
						}
					</button>
				</div>
			</div>
		</Dialog>
		: null;
}

export default connect(PasswordDialog);