import { BaseEntity, EntityListFileContent } from "@interfaces/EntityData";

export function getEntityListFileContent<C, T extends BaseEntity<C>>(items: { [id in string]: T }): EntityListFileContent<C, T> {
	let entityListFileContent: EntityListFileContent<C,T> = {};
	for (let id in items) {
		const item = { ...items[id] };
		delete item.content;
		entityListFileContent[id] = item;
	}
	return entityListFileContent;
}