import { EditorState } from "prosemirror-state";
import { MarkType, Mark } from "prosemirror-model";

export function getMarkAttrs(state: EditorState, type: MarkType): { [key: string]: any } {
	const { from, to } = state.selection;
	let marks: Mark<any>[] = [];

	state.doc.nodesBetween(from, to, node => {
		marks.push(...node.marks);
	});

	const mark = marks.find(markItem => markItem.type.name === type.name);

	if (mark) {
		return mark.attrs;
	}

	return {};
}