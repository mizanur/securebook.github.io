import { createNodeViewForComponent } from "@view/NodeView";
import { NodeViewProvider, NodeViewClass, NodeViewLookup } from "@interfaces/NodeView";

export function getNodeViewLookup(nodeViewProviders: NodeViewProvider[]) {
	const nodeViewClassLookup: { [k: string]: NodeViewClass } = {};
	for (let i = 0; i < nodeViewProviders.length; i++) {
		const nodeViewProvider = nodeViewProviders[i];
		nodeViewClassLookup[nodeViewProvider.nodeView.type] = createNodeViewForComponent(nodeViewProvider.nodeView);
	}
	const nodeViewLookup: NodeViewLookup = {};
	for (let nodeViewType in nodeViewClassLookup) {
		nodeViewLookup[nodeViewType] = (node, view, getPos) => {
			return new nodeViewClassLookup[nodeViewType](node, view, getPos);
		};
	}
	return nodeViewLookup;
}