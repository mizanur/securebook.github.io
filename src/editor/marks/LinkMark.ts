import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { getMarkAttrs } from "@editor/utils/getMarkAttrs";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { toggleMark } from "prosemirror-commands";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";
import { removeMarkAtCurrentPosition } from "@editor/utils/removeMarkAtCurrentPosition";
import { updateMarkAtCurrentPosition } from "@editor/utils/updateMarkAtCurrentPosition";

export class LinkMark implements EditorMark, MenuStateItem<'link'>, MenuActionItem<'link'> {
	readonly name = "link";

	readonly markSpec: MarkSpec = {
		attrs: {
			href: {},
			title: {default: null}
		},
		inclusive: false,
		parseDOM: [{
			tag: "a[href]",
			getAttrs(dom: any) {
				return {
					href: dom.getAttribute("href"),
					title: dom.getAttribute("title"),
				}
			}
		}],
		toDOM(node) {
			const { href, title } = node.attrs;
			return ["a", {
				target: "_blank",
				rel: "noopener noreferrer",
				href,
				title,
			}, 0];
		}
	}

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(current.state, schema.marks.link);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(current.state);
			},
			get isSelected() {
				return this.isCurrent || !current.state.selection.empty;
			},
			get attrs() {
				if (!this.isCurrent) {
					return { href: '', title: '' };
				}
				const attrs = getMarkAttrs(current.state, schema.marks.link);
				return {
					href: attrs.href || '',
					title: attrs.title || '',
				};
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			createUpdate: ({ href, title }: { href: string, title: string }) => updateMarkAtCurrentPosition(schema.marks.link, { href, title }),
			remove: () => removeMarkAtCurrentPosition(schema.marks.link),
		}
	}
}