import { BaseEntity, EntityData, EntityListFileContent, UserEntity } from "@interfaces/EntityData";
import { EntityManager as IEntityManager } from "@interfaces/EntityManager";
import { Filesystem } from "@interfaces/Filesystem";
import { Password } from "@interfaces/Password";
import { Crypter } from "@interfaces/Crypter";
import { PasswordIncorrect } from "@errors/PasswordIncorrect";
import { getEntityListFileContent } from "@utils/entity";
import { getUUID } from "@utils/uuid";
import { deepCopy } from "@utils/deep";

export class EntityManager<C, T extends BaseEntity<C>> implements IEntityManager<C,T> {
	private readonly entityName: string;
	private readonly entityData: EntityData<C,T>;
	private readonly filesystem: Filesystem;
	private readonly password: Password;
	private readonly crypter: Crypter;
	private readonly getDefault: (id: string) => UserEntity<C,T>;
	private currentRequest: Promise<any>;

	constructor(entityName: string, entityData: EntityData<C,T>, filesystem: Filesystem, password: Password, crypter: Crypter, getDefault: (id: string) => UserEntity<C,T>) {
		this.entityName = entityName;
		this.entityData = entityData;
		this.filesystem = filesystem;
		this.password = password;
		this.crypter = crypter;
		this.getDefault = getDefault;
		this.currentRequest = Promise.resolve();
	}

	private getEntityListFileName() {
		return `${this.entityName}/list`;
	}

	private getEntityFileName(id: string) {
		return `${this.entityName}/${id}`;
	}

	private performOnLists(fun: (val: EntityData<C,T>['loadedList'] | EntityData<C,T>['workingList']) => any) {
		fun(this.entityData.loadedList);
		this.entityData.loadedList = { ...this.entityData.loadedList };
		fun(this.entityData.workingList);
		this.entityData.workingList = { ...this.entityData.workingList };
	}

	private async performAfterCurrentRequest<T>(fun: () => Promise<T>): Promise<T> {
		await this.currentRequest;
		const funPromise = fun();
		this.currentRequest = new Promise(resolve => {
			funPromise.then(() => {
				resolve();
			}).catch(() => {
				resolve();
			});
		});
		return await funPromise;
	}

	async loadList() {
		this.performAfterCurrentRequest(async () => {
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
			const loadedList: EntityData<C,T>['loadedList'] = {};
			for (const id in entityListFileContent) {
				const entityInListFileWithContent = {
					...entityListFileContent[id],
					content: {
						status: createdFiles[this.getEntityFileName(id)] ? 'not loaded: created' : 'not loaded: not created',
						value: null,
					}
				};
				const entityInList: T = entityInListFileWithContent as T;
				loadedList[id] = entityInList;
			}
			this.entityData.status = 'loaded';
			this.entityData.loadedList = loadedList;
			this.entityData.workingList = deepCopy(loadedList);
		});
	}

	async loadItem(id: string) {
		this.performAfterCurrentRequest(async () => {
			this.entityData.status = 'loading entity';
			this.performOnLists(list => list[id].content.status = 'loading');
			let content: C;
			try {
				content = JSON.parse(await this.crypter.decrypt(await this.filesystem.getFileContent(this.getEntityFileName(id)), this.password.hash));
			}
			catch(e) {
				this.entityData.status = 'error';
				this.performOnLists(list => list[id].content.status = 'error');
				throw e;
			}
			this.entityData.status = 'loaded';
			this.performOnLists(list => {
				list[id].content.status = 'loaded';
				list[id].content.value = content;
			});
		});
	}

	async createItem(id: string) {
		this.performAfterCurrentRequest(async () => {
			this.entityData.status = 'creating entity';
			this.entityData.workingList[id].content.status = 'creating';
			this.entityData.workingList = { ...this.entityData.workingList };
			const loadedList = { ...this.entityData.loadedList };
			loadedList[id] = this.entityData.workingList[id];
			try {
				await this.filesystem.createFile(this.getEntityFileName(id), await this.crypter.encrypt(JSON.stringify(this.entityData.workingList[id].content.value), this.password.hash));
				await this.filesystem.updateFile(this.getEntityListFileName(), await this.crypter.encrypt(JSON.stringify(getEntityListFileContent(loadedList)), this.password.hash));
			}
			catch(e) {
				this.entityData.status = 'error';
				this.entityData.workingList[id].content.status = 'error';
				this.entityData.workingList = { ...this.entityData.workingList };
				throw e;
			}
			this.entityData.status = 'loaded';
			this.entityData.workingList[id].content.status = 'loaded';
			this.entityData.workingList = { ...this.entityData.workingList };
			this.entityData.loadedList[id] = deepCopy(this.entityData.workingList[id]);
			this.entityData.loadedList = { ...this.entityData.loadedList };
		});
	}

	async updateItem(id: string) {
		this.performAfterCurrentRequest(async () => {
			this.entityData.status = 'updating entity';
			this.performOnLists(list => list[id].content.status = 'updating');
			const loadedList = { ...this.entityData.loadedList };
			loadedList[id] = this.entityData.workingList[id];
			try {
				await this.filesystem.updateFile(this.getEntityFileName(id), await this.crypter.encrypt(JSON.stringify(this.entityData.workingList[id].content.value), this.password.hash));
				await this.filesystem.updateFile(this.getEntityListFileName(), await this.crypter.encrypt(JSON.stringify(getEntityListFileContent(loadedList)), this.password.hash));
			}
			catch(e) {
				this.entityData.status = 'error';
				this.performOnLists(list => list[id].content.status = 'error');
				throw e;
			}
			this.entityData.status = 'loaded';
			this.entityData.workingList[id].content.status = 'loaded';
			this.entityData.workingList = { ...this.entityData.workingList };
			this.entityData.loadedList[id] = deepCopy(this.entityData.workingList[id]);
			this.entityData.loadedList = { ...this.entityData.loadedList };
		});
	}

	async deleteItem(id: string) {
		this.performAfterCurrentRequest(async () => {
			const prevItemStatus = this.entityData.workingList[id].content.status;
			this.entityData.status = 'deleting entity';
			this.performOnLists(list => {
				if (list[id]) {
					list[id].content.status = 'deleting';
				}
			});
			const loadedList = { ...this.entityData.loadedList };
			delete loadedList[id];
			try {
				if (prevItemStatus !== 'loaded: not created') {
					if (prevItemStatus !== 'not loaded: not created') {
						await this.filesystem.deleteFile(this.getEntityFileName(id));
					}
					await this.filesystem.updateFile(this.getEntityListFileName(), await this.crypter.encrypt(JSON.stringify(getEntityListFileContent(loadedList)), this.password.hash));
				}
			}
			catch(e) {
				this.entityData.status = 'error';
				this.performOnLists(list => {
					if (list[id]) {
						list[id].content.status = 'error';
					}
				});
				throw e;
			}
			this.entityData.status = 'loaded';
			this.performOnLists(list => {
				if (list[id]) {
					list[id].content.status = 'deleted';
					delete list[id];
				}
			});
		});
	}

	createWorkingItem(): T {
		const def = this.getDefault(getUUID());
		const item = {
			...def,
			content: {
				...def.content,
				status: 'loaded: not created',
			}
		};
		const workingItem: T = item as T;
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
}