export type AuthStatus = 'Unauthenticated' | 'Error' | 'Authenticated';
export interface AuthData {
	data: {
		status: AuthStatus;
		token?: string;
		error?: string;
		errorDescription?: string;
	}
}