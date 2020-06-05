import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { KeyBindings, AddKeyBinding } from "@editor/interfaces/KeyBindings";
import { toggleMark } from "prosemirror-commands";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { unwrap } from "@utils/wrap";

export class EmMark implements EditorMark, KeyBindings {
	name: string = "em";

	markSpec: MarkSpec = {
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

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(unwrap(state), schema.marks.em);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(unwrap(state));
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleMark(schema.marks.em),
		}
	}
}