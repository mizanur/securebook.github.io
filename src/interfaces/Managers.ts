import { Crypter } from "@interfaces/Crypter";
import { Auth } from "@interfaces/Auth";
import { Filesystem } from "@interfaces/Filesystem";
import { PasswordManager } from "@interfaces/PasswordManager";
import { NoteManager } from "@interfaces/NoteManager";

export interface Managers {
	crypter: Crypter;
	auth: Auth;
	filesystem: Filesystem,
	passwordManager: PasswordManager,
	noteManager: NoteManager,
}