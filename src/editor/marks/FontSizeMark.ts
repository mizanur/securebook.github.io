import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema, Mark } from "prosemirror-model";
import { toggleMark } from "prosemirror-commands";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { minEditorFontSize, maxEditorFontSize, defaultFontSize } from "@view/fonts";
import { getMarkAttrs } from "@editor/utils/getMarkAttrs";
import { removeMark } from "@editor/utils/removeMark";
import { updateMark } from "@editor/utils/updateMark";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export type FontSizeMarkAttrs = {
	fontSize: number,
};

export class FontSizeMark implements EditorMark, MenuStateItem<'font_size'>, MenuActionItem<'font_size'> {
	readonly name = "font_size";

	readonly markSpec: MarkSpec = {
		attrs: {fontSize: {default: defaultFontSize}},
		parseDOM: [{
			tag: "span",
			getAttrs(n: string | Node) {
				const node = n as HTMLElement;
				let found;
				if (node.style.fontSize &&
					(found = node.style.fontSize.match(/^\s*(\d+)px\s*$/i))) {
					const fontSize = Number(found[1]);
					if (fontSize >= minEditorFontSize && fontSize <= maxEditorFontSize) {
						return { fontSize };
					}
				}
				return false;
			}
		}],
		toDOM(mark: Mark) {
			const attrs = mark.attrs as FontSizeMarkAttrs;
			const style = `font-size:${attrs.fontSize}px;`;
			return ["span", { style }, 0];
		}
	}

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(current.state, schema.marks.font_size);
			},
			get attrs() {
				return getMarkAttrs(current.state, schema.marks.font_size) as FontSizeMarkAttrs;
			},
			get canToggle() {
				return !!toggleMark(schema.marks.font_size)(current.state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			setFontSize: (fontSize: number) => {
				if (fontSize >= minEditorFontSize && fontSize <= maxEditorFontSize) {
					return updateMark(schema.marks.font_size, {
						fontSize,
					});
				}
				else {
					return removeMark(schema.marks.font_size);
				}
			},
			reset: () => removeMark(schema.marks.font_size),
		}
	}
}