import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema, Mark } from "prosemirror-model";
import { toggleMark } from "prosemirror-commands";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { getMarkAttrs } from "@editor/utils/getMarkAttrs";
import { removeMark } from "@editor/utils/removeMark";
import { updateMark } from "@editor/utils/updateMark";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";
import { isHexColorValid, getHexFromColor } from "@utils/color";

export type FontColorMarkAttrs = {
	color: string,
};

export class FontColorMark implements EditorMark, MenuStateItem<'font_color'>, MenuActionItem<'font_color'> {
	readonly name = "font_color";

	readonly markSpec: MarkSpec = {
		attrs: {color: {default: '#2e2e2e'}},
		parseDOM: [{
			tag: "span",
			getAttrs(n: string | Node) {
				const node = n as HTMLElement;
				let color: string;
				if (node.style.color &&
					node.style.color[0] === '#' &&
					isHexColorValid(color = node.style.color.substring(1))) {
					return { color };
				}
				let found;
				if (node.style.color &&
					(found = node.style.color.match(/^rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i))) {
					return {
						color: getHexFromColor([Number(found[1]), Number(found[2]), Number(found[3])])
					};
				}
				return false;
			}
		}],
		toDOM(mark: Mark) {
			const attrs = mark.attrs as FontColorMarkAttrs;
			const style = `color:#${attrs.color};`;
			return ["span", { style }, 0];
		}
	}

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(current.state, schema.marks.font_color);
			},
			get attrs() {
				return getMarkAttrs(current.state, schema.marks.font_color) as FontColorMarkAttrs;
			},
			get canToggle() {
				return !!toggleMark(schema.marks.font_color)(current.state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			setColor: (color: string) => updateMark(schema.marks.font_color, { color }),
			reset: () => removeMark(schema.marks.font_color),
		}
	}
}