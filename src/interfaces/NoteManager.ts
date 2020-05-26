import { NoteContent } from "@interfaces/Notes";

export interface NoteManager {
	loadNotes(): Promise<any>;
	selectNote(id: string | null): void;
	createNoteAndSelect(): void;
	updateSelectedNoteContent(content: NoteContent): void;
	updateSelectedNoteTags(tags: string[]): void;
	deleteNote(id: string): void;
	saveSelectedNote(): void;
}