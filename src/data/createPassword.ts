import { AuthData } from "@interfaces/AuthData";
import { Filesystem } from "@interfaces/Filesystem";
import { sha256 } from "js-sha256";

export function createPassword(authData: AuthData, filesystem: Filesystem) {
	return {
		status: 'not provided',

		value: '',

		get hash() {
			return sha256.array(this.value);
		}
	}
}