export interface Request {
	fetch(url: string, init?: RequestInit): Promise<Response>;
}