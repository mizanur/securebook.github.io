import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { KeyBindingsManager as IKeyBindingsManager, KeyMap } from "@editor/interfaces/KeyBindingsManager";
import { Schema } from "prosemirror-model";
import { EditorPlugins, AddEditorPlugin } from "@editor/interfaces/EditorPlugins";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

export class KeyBindingsManager implements IKeyBindingsManager, EditorPlugins {
	private readonly keyBindings: KeyBindings[];

	constructor(keyBindings: KeyBindings[]) {
		this.keyBindings = keyBindings;
	}

	addEditorPlugins(addEditorPlugin: AddEditorPlugin, schema: Schema) {
		addEditorPlugin(keymap(this.getKeyMap(schema)));
		addEditorPlugin(keymap(baseKeymap));
	}

	getKeyMap(schema: Schema) {
		const isMac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;
		const keys: KeyMap = {};
		const addKeyBinding: AddKeyBinding = (key, cmd) => {
			keys[key] = cmd;
		};
		for (let i = 0; i < this.keyBindings.length; i++) {
			const keyBindings = this.keyBindings[i];
			keyBindings.addKeyBindings(addKeyBinding, schema, isMac);
		}
		return keys;
	}
}