import { Note } from "@interfaces/Notes";

export function filterNotesByTags(notes: Note[], tags: string[]): Note[] {
	let nonEmptyTags: string[] = [];
	for (let i = 0; i < tags.length; i++) {
		if (tags[i]) {
			nonEmptyTags.push(tags[i]);
		}
	}
	if (nonEmptyTags.length < 1) {
		return notes;
	}
	return notes.filter(note => {
		const noteTags = note.tags;
		for (let i = 0; i < nonEmptyTags.length; i++) {
			if (noteTags.indexOf(nonEmptyTags[i]) < 0) {
				return false;
			}
		}
		return true;
	});
}