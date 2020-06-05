import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { isLinkExternal } from "@utils/link";
import { getMarkAttrs } from "@editor/utils/getMarkAttrs";
import { unwrap } from "@utils/wrap";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { updateMark } from "@editor/utils/updateMark";
import { removeMark } from "@editor/utils/removeMark";
import { toggleMark } from "prosemirror-commands";

export class LinkMark implements EditorMark {
	name: string = "link";

	markSpec: MarkSpec = {
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
			if (isLinkExternal(href)) {
				return ["a", {
					target: "_blank",
					rel: "noopener noreferrer",
					href,
					title
				}, 0];
			}
			return ["a", {
				href,
				title
			}, 0];
		}
	}

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(unwrap(state), schema.marks.link);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(unwrap(state));
			},
			get isSelected() {
				return this.isCurrent || !unwrap(state).selection.empty;
			},
			get attrs() {
				if (!this.isCurrent) {
					return { href: '', title: '' };
				}
				const attrs = getMarkAttrs(unwrap(state), schema.marks.link);
				return {
					href: attrs.href || '',
					title: attrs.title || '',
				};
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			createUpdate: ({ href, title }: { href: string, title: string }) => updateMark(schema.marks.link, { href, title }),
			remove: () => removeMark(schema.marks.link),
		}
	}
}