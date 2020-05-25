import { GitlabFilesystem as IGitlabFilesystem } from "@interfaces/GitlabFilesystem";
import { GitlabRequest } from "@interfaces/GitlabRequest";
import { GitlabCommits } from "@interfaces/GitlabCommits";
import { QueryBuilder } from "@interfaces/QueryBuilder";
import { ResponseError } from "@errors/ResponseError";
import { FileNotExist } from "@errors/FileNotExist";
import { FileContentItem } from "@interfaces/Filesystem";

type GetFolderContentQuery = {
	page: number,
	path?: string,
	per_page?: number,
	recursive?: boolean
}

export class GitlabFilesystem implements IGitlabFilesystem {
	private readonly request: GitlabRequest;
	private readonly commits: GitlabCommits;
	private readonly queryBuilder: QueryBuilder;

	constructor(request: GitlabRequest, commits: GitlabCommits, queryBuilder: QueryBuilder) {
		this.request = request;
		this.commits = commits;
		this.queryBuilder = queryBuilder;
	}

	async getFolderContent(path?: string, recursive?: boolean) {
		let page = 1;
		let result: Array<FileContentItem>;
		const folderContent: Array<FileContentItem> = [];

		do {
			const query: GetFolderContentQuery = { page };
			if (path !== undefined) {
				query.path = path;
			}
			if (recursive !== undefined) {
				query.recursive = recursive;
			}
			const queryString = this.queryBuilder.getStringFromQuery(query);
			const url = 'repository/tree?' + queryString;
			const response = await this.request.fetch(url);
			if (response.status === 404) {
				result = [];
			}
			else if (response.status !== 200) {
				throw new ResponseError(url, response.status, response.statusText);
			}
			else {
				result = await response.json();
			}
			folderContent.push(...result);
			page++;
		}
		while (result.length);

		return folderContent;
	}

	async deleteFolder(path?: string) {
		const folderContent: Array<FileContentItem> = await this.getFolderContent(path, true);
		this.commits.startCommit();
		for (let i = 0; i < folderContent.length; i++) {
			const folderContentItem = folderContent[i];
			if (folderContentItem.type === 'blob') {
				this.commits.delete(folderContentItem.path);
			}
		}
		return await this.commits.performCommit(`Delete folder "${path || ""}"`);
	}

	async getFileContent(path: string) {
		const url = `repository/files/${encodeURIComponent(path)}/raw?ref=master`;
		const response = await this.request.fetch(url);
		if (response.status === 200) {
			return await response.text();
		}
		else if (response.status === 404) {
			throw new FileNotExist(path);
		}
		else {
			throw new ResponseError(url, response.status, response.statusText);
		}
	}

	async createFile(path: string, content: string) {
		this.commits.startCommit();
		this.commits.create(path, content);
		return await this.commits.performCommit(`Create file "${path}"`);
	}

	async updateFile(path: string, content: string) {
		this.commits.startCommit();
		this.commits.update(path, content);
		return await this.commits.performCommit(`Update file "${path}"`);
	}

	async deleteFile(path: string) {
		this.commits.startCommit();
		this.commits.delete(path);
		return await this.commits.performCommit(`Delete file "${path}"`);
	}
}