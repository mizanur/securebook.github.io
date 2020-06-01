import { liftTarget, canSplit, ReplaceAroundStep } from "prosemirror-transform";
import { Slice, Fragment, NodeRange } from "prosemirror-model";

export function doWrapInList(tr, range, wrappers, joinBefore, listType) {
	let content = Fragment.empty;
  
	for (let i = wrappers.length - 1; i >= 0; i--) {
		content = Fragment.from(
			wrappers[i].type.create(wrappers[i].attrs, content)
		);
	}

	tr.step(
		new ReplaceAroundStep(
			range.start - (joinBefore ? 2 : 0),
			range.end,
			range.start,
			range.end,
			new Slice(content, 0, 0),
			wrappers.length,
			true
		)
	);

	let found = 0;
	for (let i = 0; i < wrappers.length; i++) {
		if (wrappers[i].type == listType) {
			found = i + 1;
		}
	}

	let splitDepth = wrappers.length - found;

	let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0);
	const parent = range.parent;
	let e = range.endIndex;
	let first = true;

	for (let i = range.startIndex; i < e; i++) {
		if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
			tr.split(splitPos, splitDepth);
			splitPos += 2 * splitDepth;
		}

		splitPos += parent.child(i).nodeSize;
		first = false;
	}

	return tr;
}

export function liftToOuterList(state, dispatch, itemType, range) {
	const tr = state.tr;
	const end = range.end;
	const endOfList = range.$to.end(range.depth);

	if (end < endOfList) {
		// There are siblings after the lifted items, which must become
		// children of the last item
		tr.step(
			new ReplaceAroundStep(
				end - 1,
				endOfList,
				end,
				endOfList,
				new Slice(
					Fragment.from(
						itemType.create(null, range.parent.copy())
					),
					1,
					0
				),
				1,
				true
			)
		);

		range = new NodeRange(
			tr.doc.resolve(range.$from.pos),
			tr.doc.resolve(endOfList),
			range.depth
		);
	}

	dispatch(
		tr.lift(range, liftTarget(range)).scrollIntoView()
	);

	return true;
}

export function liftOutOfList(state, dispatch, range) {
	const tr = state.tr;
	const list = range.parent;

	// Merge the list items into a single big item
	const e = range.startIndex;
	let pos = range.end;
	for (let i = range.endIndex - 1; i > e; i--) {
		pos -= list.child(i).nodeSize
		tr.delete(pos - 1, pos + 1)
	}

	const $start = tr.doc.resolve(range.start);
	const item = $start.nodeAfter;
	const atStart = range.startIndex == 0;
	const atEnd = range.endIndex == list.childCount;
	const parent = $start.node(-1);
	const indexBefore = $start.index(-1);

	if (
		!parent.canReplace(
			indexBefore + (atStart ? 0 : 1),
			indexBefore + 1,
			item.content.append(atEnd ? Fragment.empty : Fragment.from(list))
		)
	) {
		return false
	}

	const start = $start.pos;
	const end = start + item.nodeSize;
	// Strip off the surrounding list. At the sides where we're not at
	// the end of the list, the existing list is closed. At sides where
	// this is the end, it is overwritten to its end.
	tr.step(
		new ReplaceAroundStep(
			start - (atStart ? 1 : 0),
			end + (atEnd ? 1 : 0),
			start + 1,
			end - 1,
			new Slice(
				(
					atStart ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))
				)
				.append(atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))),
				atStart ? 0 : 1,
				atEnd ? 0 : 1
			),
			atStart ? 0 : 1
		)
	);

	dispatch(tr.scrollIntoView());
	return true;
}