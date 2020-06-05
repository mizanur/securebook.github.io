import { getMarkRange } from "@editor/utils/getMarkRange";
import { MarkType } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { Dispatch } from "@editor/interfaces/Actions";

export function updateMark(type: MarkType, attrs: { [k: string]: any }) {
	return (state: EditorState, dispatch: Dispatch) => {
		const { tr, selection, doc } = state;
		let { from, to } = selection;
		const { $from, empty } = selection;

		if (empty) {
			const range = getMarkRange($from, type);

			if (range) {
				from = range.from;
				to = range.to;
			}
		}

		const hasMark = doc.rangeHasMark(from, to, type);

		if (hasMark) {
			tr.removeMark(from, to, type);
		}

		tr.addMark(from, to, type.create(attrs));

		return dispatch(tr);
	}
}