import { findWrapping } from "prosemirror-transform";
import { NodeRange, NodeType, Schema } from "prosemirror-model";
import { EditorState, Transaction } from 'prosemirror-state';
import { doWrapInList } from "@editor/commands/listUtils";

// :: (NodeType, ?Object) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Returns a command function that wraps the selection in a list with
// the given type an attributes. If `dispatch` is null, only return a
// value to indicate whether this is possible, but don't actually
// perform the change.
export function wrapInList<S extends Schema = any>(
	listType: NodeType<S>,
	attrs?: { [key: string]: any }
): ((state: EditorState<S>, dispatch?: (tr: Transaction<S>) => void) => boolean) {
	return function(state, dispatch) {
		const { $from, $to } = state.selection;

		let range = $from.blockRange($to);
		let doJoin = false;
		let outerRange = range;

		if (!range) {
			return false;
		}

		// This is at the top of an existing list item
		if (
			range.depth >= 2 &&
			// @ts-ignore
			$from.node(range.depth - 1).type.compatibleContent(listType) &&
			range.startIndex == 0
		) {
			// Don't do anything if this is the top of the list
			if ($from.index(range.depth - 1) == 0) {
				return false;
			}

			let $insert = state.doc.resolve(range.start - 2);
			outerRange = new NodeRange($insert, $insert, range.depth);
			
			if (range.endIndex < range.parent.childCount) {
				range = new NodeRange($from, state.doc.resolve($to.end(range.depth)), range.depth);
			}

			doJoin = true;
		}

		// @ts-ignore
		const wrap = findWrapping(outerRange, listType, attrs, range);
		
		if (!wrap) {
			return false;
		}

		if (dispatch) {
			dispatch(
				doWrapInList(
					state.tr,
					range,
					wrap,
					doJoin,
					listType
				)
				.scrollIntoView()
			);
		}

		return true;
	}
}