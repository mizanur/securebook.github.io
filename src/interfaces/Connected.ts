import { createRenderer } from "@data/createRenderer";
import { createLocation } from "@view/createLocation";
import { createGitlabNotifyAuth } from "@data/createGitlabNotifyAuth";
import { createGitlabAuthData } from "@data/createGitlabAuthData";
import { createIntents } from "@data/createIntents";
import { createNoteViewerIntent } from "@data/createNoteViewerIntent";
import { createGitlabData } from "@data/createGitlabData";
import { createPassword } from "@data/createPassword";
import { createNotes } from "@data/createNotes";
import { createEntityData } from "@data/createEntityData";
import { createDarkMode } from "@view/createDarkMode";

export interface Connected {
	createRenderer: typeof createRenderer,
	createLocation: typeof createLocation,
	createGitlabNotifyAuth: typeof createGitlabNotifyAuth,
	createGitlabAuthData: typeof createGitlabAuthData,
	createIntents: typeof createIntents,
	createNoteViewerIntent: typeof createNoteViewerIntent,
	createGitlabData: typeof createGitlabData,
	createPassword: typeof createPassword,
	createNotes: typeof createNotes,
	createEntityData: typeof createEntityData,
	createDarkMode: typeof createDarkMode,
}