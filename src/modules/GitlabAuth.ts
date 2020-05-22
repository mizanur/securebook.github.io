import { LocationManager } from "@interfaces/LocationManager";
import { GitlabConfig } from "@interfaces/GitlabConfig";
import { QueryBuilder } from "@interfaces/QueryBuilder";
import { GitlabAuthStorage } from "@interfaces/GitlabAuthStorage";
import { GitlabAuthData } from "@interfaces/GitlabAuthData";
import { Auth } from "@interfaces/Auth";

export class GitlabAuth implements Auth {
	private readonly locationManager: LocationManager;
	private readonly config: GitlabConfig;
	private readonly queryBuilder: QueryBuilder;
	private readonly authStorage: GitlabAuthStorage;
	private readonly authData: GitlabAuthData;

	constructor(locationManager: LocationManager, config: GitlabConfig, queryBuilder: QueryBuilder, authStorage: GitlabAuthStorage, authData: GitlabAuthData) {
		this.locationManager = locationManager;
		this.config = config;
		this.queryBuilder = queryBuilder;
		this.authStorage = authStorage;
		this.authData = authData;
		this.authData.data = this.getInitialStoredData();
	}

	private getInitialStoredData(): GitlabAuthData['data'] {
		const storedToken = this.authStorage.getToken();
		if (typeof storedToken === 'string') {
			return {
				status: 'Authenticated',
				token: storedToken
			};
		} else {
			return {
				status: 'Unauthenticated'
			}
		}
	}

	login() {
		this.locationManager.redirect(
			`${this.config.oAuthUri}?${this.queryBuilder.getStringFromQuery({
				client_id: this.config.oAuthClientId,
				redirect_uri: this.config.oAuthRedirectId,
				response_type: 'token'
			})}`
		);
	}

	onLoginSucceeded(token: string) {
		this.authData.data = {
			status: 'Authenticated',
			token
		};
		this.authStorage.setToken(token);
	}

	onLoginFailed(error: string, errorDescription: string) {
		this.authData.data = {
			status: 'Error',
			error,
			errorDescription
		};
		this.authStorage.clearToken();
	}

	logout() {
		this.authData.data = {
			status: 'Unauthenticated'
		};
		this.authStorage.clearToken();
	}
}