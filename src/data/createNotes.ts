import { Notes, NoteContent, Note } from "@interfaces/Notes";
import { EntityData, UserEntity } from "@interfaces/EntityData";
import { getTimeInMS } from "@utils/time";

export function getDefaultNote(id: string): UserEntity<NoteContent, Note> {
	return {
		id,
		name: '',
		tags: [],
		createdTime: getTimeInMS(),
		lastUpdatedTime: getTimeInMS(),
		content: {
			value: { html: '' }
		}
	}
}

export function createNotes(notesEntityData: EntityData<NoteContent, Note>): Notes {
	return {
		get status() {
			return notesEntityData.status;
		},

		get list() {
			return notesEntityData.workingList;
		},

		selectedId: null,

		get selected() {
			return this.selectedId && this.list[this.selectedId] || null;
		},
	}
}