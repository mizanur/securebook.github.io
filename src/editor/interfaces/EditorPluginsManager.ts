import { Schema } from "prosemirror-model";
import { Plugin } from "prosemirror-state";

export interface EditorPluginsManager {
	getPlugins(schema: Schema): Plugin[]
}