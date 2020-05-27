import { Schema } from "prosemirror-model";
import { Plugin } from "prosemirror-state";

export interface EditorPlugins {
	addEditorPlugins(addEditorPlugin: AddEditorPlugin, schema: Schema): void;
}

export type AddEditorPlugin = (editorPlugin: Plugin) => void;