import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec } from "prosemirror-model";

export class DocNode implements EditorNode {
	readonly name = "doc";

	readonly nodeSpec: NodeSpec = {
		content: "block+"
	}
}