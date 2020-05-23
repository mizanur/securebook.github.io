export class GitlabProjectNotExist extends Error {
	constructor() {
		super("Gitlab project does not exist");
	}
}