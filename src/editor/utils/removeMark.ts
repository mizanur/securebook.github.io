import { MarkType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { getMarkRange } from "@editor/utils/getMarkRange";
import { Dispatch } from "@editor/interfaces/Actions";

export function removeMark(type: MarkType) {
	return (state: EditorState, dispatch: Dispatch) => {
		const { tr, selection } = state;
		let { from, to } = selection;
		const { $from, empty } = selection;

		if (empty) {
			const range = getMarkRange($from, type);

			if (range) {
				from = range.from;
				to = range.to;
			}
		}

		tr.removeMark(from, to, type);

		return dispatch(tr);
	}
}