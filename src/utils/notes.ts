import { NoteFileContent, NoteListFileContent } from "@interfaces/Notes"

export function getDefaultNoteContent(): NoteFileContent {
	return {
		text: '',
	}
}

export function getDefaultNoteListContent(): NoteListFileContent {
	return {
		num: Math.random(),
		notes: [],
	}
}