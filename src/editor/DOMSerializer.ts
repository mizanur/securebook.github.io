import { DOMSerializer as PMDOMSerializer } from "prosemirror-model";

const { renderSpec } = PMDOMSerializer;

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