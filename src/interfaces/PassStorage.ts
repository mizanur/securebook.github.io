export interface PassStorage {
	get(): string | null;

	set(value: string): void;

	delete(): void;
}