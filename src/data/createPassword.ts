import { PassStorage } from "@interfaces/PassStorage";
import { sha256 } from "js-sha256";
import { Password } from "@interfaces/Password";

export function createPassword(passStorage: PassStorage) {
	const stored = passStorage.get();

	return <Password> {
		status: stored != null ? 'provided' : 'not provided',

		value: stored != null ? stored : '',

		get hash() {
			return sha256.array(this.value);
		},

		onPasswordIncorrectRemoveFromStorage() {
			if (this.status === 'incorrect') {
				passStorage.delete();
			}
		}
	}
}