import { Filesystem } from "@interfaces/Filesystem";
import { Password } from "@interfaces/Password";
import { Crypter } from "@interfaces/Crypter";
import { NoteManager as INoteManager } from "@interfaces/NoteManager";
import { PasswordIncorrect } from "@errors/PasswordIncorrect";
import { Notes, NoteFileContent, NoteListFileContent, NoteChange, CreateNoteChange, UpdateNoteChange, DeleteNoteChange } from "@interfaces/Notes";
import { getDefaultNoteListContent, getDefaultNoteContent } from "@utils/notes";
import { getTimeInMS } from "@utils/time";
import { getUUID } from "@utils/uuid";
import { deepCopy, deepEqual } from "@utils/deep";
import { all } from "@utils/promise";

const maxNameCharacters = 50;
const noteListFileName = 'noteList';

function mapToContents(noteFiles: Notes['loaded']['noteFiles']): Notes['working']['noteFileContents'] {
	const noteFileContents: Notes['working']['noteFileContents'] = {};
	for (let key in noteFiles) {
		noteFileContents[key] = noteFiles[key].content;
	}
	return noteFileContents;
}

export class NoteManager implements INoteManager {
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
				}
				catch(e) {
					this.password.status = 'incorrect';
					throw new PasswordIncorrect();
				}
				notes.loaded = { ...notes.loaded, status: 'loaded', noteList: contentJson };
				notes.working = { ...notes.working, noteList: deepCopy(notes.loaded.noteList) };
			} else {
				notes.loaded = { ...notes.loaded, status: 'creating' };
				const content = getDefaultNoteListContent();
				await this.filesystem.createFile(noteListFileName, await this.crypter.encrypt(JSON.stringify(content), this.password.hash));
				notes.loaded = { ...notes.loaded, status: 'loaded', noteList: content };
				notes.working = { ...notes.working, noteList: deepCopy(notes.loaded.noteList) };
			}
		}
		catch(e) {
			if (e instanceof PasswordIncorrect) {
				notes.loaded = { ...notes.loaded, status: 'unknown' };
			} else {
				notes.loaded = { ...notes.loaded, status: 'error' };
			}
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
		notes.loaded = { ...notes.loaded, noteFiles };
		notes.working = { ...notes.working, noteFileContents: mapToContents(deepCopy(notes.loaded.noteFiles)) };
	}

	async loadNote(id: string) {
		const { notes } = this;
		const { noteFiles } = notes.loaded;
		try {
			noteFiles[id].status === 'loading';
			notes.loaded = { ...notes.loaded, noteFiles };
			const noteFileContent: NoteFileContent = JSON.parse(await this.crypter.decrypt(await this.filesystem.getFileContent(id), this.password.hash));
			noteFiles[id].status === 'loaded';
			noteFiles[id].content === noteFileContent;
			notes.loaded = { ...notes.loaded, noteFiles };
		}
		catch(e) {
			noteFiles[id].status === 'error';
			notes.loaded = { ...notes.loaded, noteFiles };
		}
	}

	async applyChange(noteChange: NoteChange) {
		const { notes } = this;
		try {
			if (noteChange.type === 'Create') {
				notes.loaded.noteFiles[noteChange.id].status === 'creating';
				notes.loaded = { ...notes.loaded, status: 'creating note' };
				const copy = deepCopy(notes.loaded);
				copy.noteList.notes.push(noteChange.note);
				copy.noteFiles[noteChange.id].content = noteChange.noteFileContent;
				await all(
					this.filesystem.createFile(noteChange.id, await this.crypter.encrypt(JSON.stringify(noteChange.noteFileContent), this.password.hash)),
					this.filesystem.updateFile(noteListFileName, await this.crypter.encrypt(JSON.stringify(copy.noteList), this.password.hash))
				);
				notes.loaded.noteFiles[noteChange.id].status === 'loaded';
				notes.loaded = { ...notes.loaded, status: 'loaded', noteList: copy.noteList, noteFiles: copy.noteFiles };
			}
			else if (noteChange.type === 'Update') {
				notes.loaded.noteFiles[noteChange.id].status === 'updating';
				notes.loaded = { ...notes.loaded, status: 'updating note' };
				const copy = deepCopy(notes.loaded);
				const index = copy.noteList.notes.findIndex(note => note.id === noteChange.id);
				if (index >= 0) {
					copy.noteList[index] = noteChange.note;
				}
				copy.noteFiles[noteChange.id].content = noteChange.noteFileContent;
				await all(
					this.filesystem.updateFile(noteChange.id, await this.crypter.encrypt(JSON.stringify(noteChange.noteFileContent), this.password.hash)),
					this.filesystem.updateFile(noteListFileName, await this.crypter.encrypt(JSON.stringify(copy.noteList), this.password.hash))
				);
				notes.loaded.noteFiles[noteChange.id].status === 'loaded';
				notes.loaded = { ...notes.loaded, status: 'loaded', noteList: copy.noteList, noteFiles: copy.noteFiles };
			}
			else if (noteChange.type === 'Delete') {
				notes.loaded.noteFiles[noteChange.id].status === 'deleting';
				notes.loaded = { ...notes.loaded, status: 'deleting note' };
				const copy = deepCopy(notes.loaded);
				const index = copy.noteList.notes.findIndex(note => note.id === noteChange.id);
				if (index >= 0) {
					copy.noteList.notes.splice(index, 1);
				}
				delete copy.noteFiles[noteChange.id];
				await all(
					this.filesystem.deleteFile(noteChange.id),
					this.filesystem.updateFile(noteListFileName, await this.crypter.encrypt(JSON.stringify(copy.noteList), this.password.hash))
				);
				notes.loaded = { ...notes.loaded, status: 'loaded', noteList: copy.noteList, noteFiles: copy.noteFiles };
			}
		}
		catch(e) {
			notes.loaded.noteFiles[noteChange.id].status === 'error';
			notes.loaded = { ...notes.loaded, status: 'error' };
		}
	}

	getChanges(): NoteChange[] {
		const { notes } = this;
		const noteChanges: NoteChange[] = [];

		for (let i = 0; i < notes.working.noteList.notes.length; i++) {
			const note = notes.working.noteList.notes[i];
			const { id } = note;
			const noteFileContent = notes.working.noteFileContents[id];
			const loadedNoteFile = notes.loaded.noteFiles[id];

			if (!loadedNoteFile) {
				noteChanges.push({ type: 'Create', id, note, noteFileContent });
			}
			else {
				const loadedNote = notes.loaded.noteList.notes.find(note => note.id === id);
				if (!deepEqual(noteFileContent, loadedNoteFile.content) || !deepEqual(note, loadedNote)) {
					noteChanges.push({ type: 'Update', id, note, noteFileContent });
				}
			}
		}
		
		for (let i = 0; i < notes.loaded.noteList.notes.length; i++) {
			const loadedNote = notes.loaded.noteList.notes[i];
			const { id } = loadedNote;

			const noteFileContent = notes.working.noteFileContents[id];
			if (!noteFileContent) {
				noteChanges.push({ type: 'Delete', id });
			}
		}

		return noteChanges;
	}

	createWorkingNote(): CreateNoteChange {
		const { notes } = this;
		const { noteList, noteFileContents } = notes.working;
		const noteInList = {
			createdTime: getTimeInMS(),
			lastUpdatedTime: getTimeInMS(),
			id: getUUID(),
			name: '',
			tags: [],
		};
		noteList.notes.push(noteInList);
		noteFileContents[noteInList.id] = getDefaultNoteContent();
		notes.working = {
			...notes.working,
			noteList,
			noteFileContents,
		};
		return {
			type: "Create",
			id: noteInList.id,
			note: noteInList,
			noteFileContent: noteFileContents[noteInList.id],
		};
	}

	updateWorkingNoteContent(id: string, content: NoteFileContent): UpdateNoteChange {
		const { notes } = this;
		const { noteList, noteFileContents } = notes.working;
		noteFileContents[id] = content;
		const index = noteList.notes.findIndex(note => note.id === id);
		let note;
		if (index >= 0) {
			note = noteList.notes[index];
			note.name = content.text.substring(0, maxNameCharacters);
			note.lastUpdatedTime = getTimeInMS();
		}
		notes.working = {
			...notes.working,
			noteList,
			noteFileContents,
		};
		return {
			type: "Update",
			id,
			note,
			noteFileContent: content,
		};
	}

	updateWorkingNoteTags(id: string, tags: string[]): UpdateNoteChange {
		const { notes } = this;
		const { noteList, noteFileContents } = notes.working;
		const index = noteList.notes.findIndex(note => note.id === id);
		let note;
		if (index >= 0) {
			note = noteList.notes[index];
			note.tags = tags;
			note.lastUpdatedTime = getTimeInMS();
		}
		notes.working = {
			...notes.working,
			noteList,
		};
		return {
			type: "Update",
			id,
			note,
			noteFileContent: noteFileContents[id],
		};
	}

	deleteWorkingNote(id: string): DeleteNoteChange {
		const { notes } = this;
		const { noteList, noteFileContents } = notes.working;
		const index = noteList.notes.findIndex(note => note.id === id);
		if (index >= 0) {
			noteList.notes.splice(index, 1);
		}
		delete noteFileContents[id];
		notes.working = {
			...notes.working,
			noteList,
			noteFileContents,
		};
		return {
			type: "Delete",
			id,
		};
	}

	selectNote(id: string): void {
		this.notes.selectedId = id;
		
		if (this.notes.selected && this.notes.selected.status === 'created') {
			this.loadNote(id);
		}
	}

	createNoteAndSelect(): void {
		const { id } = this.createWorkingNote();
		this.notes.selectedId = id;
	}

	updateSelectedNoteContent(content: NoteFileContent): void {
		if (!this.notes.selectedId) {
			console.error('This should not happen: trying to update non-selected note content')
		}
		else {
			this.updateWorkingNoteContent(this.notes.selectedId, content);
		}
	}

	updateSelectedNoteTags(tags: string[]): void {
		if (!this.notes.selectedId) {
			console.error('This should not happen: trying to update non-selected note tags')
		}
		else {
			this.updateWorkingNoteTags(this.notes.selectedId, tags);
		}
	}

	deleteNote(id: string): void {
		if (id === this.notes.selectedId) {
			this.notes.selectedId = null;
		}
		const noteChange = this.deleteWorkingNote(id);
		this.applyChange(noteChange);
	}

	saveSelectedNote(): void {
		if (this.notes.selectedId && this.notes.selected) {
			this.applyChange({
				type: this.notes.selected.status === 'not created' ? 'Create' : 'Update',
				id: this.notes.selected.note.id,
				noteFileContent: this.notes.selected.noteFileContent,
				note: this.notes.selected.note,
			});
		}
		else {
			console.error('This should not happen: trying to save non-selected note');
		}
	}
}