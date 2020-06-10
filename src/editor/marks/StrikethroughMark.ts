import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { toggleMark } from "prosemirror-commands";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export class StrikethroughMark implements EditorMark, MenuStateItem<'strikethrough'>, MenuActionItem<'strikethrough'> {
	readonly name = "strikethrough";

	readonly markSpec: MarkSpec = {
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

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(current.state, schema.marks.strikethrough);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(current.state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			toggle: () => toggleMark(schema.marks.strikethrough),
		}
	}
}