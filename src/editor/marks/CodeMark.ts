import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { toggleMark } from "prosemirror-commands";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class CodeMark implements EditorMark, KeyBindings, MenuStateItem<'code'>, MenuActionItem<'code'> {
	readonly name = "code";

	readonly markSpec: MarkSpec = {
		parseDOM: [{tag: "code"}],
		toDOM() {
			return ["code", 0];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Mod-`", toggleMark(schema.marks.code));
	}

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(current.state, schema.marks.code);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(current.state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleMark(schema.marks.code),
		}
	}
}