import { EditorState } from "prosemirror-state";
import { MarkType, Mark } from "prosemirror-model";

export function getMarkAttrs(state: EditorState, type: MarkType): { [key: string]: any } {
	let { from, $from, to, empty } = state.selection;
	let marks: Mark<any>[];

	if (empty) {
		marks = state.storedMarks || $from.marks();
	}
	else {
		marks = [];
		state.doc.nodesBetween(from, to, node => {
			marks.push(...node.marks);
		});
	}

	const mark = marks.find(markItem => markItem.type.name === type.name);
	if (mark) {
		return mark.attrs;
	}

	return {};
}