import { GitlabAuthData } from "@interfaces/GitlabAuthData";

export function createGitlabAuthData(): GitlabAuthData {
	return {
		data: {
			status: 'Unauthenticated'
		},
		
		get headers() {
			return this.data && this.data.token
				? { authorization: `Bearer ${this.data.token}` }
				: {};
		}
	}
}