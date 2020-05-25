import { Password } from "@interfaces/Password";
import { PasswordManager as IPasswordManager } from "@interfaces/PasswordManager";

export class PasswordManager implements IPasswordManager {
	private readonly password: Password;

	constructor(password: Password) {
		this.password = password;
	}

	providePassword(value: string) {
		this.password.value = value;
		this.password.status = 'provided';
	}
}