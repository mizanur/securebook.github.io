import { NodeView, EditorView } from 'prosemirror-view';
import { h, render } from 'preact';
import { Node, NodeSpec } from 'prosemirror-model';
import { useState } from 'preact/hooks';
import { NodeViewComponent } from '@interfaces/NodeView';

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

export function getToDOM<A>(Component: NodeViewComponent<A>) {
	return function (node: Node) {
		const attrs: A = node.attrs as any;
		const parent = document.createElement('div');
		const setAttrs: any = () => {};
		render(
			<Component attrs={attrs} setAttrs={setAttrs} />,
			parent
		);
		const dom = parent.firstChild as HTMLElement;
		return dom;
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
	return isRendered ? <Component attrs={attrs} setAttrs={setNodeViewAttrs} /> : null;
}

export function createNodeViewForComponent<A>(Component: NodeViewComponent<A>) {
	return class implements NodeView {
		dom: null | HTMLElement;
		contentDOM: null | HTMLElement;

		private parent: HTMLDivElement;
		private node: Node;
		private setRenderedAttrs: (newAttrs: A) => void;
		private setRendered: (newRendered: boolean) => void;

		private readonly view: EditorView;
		private readonly getPos: () => number;
		
		constructor(node: Node, view: EditorView, getPos: () => number) {
			this.node = node;
			this.view = view;
			this.getPos = getPos;

			this.parent = document.createElement('div');
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
				this.parent
			);

			if (!this.parent.firstChild) {
				throw new Error('NodeView is not rendered correctly');
			}

			this.dom = this.parent.firstChild as HTMLElement;
			this.contentDOM = this.dom.querySelector(`[data-content="${this.node.type.name}"]`);
		}

		private setAttrs = (attrs: A) => {
			this.view.dispatch(
				this.view.state.tr
					.setNodeMarkup(this.getPos(), this.node.type, {
						...this.node.attrs,
						...attrs
					})
					.scrollIntoView()
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

		destroy() {
			this.setRendered(false);
		}
	}
}