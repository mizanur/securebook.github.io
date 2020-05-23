export class FileNotExist extends Error {
	public readonly url: string;

	constructor(url: string) {
		super(`File ${url} does not exist`);
		this.url = url;
	}
}