import { EntityData, BaseEntity } from "@interfaces/EntityData";

export function createEntityData<C, T extends BaseEntity<C>>(): EntityData<C, T> {
	return {
		status: 'not loaded',
		loadedList: {},
		workingList: {},
	}
}