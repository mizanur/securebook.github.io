import { NodeType } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";
import { getNodeOfType } from "@editor/utils/getNodeOfType";

type Attrs = { [k: string]: any };

type SetAttrs = (currentAttrs: Attrs) => Attrs;

export function updateNodeAttrs(pos: number, type: NodeType, setAttrs: SetAttrs) {
	return (state: EditorState, dispatch: (t: Transaction) => any) => {
		state.doc.nodesBetween(pos, pos, (node, pos) => {
			if (node.type === type) {
				dispatch(
					state.tr.setNodeMarkup(pos, type, {
						...node.attrs,
						...setAttrs(node.attrs)
					})
					.scrollIntoView()
				);
			}
		});
	};
}