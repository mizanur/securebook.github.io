export interface PathManager {
	onAuthCompleted(): void;
	onNoteSelected(id: string | null): void;
}