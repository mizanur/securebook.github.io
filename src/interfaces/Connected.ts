import { createRenderer } from "@data/createRenderer";
import { createLocation } from "@view/createLocation";
import { createGitlabAuthIntent } from "@data/createGitlabAuthIntent";
import { createGitlabAuthData } from "@data/createGitlabAuthData";
import { createIntentManager } from "@data/createIntentManager";

export interface Connected {
	createRenderer: typeof createRenderer,
	createLocation: typeof createLocation,
	createGitlabAuthIntent: typeof createGitlabAuthIntent,
	createGitlabAuthData: typeof createGitlabAuthData,
	createIntentManager: typeof createIntentManager,
}