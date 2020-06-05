import { NodeType } from "prosemirror-model";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { setBlockType } from "prosemirror-commands";
import { EditorState } from "prosemirror-state";
import { Dispatch } from "@editor/interfaces/Actions";

export function toggleBlockType(type: NodeType, toggletype: NodeType, attrs: { [key: string]: any } = {}) {
	return (state: EditorState, dispatch?: Dispatch) => {
		const isActive = isActiveNode(state, type, attrs);

		if (isActive) {
			return setBlockType(toggletype)(state, dispatch);
		}

		return setBlockType(type, attrs)(state, dispatch);
	}
}