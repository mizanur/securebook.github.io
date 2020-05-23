export type FileContentItem = {
	type: 'tree' | 'blob',
	path: string
}

export interface Filesystem {
	getFolderContent(path?: string): Promise<Array<FileContentItem>>;
	deleteFolder(path?: string): Promise<any>;
	getFileContent(path: string): Promise<string>;
	createFile(path: string, content: string): Promise<any>;
	updateFile(path: string, content: string): Promise<any>;
	deleteFile(path: string): Promise<any>;
}