export function nodeIsOrHasAncestor(node: Node | null, maybeAncestor: Node | null) {
	while (node) {
		if (node === maybeAncestor) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}