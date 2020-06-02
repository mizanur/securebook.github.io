import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema } from "prosemirror-model";
import { unwrap } from "@utils/wrap";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { Wrapped } from "@interfaces/Wrapped";
import { EditorState } from "prosemirror-state";
import { getNodeAttrs } from "@editor/utils/getNodeAttrs";
import { setBlockType } from "prosemirror-commands";

export type ParagraphAttrs = {
	textAlign: 'left' | 'right' | 'center' | 'justify',
}

export class ParagraphNode implements EditorNode {
	name: string = 'paragraph';

	nodeSpec: NodeSpec = {
		content: "inline*",
		group: "block",
		attrs: {
			textAlign: {default: 'left'}
		},
		parseDOM: [
			{
				tag: "p",
				getAttrs(val: any): ParagraphAttrs {
					const dom: HTMLElement = val;
					const textAlign = dom.style.textAlign;
					return {
						textAlign: textAlign === 'right' || textAlign === 'center' || textAlign === 'justify'
							? textAlign
							: 'left'
					};
				}
			}
		],
		toDOM(node) {
			let style = '';
			if (node.attrs.textAlign !== 'left') {
				style += `text-align: ${node.attrs.textAlign};`
				return ["p", { style }, 0];
			}
			return ["p", 0];
		}
	}

	getMenuState(state: Wrapped<EditorState>, schema: Schema) {
		return {
			get isCurrent(): boolean {
				return isActiveNode(unwrap(state), schema.nodes.paragraph);
			},
			get attrs(): ParagraphAttrs {
				if (!this.isCurrent) {
					return { textAlign: 'left' };
				}
				const attrs = getNodeAttrs(unwrap(state), schema.nodes.paragraph) as ParagraphAttrs;
				return attrs || { textAlign: 'left' };
			},
		}
	}

	getMenuActions(schema: Schema) {
		return {
			setAttrs: (attrs: ParagraphAttrs) => setBlockType(schema.nodes.paragraph, attrs),
		}
	}
}