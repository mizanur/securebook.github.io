import { ParagraphAttrs } from "@editor/nodes/ParagraphNode";

export interface MenuActions {
	history: {
		undo: () => void,
		redo: () => void,
	},
	strong: {
		toggle: () => void,
	},
	em: {
		toggle: () => void,
	},
	code: {
		toggle: () => void,
	},
	underline: {
		toggle: () => void,
	},
	strikethrough: {
		toggle: () => void,
	},
	link: {
		createUpdate: (attrs: { href: string, title: string }) => void,
		remove: () => void,
	},
	blockquote: {
		toggle: () => void,
	},
	codeBlock: {
		toggle: () => void,
	},
	heading: {
		setLevel: (level: number) => void,
		remove: () => void,
	},
	horizontalRule: {
		add: () => void,
	},
	paragraph: {
		setAttrs: (attrs: ParagraphAttrs) => void,
	},
	bulletList: {
		toggle: () => void,
	},
	orderedList: {
		toggle: () => void,
	},
	todoList: {
		toggle: () => void,
	},
}