import { EditorView, NodeView } from "prosemirror-view";
import { FunctionComponent } from "preact";
import { Node, NodeSpec } from "prosemirror-model";

export type NodeViewSpec<A> = {
	type: string,
	tag: string,
	defaultAttrs: A,
};

export type NodeViewProps<A> = {
	attrs: A,
	setAttrs: (newAttrs: A) => void,
};

export type NodeViewComponent<A> = FunctionComponent<NodeViewProps<A>> & NodeViewSpec<A> & {
	attrs: NodeSpec['attrs'],
	parseDOM: NodeSpec['parseDOM'],
	toDOM: NodeSpec['toDOM'],
};

export interface NodeViewProvider {
	nodeView: NodeViewClass,
};

export interface NodeViewClass extends Function {
	new (node: Node, view: EditorView, getPos: () => number): NodeView;
};

export type NodeViewLookup = {
	[k: string]: (node: Node, view: EditorView, getPos: () => number) => NodeView
};