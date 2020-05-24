import { GitlabProjectManager as IGitlabProjectManager } from '@interfaces/GitlabProjectManager';
import { GitlabAuthData } from '@interfaces/GitlabAuthData';
import { GitlabConfig } from '@interfaces/GitlabConfig';
import { NoAuth } from '@errors/NoAuth';
import { GitlabProject } from '@interfaces/GitlabData';
import { GitlabProjectNotExist } from '@errors/GitlabProjectNotExist';
import { ResponseError } from '@errors/ResponseError';

export class GitlabProjectManager implements IGitlabProjectManager {
	private readonly authData: GitlabAuthData;
	private readonly config: GitlabConfig;

	constructor(authData: GitlabAuthData, config: GitlabConfig) {
		this.authData = authData;
		this.config = config;
	}

	async getProject() {
		if (!this.authData.data.token) {
			throw new NoAuth();
		}
		const response = await fetch(`${this.config.apiUri}/projects?owned=true&search=secure-book-notes`, {
			headers: this.authData.headers
		});
		if (response.status === 200) {
			const result: Array<GitlabProject> = await response.json();
			if (result.length) {
				return result[0];
			} else {
				throw new GitlabProjectNotExist();
			}
			
		} else {
			throw new ResponseError(response.url, response.status, response.statusText);
		}
	}

	async createProject() {
		if (!this.authData.data.token) {
			throw new NoAuth();
		}
		const response = await fetch(`${this.config.apiUri}/projects`, {
			method: 'post',
			headers: {
				...this.authData.headers,
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				name: 'secure-book-notes',
				visibility: 'private'
			})
		});
		if (response.status === 201) {
			return await response.json();
		} else {
			throw new ResponseError(response.url, response.status, response.statusText);
		}
	}
}