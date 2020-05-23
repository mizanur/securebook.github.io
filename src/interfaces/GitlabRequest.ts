export interface GitlabRequest {
	fetch(input: string, init?: RequestInit): Promise<Response>;
}