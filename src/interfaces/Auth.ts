export interface Auth {
	login();
	onLoginSucceeded(token: string);
	onLoginFailed(error: string, errorDescription: string);
	logout();
}