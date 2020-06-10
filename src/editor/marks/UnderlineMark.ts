import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { toggleMark } from "prosemirror-commands";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class UnderlineMark implements EditorMark, KeyBindings, MenuStateItem<'underline'>, MenuActionItem<'underline'> {
	readonly name = "underline";

	readonly markSpec: MarkSpec = {
		parseDOM: [
			{
				style: "text-decoration",
				getAttrs(value: any) {
					return (/(^|\s)underline(\s|$)/).test(value) && null;
				}
			}
		],
		toDOM() {
			return ["span", { style: "text-decoration: underline;" }, 0];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Mod-u", toggleMark(schema.marks.underline));
		addKeyBinding("Mod-U", toggleMark(schema.marks.underline));
	}

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(current.state, schema.marks.underline);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(current.state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleMark(schema.marks.underline),
		}
	}
}