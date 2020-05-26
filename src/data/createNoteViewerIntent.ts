import { Location } from "@interfaces/Location";
import { AuthData } from "@interfaces/AuthData";
import { Password } from "@interfaces/Password";
import { Notes } from "@interfaces/Notes";
import { NoteManager } from "@modules/NoteManager";

export function createNoteViewerIntent(location: Location, auth: AuthData, password: Password, notes: Notes, noteManager: NoteManager) {
	return {
		loadingStarted: false,

		isCurrentIntentValid: false,

		get isCurrentIntent() {
			return !location.query.page && auth.data.status === 'Authenticated';
		},

		loadNotesWhenAvailable() {
			if (!this.loadingStarted && this.isCurrentIntentValid && notes.status === 'not loaded' && (password.status === 'provided' || password.status === 'verified')) {
				this.loadingStarted = true;
				noteManager.loadNotes();
			}
		}
	}
}