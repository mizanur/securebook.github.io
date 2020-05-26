import { Location } from "@interfaces/Location";
import { GitlabAuth } from "@interfaces/GitlabAuth";
import { PathManager } from "@interfaces/PathManager";

export function createGitlabNotifyAuth(location: Location, pathManager: PathManager, auth: GitlabAuth) {
	return {
		notifyAuthWhenLoggedIn() {
			const query = location.query;
			if (query.token_response === 'gitlab_oauth') {
				if (query.access_token) {
					auth.onLoginSucceeded(query.access_token);
				}
				else {
					auth.onLoginFailed(
						query.error || '',
						query.error_description || ''
					);
				}
			}
			pathManager.onAuthCompleted();
		}
	}
}