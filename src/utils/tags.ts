import { Note } from "@interfaces/Notes";

export function filterNotesByTags(notes: Note[], tagSearch: string): Note[] {
	const tagOrSplit = tagSearch.split(/\s*,\s*/);
	const tagQuery = tagOrSplit.map(tagOrPart => tagOrPart.split(/\s+/));
	return notes.filter(note => {
		const noteTags = note.tags;
		for (let i = 0; i < tagQuery.length; i++) {
			const tagOrCondition = tagQuery[i];
			let isSatisfied = true;
			for (let i = 0; i < tagOrCondition.length; i++) {
				const tagAndCondition = tagOrCondition[i];
				if (noteTags.indexOf(tagAndCondition) < 0) {
					isSatisfied = false;
					break;
				}
			}
			if (isSatisfied) {
				return true;
			}
		}
		return false;
	});
}