import { Password } from "@interfaces/Password";
import { PasswordManager as IPasswordManager } from "@interfaces/PasswordManager";
import { PassStorage } from "@interfaces/PassStorage";

export class PasswordManager implements IPasswordManager {
	private readonly password: Password;
	private readonly passStorage: PassStorage;

	constructor(password: Password, passStorage: PassStorage) {
		this.password = password;
		this.passStorage = passStorage;
	}

	providePassword(value: string, rememberPassword: boolean) {
		this.password.value = value;
		this.password.status = 'provided';
		
		if (rememberPassword) {
			this.passStorage.set(value);
		}
	}
}