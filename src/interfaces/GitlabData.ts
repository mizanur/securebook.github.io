export type GitlabProject = {
	id: number,
	name: string,
	visibility: string
}

export interface GitlabData {
	project: null | GitlabProject
}