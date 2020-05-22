import { Crypter } from "@interfaces/Crypter";
import { Auth } from "@interfaces/Auth";

export interface Managers {
	crypter: Crypter;
	auth: Auth;
}