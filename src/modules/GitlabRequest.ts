import { GitlabRequest as IGitlabRequest } from "@interfaces/GitlabRequest";
import { GitlabAuthData } from '@interfaces/GitlabAuthData';
import { GitlabData } from '@interfaces/GitlabData';
import { GitlabConfig } from '@interfaces/GitlabConfig';
import { NoAuth } from "@errors/NoAuth";
import { GitlabProjectNotExist } from "@errors/GitlabProjectNotExist";
import { GitlabProjectManager } from "@interfaces/GitlabProjectManager";
import { Request } from "@interfaces/Request";

export class GitlabRequest implements IGitlabRequest {
	private readonly authData: GitlabAuthData;
	private readonly projectManager: GitlabProjectManager;
	private readonly config: GitlabConfig;
	private readonly gitlabData: GitlabData;
	private readonly request: Request;
	private gitlabProjectPromise: Promise<any>;

	constructor(authData: GitlabAuthData, projectManager: GitlabProjectManager, config: GitlabConfig, gitlabData: GitlabData, request: Request) {
		this.authData = authData;
		this.projectManager = projectManager;
		this.config = config;
		this.gitlabData = gitlabData;
		this.request = request;
	}

	async fetch(input: string, init?: RequestInit) {
		if (!this.authData.data.token) {
			throw new NoAuth();
		}

		if (!this.gitlabData.project) {
			if (!this.gitlabProjectPromise) {
				this.gitlabProjectPromise = this.createGitlabProjectPromise();
			}
			await this.gitlabProjectPromise;
		}

		const url = this.prependUrl(input);
		const params = {
			...(init || {}),
			headers: {
				...this.authData.headers,
				...(init && init.headers || {}),
			}
		};

		return await this.request.fetch(url, params);
	}

	private prependUrl(url: string): string {
		if (!this.gitlabData.project) {
			throw new GitlabProjectNotExist();
		}
		
		return `${this.config.apiUri}/projects/${this.gitlabData.project.id}/${url}`;
	}

	private async createGitlabProjectPromise() {
		try {
			this.gitlabData.project = await this.projectManager.getProject();
		}
		catch (e) {
			if (e instanceof GitlabProjectNotExist) {
				this.gitlabData.project = await this.projectManager.createProject();
			}
			else {
				throw e;
			}
		}
	}
}