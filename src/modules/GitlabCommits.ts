import { GitlabCommits as IGitlabCommits } from '@interfaces/GitlabCommits';
import { GitlabRequest } from '@interfaces/GitlabRequest';
import { ResponseError } from '@errors/ResponseError';

export type CreateAction = {
	action: 'create',
	file_path: string,
	content: string
}

export type UpdateAction = {
	action: 'update',
	file_path: string,
	content: string
}

export type DeleteAction = {
	action: 'delete',
	file_path: string
}

export type CommitBody = {
	branch: 'master',
	commit_message: string,
	actions: Array<CreateAction | UpdateAction | DeleteAction>
}

export class GitlabCommits implements IGitlabCommits {
	private readonly request: GitlabRequest;
	private currentActions: Array<CreateAction | UpdateAction | DeleteAction>;

	constructor(request: GitlabRequest) {
		this.request = request;
	}

	startCommit() {
		this.currentActions = [];
	}

	create(path: string, content: string) {
		const createAction: CreateAction = {
			action: 'create',
			file_path: path,
			content
		};
		this.currentActions.push(createAction);
	}

	update(path: string, content: string) {
		const updateAction: UpdateAction = {
			action: 'update',
			file_path: path,
			content
		};
		this.currentActions.push(updateAction);
	}

	delete(path: string) {
		const deleteAction: DeleteAction = {
			action: 'delete',
			file_path: path
		};
		this.currentActions.push(deleteAction);
	}

	async performCommit(commitMessage: string) {
		const url = 'repository/commits';
		const commitBody: CommitBody = {
			branch: 'master',
			commit_message: commitMessage,
			actions: this.currentActions
		};
		const response = await this.request.fetch(url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(commitBody)
		});
		if (response.status === 201) {
			return await response.json();
		}
		else {
			throw new ResponseError(url, response.status, response.statusText);
		}
	}
}