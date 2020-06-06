import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec } from "prosemirror-model";

export class TextNode implements EditorNode {
	readonly name = "text";

	readonly nodeSpec: NodeSpec = {
		group: "inline"
	}
}