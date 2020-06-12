import { NoteManager as INoteManager } from "@interfaces/NoteManager";
import { Notes, Note, NoteContent } from "@interfaces/Notes";
import { EntityManager } from "@interfaces/EntityManager";
import { getTimeInMS } from "@utils/time";
import { PathManager } from "@interfaces/PathManager";

const maxNameCharacters = 100;

export class NoteManager implements INoteManager {
	private readonly notes: Notes;
	private readonly noteEntityManager: EntityManager<NoteContent,Note>;
	private readonly pathManager: PathManager;
	
	constructor(notes: Notes, noteEntityManager: EntityManager<NoteContent,Note>, pathManager: PathManager) {
		this.notes = notes;
		this.noteEntityManager = noteEntityManager;
		this.pathManager = pathManager;
	}

	async loadNotes() {
		await this.noteEntityManager.loadList();
	}

	async loadNote(id: string) {
		await this.noteEntityManager.loadItem(id);
	}

	selectNote(id: string | null) {
		this.notes.selectedId = id;
		this.pathManager.onNoteSelected(id);
	}

	createNoteAndSelect(): void {
		const { id } = this.noteEntityManager.createWorkingItem();
		this.selectNote(id);
		this.notes.dirty = {
			...this.notes.dirty,
			[id]: true,
		};
	}

	updateSelectedNoteContent(textContent: string, contentValue: NoteContent): void {
		if (!this.notes.selectedId || !this.notes.selected) {
			console.error('This should not happen: trying to update non-selected note content')
		}
		else {
			let name = textContent.trim().substring(0, maxNameCharacters);
			const newLineIndex = name.indexOf("\n");
			if (newLineIndex >= 0) {
				name = name.substring(0, newLineIndex);
			}
			const note = this.notes.selected;
			note.name = name;
			note.content.value = contentValue;
			note.lastUpdatedTime = getTimeInMS();
			this.noteEntityManager.updateWorkingItem(note);
			this.notes.dirty = {
				...this.notes.dirty,
				[this.notes.selectedId]: true,
			};
		}
	}

	updateSelectedNoteTags(tags: string[]): void {
		if (!this.notes.selectedId || !this.notes.selected) {
			console.error('This should not happen: trying to update non-selected note content')
		}
		else {
			const note = this.notes.selected;
			note.tags = tags;
			note.lastUpdatedTime = getTimeInMS();
			this.noteEntityManager.updateWorkingItem(note);
			this.notes.dirty = {
				...this.notes.dirty,
				[this.notes.selectedId]: true,
			};
		}
	}

	async deleteNote(id: string) {
		await this.noteEntityManager.deleteItem(id);
		const dirty = { ...this.notes.dirty };
		const state = { ...this.notes.state };
		delete dirty[id];
		delete state[id];
		this.notes.dirty = dirty;
		this.notes.state = state;
	}

	async saveSelectedNote() {
		if (this.notes.selectedId && this.notes.selected) {
			if (this.notes.selected.content.status === 'loaded: not created' || this.notes.selected.content.status === 'not loaded: not created') {
				await this.noteEntityManager.createItem(this.notes.selectedId);
				this.notes.dirty = {
					...this.notes.dirty,
					[this.notes.selectedId]: false,
				};
			}
			else if (this.notes.selected.content.status === 'loaded') {
				await this.noteEntityManager.updateItem(this.notes.selectedId);
				this.notes.dirty = {
					...this.notes.dirty,
					[this.notes.selectedId]: false,
				};
			}
			else {
				console.error('This should not happen: trying to save non-loaded note');
			}
		}
		else {
			console.error('This should not happen: trying to save non-selected note');
		}
	}

	cancelSelectedNoteChanges() {
		const id = this.notes.selectedId;
		if (id && this.notes.dirty) {
			this.noteEntityManager.restoreWorkingItem(id);
			const state = { ...this.notes.state };
			delete state[id];
			this.notes.state = state;
			const dirty = { ...this.notes.dirty };
			delete dirty[id];
			this.notes.dirty = dirty;
		}
	}
}