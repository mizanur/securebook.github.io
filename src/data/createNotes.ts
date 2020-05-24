import { Notes } from "@interfaces/Notes";
import { getDefaultNoteListContent } from "@utils/notes";

export function createNoteList(): Notes {
	return {
		loaded: {
			status: 'unknown',
			noteList: getDefaultNoteListContent(),
			noteFiles: {},
		},

		working: {
			noteList: getDefaultNoteListContent(),
			noteFiles: {},
		},
	}
}