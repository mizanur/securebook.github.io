export class ResponseError extends Error {
	public readonly url: string;
	public readonly statusCode: number;
	public readonly statusText: string;

	constructor(url: string, statusCode: number, statusText: string) {
		super(`Error requesting ${url}: ${statusCode} ${statusText}`);
		this.url;
		this.statusCode = statusCode;
		this.statusText = statusText;
	}
}