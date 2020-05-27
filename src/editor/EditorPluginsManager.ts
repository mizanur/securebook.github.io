import { EditorPlugins, AddEditorPlugin } from "@editor/interfaces/EditorPlugins";
import { Plugin } from "prosemirror-state";
import { Schema } from "prosemirror-model";
import { EditorPluginsManager as IEditorPluginsManager } from "@editor/interfaces/EditorPluginsManager";

export class EditorPluginsManager implements IEditorPluginsManager {
	private readonly editorPlugins: EditorPlugins[];

	constructor(editorPlugins: EditorPlugins[]) {
		this.editorPlugins = editorPlugins;
	}

	getPlugins(schema: Schema): Plugin[] {
		const plugins: Plugin[] = [];
		const addEditorPlugin: AddEditorPlugin = (editorPlugin) => {
			plugins.push(editorPlugin);
		};
		for (let i = 0; i < this.editorPlugins.length; i++) {
			const editorPlugins = this.editorPlugins[i];
			editorPlugins.addEditorPlugins(addEditorPlugin, schema);
		}
		return plugins;
	}
}