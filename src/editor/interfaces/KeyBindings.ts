import { Schema } from "prosemirror-model";
import { EditorCommand } from "@editor/interfaces/EditorCommand";

export interface KeyBindings {
	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema, isMac?: boolean): void;
}

export type AddKeyBinding = (key: string, cmd: EditorCommand) => void;