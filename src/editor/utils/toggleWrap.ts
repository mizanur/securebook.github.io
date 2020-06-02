import { isActiveNode } from "@editor/utils/isActiveNode"
import { lift, wrapIn } from "prosemirror-commands"
import { EditorState, Transaction } from "prosemirror-state";
import { NodeType } from "prosemirror-model";

export function toggleWrap(type: NodeType) {
	return (state: EditorState, dispatch: (t: Transaction) => any) => {
		const isActive = isActiveNode(state, type);

		if (isActive) {
			return lift(state, dispatch);
		}

		return wrapIn(type)(state, dispatch);
	}
}