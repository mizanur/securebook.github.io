import { EditorView, NodeView } from "prosemirror-view";
import { FunctionComponent } from "preact";
import { Node } from "prosemirror-model";

export type NodeViewProps<A> = {
	attrs: A,
	setAttrs: (newAttrs: A) => void,
};

export type NodeViewComponent<A> = FunctionComponent<NodeViewProps<A>> & {
	type: string,
	defaultAttrs: A,
};

export interface NodeViewProvider {
	nodeView: NodeViewComponent<any>,
}

export interface NodeViewClass extends Function {
	new (node: Node, view: EditorView, getPos: () => number): NodeView;
}

export type NodeViewLookup = {
	[k: string]: (node: Node, view: EditorView, getPos: () => number) => NodeView
}