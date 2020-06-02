import { findSelectedNodeOfType, findParentNode } from 'prosemirror-utils';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';

export function isActiveNode(state: EditorState, type: NodeType, attrs = {}) {
	const predicate = node => node.type === type;
	const node = findSelectedNodeOfType(type)(state.selection)
		|| findParentNode(predicate)(state.selection);

	if (!Object.keys(attrs).length || !node) {
		return !!node;
	}

	return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs });
}