import { AuthData } from "@interfaces/AuthData";
import { Intents } from "@interfaces/Intents";
import { Password } from "@interfaces/Password";
import { Notes } from "@interfaces/Notes";
import { Editor } from "@interfaces/Editor";
import { DarkMode } from "@interfaces/DarkMode";
import { NoteViewerIntent } from "@interfaces/NoteViewerIntent";

export interface Store {
	authData: AuthData;
	intents: Intents,
	password: Password,
	notes: Notes,
	editor: Editor,
	darkMode: DarkMode,
	noteViewerIntent: NoteViewerIntent,
}