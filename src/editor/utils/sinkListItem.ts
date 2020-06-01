import { ReplaceAroundStep } from "prosemirror-transform";
import { Slice, Fragment, NodeType, Schema } from "prosemirror-model";
import { EditorState, Transaction } from 'prosemirror-state';

// :: (NodeType) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Create a command to sink the list item around the selection down
// into an inner list.
export function sinkListItem<S extends Schema = any>(
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

		const startIndex = range.startIndex;
		if (startIndex == 0) {
			return false;
		}

		const parent = range.parent;
		const nodeBefore = parent.child(startIndex - 1);
		if (nodeBefore.type != itemType) {
			return false;
		}

		if (dispatch) {
			const nestedBefore = nodeBefore.lastChild && nodeBefore.lastChild.type == parent.type;
			const inner = Fragment.from(
				nestedBefore ?
				itemType.create() :
				undefined
			);
			const slice = new Slice(
				Fragment.from(
					itemType.create(
						undefined,
						Fragment.from(parent.type.create(parent.attrs, inner))
					)
				),
				nestedBefore ? 3 : 1,
				0
			);

			const before = range.start;
			const after = range.end;

			dispatch(
				state.tr.step(
					new ReplaceAroundStep(
						before - (nestedBefore ? 3 : 1),
						after,
						before,
						after,
						slice,
						1,
						true
					)
				)
				.scrollIntoView()
			);
		}

		return true;
	}
}
