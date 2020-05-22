import { createRenderer } from "@data/createRenderer";
import { createLocation } from "@view/createLocation";
import { createGitlabAuthIntent } from "@data/createGitlabAuthIntent";

export interface Connected {
	createRenderer: typeof createRenderer,
	createLocation: typeof createLocation,
	createGitlabAuthIntent: typeof createGitlabAuthIntent,
}