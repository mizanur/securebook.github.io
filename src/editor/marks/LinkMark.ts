import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec, Schema } from "prosemirror-model";
import { isLinkExternal } from "@utils/link";
import { getMarkAttrs } from "@editor/utils/getMarkAttrs";
import { isActiveMark } from "@editor/utils/isActiveMark";
import { EditorState } from "prosemirror-state";
import { toggleMark } from "prosemirror-commands";
import { MenuStateItem, MenuActionItem } from "@editor/interfaces/MenuItem";
import { removeMarkAtCurrentPosition } from "@editor/utils/removeMarkAtCurrentPosition";
import { updateMarkAtCurrentPosition } from "@editor/utils/updateMarkAtCurrentPosition";
import { NodeViewProvider } from "@interfaces/NodeView";
import { createNodeViewForComponent } from "@view/NodeView";
import { LinkNodeView } from "@components/Link";

export class LinkMark implements EditorMark, NodeViewProvider, MenuStateItem<'link'>, MenuActionItem<'link'> {
	readonly nodeView = createNodeViewForComponent(LinkNodeView);

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

	getMenuState(state: EditorState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveMark(state, schema.marks.link);
			},
			get canToggle() {
				return !!toggleMark(schema.marks.strong)(state);
			},
			get isSelected() {
				return this.isCurrent || !state.selection.empty;
			},
			get attrs() {
				if (!this.isCurrent) {
					return { href: '', title: '' };
				}
				const attrs = getMarkAttrs(state, schema.marks.link);
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