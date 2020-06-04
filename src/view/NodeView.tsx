import renderToString from 'preact-render-to-string';
import { NodeView, EditorView } from 'prosemirror-view';
import { h, FunctionComponent, render } from 'preact';
import { Node, NodeSpec } from 'prosemirror-model';
import { NodeViewComponent, NodeViewProps } from '@interfaces/NodeView';
import { createCache } from '@utils/cache';
import { useState } from 'preact/hooks';

export function createNodeViewComponent<A>(Component: FunctionComponent<NodeViewProps<A>>, spec: {type: string, defaultAttrs: A}): NodeViewComponent<A> {
	return Object.assign(Component, {
		...spec,
		toDOM: getToDOM(Component),
	});
}

export function getDefaultAttrs<A>(Component: NodeViewComponent<A>) {
	const attrs: { [k in keyof A]: { default: A[k] } } = {} as any;
	for (let attrName in Component.defaultAttrs) {
		attrs[attrName] = { default: Component.defaultAttrs[attrName] };
	}
	return attrs;
}

export function getParseDOM<A>(Component: NodeViewComponent<A>): NodeSpec['parseDOM'] {
	return [{
		tag: `[data-type="${Component.type}"]`,
		contentElement: `[data-content="${Component.type}"]`,
		getAttrs(val: any) {
			const dom: HTMLElement = val;
			try {
				return JSON.parse(dom.getAttribute('data-attrs') || ``);
			}
			catch(_) {
				return { ...Component.defaultAttrs };
			}
		},
	}];
}

export function createTemplate<A>(Component: FunctionComponent<NodeViewProps<A>>, attrs: A) {
	const template = document.createElement('template');
	const setAttrs: any = () => {};
	const resultHTML = renderToString(
		<Component attrs={attrs} setAttrs={setAttrs} />
	);
	template.innerHTML = resultHTML;
	return template;
}

export function getToDOM<A>(Component: FunctionComponent<NodeViewProps<A>>, cacheSize: number = 10) {
	if (cacheSize <= 0) {
		return function(node: Node) {
			const attrs = node.attrs as A;
			const template = createTemplate(Component, attrs);
			return template.content.firstChild as HTMLElement;
		}
	}

	let cache = createCache<HTMLTemplateElement>(cacheSize);

	return function(node: Node) {
		const attrs = node.attrs as A;

		let template: HTMLTemplateElement;
		let attrsJson: string | undefined = JSON.stringify(attrs);
		let cachedTemplate = cache.getItem(attrsJson);

		if (cachedTemplate) {
			template = cachedTemplate;
		}
		else {
			template = createTemplate(Component, attrs);
			cache.storeItem(attrsJson, template);
		}
		
		return template.content.cloneNode(true).firstChild as HTMLElement;
	}
}

function ParentComponent<A>(
	{ Component, defaultAttrs, setNodeViewAttrs, provideSetAttrsAndSetRendered }:
	{
		Component: NodeViewComponent<A>,
		defaultAttrs: A,
		setNodeViewAttrs: (newAttrs: A) => void,
		provideSetAttrsAndSetRendered:
			(setAttrs: (newAttrs: A) => void, setRendered: (newRendered: boolean) => void) => void
	}
) {
	const [isRendered, setRendered] = useState<boolean>(true);
	const [attrs, setAttrs] = useState<A>(() => defaultAttrs);
	provideSetAttrsAndSetRendered(setAttrs, setRendered);
	return isRendered
		? <Component attrs={attrs} setAttrs={setNodeViewAttrs} />
		: null;
}

export function createNodeViewForComponent<A>(Component: NodeViewComponent<A>) {
	return class implements NodeView {
		dom: HTMLElement;
		contentDOM: null | HTMLElement;

		private node: Node;
		private setRenderedAttrs: (newAttrs: A) => void;
		private setRendered: (newRendered: boolean) => void;

		private readonly view: EditorView;
		private readonly getPos: () => number;
		
		constructor(node: Node, view: EditorView, getPos: () => number) {
			this.node = node;
			this.view = view;
			this.getPos = getPos;

			const frag = document.createDocumentFragment();
			render(
				<ParentComponent<A>
					Component={Component}
					defaultAttrs={this.node.attrs as A}
					setNodeViewAttrs={this.setAttrs}
					provideSetAttrsAndSetRendered={(setAttrs, setRendered) => {
						this.setRenderedAttrs = setAttrs;
						this.setRendered = setRendered;
					}}
				/>,
				frag,
			);

			this.dom = frag.firstChild as HTMLElement;
			this.contentDOM = this.dom.querySelector(`[data-content="${this.node.type.name}"]`);

			// This fixes a bug where effects are not triggered initially
			this.setRendered(false);
			this.setRendered(true);
		}

		private setAttrs = (attrs: A) => {
			this.view.dispatch(
				this.view.state.tr
					.setNodeMarkup(this.getPos(), this.node.type, {
						...this.node.attrs,
						...attrs
					})
			);
		}

		update(node: Node) {
			if (node.type !== this.node.type) {
				return false;
			}
			if (node.sameMarkup(this.node)) {
				this.node = node;
				return true;
			}
			this.node = node;
			this.setRenderedAttrs(node.attrs as A);
			return true;
		}

		ignoreMutation() {
			return true;
		}

		destroy() {
			this.setRendered(false);
		}
	}
}