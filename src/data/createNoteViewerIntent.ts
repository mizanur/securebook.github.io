import { Location } from "@interfaces/Location";
import { AuthData } from "@interfaces/AuthData";
import { Password } from "@interfaces/Password";
import { Notes } from "@interfaces/Notes";
import { NoteManager } from "@modules/NoteManager";

export function createNoteViewerIntent(location: Location, auth: AuthData, password: Password, notes: Notes, noteManager: NoteManager) {
	return {
		isCurrentIntentValid: false,

		get isCurrentIntent() {
			return !location.query.page && auth.data.status === 'Authenticated';
		},

		loadNotesWhenAvailable() {
			if (this.isCurrentIntentValid && notes.loaded.status === 'unknown' && auth.data.status === 'Authenticated' && (password.status === 'provided' || password.status === 'verified')) {
				noteManager.loadNotes();
			}
		}
	}
}