export class PasswordIncorrect extends Error {
	constructor() {
		super("Provided password is incorrect");
	}
}