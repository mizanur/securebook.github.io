import { createRenderer } from "@data/createRenderer";
import { createLocation } from "@view/createLocation";
import { createGitlabAuthIntent } from "@data/createGitlabAuthIntent";
import { createGitlabAuthData } from "@data/createGitlabAuthData";
import { createIntents } from "@data/createIntents";
import { createNoteViewerIntent } from "@data/createNoteViewerIntent";
import { createGitlabData } from "@data/createGitlabData";
import { createPassword } from "@data/createPassword";
import { createNotes } from "@data/createNotes";

export interface Connected {
	createRenderer: typeof createRenderer,
	createLocation: typeof createLocation,
	createGitlabAuthIntent: typeof createGitlabAuthIntent,
	createGitlabAuthData: typeof createGitlabAuthData,
	createIntents: typeof createIntents,
	createNoteViewerIntent: typeof createNoteViewerIntent,
	createGitlabData: typeof createGitlabData,
	createPassword: typeof createPassword,
	createNotes: typeof createNotes,
}