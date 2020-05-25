import { Notes } from "@interfaces/Notes";
import { getDefaultNoteListContent } from "@utils/notes";

export function createNotes(): Notes {
	return {
		selectedId: null,

		loaded: {
			status: 'unknown',
			noteList: getDefaultNoteListContent(),
			noteFiles: {},
		},

		working: {
			noteList: getDefaultNoteListContent(),
			noteFileContents: {},
		},

		get selected() {
			if (!this.selectedId) {
				return null;
			}
			const note = this.working.noteList.notes.find(note => note.id === this.selectedId);
			if (!note) {
				console.error('This should not happen: trying to select a non-existent note');
				return null;
			}
			const loadedNote = this.loaded.noteFiles[this.selectedId];
			return {
				status: loadedNote && loadedNote.status || 'not created',
				noteFileContent: this.working.noteFileContents[this.selectedId],
				note,
			};
		}
	}
}