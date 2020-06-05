import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec } from "prosemirror-model";

export class ListItemNode implements EditorNode {
	name: string = 'list_item';

	nodeSpec: NodeSpec = {
		content: "paragraph block*",
		parseDOM: [{ tag: "li" }],
		toDOM() {
			return ["li", 0];
		},
		defining: true
	}
}