import { createRenderer } from "@data/createRenderer";
import { createLocation } from "@view/createLocation";
import { createGitlabAuthIntent } from "@data/createGitlabAuthIntent";
import { createGitlabAuthData } from "@data/createGitlabAuthData";
import { createIntents } from "@data/createIntents";
import { createBookSelectIntent } from "@data/createBookSelectIntent";
import { createGitlabData } from "@data/createGitlabData";

export interface Connected {
	createRenderer: typeof createRenderer,
	createLocation: typeof createLocation,
	createGitlabAuthIntent: typeof createGitlabAuthIntent,
	createGitlabAuthData: typeof createGitlabAuthData,
	createIntents: typeof createIntents,
	createBookSelectIntent: typeof createBookSelectIntent,
	createGitlabData: typeof createGitlabData,
}