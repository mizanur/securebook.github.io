import { findSelectedNodeOfType, findParentNode } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

export function getNodeAttrs(state: EditorState, type: NodeType) {
	const predicate = node => node.type === type;
	const node = findSelectedNodeOfType(type)(state.selection)
		|| findParentNode(predicate)(state.selection);

	if (!node) {
		return {};
	}

	return node.node.attrs;
}