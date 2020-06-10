import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema, Mark } from "prosemirror-model";
import { toggleMark } from "prosemirror-commands";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { getMarkAttrs } from "@editor/utils/getMarkAttrs";
import { removeMark } from "@editor/utils/removeMark";
import { updateMark } from "@editor/utils/updateMark";
import { defaultFonts, fontTypeLookup, defaultFontsLookup } from "@view/fonts";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";

export type FontFamilyMarkAttrs = {
	fontFamily: string,
};

export class FontFamilyMark implements EditorMark, MenuStateItem<'font_family'>, MenuActionItem<'font_family'> {
	readonly name = "font_family";

	readonly markSpec: MarkSpec = {
		attrs: {fontFamily: {default: defaultFontsLookup.default}},
		parseDOM: [{
			tag: "span",
			getAttrs(n: string | Node) {
				const node = n as HTMLElement;
				let found;
				if (node.style.fontFamily &&
					(found = node.style.fontFamily.match(/^\s*['"]?(.*?)(['",]|$)/))) {
					const fontFamily = found[1];
					if (defaultFonts.indexOf(fontFamily) >= 0) {
						return { fontFamily };
					}
				}
				return false;
			}
		}],
		toDOM(mark: Mark) {
			const attrs = mark.attrs as FontFamilyMarkAttrs;
			const style = `font-family:"${attrs.fontFamily}",${fontTypeLookup[attrs.fontFamily]};`;
			return ["span", { style }, 0];
		}
	}

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(current.state, schema.marks.font_family);
			},
			get attrs() {
				return getMarkAttrs(current.state, schema.marks.font_family) as FontFamilyMarkAttrs;
			},
			get canToggle() {
				return !!toggleMark(schema.marks.font_family)(current.state);
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			setFontFamily: (fontFamily: string) => {
				if (defaultFonts.indexOf(fontFamily) >= 0) {
					return updateMark(schema.marks.font_family, {
						fontFamily,
					});
				}
				else {
					return removeMark(schema.marks.font_family);
				}
			},
			reset: () => removeMark(schema.marks.font_family),
		}
	}
}