import { NodeView, EditorView } from 'prosemirror-view';
import { h, FunctionComponent, render } from 'preact';
import { Node, NodeSpec, DOMOutputSpec } from 'prosemirror-model';
import { NodeViewComponent, NodeViewProps, NodeViewSpec } from '@interfaces/NodeView';
import { useState, useMemo } from 'preact/hooks';

export function createNodeViewComponent<A>(Component: FunctionComponent<NodeViewProps<A>>, spec: NodeViewSpec<A>): NodeViewComponent<A> {
	const ComponentWithSpec = Object.assign(Component, spec);
	return Object.assign(ComponentWithSpec, {
		attrs: getDefaultAttrs(ComponentWithSpec),
		parseDOM: getParseDOM(ComponentWithSpec),
		toDOM: getToDOM(ComponentWithSpec),
	});
}

export function getDefaultAttrs<A>(Component: NodeViewSpec<A>): NodeSpec['attrs'] {
	const attrs: { [k in keyof A]: { default: A[k] } } = {} as any;
	for (let attrName in Component.defaultAttrs) {
		attrs[attrName] = { default: Component.defaultAttrs[attrName] };
	}
	return attrs;
}

export function getParseDOM<A>(Component: NodeViewSpec<A>): NodeSpec['parseDOM'] {
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

export function getToDOM<A>(Component: NodeViewSpec<A>) {
	return function(node: Node): DOMOutputSpec {
		const attrs = node.attrs as A;
		return [
			Component.tag,
			{
				'data-type': Component.type,
				'data-attrs': JSON.stringify(attrs)
			},
			0,
		]
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
	const content = useMemo(
		() => isRendered
			? <Component attrs={attrs} setAttrs={setNodeViewAttrs} />
			: null,
		[isRendered, Component, attrs, setNodeViewAttrs]
	);
	return content;
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