export class NoAuth extends Error {
	constructor() {
		super("Authentication is not provided");
	}
}