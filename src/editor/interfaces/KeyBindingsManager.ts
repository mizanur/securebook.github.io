import { EditorCommand } from "@editor/interfaces/EditorCommand";
import { Schema } from "prosemirror-model";

export type KeyMap = {
	[K: string]: EditorCommand
}

export interface KeyBindingsManager {
	getKeyMap(schema: Schema): KeyMap;
}