import { EditorNode } from "@editor/interfaces/EditorNode";
import { NodeSpec, Schema, NodeType } from "prosemirror-model";
import { EditorState, NodeSelection } from "prosemirror-state";
import { Dispatch } from "@editor/interfaces/Actions";
import { EditorActiveState } from "@editor/interfaces/EditorCurrentState";
import { isActiveNode } from "@editor/utils/isActiveNode";
import { getNodeAttrs } from "@editor/utils/getNodeAttrs";
import { getNodeOfType } from '@editor/utils/getNodeOfType';
import { MenuActionItem, MenuStateItem } from "@editor/interfaces/MenuItem";

type Position = 'middle' | 'top' | 'bottom' | 'left' | 'right';

export type ImageAttrs = {
	src: string | null,
	title: string | null,
	position: Position,
	width: number | null,
	height: number | null,
};

export const defaultImageAttrs: ImageAttrs = {
	src: null,
	title: null,
	position: 'middle',
	width: null,
	height: null,
};

function updateNode(type: NodeType, attrs: { [k: string]: any }) {
	return function test(state: EditorState, dispatch?: Dispatch) {
		const replacedNode = getNodeOfType(state, type);

		if (!replacedNode) {
			return false;
		}

		if (dispatch) {
			let tr = state.tr.setNodeMarkup(replacedNode.pos, type, {
					...replacedNode.node.attrs,
					...attrs,
				});
			tr = tr.setSelection(NodeSelection.create(tr.doc, replacedNode.pos)).scrollIntoView();
			dispatch(tr);
		}
		
		return true;
	};
}

function removeNode(type: NodeType) {
	return function test(state: EditorState, dispatch?: Dispatch) {
		const removedNode = getNodeOfType(state, type);

		if (!removedNode) {
			return false;
		}

		if (dispatch) {
			dispatch(state.tr.delete(
				removedNode.pos,
				removedNode.pos + removedNode.node.nodeSize
			));
		}
		
		return true;
	};
}

function createNodeAndReplaceSelection(type: NodeType, attrs: { [k: string]: any }) {
	return (state: EditorState, dispatch?: Dispatch) => {
		if (dispatch) {
			let tr = state.tr.replaceSelectionWith(type.create(attrs));
			if (tr.selection.$anchor.nodeBefore) {
				const resolvedPos = tr.doc.resolve(
				  tr.selection.anchor - tr.selection.$anchor.nodeBefore.nodeSize
				);
				tr.setSelection(new NodeSelection(resolvedPos));
			}
			dispatch(tr);
		}
		return true;
	}
}

export class ImageNode implements EditorNode, MenuStateItem<'image'>, MenuActionItem<'image'> {
	readonly name = "image";

	readonly nodeSpec: NodeSpec = {
		inline: true,
		
		attrs: {
			src: {},
			title: {default: defaultImageAttrs.title},
			position: {default: defaultImageAttrs.position},
			width: {default: defaultImageAttrs.width},
			height: {default: defaultImageAttrs.height},
		},

		group: "inline",

		draggable: true,

		parseDOM: [{
			tag: "img[src]",

			getAttrs(dom: any): ImageAttrs {
				const node = dom as HTMLImageElement;
				const position: Position =
					(node.style.float === 'right' || node.style.float === 'left') ? node.style.float :
					(node.style.verticalAlign === 'top' || node.style.verticalAlign === 'bottom') ? node.style.verticalAlign :
					'middle';
				
				const widthMatch = node.getAttribute("width")?.match(/^(\d+)px$/i);
				const heightMatch = node.getAttribute("height")?.match(/^(\d+)px$/i);
				const width = widthMatch && Number(widthMatch[1]) || null;
				const height = heightMatch && Number(heightMatch[1]) || null;
				const title = node.getAttribute("title") || node.getAttribute("alt");

				return {
					src: node.getAttribute("src"),
					title,
					position,
					width,
					height,
				};
			}
		}],

		toDOM(node) {
			const { src, title, position, width, height } = node.attrs as ImageAttrs;
			const style = (position === 'left' || position === 'right')
				? `float: ${position};`
				: `vertical-align: ${position};`;
			const attrs: { [k: string]: any } = { style };
			if (src) attrs.src = src;
			if (title) {
				attrs.title = title;
				attrs.alt = title;
			}
			if (width) attrs.width = `${width}px`;
			if (height) attrs.height = `${height}px`;
			attrs['data-position'] = position;
			return ["img", attrs];
		}
	}

	getMenuState(current: EditorActiveState, schema: Schema) {
		return {
			get isCurrent() {
				return isActiveNode(current.state, schema.nodes.image);
			},
			get attrs() {
				return (this.isCurrent && getNodeAttrs(current.state, schema.nodes.image) as ImageAttrs) || null;
			}
		}
	}

	getMenuActions(schema: Schema) {
		return {
			create: (attrs: ImageAttrs) => {
				return createNodeAndReplaceSelection(schema.nodes.image, attrs);
			},
			setAttrs: (newAttrs: Partial<ImageAttrs>) => {
				return updateNode(schema.nodes.image, newAttrs);
			},
			remove: () => {
				return removeNode(schema.nodes.image);
			},
		}
	}
}