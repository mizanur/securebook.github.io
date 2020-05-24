import { NoteFileContent } from "@interfaces/Notes";
export type NoteType = 'working' | 'loaded';

export interface NotesManager {
	loadNotes(): Promise<any>;
	addNote<T extends NoteType>(type: T): string;
	editNoteContent<T extends NoteType>(type: T, id: string, content: NoteFileContent): void;
	editNoteTags<T extends NoteType>(type: T, id: string, tags: string[]): void;
	removeNote<T extends NoteType>(type: T, id: string): void;
}