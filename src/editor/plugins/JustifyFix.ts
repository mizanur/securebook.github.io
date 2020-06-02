import { Plugin, EditorState } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { EditorPlugins, AddEditorPlugin } from "@editor/interfaces/EditorPlugins";

/**
 * Justify content requires space to be `white-space: normal` (in Firefox).
 * However, the editor requires to be `white-space: pre-wrap`.
 * This plugin is meant to selectively apply `white-space: normal` to
 * the whitespace of the justified paragraph.
 */
const justifyFixPlugin = new Plugin({
	props: {
		decorations(state: EditorState) {
			const decorations: Decoration[] = [];
			const doc = state.doc;
			const spaces = /\s+/g;
		
			doc.nodesBetween(0, doc.content.size, (node, position, parent) => {
				if (parent.type === state.schema.nodes.paragraph && parent.attrs.textAlign === 'justify') {
					let start: number;
					let match: RegExpExecArray | null;
					let length: number;
					const text = node.text || "";

					while ((match = spaces.exec(text)) !== null) {
						start = position + match.index;
						length = match[0].length;

						if (match.index + length < match.input.length) {
							for (let i = 0; i <= length - 1; i += 2) {
								decorations.push(
									Decoration.inline(start + i, start + i + 1, {
										style: "white-space: normal"
									})
								);
							}
						}
					}
				}
			});
		
			return DecorationSet.create(doc, decorations);
		},
	},
});

export class JustifyFix implements EditorPlugins {
	addEditorPlugins(addEditorPlugin: AddEditorPlugin) {
		addEditorPlugin(justifyFixPlugin);
	}
}