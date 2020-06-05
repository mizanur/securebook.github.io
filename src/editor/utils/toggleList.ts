import { findParentNode } from "prosemirror-utils";
import { liftListItem } from "@editor/utils/liftListItem";
import { NodeType, Node, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { wrapInList } from "@editor/utils/wrapInList";
import { Dispatch } from "@editor/interfaces/Actions";

function isList(node: Node, schema: Schema) {
	return (node.type === schema.nodes.bullet_list
		|| node.type === schema.nodes.ordered_list
		|| node.type === schema.nodes.todo_list);
}

export function toggleList(listType: NodeType, itemType: NodeType) {
	return (state: EditorState, dispatch: Dispatch) => {
		const { schema, selection } = state;
		const { $from, $to } = selection;
		const range = $from.blockRange($to);

		if (!range) {
			return false;
		}

		const parentList = findParentNode(node => isList(node, schema))(selection);

		if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
			if (parentList.node.type === listType) {
				return liftListItem(itemType)(state, dispatch);
			}

			if (isList(parentList.node, schema) && listType.validContent(parentList.node.content)) {
				const { tr } = state;
				tr.setNodeMarkup(parentList.pos, listType);

				if (dispatch) {
					dispatch(tr);
				}

				return false;
			}
		}

		return wrapInList(listType)(state, dispatch);
	}
}