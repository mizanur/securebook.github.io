import { NodeViewProvider, NodeViewClass, NodeViewLookup } from "@interfaces/NodeView";
import { EditorMark } from "@editor/interfaces/EditorMark";
import { EditorNode } from "@editor/interfaces/EditorNode";

export function getNodeViewLookup(nodeViewProviders: Array<NodeViewProvider & (EditorMark | EditorNode)>) {
	const nodeViewClassLookup: { [k: string]: NodeViewClass } = {};
	for (let i = 0; i < nodeViewProviders.length; i++) {
		const nodeViewProvider = nodeViewProviders[i];
		nodeViewClassLookup[nodeViewProvider.name] = nodeViewProvider.nodeView;
	}
	const nodeViewLookup: NodeViewLookup = {};
	for (let nodeViewType in nodeViewClassLookup) {
		nodeViewLookup[nodeViewType] = (node, view, getPos) => {
			return new nodeViewClassLookup[nodeViewType](node, view, getPos);
		};
	}
	return nodeViewLookup;
}