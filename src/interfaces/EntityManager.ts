export type BaseEntity<T> = {
	id: string,
	content: T,
};

export interface EntityManager<C, T extends BaseEntity<C>> {
	loadList(): void;
	loadItem(id: string): void;
}