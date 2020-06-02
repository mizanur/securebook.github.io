import { EditorCommand } from "@editor/interfaces/EditorCommand";
import { KeyBindings } from "@editor/interfaces/KeyBindings";
import { Schema } from "prosemirror-model";

export type KeyMap = {
	[K: string]: EditorCommand
}

export interface KeyBindingsManager {
	getKeyMap(keyBindings: KeyBindings, schema: Schema): KeyMap;
}