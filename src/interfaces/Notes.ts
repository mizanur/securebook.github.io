import { BaseEntity, EntityData } from "@interfaces/EntityData";
import { EditorState } from "prosemirror-state";

export type NoteContent = {
	html: string,
};

export type Note = BaseEntity<NoteContent> & {
	name: string,
	tags: string[],
	createdTime: number,
	lastUpdatedTime: number,
};

export type Notes = {
	status: EntityData<NoteContent, Note>['status'],
	list: EntityData<NoteContent, Note>['workingList'],
	selectedId: null | string,
	selected: null | Note,
	dirty: { [k: string]: boolean },
	state: { [k: string]: EditorState },
	tags: string[],
};