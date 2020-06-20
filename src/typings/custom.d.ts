import { GitlabConfig } from "@interfaces/GitlabConfig";

declare module "*.worker" {
	class WebpackWorker extends Worker {
		constructor();
	}

	export default WebpackWorker;
}

declare module '*.svg';

declare global {
	const GITLAB_CONFIG: GitlabConfig;
}