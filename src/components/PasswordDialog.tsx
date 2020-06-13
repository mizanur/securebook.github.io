import { h } from 'preact';
import { connect } from "@view/connect";
import { useState, useContext } from 'preact/hooks';
import Input from '@components/Input';
import Icon from '@components/Icon';
import Dialog from '@components/Dialog';
import { StoreContext } from '@view/StoreContext';
import { ManagersContext } from '@view/ManagersContext';
import "@styles/PasswordDialog.scss";
import { keycodes } from '@utils/keycode';
import { useFocusOnMount } from '@view/useFocusOnMount';
import Checkbox from './Checkbox';

function PasswordDialog() {
	const { password } = useContext(StoreContext);
	const { passwordManager } = useContext(ManagersContext);

	const [passwordValue, setPasswordValue] = useState('');
	const [rememberPassword, setRememberPassword] = useState(false);
	const [isRevealed, setRevealed] = useState(false);

	const useFocusProps = useFocusOnMount();

	const submitOnEnter = (e: KeyboardEvent) => {
		if (e.keyCode === keycodes.enter) {
			passwordManager.providePassword(passwordValue, rememberPassword);
		}
	};

	return password.status === 'not provided' || password.status === 'incorrect'
		? <Dialog>
			<div className="PasswordDialog">
				<h1>Please enter password</h1>
				<p>
					If this is your first time using the app, choose a secure password.
					This password will be used to encrypt all of your notes. Without knowing
					the password, nobody will be able to see your notes.
				</p>
				<h2 className="PasswordDialog__Warn"><Icon type="warning" /> A word of caution</h2>
				<p>
					If the password is lost, all notes will be lost too. There is no way to
					recover the password, because it's not stored anywhere in any
					shape or form. In addition, it's currently impossible to change password
					once it was chosen (this feature is still under development).
				</p>
				{
					password.status === 'incorrect' &&
						<p className="PasswordDialog__Incorrect">
							The provided password is incorrect. Please, try again:
						</p>
				}
				<button
					className="PasswordDialog__RememberPassword"
					onClick={() => setRememberPassword(!rememberPassword)}
					title="Remember password on this device until logging out"
				>
					<Checkbox
						className="PasswordDialog__RememberPasswordCheckbox"
						isChecked={rememberPassword}
					/>
					<span className="PasswordDialog__RememberPasswordLabel">
						Remember password
					</span>
				</button>
				<div className="PasswordDialog__PasswordField">
					<Input
						iconType="vpn_key"
						type={isRevealed ? 'text' : 'password'}
						placeholder="Password"
						value={passwordValue}
						onInput={e => setPasswordValue(e.currentTarget.value)}
						className="Dialog__PasswordInputField"
						onKeyUp={submitOnEnter}
						{...useFocusProps}
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