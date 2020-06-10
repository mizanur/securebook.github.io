import { Location } from "@interfaces/Location";
import { AuthData } from "@interfaces/AuthData";
import { Password } from "@interfaces/Password";
import { Notes } from "@interfaces/Notes";
import { NoteManager } from "@modules/NoteManager";

export function createNoteViewerIntent(location: Location, auth: AuthData, password: Password, notes: Notes, noteManager: NoteManager) {
	return {
		canLoad: true,

		isCurrentIntentValid: false,

		get isCurrentIntent() {
			return !location.query.page && auth.data.status === 'Authenticated';
		},

		allowLoadingWhenPasswordIsIncorrect() {
			if (password.status === 'incorrect') {
				this.canLoad = true;
			}
		},

		loadNotesWhenAvailable() {
			if (this.canLoad && this.isCurrentIntentValid && notes.status === 'not loaded' && (password.status === 'provided' || password.status === 'verified')) {
				this.canLoad = false;
				noteManager.loadNotes();
			}
		},

		loadNoteWhenSelected() {
			if (notes.selected && notes.selected.content.status === 'not loaded: created') {
				noteManager.loadNote(notes.selected.id);
			}
		},

		deselectNoteWhenIncorrect() {
			if (notes.status === 'loaded' && notes.selectedId && !notes.selected) {
				noteManager.selectNote(null);
			}
		},
	}
}