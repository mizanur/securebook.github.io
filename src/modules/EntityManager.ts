import { BaseEntity, EntityData, EntityListFileContent, UserEntity } from "@interfaces/EntityData";
import { EntityManager as IEntityManager, EntityTransform } from "@interfaces/EntityManager";
import { Filesystem } from "@interfaces/Filesystem";
import { Password } from "@interfaces/Password";
import { Crypter } from "@interfaces/Crypter";
import { PasswordIncorrect } from "@errors/PasswordIncorrect";
import { getEntityListFileContent } from "@utils/entity";
import { getUUID } from "@utils/uuid";

export class EntityManager<C, T extends BaseEntity<C>> implements IEntityManager<C,T> {
	private readonly entityName: string;
	private readonly entityData: EntityData<C,T>;
	private readonly filesystem: Filesystem;
	private readonly password: Password;
	private readonly crypter: Crypter;
	private readonly transforms: EntityTransform<C,T>[];
	private readonly getDefault: (id: string) => UserEntity<C,T>;

	constructor(entityName: string, entityData: EntityData<C,T>, filesystem: Filesystem, password: Password, crypter: Crypter, transforms: EntityTransform<C,T>[], getDefault: (id: string) => UserEntity<C,T>) {
		this.entityName = entityName;
		this.entityData = entityData;
		this.filesystem = filesystem;
		this.password = password;
		this.crypter = crypter;
		this.transforms = transforms;
		this.getDefault = getDefault;
	}

	private applyTransformsToEntity(entity: T) {
		let transformedEntity: T = entity;
		for (let i = 0; i < this.transforms.length; i++) {
			transformedEntity = this.transforms[i].applyToEntity(transformedEntity);
		}
		return transformedEntity;
	}

	private applyTransformsToContent(content: T['content']) {
		let transformedContent: T['content'] = content;
		for (let i = 0; i < this.transforms.length; i++) {
			transformedContent = this.transforms[i].applyToContent(transformedContent);
		}
		return transformedContent;
	}

	private getEntityListFileName() {
		return `${this.entityName}/list`;
	}

	private getEntityFileName(id: string) {
		return `${this.entityName}/${id}`;
	}

	async loadList() {
		const entityListName = this.getEntityListFileName();
		this.entityData.status = 'loading';
		let isNoteListCreated = false;
		const filesystemContent = await this.filesystem.getFolderContent(`${this.entityName}`);
		const createdFiles: { [k: string]: boolean } = {};
		for (let i = 0; i < filesystemContent.length; i++) {
			const contentItem = filesystemContent[i];
			if (contentItem.path === entityListName) {
				isNoteListCreated = true;
			} else {
				createdFiles[contentItem.path] = true;
			}
		}
		let entityListFileContent: EntityListFileContent<C,T> = {};
		try {
			if (isNoteListCreated) {
				const content = await this.crypter.decrypt(await this.filesystem.getFileContent(entityListName), this.password.hash);
				try {
					entityListFileContent = JSON.parse(content);
				}
				catch(e) {
					this.password.status = 'incorrect';
					throw new PasswordIncorrect();
				}
			}
			else {
				await this.filesystem.createFile(entityListName, await this.crypter.encrypt(JSON.stringify(entityListFileContent), this.password.hash));
			}
		}
		catch(e) {
			if (e instanceof PasswordIncorrect) {
				this.entityData.status = 'not loaded';
			} else {
				this.entityData.status = 'error';
			}
			throw e;
		}
		const loadedlist: EntityData<C,T>['loadedlist'] = {};
		for (const id in entityListFileContent) {
			const entityInListFileWithContent = {
				...entityListFileContent[id],
				content: {
					status: createdFiles[this.getEntityFileName(id)] ? 'not loaded: created' : 'not loaded: not created',
					value: null,
				}
			};
			const entityInList: T = entityInListFileWithContent as T;
			loadedlist[id] = entityInList;
		}
		this.entityData.status = 'loaded';
		this.entityData.loadedlist = loadedlist;
	}

	async loadItem(id: string) {
		this.entityData.status = 'loading entity';
		this.entityData.loadedlist[id].content.status = 'loading';
		let content: C;
		try {
			content = JSON.parse(await this.crypter.decrypt(await this.filesystem.getFileContent(this.getEntityFileName(id)), this.password.hash));
		}
		catch(e) {
			this.entityData.status = 'error';
			this.entityData.loadedlist[id].content.status = 'error';
			throw e;
		}
		this.entityData.loadedlist[id].content.status = 'loaded';
		this.entityData.loadedlist[id].content.value = content;
	}

	async createItem(item: T) {
		item.content.status = 'creating';
		this.entityData.status = 'creating entity';
		const loadedList = { ...this.entityData.loadedlist };
		loadedList[item.id] = item;
		try {
			await this.filesystem.createFile(this.getEntityFileName(item.id), await this.crypter.encrypt(JSON.stringify(item.content.value), this.password.hash));
			await this.filesystem.updateFile(this.getEntityListFileName(), await this.crypter.encrypt(JSON.stringify(getEntityListFileContent(loadedList)), this.password.hash));
		}
		catch(e) {
			this.entityData.status = 'error';
			item.content.status = 'error';
			throw e;
		}
		this.entityData.loadedlist[item.id] = item;
		this.entityData.status = 'loaded';
		item.content.status = 'loaded';
	}

	async updateItem(item: T) {
		item.content.status = 'updating';
		this.entityData.status = 'updating entity';
		const loadedList = { ...this.entityData.loadedlist };
		loadedList[item.id] = item;
		try {
			await this.filesystem.updateFile(this.getEntityFileName(item.id), await this.crypter.encrypt(JSON.stringify(item.content.value), this.password.hash));
			await this.filesystem.updateFile(this.getEntityListFileName(), await this.crypter.encrypt(JSON.stringify(getEntityListFileContent(loadedList)), this.password.hash));
		}
		catch(e) {
			this.entityData.status = 'error';
			item.content.status = 'updating';
			throw e;
		}
		this.entityData.loadedlist[item.id] = item;
		this.entityData.status = 'loaded';
		item.content.status = 'loaded';
	}

	async deleteItem(item: T) {
		const prevItemStatus = item.content.status;
		item.content.status = 'deleting';
		this.entityData.status = 'deleting entity';
		const loadedList = { ...this.entityData.loadedlist };
		delete loadedList[item.id];
		try {
			if (prevItemStatus !== 'not loaded: not created' && prevItemStatus !== 'loaded: not created') {
				await this.filesystem.deleteFile(this.getEntityFileName(item.id));
			}
			await this.filesystem.updateFile(this.getEntityListFileName(), await this.crypter.encrypt(JSON.stringify(getEntityListFileContent(loadedList)), this.password.hash));
		}
		catch(e) {
			item.content.status = 'error';
			this.entityData.status = 'error';
			throw e;
		}
		delete this.entityData.loadedlist[item.id];
		this.entityData.status = 'loaded';
		item.content.status = 'deleted';
	}

	loadWorkingList() {
		const workingList = {};
		for (let id in this.entityData.loadedlist) {
			const item = { ...this.entityData.loadedlist[id] };
			item.content = this.applyTransformsToContent({ ...item.content });
			workingList[id] = this.applyTransformsToEntity(item);
		}
		this.entityData.workingList = workingList;
	}

	createWorkingItem(): T {
		const def = this.getDefault(getUUID());
		const item = {
			...def,
			content: this.applyTransformsToContent({
				...def.content,
				status: 'loaded: not created',
			})
		};
		const workingItem: T = this.applyTransformsToEntity(item as T);
		this.entityData.workingList = {
			...this.entityData.workingList,
			[workingItem.id]: workingItem
		};
		return workingItem;
	}

	updateWorkingItem(workingItem: T): T {
		this.entityData.workingList = {
			...this.entityData.workingList,
			[workingItem.id]: workingItem
		};
		return workingItem;
	}

	deleteWorkingItem(workingItem: T): T {
		const workingList = { ...this.entityData.workingList };
		delete workingList[workingItem.id];
		this.entityData.workingList = workingList;
		return workingItem;
	}
}