import { AuthData } from "@interfaces/AuthData";
import { Filesystem } from "@interfaces/Filesystem";
import { sha256 } from "js-sha256";
import { Password } from "@interfaces/Password";

export function createPassword(authData: AuthData, filesystem: Filesystem): Password {
	return {
		status: 'not provided',

		value: '',

		get hash() {
			return sha256.array(this.value);
		}
	}
}