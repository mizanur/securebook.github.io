import { GitlabConfig } from "@interfaces/GitlabConfig";

export class GitlabDev implements GitlabConfig {
	apiUri = "https://gitlab.com/api/v4";
	oAuthUri = "https://gitlab.com/oauth/authorize";
	oAuthClientId = "7fc2d48d8e06b0f051da1ec0344f1bebb0403e35a7e5cb8a1a7fb7758711e3c1";
	oAuthRedirectId = "http://192.168.0.244:8080/?token_response=gitlab_oauth";
}