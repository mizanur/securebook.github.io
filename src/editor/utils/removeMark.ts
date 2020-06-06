import { MarkType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { Dispatch } from "@editor/interfaces/Actions";
import { markApplies } from "@editor/utils/markApplies";

export function removeMark(type: MarkType) {
	return (state: EditorState, dispatch?: Dispatch) => {
		let {empty, ranges} = state.selection;
		let { $cursor } = state.selection as any;
		if ((empty && !$cursor) || !markApplies(state.doc, ranges, type)) {
			return false;
		}
		if (dispatch) {
			if ($cursor) {
				if (type.isInSet(state.storedMarks || $cursor.marks())) {
					dispatch(state.tr.removeStoredMark(type));
				}
			}
			else {
				let has = false, tr = state.tr;
				for (let i = 0; !has && i < ranges.length; i++) {
					let {$from, $to} = ranges[i];
					has = state.doc.rangeHasMark($from.pos, $to.pos, type);
				}
				for (let i = 0; i < ranges.length; i++) {
					let {$from, $to} = ranges[i];
					if (has) {
						tr.removeMark($from.pos, $to.pos, type);
					}
				}
				dispatch(tr.scrollIntoView());
			}
		}
		return true;
	}
}