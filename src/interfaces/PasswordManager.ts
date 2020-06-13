export interface PasswordManager {
	providePassword(value: string, rememberPassword: boolean): void;
}