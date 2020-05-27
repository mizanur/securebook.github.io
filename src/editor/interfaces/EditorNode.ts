import { NodeSpec } from "prosemirror-model";

export interface EditorNode {
	name: string,
	nodeSpec: NodeSpec,
}