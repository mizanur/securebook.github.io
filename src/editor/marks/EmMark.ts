import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { toggleMark } from "prosemirror-commands";
import { EditorState } from "prosemirror-state";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class EmMark implements EditorMark, KeyBindings, MenuStateItem<'em'>, MenuActionItem<'em'> {
	readonly name = "em";

	readonly markSpec: MarkSpec = {
		parseDOM: [
			{tag: "i"},
			{tag: "em"},
			{style: "font-style=italic"}
		],
		toDOM() {
			return ["em", 0];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Mod-i", toggleMark(schema.marks.em));
		addKeyBinding("Mod-I", toggleMark(schema.marks.em));
	}

	getMenuState(state: EditorState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(state, schema.marks.em);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleMark(schema.marks.em),
		}
	}
}