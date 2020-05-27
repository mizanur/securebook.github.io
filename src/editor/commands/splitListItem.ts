import { canSplit } from "prosemirror-transform";
import { Slice, Fragment, NodeType, Schema } from "prosemirror-model";
import { EditorState, Transaction } from 'prosemirror-state';

// :: (NodeType) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Build a command that splits a non-empty textblock at the top level
// of a list item by also splitting that list item.
export function splitListItem<S extends Schema = any>(
    itemType: NodeType<S>
): ((state: EditorState<S>, dispatch?: (tr: Transaction<S>) => void) => boolean) {
    return function(state, dispatch) {
        // @ts-ignore
        const { $from, $to, node } = state.selection;

        if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
            return false;
        }

        const grandParent = $from.node(-1);
        if (grandParent.type != itemType) {
            return false;
        }

        if ($from.parent.content.size == 0) {
            // In an empty block. If this is a nested list, the wrapping
            // list item should be split. Otherwise, bail out and let next
            // command handle lifting.
            if (
                $from.depth == 2 ||
                $from.node(-3).type != itemType ||
                $from.index(-2) != $from.node(-2).childCount - 1
            ) {
                return false;
            }

            if (dispatch) {
                const keepItem = $from.index(-1) > 0;
                let wrap = Fragment.empty;

                // Build a fragment containing empty versions of the structure
                // from the outer list item to the parent node of the cursor
                for (let d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
                    wrap = Fragment.from($from.node(d).copy(wrap))
                }

                // Add a second list item with an empty default start node
                // @ts-ignore
                wrap = wrap.append(Fragment.from(itemType.createAndFill()));

                const tr = state.tr.replace(
                    // @ts-ignore
                    $from.before(keepItem ? null : -1),
                    $from.after(-3),
                    new Slice(wrap, keepItem ? 3 : 2, 2)
                );

                tr.setSelection(
                    // @ts-ignore
                    state.selection.constructor.near(
                        tr.doc.resolve($from.pos + (keepItem ? 3 : 2))
                    )
                );

                dispatch(tr.scrollIntoView());
            }

            return true;
        }

        const nextType = $to.pos == $from.end() ?
            grandParent.contentMatchAt($from.indexAfter(-1)).defaultType :
            null;

        const tr = state.tr.delete($from.pos, $to.pos);
        const types = nextType && [null, {type: nextType}];

        // @ts-ignore
        if (!canSplit(tr.doc, $from.pos, 2, types)) {
            return false;
        }

        if (dispatch) {
            // @ts-ignore
            dispatch(tr.split($from.pos, 2, types).scrollIntoView());
        }

        return true;
    }
}