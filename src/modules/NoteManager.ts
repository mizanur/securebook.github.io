import { NoteManager as INoteManager } from "@interfaces/NoteManager";
import { Notes, Note, NoteContent } from "@interfaces/Notes";
import { EntityManager } from "@interfaces/EntityManager";

const maxNameCharacters = 50;

export class NoteManager implements INoteManager {
	private readonly notes: Notes;
	private readonly noteEntityManager: EntityManager<NoteContent,Note>;
	
	constructor(notes: Notes, noteEntityManager: EntityManager<NoteContent,Note>) {
		this.notes = notes;
		this.noteEntityManager = noteEntityManager;
	}

	async loadNotes() {
		await this.noteEntityManager.loadList();
	}

	async selectNote(id: string | null) {
		this.notes.selectedId = id;
		
		if (id && this.notes.selected && this.notes.selected.content.status === 'not loaded: created') {
			await this.noteEntityManager.loadItem(id);
		}
	}

	createNoteAndSelect(): void {
		const { id } = this.noteEntityManager.createWorkingItem();
		this.notes.selectedId = id;
	}

	updateSelectedNoteContent(contentValue: NoteContent): void {
		if (!this.notes.selectedId || !this.notes.selected) {
			console.error('This should not happen: trying to update non-selected note content')
		}
		else {
			const note = this.notes.selected;
			note.name = contentValue.text.substring(0, maxNameCharacters);
			note.content.value = contentValue;
			this.noteEntityManager.updateWorkingItem(note);
		}
	}

	updateSelectedNoteTags(tags: string[]): void {
		if (!this.notes.selectedId || !this.notes.selected) {
			console.error('This should not happen: trying to update non-selected note content')
		}
		else {
			const note = this.notes.selected;
			note.tags = tags;
			this.noteEntityManager.updateWorkingItem(note);
		}
	}

	deleteNote(id: string): void {
		if (id === this.notes.selectedId) {
			this.notes.selectedId = null;
		}
		this.noteEntityManager.deleteItem(id);
	}

	saveSelectedNote(): void {
		if (this.notes.selectedId && this.notes.selected) {
			if (this.notes.selected.content.status === 'loaded: not created' || this.notes.selected.content.status === 'not loaded: not created') {
				this.noteEntityManager.createItem(this.notes.selectedId);
			}
			else if (this.notes.selected.content.status === 'loaded') {
				this.noteEntityManager.updateItem(this.notes.selectedId);
			}
			else {
				console.error('This should not happen: trying to save non-loaded note');
			}
		}
		else {
			console.error('This should not happen: trying to save non-selected note');
		}
	}
}