import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { toggleMark } from "prosemirror-commands";
import { EditorState } from "prosemirror-state";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class StrongMark implements EditorMark, KeyBindings, MenuStateItem<'strong'>, MenuActionItem<'strong'> {
	readonly name = "strong";

	readonly markSpec: MarkSpec = {
		parseDOM: [
			{ tag: "strong" },
			// This works around a Google Docs misbehavior where
			// pasted content will be inexplicably wrapped in `<b>`
			// tags with a font-weight normal.
			{
				tag: "b",
				getAttrs(node: any) {
					return node.style.fontWeight != "normal" && null;
				}
			},
			{
				style: "font-weight",
				getAttrs(value: any) {
					return (/^(bold(er)?|[5-9]\d{2,})$/).test(value) && null;
				}
			}
		],
		toDOM() {
			return ["strong", 0];
		}
	}

	addKeyBindings(addKeyBinding: AddKeyBinding, schema: Schema) {
		addKeyBinding("Mod-b", toggleMark(schema.marks.strong));
		addKeyBinding("Mod-B", toggleMark(schema.marks.strong));
	}

	getMenuState(state: EditorState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(state, schema.marks.strong);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleMark(schema.marks.strong),
		}
	}
}