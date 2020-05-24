import { Crypter } from "@interfaces/Crypter";
import { Auth } from "@interfaces/Auth";
import { Filesystem } from "@interfaces/Filesystem";

export interface Managers {
	crypter: Crypter;
	auth: Auth;
	filesystem: Filesystem,
}