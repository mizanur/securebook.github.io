import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { getNodeOfType } from '@editor/utils/getNodeOfType';

export function isActiveNode(state: EditorState, type: NodeType, attrs: { [k: string]: any } = {}) {
	const node = getNodeOfType(state, type);

	if (!node) {
		return false;
	}
	
	if (!Object.keys(attrs).length) {
		return !!node;
	}

	return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs });
}