import { NodeType, Node } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";

type Attrs = { [k: string]: any };

type SetAttrs = (currentAttrs: Attrs) => Attrs;

export function updateNodeAttrs(pos: number, type: NodeType, setAttrs: SetAttrs) {
	return (state: EditorState, dispatch: (t: Transaction) => any) => {
		const nodes: Array<{ node: Node, pos: number }> = [];
		state.doc.nodesBetween(pos, pos, (node, pos) => {
			if (node.type === type) {
				nodes.push({ node, pos });
			}
		});
		if (nodes.length) {
			const node = nodes[nodes.length - 1];
			dispatch(
				state.tr.setNodeMarkup(node.pos, type, {
					...node.node.attrs,
					...setAttrs(node.node.attrs)
				})
				.scrollIntoView()
			);
		}
	};
}