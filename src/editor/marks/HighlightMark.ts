import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema, Mark } from "prosemirror-model";
import { toggleMark } from "prosemirror-commands";
import { EditorState } from "prosemirror-state";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { getMarkAttrs } from "@editor/utils/getMarkAttrs";
import { removeMark } from "@editor/utils/removeMark";
import { updateMark } from "@editor/utils/updateMark";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";
import { isHexColorValid, getHexFromColor } from "@utils/color";

export type HighlightMarkAttrs = {
	color: string,
};

export class HighlightMark implements EditorMark, MenuStateItem<'highlight'>, MenuActionItem<'highlight'> {
	readonly name = "highlight";

	readonly markSpec: MarkSpec = {
		attrs: {color: {default: '#FFF'}},
		parseDOM: [{
			tag: "span",
			getAttrs(n: string | Node) {
				const node = n as HTMLElement;
				let color: string;
				if (node.style.backgroundColor &&
					node.style.backgroundColor[0] === '#' &&
					isHexColorValid(color = node.style.backgroundColor.substring(1))) {
					return { color };
				}
				let found;
				if (node.style.backgroundColor &&
					(found = node.style.backgroundColor.match(/^rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i))) {
					return {
						color: getHexFromColor([Number(found[1]), Number(found[2]), Number(found[3])])
					};
				}
				return false;
			}
		}],
		toDOM(mark: Mark) {
			const attrs = mark.attrs as HighlightMarkAttrs;
			const style = `background:#${attrs.color};`;
			return ["span", { style }, 0];
		}
	}

	getMenuState(state: EditorState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(state, schema.marks.highlight);
			},
			get attrs() {
				return getMarkAttrs(state, schema.marks.highlight) as HighlightMarkAttrs;
			},
			get canToggle() {
				return !!toggleMark(schema.marks.highlight)(state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			setColor: (color: string) => updateMark(schema.marks.highlight, { color }),
			reset: () => removeMark(schema.marks.highlight),
		}
	}
}