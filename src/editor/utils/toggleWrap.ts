import { isActiveNode } from "@editor/utils/isActiveNode"
import { lift, wrapIn } from "prosemirror-commands"
import { EditorState } from "prosemirror-state";
import { NodeType } from "prosemirror-model";
import { Dispatch } from "@editor/interfaces/Actions";

export function toggleWrap(type: NodeType) {
	return (state: EditorState, dispatch: Dispatch) => {
		const isActive = isActiveNode(state, type);

		if (isActive) {
			return lift(state, dispatch);
		}

		return wrapIn(type)(state, dispatch);
	}
}