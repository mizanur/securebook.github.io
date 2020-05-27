import { NodeType, Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { liftToOuterList, liftOutOfList } from "@editor/commands/listUtils";

// :: (NodeType) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Create a command to lift the list item around the selection up into
// a wrapping list.
export function liftListItem<S extends Schema = any>(
	itemType: NodeType<S>
): ((state: EditorState<S>, dispatch?: (tr: Transaction<S>) => void) => boolean) {
	return function(state, dispatch) {
		const { $from, $to } = state.selection;

		const range = $from.blockRange(
			$to,
			node => !!(node.childCount && node.firstChild && node.firstChild.type == itemType)
		);

		if (!range) {
			return false;
		}

		if (!dispatch) {
			return true;
		}

		if ($from.node(range.depth - 1).type == itemType) {
			// Inside a parent list
			return liftToOuterList(state, dispatch, itemType, range);
		}
		else {
			// Outer list node
			return liftOutOfList(state, dispatch, range);
		}
	}
}