export type NoteFileContent = {
	text: string,
};

export type NoteFile = {
	id: string,
	status: 'not created' | 'created' | 'creating' | 'loading' | 'loaded' | 'error',
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

export type Notes = {
	loaded: {
		status: 'unknown' | 'created' | 'creating' | 'loading' | 'loaded' | 'error',
		noteList: NoteListFileContent,
		noteFiles: { [k: string]: NoteFile },
	}

	working: {
		noteList: NoteListFileContent,
		noteFiles: { [k: string]: NoteFile },
	}
};