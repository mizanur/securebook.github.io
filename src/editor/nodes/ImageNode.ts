import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec } from "prosemirror-model";

export class ImageNode implements EditorNode {
	name: string = "image";

	nodeSpec: NodeSpec = {
		inline: true,
		attrs: {
			src: {},
			alt: {default: null},
			title: {default: null}
		},
		group: "inline",
		draggable: true,
		parseDOM: [{
			tag: "img[src]",
			getAttrs(dom: any) {
				return {
					src: dom.getAttribute("src"),
					title: dom.getAttribute("title"),
					alt: dom.getAttribute("alt")
				}
			}
		}],
		toDOM(node) {
			return ["img", node.attrs];
		}
	}
}