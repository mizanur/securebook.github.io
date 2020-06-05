import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { toggleMark } from "prosemirror-commands";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { unwrap } from "@utils/wrap";

export class StrikethroughMark implements EditorMark {
	name: string = "strikethrough";

	markSpec: MarkSpec = {
		parseDOM: [
			{
				style: "text-decoration",
				getAttrs(value: any) {
					return (/(^|\s)line-through(\s|$)/).test(value) && null;
				}
			}
		],
		toDOM() {
			return ["span", { style: "text-decoration: line-through;" }, 0];
		}
	}

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(unwrap(state), schema.marks.strikethrough);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(unwrap(state));
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleMark(schema.marks.strikethrough),
		}
	}
}