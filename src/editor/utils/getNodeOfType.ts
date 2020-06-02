import { findSelectedNodeOfType, findParentNode } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

export function getNodeOfType(state: EditorState, type: NodeType) {
	const predicate = node => node.type === type;
	return findSelectedNodeOfType(type)(state.selection)
		|| findParentNode(predicate)(state.selection);
}