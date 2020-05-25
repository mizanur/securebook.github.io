export type NoteFileContent = {
	text: string,
};

export type NoteFile = {
	id: string,
	status: 'not created' | 'created' | 'creating' | 'loading' | 'loaded' | 'updating' | 'deleting' | 'error',
	content: NoteFileContent,
};

export type Note = {
	id: string,
	name: string,
	tags: string[],
	createdTime: number,
	lastUpdatedTime: number,
};

export type NoteListFileContent = {
	num: number,
	notes: Note[],
};

export type CreateNoteChange = {
	type: 'Create',
	id: string,
	noteFileContent: NoteFileContent,
	note: Note,
};

export type UpdateNoteChange = {
	type: 'Update',
	id: string,
	noteFileContent: NoteFileContent,
	note: Note,
};

export type DeleteNoteChange = {
	type: 'Delete',
	id: string,
};

export type NoteChange = CreateNoteChange | UpdateNoteChange | DeleteNoteChange;

export type Notes = {
	loaded: {
		status: 'unknown' | 'created' | 'creating' | 'loading' | 'loaded' | 'creating note' | 'updating note' | 'deleting note' | 'error',
		noteList: NoteListFileContent,
		noteFiles: { [k: string]: NoteFile },
	},
	
	working: {
		noteList: NoteListFileContent,
		noteFileContents: { [k: string]: NoteFileContent },
	},

	selectedId: string | null,
	
	selected: null | {
		status: NoteFile['status'],
		noteFileContent: NoteFileContent,
		note: Note,
	},
};