import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { Schema } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { AddEditorPlugin, EditorPlugins } from "@editor/interfaces/EditorPlugins";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class History implements KeyBindings, EditorPlugins, MenuStateItem<'history'>, MenuActionItem<'history'> {
	readonly name = 'history';

	addEditorPlugins(addEditorPlugin: AddEditorPlugin, schema: Schema) {
		addEditorPlugin(history());
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, _schema: Schema, isMac: boolean) {
		addKeyBinding("Mod-z", undo);
		addKeyBinding("Shift-Mod-z", redo);
		if (!isMac) {
			addKeyBinding("Mod-y", redo);
		}
	}

	getMenuState(current: EditorActiveState) {
		return {
			get canUndo() {
				return !!undo(current.state);
			},
			get canRedo() {
				return !!redo(current.state);
			},
		}
	}

	getMenuActions() {
		return {
			undo: () => undo,
			redo: () => redo,
		}
	}
}