import { BaseEntity } from "@interfaces/EntityData";

export interface EntityManager<C, T extends BaseEntity<C>> {
	loadList(): Promise<void>;
	loadItem(id: string): Promise<void>;
	createItem(id: string): Promise<void>;
	updateItem(id: string): Promise<void>;
	deleteItem(id: string): Promise<void>;
	createWorkingItem(): T;
	updateWorkingItem(item: T): void;
	restoreWorkingItem(id: string): void;
}