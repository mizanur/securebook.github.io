import { Location } from "@interfaces/Location";
import { GitlabAuth } from "@interfaces/GitlabAuth";
import { PathManager } from "@interfaces/PathManager";

export function createGitlabAuthIntent(location: Location, pathManager: PathManager, auth: GitlabAuth) {
	return {
		isCurrentIntentValid: false,

		get isCurrentIntent() {
			const query = location.query;
			return (
				query.token_response === 'gitlab_oauth'
			);
		},
	
		notifyAuth() {
			if (this.isCurrentIntentValid) {
				const query = location.query;
				if (query.access_token) {
					auth.onLoginSucceeded(query.access_token);
				} else {
					auth.onLoginFailed(
						query.error || '',
						query.error_description || ''
					);
				}
				pathManager.onAuthCompleted();
			}
		}
	}
}