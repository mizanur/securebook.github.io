import { BaseEntity, EntityData } from "@interfaces/EntityData";

export type NoteContent = {
	text: string,
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
};