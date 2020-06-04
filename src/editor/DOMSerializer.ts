import { DOMSerializer as PMDOMSerializer } from "prosemirror-model";

const { renderSpec } = PMDOMSerializer;

// By default, if the `toDOM` of a prosemirror's NodeSpec returns an html node,
// there is no way to provide a node representing the content. We're just overriding
// this behaviour to add this use case.
const DOMSerializer = PMDOMSerializer;
DOMSerializer.renderSpec = (...args) => {
	const structure = args[1];
	
	if (structure instanceof HTMLElement) {
		const type = structure.getAttribute('data-type');

		if (type) {
			const contentDOM = structure.querySelector(`[data-content=${type}]`);

			if (contentDOM) {
				return { dom: structure, contentDOM };
			}
		}
	}

	return renderSpec(...args);
}

export { DOMSerializer };