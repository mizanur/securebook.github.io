import { LocationManager } from "@interfaces/LocationManager";
import { GitlabConfig } from "@interfaces/GitlabConfig";
import { QueryBuilder } from "@interfaces/QueryBuilder";
import { GitlabAuthStorage } from "@interfaces/GitlabAuthStorage";
import { GitlabAuthData } from "@interfaces/GitlabAuthData";
import { GitlabAuth as IGitlabAuth } from "@interfaces/GitlabAuth";
import { AuthURLStorage } from "@interfaces/AuthURLStorage";
import { PassStorage } from "@interfaces/PassStorage";

export class GitlabAuth implements IGitlabAuth {
	private readonly locationManager: LocationManager;
	private readonly config: GitlabConfig;
	private readonly queryBuilder: QueryBuilder;
	private readonly authStorage: GitlabAuthStorage;
	private readonly authData: GitlabAuthData;
	private readonly authURLStorage: AuthURLStorage;
	private readonly passStorage: PassStorage;

	constructor(locationManager: LocationManager, config: GitlabConfig, queryBuilder: QueryBuilder, authStorage: GitlabAuthStorage, authData: GitlabAuthData, authURLStorage: AuthURLStorage, passStorage: PassStorage) {
		this.locationManager = locationManager;
		this.config = config;
		this.queryBuilder = queryBuilder;
		this.authStorage = authStorage;
		this.authData = authData;
		this.authURLStorage = authURLStorage;
		this.authData.data = this.getInitialStoredData();
		this.passStorage = passStorage;
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
		this.authURLStorage.storeURL();
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
		this.passStorage.delete();
	}
}