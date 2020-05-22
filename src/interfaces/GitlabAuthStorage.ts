export interface GitlabAuthStorage {
	getToken(): string | null;
	setToken(token: string);
	clearToken();
}