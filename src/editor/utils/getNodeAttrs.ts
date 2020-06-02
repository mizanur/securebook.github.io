
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { getNodeOfType } from '@editor/utils/getNodeOfType';

export function getNodeAttrs(state: EditorState, type: NodeType) {
	const node = getNodeOfType(state, type);

	if (!node) {
		return {};
	}

	return node.node.attrs;
}