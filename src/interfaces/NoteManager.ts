import { NoteFileContent, NoteChange, CreateNoteChange, UpdateNoteChange, DeleteNoteChange } from "@interfaces/Notes";

export interface NoteManager {
	loadNotes(): Promise<any>;
	applyChange(noteChange: NoteChange): Promise<any>;
	createWorkingNote(): CreateNoteChange;
	updateWorkingNoteContent(id: string, content: NoteFileContent): UpdateNoteChange;
	updateWorkingNoteTags(id: string, tags: string[]): UpdateNoteChange;
	deleteWorkingNote(id: string): DeleteNoteChange;
	selectNote(id: string): void;
	createNoteAndSelect(): void;
	updateSelectedNoteContent(content: NoteFileContent): void;
	updateSelectedNoteTags(tags: string[]): void;
	deleteNote(id: string): void;
	saveSelectedNote(): void;
}