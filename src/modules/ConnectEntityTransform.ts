import { EntityTransform } from "@interfaces/EntityManager";
import { connectObject } from "typeconnect";
import { BaseEntity } from "@interfaces/EntityData";

export class ConnectEntityTransform<C, T extends BaseEntity<C>> implements EntityTransform<C,T> {
	applyToEntity(item: T): T {
		return connectObject(item);
	}

	applyToContent(content: T['content']): T['content'] {
		return connectObject(content);
	}
}