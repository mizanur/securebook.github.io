import { GitlabAuthStorage as IGitlabAuthStorage } from "@interfaces/GitlabAuthStorage";

export class GitlabAuthStorage implements IGitlabAuthStorage {
	getToken() {
		return window.localStorage.getItem('token');
	}

	setToken(token: string) {
		window.localStorage.setItem('token', token);
	}

	clearToken() {
		window.localStorage.removeItem('token');
	}
}