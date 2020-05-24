import { Filesystem } from "@interfaces/Filesystem";
import { Password } from "@interfaces/Password";
import { Crypter } from "@interfaces/Crypter";
import { NotesManager as INotesManager, NoteType } from "@interfaces/NotesManager";
import { PasswordIncorrect } from "@errors/PasswordIncorrect";
import { Notes, NoteFileContent, NoteListFileContent } from "@interfaces/Notes";
import { getDefaultNoteListContent, getDefaultNoteContent } from "@utils/notes";
import { getTimeInMS } from "@utils/time";
import { getUUID } from "@utils/uuid";

const maxNameCharacters = 50;
const noteListFileName = 'noteList';

export class NotesManager implements INotesManager {
	private readonly notes: Notes;
	private readonly filesystem: Filesystem;
	private readonly password: Password;
	private readonly crypter: Crypter;
	
	constructor(notes: Notes, filesystem: Filesystem, password: Password, crypter: Crypter) {
		this.notes = notes;
		this.filesystem = filesystem;
		this.password = password;
		this.crypter = crypter;
	}

	async loadNotes() {
		const { notes } = this;
		let isNoteListCreated = false;

		const filesystemContent = await this.filesystem.getFolderContent('/');
		const createdFiles: { [k: string]: boolean } = {};
		for (let i = 0; i < filesystemContent.length; i++) {
			const contentItem = filesystemContent[i];
			if (contentItem.path === noteListFileName) {
				isNoteListCreated = true;
				notes.loaded = { ...notes.loaded, status: 'created' };
			} else {
				createdFiles[contentItem.path] = true;
			}
		}

		try {
			if (isNoteListCreated) {
				notes.loaded = { ...notes.loaded, status: 'loading' };
				let contentJson: NoteListFileContent;
				const fileContent = await this.filesystem.getFileContent(noteListFileName);
				const content = await this.crypter.decrypt(fileContent, this.password.hash);
				try {
					contentJson = JSON.parse(content);
					if (!(typeof contentJson.num === 'number')) {
						throw new PasswordIncorrect();
					}
				} catch(e) {
					this.password.status = 'incorrect';
					throw new PasswordIncorrect();
				}
				notes.loaded = { ...notes.loaded, status: 'loaded', noteList: contentJson };
			} else {
				notes.loaded = { ...notes.loaded, status: 'creating' };
				const content = getDefaultNoteListContent();
				await this.filesystem.createFile(noteListFileName, await this.crypter.encrypt(JSON.stringify(content), this.password.hash));
				notes.loaded = { ...notes.loaded, status: 'loaded', noteList: content };
			}
		} catch(e) {
			notes.loaded = { ...notes.loaded, status: 'unknown' };
			throw e;
		}

		const noteFiles: Notes['loaded']['noteFiles'] = {};
		for (let i = 0; i < notes.loaded.noteList.notes.length; i++) {
			const note = notes.loaded.noteList.notes[i];
			noteFiles[note.id] = {
				id: note.id,
				status: createdFiles[note.id] ? "created" : "not created",
				content: getDefaultNoteContent(),
			};
		}
	}

	addNote<T extends NoteType>(type: T): string {
		const { notes } = this;
		const { noteList, noteFiles } = notes[type];
		const noteInList = {
			createdTime: getTimeInMS(),
			lastUpdatedTime: getTimeInMS(),
			id: getUUID(),
			name: '',
			tags: [],
		};
		noteList.notes.push(noteInList);
		noteFiles[noteInList.id] = {
			id: noteInList.id,
			status: 'loaded',
			content: getDefaultNoteContent(),
		};
		notes[type] = {
			...notes[type],
			noteList,
			noteFiles,
		};
		return noteInList.id;
	}

	editNoteContent<T extends NoteType>(type: T, id: string, content: NoteFileContent): void {
		const { notes } = this;
		const { noteList, noteFiles } = notes[type];
		noteFiles[id].content = content;
		const index = noteList.notes.findIndex(note => note.id === id);
		if (index >= 0) {
			const note = noteList.notes[index];
			note.name = content.text.substring(0, maxNameCharacters);
			note.lastUpdatedTime = getTimeInMS();
		}
		notes[type] = {
			...notes[type],
			noteList,
			noteFiles,
		};
	}

	editNoteTags<T extends NoteType>(type: T, id: string, tags: string[]): void {
		const { notes } = this;
		const { noteList } = notes[type];
		const index = noteList.notes.findIndex(note => note.id === id);
		if (index >= 0) {
			noteList.notes[index].tags = tags;
			noteList.notes[index].lastUpdatedTime = getTimeInMS();
		}
		notes[type] = {
			...notes[type],
			noteList,
		};
	}

	removeNote<T extends NoteType>(type: T, id: string): void {
		const { notes } = this;
		const { noteList, noteFiles } = notes[type];
		const index = noteList.notes.findIndex(note => note.id === id);
		if (index >= 0) {
			noteList.notes.splice(index, 1);
		}
		delete noteFiles[id];
		notes[type] = {
			...notes[type],
			noteList,
			noteFiles,
		};
	}
}