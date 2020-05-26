import { BaseEntity } from "@interfaces/EntityData";

export interface EntityTransform<C,T extends BaseEntity<C>> {
	applyToEntity(item: T): T;
	applyToContent(content: T['content']): T['content'];
}

export interface EntityManager<C, T extends BaseEntity<C>> {
	loadList(): void;

	loadItem(id: string): void;
	createItem(item: T): void;
	updateItem(item: T): void;
	deleteItem(item: T): void;

	loadWorkingList(): void;
	createWorkingItem(): T;
	updateWorkingItem(item: T): void;
	deleteWorkingItem(item: T): void;
}