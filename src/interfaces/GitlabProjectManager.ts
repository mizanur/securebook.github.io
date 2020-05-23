import { GitlabProject } from "@interfaces/GitlabData";

export interface GitlabProjectManager {
	getProject(): Promise<GitlabProject>;
	createProject(): Promise<GitlabProject>;
}